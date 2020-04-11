const Sentry = require('@sentry/node');
Sentry.init({ dsn: `${process.env.SENTRY}` });

exports.Sentry = Sentry;
