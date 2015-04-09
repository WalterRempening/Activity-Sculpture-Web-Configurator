var settings = require('../config/settings.json');
var withings = require('withings-api');
var beginning = '2015-02-25';

function activityQuery(options) {
  return withings.generateUrl({
    url: "http://wbsapi.withings.net/v2/measure",
    parameters: {
      action: "getactivity",
      userid: options.userid,
      startdateymd: beginning,
      enddateymd: options.enddate
    },
    consumer_key: settings.withings.key,
    consumer_secret: settings.withings.secret,
    access_token: options.access_token,
    access_token_secret: options.access_secret
  });

}

function bodyQuery(options) {
  return withings.generateUrl({
    url: "http://wbsapi.withings.net/v2/measure",
    parameters: {
      action: "getmeas",
      userid: options.userid,
      startdate: beginning,
      enddate: options.enddate
    },
    consumer_key: settings.withings.key,
    consumer_secret: settings.withings.secret,
    access_token: options.access_token,
    access_token_secret: options.access_secret
  });
}

function sleepSummaryQuery(options) {
  return withings.generateUrl({
    url: "http://wbsapi.withings.net/v2/sleep",
    parameters: {
      action: "getsummary",
      userid: options.userid,
      startdateymd: beginning,
      enddateymd: options.enddate
    },
    consumer_key: settings.withings.key,
    consumer_secret: settings.withings.secret,
    access_token: options.access_token,
    access_token_secret: options.access_secret
  });
}

function sleepQuery(options) {
  return withings.generateUrl({
    url: "http://wbsapi.withings.net/v2/sleep",
    parameters: {
      action: "get",
      userid: options.userid,
      startdateymd: beginning,
      enddateymd: options.enddate
    },
    consumer_key: settings.withings.key,
    consumer_secret: settings.withings.secret,
    access_token: options.access_token,
    access_token_secret: options.access_secret
  });
}

module.exports = {
  activityQuery: activityQuery,
  sleepSumQuery: sleepSummaryQuery,
  sleepQuery: sleepQuery,
  bodyQuery: bodyQuery
};