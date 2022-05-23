//jshint esversion:6
const express=require('express');
const bodyParser =require( 'body-parser' );
const ejs =require("ejs");
const mongoose=require("mongoose");
const encrypt= require('mongoose-encryption');

const app=express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));


mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userSchema=new mongoose.Schema({
  email : String,
  password : String
});
////for encryption
const secret="Thisisourlittlesecret.";
userSchema.plugin(encrypt,{secret:secret,encryptedFields:['password']});

const User=new mongoose.model("User",userSchema);

app.get('/',function (req,res){
   res.render("home");
});
app.get('/login',function (req,res){
   res.render("login");
});
app.get('/register',function (req,res){
   res.render("register");
});
app.get('/',function (req,res){
   res.render("secrets");
});
app.get('/submit',function (req,res){
   res.render("submit");
});

app.post('/register',function (req,res){
   const newUser= new User({
     email: req.body.username,
     password: req.body.password
   });
   newUser.save(function (err){
     if(err){
       console.log(err);
     }
     else{
       res.render('secrets');
     }
   })
});

app.post('/login',function(req,res){
  const userName= req.body.username;
    const password= req.body.password;
console.log(userName+"   "+password);

  User.findOne({email: userName},function (err,foundUser){
    if(err){
      console.log(err);
    }
    else{
      if(foundUser){
        if(foundUser.password === password){
          console.log("inside else");
          res.render('secrets');
        }
      }
    }
  });

})

app.listen(3500,function (){
  console.log("server Started at port 3500");
});
