const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { writeStatus, updateStatus, getStatus, getActiveJobs } = require('./../job_logger');

// const { spawn, exec } = require('child_process');
// const ls = spawn('C:/Apache/spark-2.2.0-k8s-0.5.0-bin-2.7.3/bin/spark-submit test.py');

// ls.stdout.on('data', (data) => {
//   console.log(`stdout: ${data}`);
// });

// ls.stderr.on('data', (data) => {
//   console.log(`stderr: ${data}`);
// });

// ls.on('close', (code) => {
//   console.log(`child process exited with code ${code}`);
// });


async function _exec() {
  const jobStartedAt = Date.now();
  await writeStatus({ jobStartedAt, status: 'Started' });
  const { error, stdout, stderr } = await exec('C:/Apache/spark-2.2.0-k8s-0.5.0-bin-2.7.3/bin/spark-submit child_process/test.py');
  const jobCompletedAt = Date.now();
  await updateStatus({
    jobStartedAt,
    jobCompletedAt,
    status: 'Completed',
    error,
    stdout,
    stderr,
    duration: jobCompletedAt - jobStartedAt,
    active: false
  });
  return {
    error,
    stdout,
    stderr,
    jobStartedAt: Date(jobStartedAt),
    jobCompletedAt: Date(jobCompletedAt),
    duration: jobCompletedAt - jobStartedAt
  };
}

async function status() {
  return await getActiveJobs()
};


module.exports = {
  exec: _exec,
  status: function(cb) {
    status()
      .then(resp => cb(null, resp))
      .catch(err => cb(err, null));
  }
};
