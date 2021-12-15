const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
// import mongoose from 'mongoose';
const dotenv = require('dotenv');
const ImageKit = require('imagekit');
const fileupload = require('express-fileupload');
dotenv.config();

const app = express();

app.use(fileupload());
app.use(cors());
app.use(helmet());

// const mongo = mongoose.connect(process.env.MONGO_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// mongo
//   .then(() => {
//     app.listen(port, function () {
//       console.log('Running App on Port ' + port);
//     });
//   })
//   .catch((err) => {
//     process.exit();
//   });

const imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_KIT_URL,
});

app.get('/upload-video', (req, res) => {
  res.send('url ready for work');

  // imagekit.upload({
  //   file: 'https://ik.imagekit.io/ikmedia/red_dress_woman.jpeg',
  //   fileName: 'women_in_red.jpg',
  // });
});

app.post('/upload-video', (req, res) => {
  imagekit
    .upload({
      file: req.files.video_file.data,
      fileName: req.files.video_file.name,
    })
    .then((result) => {
      res.status(200).json({
        message: 'Success',
        url: result.url,
        thumbnil: result.thumbnailUrl,
      });
    })
    .catch((err) => res.json(err));
});

app.listen(process.env.PORT, function () {
  console.log('Running App on Port ' + process.env.PORT);
});
