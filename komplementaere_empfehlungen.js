const {
  _connect,
  connect,
  collections,
  collection,
  find
} = require('./mongo');
const MongoClient = require('mongodb').MongoClient;
const schedule = require('node-schedule');

// 6 Uhr morgens
// let j = schedule.scheduleJob('* */6 * * *', komplementaere_empfehlungen);

async function komplementaere_empfehlungen() {
  const coll = await collection({
    url: 'mongodb://apiomat:Qh0Zw47u5t2x1@158.177.122.67:28017/?authSource=admin',
    dbname: "Stammdaten-test",
    collectionname: "Bewegungsdaten",
    keepAlive: true
  });
  coll.aggregate([{
          $project: {
      mitegronummer7LastTwoChars: { $substrCP: ["$mitegronummer7", 7, 2] },
      mitegronummer7: "$mitegronummer7",
      "herstellername": "$herstellername",
      "marke": "$marke",
      "produktserie": "$produktserie",
      "zolltarifnummer": "$zolltarifnummer"
    }
  }, {
    $project: {
      mitegronummer7Original: "$mitegronummer7",
      "herstellername": "$herstellername",
      "marke": "$marke",
      "produktserie": "$produktserie",
      "zolltarifnummer": "$zolltarifnummer",
      mitegronummer7: {
        $cond: {
          if: { "$eq": [{ "$strLenCP": "$mitegronummer7LastTwoChars" }, 2] },
          then: { "$substr": ["$mitegronummer7", 0, 7] },
          else: "$mitegronummer7"
        }
      }
    }
  }, {
    $group: {
      _id: {
        "herstellername": "$herstellername",
        "marke": "$marke",
        "produktserie": "$produktserie",
        "zolltarifnummer": "$zolltarifnummer"
      },
      produkts: {
        $push: "$mitegronummer7"
      }
    }
  }, {
    $out: "ProduktgruppeTest"
  }], { allowDiskUse: true })
  .toArray((err, results) => {
    if (err) {
      return console.error(err);
    }
    console.log('done');
    coll.s.db.s.topology.close();
  });
}

module.exports = { komplementaere_empfehlungen };
