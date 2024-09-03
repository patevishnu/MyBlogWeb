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
const NewLoginSchema={
  user_id:String,
  password:String
}
const NewLoginBlog=mongoose.model('newLoginBlog',NewLoginSchema);
/***********************************************************************************/
app.get('/login',function(req,res)
{
  res.render('login',{Content_page:"Login with your Credentials"});
})
app.get('/signup',function(req,res)
{
  res.render('signup',{Content_page:"Create your user id and password "});
})
let Users=[];
let Users_new=[];
let logged_in=0;
app.post('/signpost',function(req,res)
{

  NewLoginBlog.find({})
  .then(function(loginData)
{

  for(let i=0;i<loginData.length;i++)
  {
    let newUser = {id:loginData[i].user_id, password: loginData[i].password};
    Users_new.push(newUser);
  }

  for(let i=0;i<Users_new.length;i++)
        {
        if(Users_new[i].id===req.body.id)
        {
          res.render('login',{Content_page:"User already exist"});
          alert("User already exist ")
        }
      }

      console.log(req.body.id);
      let NewLogin=new NewLoginBlog({
        user_id:req.body.id,
        password:req.body.password
      });
      NewLogin.save();

      res.redirect('/login');

      }
)
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
})

let User_Page_blogs="";
app.post('/loginpost',function(req,res)
{

  NewLoginBlog.find({})
  .then(function(loginData)
{
  for(let i=0;i<loginData.length;i++)
  {
    let newUser = {id:loginData[i].user_id, password: loginData[i].password};
    Users.push(newUser);
  }

  if(!req.body.id || !req.body.password){
     res.render('login');
  } else {
     console.log("vishnu pate hi ");
     console.log(Users.length);
     console.log(Users[0].id);
     console.log(req.body.id);
     for(let i=0;i<Users.length;i++)
     {
       console.log("hi vishnu pate vishnu pate");
        if(Users[i].id === req.body.id && Users[i].password === req.body.password){
           User_Page=Users[i].id;
           res.redirect('/person/'+User_Page);
        }
     }

     res.render('login',{Content_page:"Invalid Credentials"});
     alert("Invalid Credentials")
  }

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
});
let x=0;
app.get("/person/:User_Page",function(req,res)
{
  logged_in=1;
  User_Page=req.params.User_Page;
//  User_Page_blogs =(mongoose.models.User_Page || mongoose.model(User_Page, BlogSchema));
  if (!mongoose.connection.models[User_Page]) {
  mongoose.model(User_Page, BlogSchema);
}
 User_Page_blogs= mongoose.model(User_Page);
//  User_Page=mongoose.model(req.params.User_Page,BlogSchema);
  User_Page_blogs.find({})
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

});









/************************************************************************************/

app.get("/",function(req,res)
{
  if(logged_in==0)
  {
    res.redirect("/login");
  }
  console.log(User_Page_blogs);
  User_Page_blogs.find({})
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
  if(logged_in==0)
  {
    res.redirect("/login");
  }
  console.log("about");
  res.render("about",{Content_page:aboutContent});
})



app.get("/contact",function(req,res)
{
  if(logged_in==0)
  {
    res.redirect("/login");
  }
  res.render("contact",{Content_page:contactContent});
})



app.get("/compose",function(req,res)
{
  if(logged_in==0)
  {
    res.redirect("/login");
  }
  res.render("compose");
})


app.post("/compose",function(req,res)
{
  if(logged_in==0)
  {
    res.redirect("/login");
  }
  console.log(User_Page_blogs);
  var post={title:req.body.postTitle,Body:req.body.postBody};
   allPost.push(post);
  let BlogTitle=req.body.postTitle;
  let BlogBody=req.body.postBody;
//  let newpblog=mongoose.model(User_Page,BlogSchema);
  let newBlog=new User_Page_blogs({
    Blog_title:BlogTitle,
    Blog_body:BlogBody
  })
  newBlog.save();



   res.redirect("/person/"+User_Page);
})

app.get("/post/:userId",function(req,res)
{
  const requested=_.lowerCase(req.params.userId);
   console.log("Hi vishnu read more");
  User_Page_blogs.find({})
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
   res.redirect("/post/"+requested);
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
