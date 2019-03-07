class Job {
  constructor() {
    for (let arg in arguments[0]) {
      this[arg] = arguments[0][arg];
    }
    return this.init();
  }

  init() {
    const now = Date.now();
    const nowString = this.jobStartedAt ? this.jobStartedAt.toString() : now.toString();
    return {
      jobId: 'job_' + nowString,
      jobStartedAt: this.jobStartedAt || now,
      jobCompletedAt: this.jobCompletedAt || null,
      duration: this.duration || null,
      status: this.status || '',
      active: typeof this.active === 'undefined' ? true : this.active
    }
  }
}

module.exports = Job;
