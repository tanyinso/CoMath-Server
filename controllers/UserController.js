const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const registerUser = async (req, res) => {
     const url = req.protocol + '://' + req.get('host');
     const { name, email, password } = req.body;
     if (!name || !email || !password) {
          res.status(400).json({ message: 'Missing fields' });
          return; // Return early to avoid executing the rest of the function
     }

     try {
          const userExist = await User.findOne({ email: email });
          if (userExist) {
               res.status(400).json({ message: 'User already exists' });
               return; // Return early to avoid executing the rest of the function
          }

          const hashedPassword = await bcrypt.hash(password, 10);
          const user = new User({
               name: name,
               email: email,
               password: hashedPassword,
               profileImg: url + '/public/' + req.file.filename
          });

          const result = await user.save();
          res.status(201).json({
               message: 'User registered successfully!',
               userCreated: {
                    _id: result._id,
                    profileImg: result.profileImg
               }
          });
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: 'Server error' });
     }
};


const loginUser = async (req, res) => {
     const { email, password } = req.body;
     try {
          const user = await User.findOne({ email: email });

          if (user && await bcrypt.compare(password, user.password)) {
               res.status(200).json({
                    message: 'Login successful',
                    id: user._id,
                    name: user.name,
                    token: generateToken(user._id)
               });
          } else {
               res.status(401).json({ message: "Invalid credentials" });
          }

     } catch (error) {
          console.log(error); // Log the error for debugging purposes
          res.status(400).json({ message: "Could not login" });
     }
};

const getUser = async (req, res) => {
     try {
          if (req.user && req.user._id) {
               const user = await User.findOne({ _id: req.user._id }, { password: false, __v: false });
               if (user) {
                    res.status(200).json(user);
               } else {
                    res.status(404).json({ message: 'User not found' });
               }
          } else {
               res.status(401).json({ message: 'Unauthorized' });
          }
     } catch (error) {
          console.log(error);
          res.status(500).json({ message: 'Server error' });
     }
};

const getUserById  = async (req,res) =>  {
     try{
          const user = await User.findOne({_id:req.params.id})
          if(user){
               res.status(200).json(user)
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

  const updateUser = async (req, res) => {
     const { name, email, old_pass, new_pass } = req.body;
     const userId = req.user?._id; // Assuming you have middleware that authenticates the user and sets the user ID in req.user.id
     const url = req.protocol + '://' + req.get('host');
     try {
       const user = await User.findById(userId);
       if (!user) {
         res.status(404).json({ message: 'User not found' });
         return;
       }
   
       if (name) user.name = name;
       if (email) user.email = email;
   
       if (old_pass && new_pass) {
         const isPasswordValid = await bcrypt.compare(old_pass, user.password);
         if (!isPasswordValid) {
           res.status(401).json({ message: 'Invalid password' });
           return;
         }
   
         const hashedPassword = await bcrypt.hash(new_pass, 10);
         user.password = hashedPassword;
       }
   
       if (req.file) {
         // Assuming you're using a file upload library like Multer to handle file uploads
         user.profileImg = url + "/public/"+ req.file.filename; // Update the profile image path based on the uploaded file
       }
   
       const updatedUser = await user.save();
       res.status(200).json({
         message: 'User updated successfully!',
         userUpdated: {
           _id: updatedUser._id,
           name: updatedUser.name,
           email: updatedUser.email,
           profileImg: updatedUser.profileImg
         }
       });
     } catch (error) {
       console.log(error);
       res.status(500).json({ error: 'Server error' });
     }
   };

const generateToken = (id) => {
     return jwt.sign({ id, isTut:false}, process.env.JWT_SECRET, { expiresIn: '24h' })
}

module.exports = {
     registerUser,
     loginUser,
     getUser,
     getUserById,
     updateUser,
}