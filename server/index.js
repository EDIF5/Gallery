const { response } = require('express');
const { globalAgent } = require('http');
const { getMaxListeners } = require('process');

var express=require('express')
, app = express()
, cors=require("cors")
, bodyParser=require('body-parser')
, mysql=require("mysql")
 , routes = require('./routes')
 , path = require('path')
 ,fileUpload = require('express-fileupload')
 ,nodemailer=require("nodemailer")
 ,{google} =require("googleapis")
, bcrypt=require("bcrypt");


var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'Life77Life77',
	database : 'cruddatabase'
});
 
connection.connect();
global.db = connection;

app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname,'../client/src/components'));
app.set('view engine', 'js');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(cors());

app.get('/', routes.user);//call for main index page
app.post('/api/insertphoto', routes.user, (req,res)=>{

});
const CLIENT_ID='1048303915206-8d6jrfv8ebtbtldjsltkr0vjrrlnicov.apps.googleusercontent.com'
const CLIENT_SECRET='gKEDmCLs_H1BCoilKDxDiOjB'
const REDIRECT_URI='https://developers.google.com/oauthplayground'
const REFRESH_TOKEN='1//04e6DSZGgC_7FCgYIARAAGAQSNwF-L9IrAc8ecIewA9oHzgxp7HRvtdwF83r3OjgKiY2M7bp1ahDJGPDqHsjZFbuwvvZ911f-zbc'
const oAuth2Client=new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN});

global.personIndex=-1;
global.recoveryNo=0;
 app.post("/api/send",(req,res)=>{
    email=req.body.email;
    
async function sendMails(){
   console.log(email)
   console.log("Herernit is"+(await oAuth2Client.getAccessToken()))
   try {
      
      const accessToken=await oAuth2Client.getAccessToken()
      
      var transport=nodemailer.createTransport({
         service:'gmail',
         auth:{
            type:'OAuth2',
            user:'amanueltsehay09@gmail.com',
            clientId:CLIENT_ID,
            clientSecret:CLIENT_SECRET,
            refreshToken:REFRESH_TOKEN,
            accessToken:accessToken
         }
         
      })
      recoveryNo=between(100000,999999);
      const mailoption={
         from:'AMANUEL TSEHAY  <amanueltsehay09@gmail.com>',
         to:'emanaeyasu77@gmail.com',
         subject:'Hello from gmail using my application',
         text:'Hello from Eyasu Emana ',
         html:`<h1>Please read the following information your recovery key is # ${recoveryNo}</h1>`
      };
      const result=await transport.sendMail(mailoption);



      res.json(result)
      return result;
   } catch (error) {
      res.json("not sent")
      return error
   }
} 

function between(min, max) {  
   return Math.floor(
     Math.random() * (max - min) + min
   )
 }

sendMails().then((result)=>{
   console.log("Email sending...",result.messageId)
   res.json()
})
.catch(error=>console.log("error",error.message));

 })

 app.post("/api/checkrecno",(req,res)=>{
    const recno=req.body.recnum
    console.log("one"+recno+"two"+recoveryNo)
    res.json("ckecked")
    if (recno===recoveryNo) {
       res.json("passtoforgot")
       console.log("next stage please")
    }
 })
 
app.post("/api/insert",(req,res) => {   
   console.log("as ga'eera!")
   const name=req.body.name;
   const email=req.body.email;
   const password=req.body.password;
   const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());
   // bcrypt.gen=bcrypt.hash(password, 10, function(err, hash) {
 
   const sqlInsert="INSERT INTO account (name, email, password) VALUES (?,?,?);"
   db.query(sqlInsert,[name, email,hashedPassword],(err,result)=>{
      res.send("broken");
       console.log(result);
   });
// }); 
});

app.post("/api/photos",(req,res)=>{
   const sql2="SELECT id,img_name FROM photo where userId=?;"
   if (personIndex !==-1) {
      db.query(sql2,personIndex,(error,imgNames)=>{
      res.json(imgNames);
   })
   }
   
})
app.post("/api/select",(req, res)=>{
   const username=req.body.name;
   const password=req.body.password;
   const sql="SELECT *FROM account WHERE name = ? ;"
   db.query(sql,username,(err,result)=>{
      if (err) {

      }
       if (result.length>0) {
         const doesPasswordMatch = bcrypt.compareSync(password, result[0].password)            
           if (doesPasswordMatch) {  
              personIndex=result[0].id;
                res.send("broken");
              console.log("logged in");
           } else {
              res.send("notLoggedIn")
           }
       } 
       else {
         res.send("userNotExist")
       }
   })
})
app.use("/",(req,res)=>{
   res.status(404).send("welcome eyasu");
});

app.listen(3001,"localhost",()=>{
   console.log("listening");
});
