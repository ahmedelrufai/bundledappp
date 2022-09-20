const async = require("hbs/lib/async");
const Cv = require("../model/cvModel");
const UserTemplatesModel = require("../model/userTemplatesModel");
const Letter = require("../model/letterModel");
const cvtCtrl = {
  getCv: async (req, res) => {
    try {
      let id = req.params.id.slice(1);
      const result = await Cv.find({ userid: id });
      const letterResult = await Letter.find({ userid: id });
      // console.log([...result,...letterResult]);
      if (result.length === 0 && letterResult.length === 0)
        return res.json({ notfound: true, msg: "Cv not created yet" });

      res.json({
        status: "Success",
        result: Cv.length,
        cv: [...result, ...letterResult],
      });
    } catch (err) {
      return res.json({ msg: err.message });
    }
  },
  saveTemplate: async (req, res) => {
    try {
      const { userid, template } = req.body.templateData;
      // console.log(userid, template);
      const anExistingTemplate = await UserTemplatesModel.findOne({
        userid: userid,
        template: template,
      });
      if (anExistingTemplate)
        return res.json({
          msg: "You already have this template in your list of templates",
        });
      const newtemplate = new UserTemplatesModel({
        userid: userid,
        template: template,
      });

      const result = await newtemplate.save();
      res.json({ result: result });
    } catch (err) {
      console.log(err);
      res.json({ err: err });
    }
  },
  getWebCv:async (req,res)=>{
    try {
      let id=req.params.id.slice(1);
      console.log(id)
      let result=await Cv.find({_id:id})
      res.json({data:result})

    } catch (error) {
      
    }
  },
getWebLetter:async (req,res)=>{
  try {
    let id=req.params.id.slice(1);
    console.log(id)
    let result=await Letter.find({_id:id})
    res.json({data:result})
  } catch (error) {
    
  }
},
  getTemplate: async (req, res) => {
    try {
      const id = req.params.id.slice(1);

      const templates = await UserTemplatesModel.find({ userid: id });

      res.json({ templates: templates });
    } catch (err) {
      res.json({ err: err });
    }
  },
  createCv: async (req, res) => {
    try {
      let result = "";
      let actualTemplate = req.body.template.type;
      // return console.log(req.body);

      if (actualTemplate === "resume") {
        const {
          userid,
          onEdit,
          _id,
          address,
          phoneNumber,
          dateofbirth,
          state,
          email,
          images,
          facebook,
          instagram,
          linkedin,
          twitter,
          country,
          profile,
          fullName,
          interest,
          gender,
          profession,
          objective,
          experiences,
          educations,
          certifications,
          template,
          maritalstatus,
          reffrences,
          skills,
          languages,
        } = req.body;

        // if (!images) return res.json({ msg: "No image upload" });
        // const cv = await Cv.findOne({ _id });
        // if (cv) return res.json({ msg: "This cv already exist" });

        const newCv = new Cv({
          maritalstatus,
          reffrences,
          template,
          userid,
          address,
          phoneNumber,
          dateofbirth,
          state,
          email,
          images,
          facebook,
          instagram,
          linkedin,
          twitter,
          country,
          profile,
          fullName,
          interest,
          gender,
          profession,
          objective,
          experiences,
          educations,
          certifications,
          template,
          skills,
          languages,
        });
        let cvDoc = req.body;
        // return console.log(cvDoc);
        if (onEdit) {
          delete cvDoc._id;
          delete cvDoc.onEdit;
          result = await Cv.findOneAndUpdate({ _id: _id }, cvDoc);
          // console.log(res)
        }
        else {

          result = await newCv.save();
        }

      }
      if (actualTemplate === "letter") {
        const {
          address,
          city,
          compenyname,
          email,
          fullName,
          images,
          phoneNumber,
          profession,
          receipient,
          state,
          template,
          onEdit,
          _id,
          theletter,
          streetaddress,
          userid,
        } = req.body;

        const newLetter = new Letter({
          address,
          city,
          compenyname,
          email,
          fullName,
          images,
          phoneNumber,
          profession,
          receipient,
          state,
          template,
          theletter,
          streetaddress,
          userid,
        });
        //     return result=onEdit
        let letterDoc = req.body;
        // console.log(letterDoc);
        if (onEdit) {
          delete letterDoc._id;
          delete letterDoc.onEdit;
          result = await Letter.findOneAndUpdate({ _id: _id }, letterDoc);
          // console.log(res)
        }
        else {

          result = await newLetter.save();
        }
        // return console.log(newLetter);
        }

      res.json({ data: result });
    } catch (err) {
      return res.json({ msg: err.message });
    }
  },
  deleteCv: async (req, res) => {
    try {
      let id = req.params.id.slice(1);
      await Cv.findByIdAndDelete({ _id: id });
      res.json({ msg: "cv deleted" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteletter: async (req, res) => {
    try {
      let id = req.params.id.slice(1);
      await Letter.findByIdAndDelete({ _id: id });
      res.json({ msg: "cv deleted" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
module.exports = cvtCtrl;
