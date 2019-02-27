const util = require('util');
const MongoClient = require('mongodb').MongoClient;
const globals = require('./globals.json');
const MONGO_NDOCS_LIM = globals.MONGO_NDOCS_LIM;
const RECOMMENDATIONS_LENGTH = globals.RECOMMENDATIONS_LENGTH;
const _ = require('lodash');

function _connect(url_or_client, cb, dbname, should_connection_be_left_open = false) {
  const localclient = typeof url_or_client === 'string' ? new MongoClient(url_or_client, { useNewUrlParser: true }) : url_or_client;
  localclient.connect(err => {
    if (err) {
      return cb(err, null);
    }
    if (!should_connection_be_left_open) {
      localclient.close();
    }
    cb(null, localclient);
  });
}

function connect(options) {
  return new Promise((resolve, reject) => {
    _connect(options.client || options.urlOrClient || options.url, (err, client) => err ? reject(err) : resolve(client), options.dbname, options.keepAlive);
  });
}

async function collections(options) {
  const mainKeepAlive = options.keepAlive;
  options.keepAlive = true;
  const client = await connect(options);
  const db = client.db(options.dbname);
  return new Promise((resolve, reject) => db.collections((err, colls) => {
    err ? reject(err) : resolve(colls, client, db);
    if (!mainKeepAlive)
      client.close();
  }));
}

async function collection(options) {
  const mainKeepAlive = options.keepAlive;
  options.keepAlive = true;
  const client = await connect(options);
  const db = client.db(options.dbname);
  return new Promise((resolve, reject) => db.collection(options.collectionname, (err, colls) => {
    err ? reject(err) : resolve(colls, client, db);
    if (!mainKeepAlive)
      client.close();
  }));
}

async function find(options) {
  const mainKeepAlive = options.keepAlive;
  // const sortingOptions = _.merge({}, options.sortingOptions, { confidence: -1 });
  const sortingOptions = _.merge({}, options.sortingOptions, {});
  options.keepAlive = true;
  const coll = await collection(options);
  return new Promise((resolve, reject) => coll
    .find(options.query, options.queryOptions)
    .limit(options.nDocsLim || MONGO_NDOCS_LIM)
    .sort(sortingOptions)
    .toArray((err, result) => {
      err ? reject(err) : resolve({ result, collection: coll });
      if (!mainKeepAlive)
        coll.s.db.s.topology.close();
    }));
}

module.exports = {
  _connect,
  connect,
  collections,
  collection,
  find
};
