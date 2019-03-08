const {
  _connect,
  connect,
  collections,
  collection,
  find
} = require('./../mongo');
const Job = require('./Job');


async function getCronJobColl() {
  return await collection({
    url: 'mongodb://apiomat:Qh0Zw47u5t2x1@158.177.122.67:28017/?authSource=admin',
    dbname: "Spark",
    collectionname: "CronJobs",
    keepAlive: true
  });
}

async function writeStatus(job) {
  const coll = await getCronJobColl();
  return new Promise((resolve, reject) => {
    const statusDocs = new Job(job);
    coll.insertOne(statusDocs, { w: 1 }, (err, result) => {
      err ? reject(err) : resolve(result.result);
      return coll.s.db.s.topology.close();
    });
  });
}

async function updateStatus(job) {
  const coll = await getCronJobColl();
  let doc = (await coll.find({ jobId: 'job_' + job.jobStartedAt.toString() }).toArray())[0];
  if (!doc)
	  return await writeStatus(job);
  for (let key in job) {
    doc[key] = job[key];
  }
  const statusDoc = new Job(doc);
  return new Promise((resolve, reject) => {
    coll.update({ _id: doc._id }, { $set: statusDoc }, { upsert: true }, (err, result) => {
      err ? reject(err) : resolve(result.result);
      return coll.s.db.s.topology.close();
    });
  });
}

async function getStatus(job) {
  const coll = await getCronJobColl();
  const docs = await coll.find({ jobId: 'job_' + job.jobStartedAt.toString() }).toArray();
  coll.s.db.s.topology.close();
  return docs;
}

async function getActiveJobs(jobSubject) {
  const coll = await getCronJobColl();
  const docs = await coll.find({ active: true, jobSubject }).toArray();
  coll.s.db.s.topology.close();
  return docs;
}

async function getAllJobs() {
  const coll = await getCronJobColl();
  const docs = await coll.find().toArray();
  coll.s.db.s.topology.close();
  return docs;
}

async function getLastJobOfSubject(jobSubject='') {
  const coll = await getCronJobColl();
  const docs = await coll.find({ jobSubject }).sort({ jobStartedAt: -1 }).limit(1).toArray();
  coll.s.db.s.topology.close();
  return docs;
}


module.exports = { writeStatus, updateStatus, getStatus, getActiveJobs, getAllJobs, getLastJobOfSubject };
