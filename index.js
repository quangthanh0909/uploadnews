const express = require('express');
const app = express();
const route = express.Router();

// Body-Parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));

// Setting static file
app.use(express.static('public'));

// Connect Database
  const mongoose = require('mongoose');
  mongoose.connect("mongodb+srv://quangthanh0909:mypassword@cluster0-hvfpj.mongodb.net/test?retryWrites=true&w=majority",{ useNewUrlParser: true },(err) => {
    if(!err){
       console.log("Database Connected");
    }else{
      console.log(err);
    }
  });

// connect NewsModel
const NewsModel = require('./models/NewsModel');

// template Engine
app.set('view engine','ejs');
app.set('views','views');

//multer
        var multer = require('multer');
        var storage = multer.diskStorage({
          destination: function(req,file,cb){
            console.log(__dirname);
            
            cb(null,__dirname+'/public/uploads');
          },
          filename: function(req,file,cb){
            cb(null, Date.now() + '-' + file.originalname)
          }
        });
        // Setting up filter file type 
        const MimeTypes =['image/jpeg','image/png','image/jpg'];
        function fileFilter(req,file,cb) {
          if(MimeTypes.includes(file.mimetype)){
            cb(null,true);
          }else {
            cb(new Error("File is not accepted"),false)
          };
        };
      var upload = multer({
          storage:storage,
          fileFilter:fileFilter
        }).single('avatar');
// End multer upload File

app.get('/', async (req,res) => {
  const  News = await NewsModel.find();
  //  console.log(News[0].date);

  res.render('home',{News});

});
app.get('/addNews',(req,res) => {
  res.render('addNews');
});

app.post("/xuly",  function(req, res){
  upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        res.send("A Multer error occurred when uploading."); }
      else if (err) {
        console.log("An unknown error occurred when uploading." + err);
        res.send("An unknown error occurred when uploading." + err);
      }else{
          console.log("Upload is okay");
          console.log(req.file); // Thông tin file đã upload
          if(req.body.txtUn && req.body.txtPa){
              var un = req.body.txtUn;
              var pa = req.body.txtPa;
              res.json({"username":un, "password": pa, "file": req.file.filename});
          }else{
            const newNew = new NewsModel({
              title: req.body.title,
              content:req.body.content,
              photo: req.file.filename
            });
            newNew.save()
            .then(() => {
              console.log("Data saved");
              res.redirect('/')
            })
            .catch((err) => {
              console.log("saving get Err" + err);
            })
          }
      }

  });

  
    //  res.send(req.body.name+"");
});
app.listen( process.env.PORT || 3000);