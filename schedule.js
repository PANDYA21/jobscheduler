const {
  _connect,
  connect,
  collections,
  collection,
  find
} = require('./mongo');
const MongoClient = require('mongodb').MongoClient;
const schedule = require('node-schedule');


let j = schedule.scheduleJob('*/1 * * * *', full_pipeline_basket);

async function full_pipeline_basket() {
  const coll = await collection({
    url: 'mongodb://apiomat:Qh0Zw47u5t2x1@158.177.122.67:28017/?authSource=admin',
    dbname: "Stammdaten-test",
    collectionname: "Bewegungsdaten",
    keepAlive: true
  });
  coll.aggregate([{
          $match: {
            "plz": { "$exists": true }
          }
        }, {
          $redact: {
            $cond: [
              { "$eq": [{ "$strLenCP": "$plz" }, 5] },
              "$$KEEP",
              "$$PRUNE"
            ]
          }
        }, {
          $project: {
            produktIdLastTwoChars: { $substrCP: ["$produktId", 7, 2] },
            produktId: "$produktId",
            plz: "$plz",
            customerId: "$customerId",
            gesellschafterId: "$gesellschafterId",
            _id: "$_id"
          }
        }, {
          $project: {
            produktIdOriginal: "$produktId",
            plz: "$plz",
            customerId: "$customerId",
            gesellschafterId: "$gesellschafterId",
            _id: "$_id",
            produktId: {
              $cond: {
                if: { "$eq": [{ "$strLenCP": "$produktIdLastTwoChars" }, 2] },
                then: { "$substr": [ "$produktId", 0, 7 ] },
                else: "$produktId"
              }
            }
          }
        }, {
          $group: {
            _id: {
              customerId: "$customerId",
              plz: "$plz",
              gesellschafterId: "$gesellschafterId"
            },
            produkts: {
              $push: {
                $concat: ["$produktId"]
              }
            }
          }
        }, {
          $unwind: {
            path: "$produkts"
          }
        }, {
          $group: {
            _id: { $concat: ["$produkts", "-", "$_id.plz", "-", "$_id.customerId", "$_id.gesellschafterId"] },
            count: { $sum: 1 }
          }
        }, {
          $group: {
            _id: "$_id",
            count: { $sum: 1 }
          }
        }, {
          $group: {
            _id: { $substr: ["$_id", 0, 10] },
            count: { $sum: 1 }
          }
        }, {
          $project: {
            produktIdPlz: { $split: ["$_id", '-'] },
            count: "$count"
          }
        }, {
          $addFields: {
            produktId: {
              $arrayElemAt: ["$produktIdPlz", 0]
            },
            plz: {
              $arrayElemAt: ["$produktIdPlz", 1]
            }
          }
        }, {
          $out: "CronJobTesting"
        }], { allowDiskUse: true })
  .toArray((err, results) => {
    if (err) {
      return console.error(err);
    }
    console.log('done');
    coll.s.db.s.topology.close();
  });
}
