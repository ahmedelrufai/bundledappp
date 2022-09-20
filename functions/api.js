const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const serverless = require("serverless-http");
const app = express();
const path=require("path")

require("dotenv").config();

// const PORT = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
});
//import router from './home/elrufai/Desktop/project/api/route/user.js';
const connection = mongoose.connection;
connection.once("open", () => console.log("database connection established"));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static("client"));

app.get('*',(req,res)=>{
  res.sendFile(path.resolve(__dirname,'client',"index.html"))
});

const router = require("../api/route/user");
const resumeRouter = require("../api/route/resume");
const uploadRouter = require("../api/route/upload");
app.use("/", uploadRouter);
app.use("/", resumeRouter);
app.use("/", router);


module.exports.handler = serverless(app);

// app.listen(PORT, () => console.log(`server running at port:${PORT}`));