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

// function shapeStatusDoc(job) {
//   let obj = {
//     jobId: 'job_' + job.jobStartedAt.toString(),
//     jobStartedAt: job.jobStartedAt,
//     jobCompletedAt: job.jobCompletedAt,
//     status: job.status
//   };
//   for (let key in job) {
//     if (key !== 'jobStartedAt' && key !== 'jobCompletedAt' && key !== 'status' && key !== '_id') {
//       obj[key] = job[key];
//     }
//   }
//   return obj;
// }

async function writeStatus(job) {
  const coll = await getCronJobColl();
  console.log('WRITING doc');
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
  console.log('At update: ', job);
  let doc = (await coll.find({ jobId: 'job_' + job.jobStartedAt.toString() }).toArray())[0];
  if (!doc)
	  return await writeStatus(job);
  for (let key in job) {
    doc[key] = job[key];
  }
  const statusDoc = new Job(doc);
  console.log('UPDATING doc');
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

async function getActiveJobs() {
  const coll = await getCronJobColl();
  const docs = await coll.find({ active: true }).toArray();
  coll.s.db.s.topology.close();
  return docs;
}


module.exports = { writeStatus, updateStatus, getStatus, getActiveJobs };