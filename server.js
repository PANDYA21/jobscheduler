const express = require('express');
let app = express();
const { cross_selling } = require('./cross_selling.js');
const { komplementaere_empfehlungen } = require('./komplementaere_empfehlungen');
const { full_pipeline_basket, test } = require('./full_pipeline_basket');
const schedule = require('node-schedule');


app.get('/trigger/2a', (req, res, next) => {
	let j = schedule.scheduleJob('*/1 * * * *', cross_selling);
  res.status(200).json({message: 'Cross_selling-Schedule started'});
});

app.get('/trigger/2b', (req, res, next) => {
	let j = schedule.scheduleJob('*/1 * * * *', komplementaere_empfehlungen);
  res.status(200).json({message: 'komplementaere_empfehlungen-Schedule started'});
});

app.get('/trigger/2c', (req, res, next) => {
	let j = schedule.scheduleJob('*/1 * * * *', test);
  res.status(200).json({message: 'Full_pipeline_basket-Schedule started'});
});

app.listen(8080, () => {
  console.info('Server starting at 8080');
});