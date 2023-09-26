const express = require("express");
const PORT = 4001;
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");

const uploadMiddleware = multer({ dest: "uploads/" });

const salt = bcrypt.genSaltSync(10); // hashstring
const secret = "asdqwd31asdasd";

// app.use(cors({credentials:true, origin: 'http://localhost:3000'}));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
// to get the path name of cover image using static path
app.use("/uploads", express.static(__dirname + "/uploads"));
//connect to mongoose
mongoose.connect(
  "mongodb+srv://omaute2002:t04kXZtr4YHhY9l7@cluster0.bx4ubav.mongodb.net/?retryWrites=true&w=majority"
);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  // to create a user in backend
  try {
    const userDoc = await User.create({
      username,
      password: password,
      // bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(400).json(e);
  }

  //   console.log({ username: username, password: password });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // const userDoc = await User.find({username})

  //this function will compare the password from body and encrypted
  // password from the database
  // and this will return true or false

  // bcrypt.compare(password, userDoc.password, async (err,response)=>{

  //   if(response){

  //     // logged in response in json token
  //     await jwt.sign({username, id:userDoc._id},secret,{}, (err, token)=>{
  //       if(err){
  //         throw err;
  //       }
  //       res.cookie('token',token).json({
  //            id: userDoc._id,
  //            username,
  //        });
  //     })

  //   }else{
  //     res.status(400).json('wrong email or password')
  //   }
  // })

  // =================================================================
  // building Simple Login just to check things
  // try{
  //   const userDoc = await User.find({username,password});
  //   if(user){
  //     res.status(200).json({message: "Login Successfull"})
  //   }
  //   else{
  //     res.status(401).json({message : "Ivalid credentials"})
  //   }
  // }catch(err){
  //   res.status(500).json({message: "internal server error"})
  // }

  res.status(200).json({ username: username });
});

//Creating an endpoint to get the login information
// to check whether user is logging in or not and display username in header
app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

// Logout logic
app.post("/logout", (req, res) => {
  res.json("ok").status(200);
});

// Post request endpoint
app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  //we have to save that file to the server upload folder
  // suing multer package for it

  // we wnat the file in normal format rather than a big complex string without extension
  const { originalname, path } = req.file;
  const parts = originalname.split("."); // to get the extension
  const ext = parts[parts.length - 1];

  //we have to rename the file
  // so we need fs library to do the chnages
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  // We have to grab the cookie to get the author of the artcle
  // const { token } = req.cookies;

  // jwt.verify(token, secret, {}, async (err, info) => {
  //   if (err) throw err;
  //   const { title, summary, content } = req.body;
  //   const postDoc = await Post.create({
  //     title,
  //     summary,
  //     content,
  //     cover: newPath,
  //     author: info.id,
  //   });
  //   // res.json(info);
  // });

  // Now after uploading the file have to save titl, summary, content to the database
  // create new model for that
  const { title, summary, content, author } = req.body;
  const postDoc = await Post.create({
    title,
    summary,
    content,
    author,
    cover: newPath,
  });
  res.json(postDoc);
});

app.get("/post", async (req, res) => {
  // We want to get the latest post first in the stack
  // sort will do that
  // limit(20) will only show top 20 posts

  const posts = await Post.find().sort({ createdAt: -1 }).limit(20); // to get all the posts
  res.json(posts);
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;

  const postDoc = await Post.findById(id);
  res.json(postDoc);
});

//Endpoint to edit the post
app.put("post", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split("."); // to get the extension
    const ext = parts[parts.length - 1];

    //we have to rename the file
    // so we need fs library to do the chnages
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  // jwt.verify(token, secret, {}, async (err, info) => {
  //   if (err) throw err;
  //   const { title, summary, content } = req.body;
  //   const postDoc = await Post.create({
  //     title,
  //     summary,
  //     content,
  //     cover: newPath,
  //     author: info.id,
  //   });
  //   // res.json(info);
  // });

  const { title, summary, content, author, id } = req.body;
  const postDoc = await Post.findById();
  // const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id)
  // if(!isAuthor){
  //   res.status(400).json("you are not the author")
  //   throw 'you are not the author'
  // }
  // res.json({isAuthor, postDoc, info})
  // const postDoc = await Post.create({
  //   title,
  //   summary,
  //   content,
  //   author,
  //   cover: newPath,
  // });
  // res.json(postDoc);
  await postDoc.update({
    title,
    summary,
    content,
    cover: newPath ? newPath : postDoc.cover,
  });
  res.json(postDoc);
});

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});

//password: t04kXZtr4YHhY9l7
//username: omaute2002

// mongodb+srv://omaute2002:t04kXZtr4YHhY9l7@cluster0.bx4ubav.mongodb.net/?retryWrites=true&w=majority
