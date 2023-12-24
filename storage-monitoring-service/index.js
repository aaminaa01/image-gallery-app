const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
const { Image } = require('./db'); // Import the Image model from the db module


const app = express();
const port = 5000;

app.use(cors());


// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to parse JSON
app.use(express.json());

// Endpoint to receive and store the image along with userId and calculated size
app.post('/api/uploadImage', upload.single('image'), async (req, res) => {
  try {
    // Extract userId from the request body
    const userId = req.body.userId;

    // Calculate image size
    const imageSize = Buffer.byteLength(req.file.buffer); // size in bytes

    // Make the inner API request to check if bandwidth is available
    const innerApiResponse = await fetch('http://localhost:3400/api/getBandwidthUsed', {
      method: 'POST',
      body: JSON.stringify({ userId: userId, imageSize: imageSize }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const innerApiData = await innerApiResponse.json();

    console.log(innerApiData.bandwidthAvailable);

    // Check if the boolean response from the inner API is true
    if (innerApiData && innerApiData.bandwidthAvailable === true) {
      // Bandwidth is available, now check storage availability

      // Fetch existing records with the same userId from the database
      const existingImages = await Image.find({ userId: userId });

      // Calculate the total size of existing images
      const totalSizeOfExistingImages = existingImages.reduce((totalSize, image) => totalSize + image.size, 0);

      // Set the maximum allowed size (in bytes)
      const maxAllowedSize = 100000;

      // Check if adding the current image size exceeds the limit
      if (totalSizeOfExistingImages + imageSize <= maxAllowedSize) {
        // Create a new Image document with the uploaded image data, userId, and size
        const newImage = new Image({
          data: req.file.buffer,
          userId: userId,
          size: imageSize,
        });

        // Save the image to MongoDB
        await newImage.save();

        //send usage monitoring a request to update the used bandwidth
        const updateBandwidthUsage = await fetch('http://localhost:3400/api/updateBandwidthUsed', {
          method: 'POST',
          body: JSON.stringify({ userId: userId, imageSize: imageSize }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const bandwidthUpdated = await updateBandwidthUsage.json();

        console.log(bandwidthUpdated.db_status);

        // const log = await fetch('http://10.7.81.12:3000/logs/', {
        //   method: 'POST',
        //   body: JSON.stringify({ time: new Date(), service: 'stored', message: `${userId} saved.` }),
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        // });


        res.json({ message: 'Image uploaded successfully!' });
      } else {
        // The total size exceeds the limit, do not save the image
        console.log("Not enough storage");
        res.json({ message: 'Image not saved. Storage limit exceeded.' });
      }
    } else {
      // The boolean response is false, do not save the image
      console.log("Not enough bandwidth");
      res.json({ message: 'Image not saved due to inner API response.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to delete the image based on imageId and userId
app.post('/api/deleteImage', async (req, res) => {
  try {
    const imageId = req.body.imageId;
    const userId = req.body.userId;

    const existingImage = await Image.findById(imageId);

    if (existingImage) {
      const imageSize = existingImage.size;
      console.log("---------");
      console.log(imageSize);
      console.log(userId);
      const innerApiResponse = await fetch('http://localhost:3400/api/getBandwidthUsed', {
        method: 'POST',
        body: JSON.stringify({ userId: userId, imageSize: imageSize }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const innerApiData = await innerApiResponse.json();

      console.log(innerApiData.bandwidthAvailable);

      if (innerApiData && innerApiData.bandwidthAvailable === true) {
        await existingImage.deleteOne();

        const updateBandwidthUsage = await fetch('http://localhost:3400/api/updateBandwidthUsed', {
          method: 'POST',
          body: JSON.stringify({ userId: userId, imageSize: imageSize }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const bandwidthUpdated = await updateBandwidthUsage.json();

        console.log(bandwidthUpdated.db_status);

        res.json({ message: 'Image deleted successfully!' });
      } else {
        console.log("Not enough bandwidth");
        res.json({ message: 'Image not deleted due to inner API response.' });
      }
    } else {
      res.json({ message: 'Image not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/api/viewGallery', async (req, res) => {
  try {
    const userId = req.body.userId;
    console.log(userId);
    const userImages = await Image.find({ userId: userId });

    // Convert each image to Base64 format
    const imagesWithBase64 = userImages.map((image) => {
      return {
        _id: image._id,
        data: image.data.toString('base64'), // Convert Buffer to Base64
        // Include other image properties as needed
      };
    });

    res.json({ images: imagesWithBase64 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
