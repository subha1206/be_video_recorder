const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ImageKit = require('imagekit');
const fileupload = require('express-fileupload');
dotenv.config();

const app = express();

app.use(fileupload());
app.use(cors());
app.use(helmet());

const videoStorageSchema = new mongoose.Schema({
  url: String,
  thumbnail: String,
});

const VideoStorageModel = mongoose.model('VideoStorage', videoStorageSchema);

const imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_KIT_URL,
});

const mongo = mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get('/upload-video', (req, res) => {
  VideoStorageModel.find({}, (err, videos) => {
    if (err) {
      res.status(400).json({ message: 'Erorr', data: { err } });
    }
    res.status(200).json({
      message: 'Success',
      data: {
        videos: videos,
      },
    });
  });
});

app.post('/upload-video', (req, res) => {
  console.log(req.files.video_file);
  imagekit
    .upload({
      file: req.files.video_file.data,
      fileName: req.files.video_file.name,
    })
    .then((result) => {
      VideoStorageModel.create({
        url: result.url,
        thumbnail: result.thumbnailUrl,
      }).then((mongoRes) => {
        res.status(200).json({
          message: 'Success',
          url: mongoRes.url,
          thumbnil: mongoRes.thumbnail,
        });
      });
    })
    .catch((err) => {
      res.send('error');
    });
});

mongo
  .then(() => {
    app.listen(process.env.PORT, function () {
      console.log('Running restAPI on Port ' + process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit();
  });
