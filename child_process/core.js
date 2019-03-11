const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { writeStatus, updateStatus, getStatus, getActiveJobs, getAllJobs, getLastJobOfSubject } = require('./../job_logger');
const SPARK_HOME = (process.env.SPARK_HOME || 'C:/Apache/spark-2.2.0-k8s-0.5.0-bin-2.7.3') + '/';

console.log({ 'SPARK_HOME': SPARK_HOME });

async function _exec(jobSubject, scriptPath) {
  const jobStartedAt = Date.now();
  await writeStatus({ jobStartedAt, status: 'Started', jobSubject });
  const { error, stdout, stderr } = await exec(`${SPARK_HOME}bin/spark-submit ${scriptPath}`);
  const jobCompletedAt = Date.now();
  return await updateStatus({
    jobStartedAt,
    jobCompletedAt,
    jobSubject,
    status: 'Completed',
    error,
    stdout,
    stderr,
    duration: jobCompletedAt - jobStartedAt,
    active: false
  });
}

async function status(jobSubject) {
  return await getLastJobOfSubject(jobSubject);
};

// start the kubectl proxy server
async function kubeProxy() {
  const { error1, stdout1, stderr1 } = await exec(`kubectl proxy`);
  console.log({ error1, stdout1, stderr1 });
}
kubeProxy().catch(console.error).then();

module.exports = {
  exec: _exec,
  status
};
