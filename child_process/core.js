const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { writeStatus, updateStatus, getStatus, getActiveJobs, getAllJobs, getLastJobOfSubject } = require('./../job_logger');
const SPARK_HOME = process.env.SPARK_HOME || 'C:/Apache/spark-2.2.0-k8s-0.5.0-bin-2.7.3/';

console.log({ 'SPARK_HOME': SPARK_HOME });

async function _exec(jobSubject, scriptPath) {
  const jobStartedAt = Date.now();
  await writeStatus({ jobStartedAt, status: 'Started', jobSubject });
  const { error, stdout, stderr } = await exec(`chmod +x ./child_process/submit_${jobSubject}.sh&&./child_process/submit_${jobSubject}.sh`); // await exec(`${SPARK_HOME}bin/spark-submit ${scriptPath}`);
  console.log({ error, stdout, stderr });
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


module.exports = {
  exec: _exec,
  status
};


// start the kubectl proxy server
const { spawn } = require('child_process');
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}
if (process.env.NODE_ENV.indexOf('prod') === -1) {
  process.env.KUBECONFIG = '/home/bhaumik/.bluemix/plugins/container-service/clusters/mitegro-qa01/kube-config-fra02-mitegro-qa01.yml';
} else { 
  process.env.KUBECONFIG = '/root/.bluemix/plugins/container-service/clusters/mitegro-qa01/kube-config-fra02-mitegro-qa01.yml';
}

console.log({ NODE_ENV: process.env.NODE_ENV });
console.log({ KUBECONFIG: process.env.KUBECONFIG });

const proxy = spawn('./kubectl', ['proxy', '-p', '8001']);

proxy.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

proxy.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

proxy.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

