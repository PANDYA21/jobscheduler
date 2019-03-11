const express = require('express');
let app = express();
const morgan = require('morgan');
const {
  startJob1b,
  startJob1c,
  getStatusForJob1b,
  getStatusForJob1c,
  startJob2a,
  startJob2b,
  startJob2c,
  getStatusForJob2a,
  getStatusForJob2b,
  getStatusForJob2c,
  endJob2a,
  endJob2b,
  endJob2c
} = require('./scheduler');

// logger and frontend-service
app.use(morgan('dev'));
app.use('/', express.static('public'));

// 2a
app.get('/trigger/2a/start', (req, res, next) => {
  startJob2a((err, resp) => {
    err ? res.status(500).json({message: [{message: err.message + '\n' + err.stack}]}) : res.status(200).json(resp);
  });
});

app.get('/trigger/2a/status', (req, res, next) => {
  getStatusForJob2a((err, resp) => {
    err ? res.status(500).json({message: [{message: err.message + '\n' + err.stack}]}) : res.status(200).json(resp);
  });
});

app.get('/trigger/2a/end', (req, res, next) => {
  endJob2a((err, resp) => {
    err ? res.status(500).json({message: [{message: err.message + '\n' + err.stack}]}) : res.status(200).json(resp);
  });
});


// 2b
app.get('/trigger/2b/start', (req, res, next) => {
  startJob2b((err, resp) => {
    err ? res.status(500).json({message: [{message: err.message + '\n' + err.stack}]}) : res.status(200).json(resp);
  });
});

app.get('/trigger/2b/status', (req, res, next) => {
  getStatusForJob2b((err, resp) => {
    err ? res.status(500).json({message: [{message: err.message + '\n' + err.stack}]}) : res.status(200).json(resp);
  });
});

app.get('/trigger/2b/end', (req, res, next) => {
  endJob2b((err, resp) => {
    err ? res.status(500).json({message: [{message: err.message + '\n' + err.stack}]}) : res.status(200).json(resp);
  });
});


// 2c
app.get('/trigger/2c/start', (req, res, next) => {
  startJob2c((err, resp) => {
    err ? res.status(500).json({message: [{message: err.message + '\n' + err.stack}]}) : res.status(200).json(resp);
  });
});

app.get('/trigger/2c/status', (req, res, next) => {
  getStatusForJob2c((err, resp) => {
    err ? res.status(500).json({message: [{message: err.message + '\n' + err.stack}]}) : res.status(200).json(resp);
  });
});

app.get('/trigger/2c/end', (req, res, next) => {
  endJob2c((err, resp) => {
    err ? res.status(500).json({message: [{message: err.message + '\n' + err.stack}]}) : res.status(200).json(resp);
  });
});


// 1b
app.get('/trigger/1b/start', (req, res, next) => {
  startJob1b((err, resp) => {
    err ? res.status(500).json({message: [{message: err.message + '\n' + err.stack}]}) : res.status(200).json(resp);
  });
});

app.get('/trigger/1b/status', (req, res, next) => {
  getStatusForJob1b((err, resp) => {
    err ? res.status(500).send(err) : res.status(200).json({ message: resp });
  });
});


// 1c
app.get('/trigger/1c/start', (req, res, next) => {
  startJob1c((err, resp) => {
    err ? res.status(500).json({message: [{message: err.message + '\n' + err.stack}]}) : res.status(200).json(resp);
  });
});

app.get('/trigger/1c/status', (req, res, next) => {
  getStatusForJob1c((err, resp) => {
    err ? res.status(500).send(err) : res.status(200).json({ message: resp });
  });
});


// start server
app.listen(8080, () => {
  console.info('Server starting at 8080');
});


process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason.stack || reason);
  // Recommended: send the information to sentry.io
  // or whatever crash reporting service you use
})