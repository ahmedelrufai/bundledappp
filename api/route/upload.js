const express = require("express");
const uploadRouter = express.Router();
const AWS =require("aws-sdk")
const auth = require("../../middleware/auth");
const crypto=require("crypto")
// const {promisify} =require("util")

const s3Config = {
  region: "us-east-1",
  signatureVersion:"v4",
  accessKeyId: process.env.CLOUD_API_ID,
  secretAccessKey: process.env.CLOUD_API_SECRET,
};
const AWS_S3 = new AWS.S3(s3Config);
uploadRouter.post("/upload/", async(req, res) => {   
  // return res.json({hereisit:req.body.imageType})
  // defining the parameta and image Id
  const imgName=crypto.randomBytes(64).toString("hex")
  const params=({
    Bucket:process.env.CLOUD_NAME,
    Key:imgName,
    Expires:60,
    ContentType:req.body.imageType
  })
 const uploadUrl=await AWS_S3.getSignedUrlPromise("putObject",params);
 res.json({uploadUrl:uploadUrl})
  }
);

module.exports = uploadRouter;
