// Required
const Url = require('../Schema/URL');
const express = require('express');
const path = express.Router();
const randomstring = require('randomstring');
require('dotenv').config();

// Conform to work; ------------------------------------------------------------------------------------------------(1)
path.post('/Short', (req, res) => {
  // Long to Short
  const urlId = randomstring.generate({ length: 12, charset: 'alphanumeric' });
  let shortLink = `${process.env.SHORT}/Url/${urlId}`;
  req.body.shortUrl = urlId;
  req.body.short = shortLink;

  // Insert Short Url data
  let data = new Url(req.body);
  data
    .save()
    .then((result) => {
      res.status(201).send(result.short);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

// Find and return original url -------------------------------------------------------------------------------------(2)
path.get('/:Url', async (req, res) => {
  try {
    let shortUrl = req.params.Url;
    const data = await Url.findOneAndUpdate(
      { shortUrl: shortUrl },
      { $inc: { count: 1 } },
      { new: true }
    );

    if (!data) {
      return res.status(404).json({ Message: 'URL not found' });
    }

    res.redirect(data.origUrl);
    console.log('Redirected to:', data.origUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ Message: 'Internal Server Error' });
  }
});

// Get all data ------------------------------------------------------------------------------------------------------(3)
path.get('/Data/All', async (req, res) => {
  try {
    const data = await Url.find();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ Message: 'Internal Server Error' });
  }
});

// Export express Router;
module.exports = path;
