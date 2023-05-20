const express=require("express");

const bodyParser=require("body-parser");
//const ejs=require("body-parser");
const app=express();
const mongoose=require("mongoose");
const _=require('lodash');
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
var allPost=[];
const homeStartingContent = "Writing a blog post is a little like driving; you can study the highway code (or read articles telling you how to write a blog post) for months, but nothing can prepare you for the real thing like getting behind the wheel and hitting the open road. Or something.";
const aboutContent = "we are passionate about sharing knowledge, insights, and inspiration with our readers. Our aim is to create a platform that offers valuable content across a wide range of topics.Thank you for visiting here. We hope you enjoy exploring our articles and find inspiration in the words we share. Join us on this exciting journey of discovery, learning, and connection.";
const contactContent = "Thank you for your interest in contacting us . We welcome your feedback, suggestions, and inquiries.";

//connect to mongodb
mongoose.connect("mongodb+srv://sumit_pate:root@cluster0.8r4ve7j.mongodb.net/MyBlog",{useNewUrlParser:true});
const BlogSchema={
  Blog_title:String,
  Blog_body:String
};
const NewBlog=mongoose.model("NewBlog",BlogSchema);










app.get("/",function(req,res)
{
  NewBlog.find({})
  .then(function(foundBlog)
{
  res.render("home",{Content_page:homeStartingContent,foundBlog:foundBlog});
})
.catch(function(err)
{
  if(err)
  {
    console.log(err);
  }
  else
  {
    console.log("successfully saved");
  }
});
//  res.render("home",{Content_page:homeStartingContent,allPost:allPost});

})


app.get("/about",function(req,res)
{
  res.render("about",{Content_page:aboutContent});
})



app.get("/contact",function(req,res)
{
  res.render("contact",{Content_page:contactContent});
})



app.get("/compose",function(req,res)
{
  res.render("compose");
})


app.post("/compose",function(req,res)
{

  var post={title:req.body.postTitle,Body:req.body.postBody};
   allPost.push(post);
  let BlogTitle=req.body.postTitle;
  let BlogBody=req.body.postBody;
  let newBlog=new NewBlog({
    Blog_title:BlogTitle,
    Blog_body:BlogBody
  })
  newBlog.save();



   res.redirect("/");
})

app.get("/:userId",function(req,res)
{
  const requested=_.lowerCase(req.params.userId);

   NewBlog.find({})
   .then(function(FoundItems)
 {
   for(let i=0;i<FoundItems.length;i++)
   {

     if(requested===_.lowerCase(FoundItems[i].Blog_title))
     {

   //    let myString=allPost[i].Body.substring(0,40);
       res.render("post",{title:FoundItems[i].Blog_title,postBody:FoundItems[i].Blog_body});
     }

   }
   res.redirect("/"+requested);
 })
 .catch(function(err)
{
  if(err)
  {
    console.log(err);
  }
  else
  {
    console.log("succeed");
  }
})

})


let port=process.env.PORT;
if(port==null || port=="")
{
  port=3000;
}
app.listen(3000,function(req,res)
{
  console.log("server is running on the port 3000");

})
