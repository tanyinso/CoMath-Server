const express = require('express');
const multer = require('multer');
const {v4:uuid} = require('uuid');
const { teacherProtected } = require('../middleware/authMiddleware')
const router = express.Router();
const User = require('../models/userModel');
const { registerTeacher, getTeacher, loginTeacher, getAllTeachers, getTeacherById, updateTeacher } = require('../controllers/teacherController');

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
         if (
          file.mimetype == "image/png" || 
          file.mimetype == "image/jpg" || 
          file.mimetype == "image/jpeg"  
          ) {
             cb(null, true);
         } else {
             cb(null, false);
             return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
         }
     }
 });

 router.post('/register', upload.single("profileImg"), registerTeacher)
 
 router.get("/",teacherProtected, getTeacher);

 router.get("/profile/:id", getTeacherById);

 router.post("/login",loginTeacher);

 router.get('/allteachers', getAllTeachers)
 router.post("/update/",teacherProtected, upload.single('profileImg'), updateTeacher)



 module.exports = router;