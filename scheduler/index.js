const {
  writeStatus,
  updateStatus,
  getStatus,
  getActiveJobs,
  getAllJobs,
  getLastJobOfSubject
} = require('./../job_logger');
const {
  aggregate2a,
  aggregate2b,
  aggregate2c
} = require('../pipelines_aggregator');
const {
  startJob1b,
  startJob1c,
  getStatusForJob1b,
  getStatusForJob1c
} = require('../child_process');
const schedule = require('node-schedule');

let job = {
  '1b': null,
  '1c': null,
  '2a': null,
  '2b': null,
  '2c': null
};
var rule2a= new schedule.RecurrenceRule();
rule2a.minute =0;
rule2a.hour = 6;
var rule2b= new schedule.RecurrenceRule();
rule2b.minute = 15
rule2b.hour = 6;
var rule2c= new schedule.RecurrenceRule();
rule2c.minute = 30;
rule2c.hour = 6;
var rule1b= new schedule.RecurrenceRule();
rule1b.minute = 4;
//rule1b.hour = 6;
var rule1c= new schedule.RecurrenceRule();
rule1c.minute = 48;
// rule1c.hour = ;

const SCHEDULE_2a = rule2a;
const SCHEDULE_2b = rule2b;
const SCHEDULE_2c = rule2c;
const SCHEDULE_1b = rule1b;
const SCHEDULE_1c = rule1c;

async function getStatusForJob(jobSubject, cb) {
  const status = await getLastJobOfSubject(jobSubject);
  cb(null, { message: status });
}

async function startJob(jobSubject, jobSchedule, jobFunction, cb) {
  job[jobSubject] = schedule.scheduleJob(jobSchedule, jobFunction);

  // write current status in db
  const jobStartedAt = Date.now();
  await writeStatus({
    jobStartedAt,
    active: false,
    status: 'Queued', 
    jobSubject,
    jobSchedule,
    nextExecution: (job[jobSubject].nextInvocation()).toString()
  });

  return cb(null, {message: [{message: 'Job-' + jobSubject + ' started'}]});
}

function endJob(jobSubject, cb) {
  if (!job[jobSubject]) {
    return cb(null, {message: [{message: 'Job-' + jobSubject + ' was not scheduled so no cancellation required.'}]})
  }
  job[jobSubject].cancel();
  if (job[jobSubject].nextInvocation() == null){
    return cb(null, {message: [{message: 'Job-' + jobSubject + ' canceled'}]});
  }
  return cb(null, {message: [{message: 'Job-' + jobSubject + ' could not be canceled.'}]});
}



function startJob2a(cb) {
  try {
    startJob('2a', SCHEDULE_2a, aggregate2a, cb);
  } catch(e) {
    cb(e, null);
  }
}

function startJob2b(cb) {
  try {
    startJob('2b', SCHEDULE_2b, aggregate2b, cb);
  } catch(e) {
    cb(e, null);
  }
}

function startJob2c(cb) {
  try {
    startJob('2c', SCHEDULE_2c, aggregate2c, cb);
  } catch(e) {
    cb(e, null);
  }
}



function getStatusForJob2a(cb) {
  try {
    getStatusForJob('2a', cb);
  } catch(e) {
    cb(e, null);
  }
}

function getStatusForJob2b(cb) {
  try {
    getStatusForJob('2b', cb);
  } catch(e) {
    cb(e, null);
  }
}

function getStatusForJob2c(cb) {
  try {
    getStatusForJob('2c', cb);
  } catch(e) {
    cb(e, null);
  }
}



function endJob2a(cb) {
  endJob('2a', cb);
}

function endJob2b(cb) {
  endJob('2b', cb);
}

function endJob2c(cb) {
  endJob('2c', cb);
}


module.exports = {
  startJob1b: async function(cb) {
    try {    
  await startJob('1b', SCHEDULE_1b, startJob1b, cb);
	//await startJob('1b', SCHEDULE_1b, function(){ console.log("hello")}, cb);  
 } catch(e) {
      cb(e, null);
    }
  },
  startJob1c: async function(cb) {
    try {
      await startJob('1c', SCHEDULE_1c, startJob1c, cb);
    } catch(e) {
      cb(e, null);
    }
  },
  getStatusForJob1b,
  getStatusForJob1c,
  startJob2a,
  startJob2b,
  startJob2c,
  getStatusForJob2a,
  getStatusForJob2b,
  getStatusForJob2c,
  endJob2a,
  endJob2b,
  endJob2c
};

// on start up:
module.exports.startJob2a((err, resp) => {
  err ? console.error(err) : console.log(resp);
});
module.exports.startJob2b((err, resp) => {
  err ? console.error(err) : console.log(resp);
});
module.exports.startJob2c((err, resp) => {
  err ? console.error(err) : console.log(resp);
});
module.exports.startJob1b((err, resp) => {
console.log(Date.now())
  err ? console.error(err) : console.log(resp);
});
module.exports.startJob1c((err, resp) => {
  err ? console.error(err) : console.log(resp);
});
