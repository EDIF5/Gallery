const express=require('express');
const app = express();
app.get('/',(req,res)=>res.redirect('https://www.google.com'))
app.get('/nodejs',(req,res)=>res.redirect('https://www.google.com'))
  
res.redirect("https://www.gooogle.com")

app.listen(4000,"localhost",()=>{
    console.log("listening");
 });