const Url = require('../Schema/URL');
const express = require('express');
const path = express.Router();
const randomstring = require('randomstring');
require('dotenv').config();

// Shortening Endpoint
path.post('/Short', async (req, res) => {
  try {
    const urlId = randomstring.generate({ length: 12, charset: 'alphanumeric' });
    const shortLink = `${process.env.SHORT}/Url/${urlId}`;
    req.body.shortUrl = urlId;
    req.body.short = shortLink;

    const data = new Url(req.body);
    const result = await data.save();
    res.status(201).send(result.short);
  } catch (error) {
    console.error(error);
    res.status(500).json({ Message: 'Internal Server Error' });
  }
});

// Find and Return Original URL
path.get('/:Url', async (req, res) => {
  try {
    const shortUrl = req.params.Url;
    const data = await Url.findOneAndUpdate(
      { shortUrl: shortUrl },
      { $inc: { count: 1 } },
      { new: true }
    );

    if (!data) {
      return res.status(404).json({ Message: 'URL not found' });
    }

    res.redirect(data.originalUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ Message: 'Internal Server Error' });
  }
});

// Get all data
path.get('/Data/All', async (req, res) => {
  try {
    const data = await Url.find();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ Message: 'Internal Server Error' });
  }
});

// Export express Router
module.exports = path;
