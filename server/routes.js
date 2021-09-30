exports.user = function(req, res){
  message = '';
 if(req.method == "POST"){
 const userId=1;
  if (!req.files)
      return res.status(400).send('No files were uploaded.');

  var file = req.files.uploaded_image;
  var img_name=file.name;
     if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
                               
            file.mv('public/images/upload_images/'+file.name, function(err) {
                           
              if (err)
                return res.status(500).send(err);
              var sql="insert into photo(img_name,userId) values (?,?);"
              db.query(sql,[img_name,personIndex],(err,result)=>{
            });

           });
        } else {
        }
 } else {
    res.render('user');
 }

};
