const asyncHandler = require("express-async-handler");
const Content = require('../models/contentModel')

const createContent = asyncHandler(async (req, res) => {
     const url = req.protocol + '://' + req.get('host');
     const { title, description } = req.body;

     if (!title || !description || !req.files || !req.files['thumb'] || !req.files['video']) {
          res.status(400).json({ message: 'All fields are required' });
          return;
     }

     try {
          const thumbFile = req.files['thumb'][0];
          const videoFile = req.files['video'][0];

          const content = new Content({
               teacher: req.teacher._id,
               title: title,
               description: description,
               thumbnail: url + '/public/' + thumbFile.filename,
               video: url + '/public/' + videoFile.filename,
          });

          const result = await content.save();

          res.status(201).json({
               message: 'Content created successfully!',
               content: {
                    _id: result._id,
                    title: result.title,
                    description: result.description,
                    thumbnail: result.thumbnail,
                    video: result.video,
               },
          });
     } catch (error) {
          console.log(error);
          res.status(500).json({ message: 'Server error' });
     }
});

const getAllContent = asyncHandler(async (req, res) => {
     try {
          const contents = await Content.find()
          if (contents) {
               res.status(200).json(contents)
          } else {
               res.status(400).json('Bad request')
               return
          }
     } catch (error) {
          console.log(error)
          res.status(500).json({ message: 'connection error' })
     }
})

const getTeacherContent = asyncHandler(async (req, res) => {
     try {
          const id = req.teacher._id;
          const contents = await Content.find({ teacher: id });
          const count = await Content.countDocuments({ teacher: id });

          if (contents.length > 0) {
               res.status(200).json({
                    content: contents,
                    count: count,
               });
          } else {
               res.status(400).json('Bad request');
               return;
          }
     } catch (error) {
          console.log(error);
          res.status(500).json({ message: 'Connection error' });
     }
});

const getAllContentById = asyncHandler(async (req, res) => {
     try {
          const contents = await Content.find({teacher:req.params.id})
          if (contents) {
               res.status(200).json(contents)
          } else {
               res.status(400).json('Bad request')
               return
          }
     } catch (error) {
          console.log(error)
          res.status(500).json({ message: 'connection error' })
     }
})

const getVideo = asyncHandler(async (req, res) => {
     try {
          const contents = await Content.find({_id:req.params.id})
          if (contents) {
               res.status(200).json(contents)
          } else {
               res.status(400).json('Bad request')
               return
          }
     } catch (error) {
          console.log(error)
          res.status(500).json({ message: 'connection error' })
     }
})


module.exports = {
     createContent,
     getAllContent,
     getTeacherContent,
     getAllContentById,
     getVideo,
}