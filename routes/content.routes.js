const express = require('express')
const multer = require('multer')
const Content = require('../models/contentModel')
const { createContent, getAllContent, getTeacherContent, getAllContentById, getVideo } = require('../controllers/contentController')
const router = express.Router()
const {v4:uuid} = require('uuid') 
const { teacherProtected } = require('../middleware/authMiddleware')

const storage = multer.diskStorage({
     destination: (req, file, cb) => {
          cb(null, './public')
     },
     filename: (req, file, cb) => {
          const fileName = file.originalname.toLowerCase().split(' ').join('-');
          cb(null, uuid() + '-' + fileName)
     },
})

var upload = multer({
     storage: storage,
     fileFilter: (req, file, cb) => {
         if (file.mimetype == "image/png" || 
               file.mimetype == "image/jpg" || 
               file.mimetype == "image/jpeg"||
               file.mimetype == "video/mp4" ||
               file.mimetype == "video/ogg" ||
               file.mimetype == "video/mkv" ) {
             cb(null, true);
         } else {
             cb(null, false);
             return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
         }
     }
 });



router.post('/create',teacherProtected,upload.fields([{name:"thumb", maxCount: 1},{name:"video", maxCount : 1}]), createContent )
router.get('/allcontent',getAllContent)
router.get('/teacherContent/:id',getAllContentById)
router.get('/mycontent',teacherProtected,getTeacherContent)
router.get('/video/:id',getVideo)

module.exports = router