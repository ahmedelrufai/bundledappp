const CvUser = require("../model/userModel");
const Cv = require("../model/cvModel");
const VisitorsModel=require("../model/visitorsModel")
const Letter = require("../model/letterModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const BlogModel = require("../model/blogModel");
const CategoryModel = require("../model/categoryModel");
require("dotenv").config();

// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");
const async = require("hbs/lib/async");
const categoryModel = require("../model/categoryModel");

const sesConfig = {
  region: "us-east-1",
  apiVersion: "2010-12-01",
  accessKeyId: process.env.AWS_SES_ID,
  secretAccessKey: process.env.AWS_SES_SECRET,
};

const AWS_SES = new AWS.SES(sesConfig);

// Set the region
// AWS.config.update({region: 'REGION'});

const userCtrl = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await CvUser.findOne({ email });
      if (!user) return res.json({ msg: "User does not exist." });

      const isMatch = await bcrypt.compare(password, user.password);
      const isAdmin = email === "cvstudio.main@gmail.com" && isMatch;
      // const isEditor = email === "erut834@gmail.com" && isMatch;
      if (isAdmin) return res.json({ data: "1" });
      // if (isEditor) return res.json({ data: "2" });

      if (!isMatch) return res.json({ msg: "Incorrect password." });
      //if login success
      const accesstoken = createAccessToken({ id: user._id });

      const refreshtoken = refreshAccessToken({ id: user._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/euser/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ accesstoken, user: user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  addVisitor: async (req, res)=>{
    try {
      const newVisitor=new VisitorsModel()
      const vresult=await newVisitor.save();
      res.json({data:vresult})
    } catch (error) {
      
    }
  },
  addBlogEditor: async (req, res) => {
    const { email } = req.body;
    let editorRes = await CvUser.findOneAndUpdate(
      { email: email },
      { editor: true }
    );
    res.json({ data: editorRes });
  },
  getAllCategories: async (req, res) => {
    let catres = await CategoryModel.find();
    res.json({ data: catres });
  },
  blogEditors: async (req, res) => {
    let allEditors = await CvUser.find({ editor: true });
    res.json({ editors: allEditors });
  },
  createBlogCategory: async (req, res) => {
    try {
      let categoryValue = req.body.categoryValue;
      // console.log(categoryValue);
      let catRes = await CategoryModel({ category: categoryValue }).save();
      console.log(catRes);
      res.json({ data: catRes });
    } catch (error) {
      res.json({ err: error });
    }
  },
  createBlog: async (req, res) => {
    try {
      const { blogArticle, blogTittle, fetureImage, categories, editorId } =
        req.body.blogFromInput;
      // return console.log(editorId)
      if (!editorId) return;
      const blog = new BlogModel({
        blogArticle: blogArticle,
        blogTittle: blogTittle,
        fetureImage: fetureImage,
        categories: categories,
        editorId:editorId
      });
      // return console.log(blog.editorId)
      let blogRes = await blog.save();
      // return console.log(blogRes);
      res.json({ data: blogRes });
    } catch (err) {
      res.json({ err: err });
    }
  },
  getAllBlogs: async (req, res) => {
    try {
      let allBlogs = await BlogModel.find();
      res.json({ data: allBlogs });
    } catch (error) {}
  },
  register: async (req, res) => {
    try {
      const { email, password, userName, phone, emailtoken } = req.body;
      if (emailtoken) {
        let result = await sendMailToUser(req.body, req);

        return res.json({ result: result });
      }

      let user = await CvUser.findOne({ email: email });

      if (user) return res.json({ msg: "The email already exist" });

      if (password.length < 6)
        return res.json({ msg: "Password is too short" });

      //password Encryption

      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = new CvUser({
        isVerified: false,
        email,
        emailtoken: crypto.randomBytes(64).toString("hex"),
        password: passwordHash,
        userName,
        phone,
      });

      user = await newUser.save();

      let result = await sendMailToUser(user, req);

      const accesstoken = createAccessToken({ id: user._id });

      const refreshtoken = refreshAccessToken({ id: user._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/euser/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ accesstoken, user: user, result: result });
    } catch (err) {
      return res.json({ msg: err.message });
    }
  },
  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token)
        return res.status(400).json({ msg: "please Login or Register" });
      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return res.status(400).json({ msg: "please Login or Register" });
        const accesstoken = createAccessToken({ id: user.id });
        res.json({ accesstoken });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", {
        path: "/euser/refresh_token",
      });
      return res.json({ msg: "Logged out" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  success: function (req, res) {
    const marckup = `
        <div style="width:100%;height:100%;display:flex;flex-direction:column;margin-top:100px;align-items:center;justify-content:flex-start;">
        <h1>Welcome to CVSTUDIO</h1>
        <p>verification successfull</p>
        <a href="https://cvstudio.io/cvengine.html">login</a>
        </div>`;
    res.send(marckup);
  },
  verifyUser: async function (req, res) {
    try {
      const token = req.query.token;

      const user = await CvUser.findOne({ emailtoken: token });
      if (!user) return res.json({ msg: "invalid or expired token" });
      user.isVerified = true;
      user.emailtoken = null;
      await user.save();
      res.redirect("/user/success");
    } catch (error) {
      console.log(error);
    }
  },
  getcvs: async (req, res) => {
    try {
      // console.log(req.body)
      // if(req.body!=="cvstudio.main@gmail.com") return res.json("unautorized request")
      // const users = await CvUser.find().select("-password");
      // const letters = await Letter.find();
      const cvs = await Cv.find();

      // if (!users) return res.json({ msg: "no users" });

      // console.log(letters)
      res.json({
        // users: users.filter((user) => user.email !== "cvstudio.main@gmail.com"),
        cvsLenght: cvs.length,
        cvs: cvs.reverse().slice(0, 100),
      });
    } catch (err) {
      return res.json({ mss: err.message });
    }
  },
  getusers: async (req, res) => {
    try {
      // console.log(req.body)
      // if(req.body!=="cvstudio.main@gmail.com") return res.json("unautorized request")
      const users = await CvUser.find().select("-password");
      // const letters = await Letter.find();
      // const cvs = await Cv.find();

      if (!users) return res.json({ msg: "no users" });

      // console.log(letters)
      res.json({
        usersLength: users.length,
        users: users
          .filter((user) => user.email !== "cvstudio.main@gmail.com")
          .reverse()
          .slice(0, 100),
        // letters: letters,
      });
    } catch (err) {
      return res.json({ mss: err.message });
    }
  },
  getletters: async (req, res) => {
    try {
      // console.log(req.body)
      // if(req.body!=="cvstudio.main@gmail.com") return res.json("unautorized request")
      // const users = await CvUser.find().select("-password");
      const letters = await Letter.find();
      // const cvs = await Cv.find();

      // if (!users) return res.json({ msg: "no users" });

      // console.log(letters)
      res.json({
        // users: users.filter((user) => user.email !== "cvstudio.main@gmail.com"),
        // cvs: cvs,
        lettersLength: letters.length,
        letters: letters.reverse().slice(0, 100),
      });
    } catch (err) {
      return res.json({ mss: err.message });
    }
  },
  delete: async (req, res) => {
    try {
      const id = req.params.id.slice(1);
      const cvres = await Cv.findByIdAndDelete({ _id: id });
      const userres = await CvUser.findByIdAndDelete({ _id: id });
      res.json({ cv: cvres, user: userres });
    } catch (err) {
      return res.json({ msg: err.message });
    }
  },
};
const refreshAccessToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "30d" });
};

const sendMailToUser = async function (user, req) {
  // Create sendEmail params
  var params = {
    Destination: {
      /* required */

      ToAddresses: [user.email],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: `
       <h1>Hello, ${user.userName}</h1>
       <p>Thanks for registering on our site.</p>
       <p>Please click the link below to verify your account.</p>
       <a href="https://${req.headers.host}/user/verify-email?token=${user.emailtoken}">Verify email</a>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: `Hellow, thanks for registering on our site. Please copy and paste the address below to verify your account. https://${req.headers.host}/verify'email?token=${user.emailtoken}`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "WELCOME - verify your email",
      },
    },
    Source: "CVSTUDIO <no-reply@cvstudio.io>" /* required */,
    ReplyToAddresses: [
      "cvstudio.main@gmail.com",
      /* more items */
    ],
  };

  let sendPromise = await AWS_SES.sendEmail(params).promise();
  return sendPromise;
  // Handle promise's fulfilled/rejected states
  // sendPromise
  //   .then(function (data) {
  //     if(data) return true;
  //   })
  //   .catch(function (err) {
  //     if(err) return false;
  //   });
};
const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "300d" });
};
module.exports = userCtrl;
