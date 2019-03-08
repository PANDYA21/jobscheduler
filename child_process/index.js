const util = require('util');
const { exec, status } = require('./core');
const SCRIPT_1B_PATH = 'child_process/test_1b.py';
const SCRIPT_1C_PATH = 'child_process/test_1c.py';


async function startJob1b() {
  return await exec('1b', SCRIPT_1B_PATH);
}

async function startJob1c() {
  return await exec('1c', SCRIPT_1C_PATH);
}

async function getStatusForJob1b() {
  return await status('1b');
}

async function getStatusForJob1c() {
  return await status('1c');
}

module.exports = {
  startJob1b,
  startJob1c,
  getStatusForJob1b: function(cb) {
    getStatusForJob1b()
      .then(resp => cb(null, resp))
      .catch(err => cb(err, null));
  },
  getStatusForJob1c: function(cb) {
    getStatusForJob1c()
      .then(resp => cb(null, resp))
      .catch(err => cb(err, null));
  }
};
