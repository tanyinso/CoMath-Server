const Teacher = require('../models/teacherModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const registerTeacher = async (req, res) => {
     const url = req.protocol + '://' + req.get('host')
     const {name, email, password, proffession} =  req.body
     if(!name || !email || !password || !proffession) {
          res.status(400).json({
               message: "Missing fields"
          })
          return
     }
     try{
          const teacherExist = await Teacher.findOne({email:email})
          
          if(teacherExist) {
               res.status(400).json({
                    message: "Account alraedy exist"
               })
               return
          }
     
          const hashedPassword = await bcrypt.hash(password, 10) 
          const teacher = new Teacher({
              name: req.body.name,
              email: req.body.email,
              password: hashedPassword,
              proffession:  proffession,
              profileImg: url + '/public/' + req.file.filename
          });
          const result = await teacher.save()
              res.status(201).json({
                  message: "Teacher registered successfully!",
                  userCreated: {
                      _id: result._id,
                      email: result.email
                  }
              })

     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: "server error"
          })
     }
}

const loginTeacher =  async (req, res) => {
     const {email,password} = req.body;
     try {
          const teacher = await Teacher.findOne({email:email});

          if (teacher && bcrypt.compare(password, teacher.password)) {
               res.status(200).json({
                    message: 'Login successful',
                    id: teacher._id,
                    name: teacher.name,
                    token: generateToken(teacher._id)
               })
          } else {
               res.status(401).json({message:"Invalid credential"})
               return
          }

     } catch (error) {
          console.log(error)
          res.status(500).json({message:"Server error"})
     }
  }

  const getTeacher = async (req, res) => {
       
       try{

          if(req.teacher && req.teacher._id){
               
               const teacher = await  Teacher.findOne({_id:req.teacher._id},{ password:false, __v:false})
               if (teacher) {
                    res.status(200).json(teacher);
               } else {
                    res.status(404).json({ message: 'teacher not found' });
               }
          } else {
               res.status(401).json({ message: 'Unauthorized' });
          }

     }catch (error) {
          console.log(error)
          res.status(500).json({message:"Server error"})
     }
  }

  const getAllTeachers  = async (req,res) =>  {
     try{
          const teachers = await Teacher.find()
          if(teachers){
               res.status(200).json(teachers)
          }else {
               res.status(400).json('Bad request')
               return
          }
     }catch(error){
          console.log(error)
          res.status(5000).json({
               message: "server error"
          })
     }
  }

  const getTeacherById  = async (req,res) =>  {
     try{
          const teacher = await Teacher.findOne({_id:req.params.id})
          if(teacher){
               res.status(200).json(teacher)
          }else {
               res.status(400).json('Bad request')
               return
          }
     }catch(error){
          console.log(error)
          res.status(500).json({
               message: "server error"
          })
     }
  }

  const updateTeacher = async (req, res) => {
     const { name, email,proffession, old_pass, new_pass } = req.body;
     const teacherId = req.teacher?._id; // Assuming you have middleware that authenticates the user and sets the user ID in req.user.id
     const url = req.protocol + '://' + req.get('host');
     try {
       const teacher = await Teacher.findById(teacherId);
       if (!teacher) {
         res.status(404).json({ message: 'Teacher not found' });
         return;
       }
   
       if (name) teacher.name = name;
       if (email) teacher.email = email;
   
       if (old_pass && new_pass) {
         const isPasswordValid = await bcrypt.compare(old_pass, teacher.password);
         if (!isPasswordValid) {
           res.status(401).json({ message: 'Invalid password' });
           return;
         }
   
         const hashedPassword = await bcrypt.hash(new_pass, 10);
         teacher.password = hashedPassword;
       }
   
       if (req.file) {
         // Assuming you're using a file upload library like Multer to handle file uploads
         teacher.profileImg = url + "/public/"+ req.file.filename; // Update the profile image path based on the uploaded file
       }
   
       const updatedTeacher = await teacher.save();
       res.status(200).json({
         message: 'User updated successfully!',
         teacherUpdated: {
           _id: updatedTeacher._id,
           name: updatedTeacher.name,
           email: updatedTeacher.email,
           profession: updatedTeacher.proffession,
           profileImg: updatedTeacher.profileImg
         }
       });
     } catch (error) {
       console.log(error);
       res.status(500).json({ error: 'Server error' });
     }
   };

  const generateToken = (id) => {
     return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '24h'})
  }

  
module.exports = {
     registerTeacher,
     loginTeacher,
     getTeacher,
     getAllTeachers,
     getTeacherById,
     updateTeacher,
}