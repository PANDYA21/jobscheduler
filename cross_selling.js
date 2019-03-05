const {
  _connect,
  connect,
  collections,
  collection,
  find
} = require('./mongo');
const MongoClient = require('mongodb').MongoClient;
const schedule = require('node-schedule');

const testPipeline1 = require('./pipelines/full_pipeline_cross_selling.js');

async function cross_selling() {
  const coll = await collection({
    url: 'mongodb://apiomat:Qh0Zw47u5t2x1@158.177.122.67:28017/?authSource=admin',
    dbname: "Stammdaten-test",
    collectionname: "Bewegungsdaten",
    keepAlive: true
  });
  coll.aggregate(testPipeline1, { allowDiskUse: true })
  .toArray((err, results) => {
    if (err) {
      return console.error(err);
    }
    console.log('done');
    coll.s.db.s.topology.close();
  });
}


module.exports = { cross_selling };
