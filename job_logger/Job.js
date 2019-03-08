class Job {
  constructor() {
    for (let arg in arguments[0]) {
      this[arg] = arguments[0][arg];
    }
    return this.init();
  }

  init() {
    this.setSuplioedValues();
    const now = Date.now();
    const nowString = this.jobStartedAt ? this.jobStartedAt.toString() : now.toString();
    this.details = Object.assign(this.details, {
      jobId: 'job_' + nowString,
      jobStartedAt: this.jobStartedAt || now,
      jobCompletedAt: this.jobCompletedAt || null,
      duration: this.duration || null,
      status: this.status || '',
      active: typeof this.active === 'undefined' ? true : this.active,
      jobSubject: this.jobSubject || '',
      nextExecution: this.nextExecution || null,
      lastExecution: this.lastExecution || null
    });
    return this.details;
  }

  setSuplioedValues() {
    let details = {};
    for (let key in this) {
      details[key] = this[key];
    }
    this.details = details;
  }
}

module.exports = Job;
