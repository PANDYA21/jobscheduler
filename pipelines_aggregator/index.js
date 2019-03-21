const {
  writeStatus,
  updateStatus,
  getStatus,
  getActiveJobs,
  getAllJobs,
  getLastJobOfSubject
} = require('./../job_logger');
const {
  _connect,
  connect,
  collections,
  collection,
  find
} = require('../mongo');
const MongoClient = require('mongodb').MongoClient;
const schedule = require('node-schedule');
const globals = require('./../globals.json');
const testPipeline1 = require('./pipelines/full_pipeline_cross_selling.js');
const testPipeline2 = require('./pipelines/komplemntaere_empfehlungen_produkt_gruppe_pipeline.js');
const testPipeline3 = require('./pipelines/full_pipeline_basket.js');


async function getColl(colname) {
  return await collection({
    url: globals.MONGO_URI,
    dbname: "Stammdaten-test",
    collectionname: colname,
    keepAlive: true
  });
}

async function _aggregate2a() {
  const jobStartedAt = Date.now();
  const jobSubject = '2a';
  await writeStatus({ jobStartedAt, status: 'Started', jobSubject });
  const coll = await getColl("Bewegungsdaten");
  await coll.aggregate(testPipeline1, { allowDiskUse: true }).toArray();
  const jobCompletedAt = Date.now();
  await updateStatus({
    jobStartedAt,
    jobCompletedAt,
    jobSubject,
    status: 'Completed',
    duration: jobCompletedAt - jobStartedAt,
    active: false
  });
  coll.s.db.s.topology.close();
  return 'done: ' + jobSubject;
}

async function _aggregate2b() {
  const jobStartedAt = Date.now();
  const jobSubject = '2b';
  await writeStatus({ jobStartedAt, status: 'Started', jobSubject });
  const coll = await getColl("Produkt");
  await coll.aggregate(testPipeline2, { allowDiskUse: true }).toArray();
  const jobCompletedAt = Date.now();
  await updateStatus({
    jobStartedAt,
    jobCompletedAt,
    jobSubject,
    status: 'Completed',
    duration: jobCompletedAt - jobStartedAt,
    active: false
  });
  coll.s.db.s.topology.close();
  return 'done: ' + jobSubject;
}

async function _aggregate2c() {
  const jobStartedAt = Date.now();
  const jobSubject = '2c';
  await writeStatus({ jobStartedAt, status: 'Started', jobSubject });
  const coll = await getColl("Bewegungsdaten");
  await coll.aggregate(testPipeline3, { allowDiskUse: true }).toArray();
  const jobCompletedAt = Date.now();
  await updateStatus({
    jobStartedAt,
    jobCompletedAt,
    jobSubject,
    status: 'Completed',
    duration: jobCompletedAt - jobStartedAt,
    active: false
  });
  coll.s.db.s.topology.close();
  return 'done: ' + jobSubject;
}

function aggregate2a() {
  _aggregate2a()
    .then(console.log)
    .catch(console.error);
}

function aggregate2b() {
  _aggregate2b()
    .then(console.log)
    .catch(console.error);
}

function aggregate2c() {
  _aggregate2c()
    .then(console.log)
    .catch(console.error);
}


module.exports = {
  aggregate2a,
  aggregate2b,
  aggregate2c
};
