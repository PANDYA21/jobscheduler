const express = require('express');
let app = express();
const { cross_selling } = require('./cross_selling.js');
const { komplementaere_empfehlungen } = require('./komplementaere_empfehlungen');
const { full_pipeline_basket, test } = require('./full_pipeline_basket');
const schedule = require('node-schedule');
let job1;
let job2;
let job3;


app.get('/trigger/2a/?*?', (req, res, next) => {
	if (!req.params["0"] || req.params["0"]== '') {
		return res.redirect("/trigger/2c/status")
	}
	if (!req.params["0"] == 'status' || 'end' || 'start') {
		return res.status(200).json({message: 'ungültiger Aufruf'});
	}
	if (req.params['0'] == 'start') {
		job1 = schedule.scheduleJob('*/1 * * * *', test);
		return res.status(200).json({message: '2a-schedule started'});
	}
	if (req.params['0'] == 'end') {
		job1.cancel();
		if(job1.nextInvocation() == null){
			res.status(200).json({message: '2a-Schedule Canceled'});
		}
	}
	if (req.params['0'] == 'status') {
		if (job1) {
			if(job1.nextInvocation() == null){
			res.status(200).json({message: '2a-Schedule Canceled'});
			} else {
			res.status(200).json({message: 'Job 2a is running. Next Invocation at: '+ job1.nextInvocation()});
			}
		} else {
		res.status(200).json({message: 'Job is not running.'});
		}
		res.end();
	}
});

app.get('/trigger/2b/?*?', (req, res, next) => {
	if (!req.params["0"] || req.params["0"]== '') {
		return res.redirect("/trigger/2c/status")
	}
	if (!req.params["0"] == 'status' || 'end' || 'start') {
		return res.status(200).json({message: 'ungültiger Aufruf'});
	}
	if (req.params['0'] == 'start') {
		job2 = schedule.scheduleJob('*/1 * * * *', test);
		return res.status(200).json({message: '2b-schedule started'});
	}
	if (req.params['0'] == 'end') {
		job2.cancel();
		if(job2.nextInvocation() == null){
			res.status(200).json({message: '2b-Schedule Canceled'});
		}
	}
	if (req.params['0'] == 'status') {
		if (job2) {
			if(job2.nextInvocation() == null){
			res.status(200).json({message: '2b-Schedule Canceled'});
			} else {
			res.status(200).json({message: 'Job 2b is running. Next Invocation at: '+ job2.nextInvocation()});
			}
		} else {
			
		}
		res.end();
	}
});

app.get('/trigger/2c/?*?', (req, res, next) => {
	if (!req.params["0"] || req.params["0"]== '') {
		return res.redirect("/trigger/2c/status")
	} 
/*	if (!req.params["0"] == 'status' && !req.params["0"] == 'end' && !req.params["0"] == 'start') {
		return res.status(200).json({message: 'ungültiger Aufruf'});
	} */
	if (req.params['0'] == 'start') {
		job3 = schedule.scheduleJob('*/1 * * * *', test);
		return res.status(200).json({message: '2c-schedule started'});
	}
	if (req.params['0'] == 'end') {
		job3.cancel();
		if(job3.nextInvocation() == null){
			res.status(200).json({message: '2c-Schedule Canceled'});
		}
	}
	if (req.params['0'] == 'status') {
		if (job3) {
			if(job3.nextInvocation() == null){
			res.status(200).json({message: '2c-Schedule Canceled'});
			} else {
			res.status(200).json({message: 'Job 2c is running. Next Invocation at: '+ job3.nextInvocation() + ' Job 2c already ran '+ job3.triggeredJobs() +' times.'});
			}
		} else {
		res.status(200).json({message: 'Job is not running.'});
		}
		res.end();
	}
});

app.listen(8080, () => {
  console.info('Server starting at 8080');
});