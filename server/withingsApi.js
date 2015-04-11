var settings = require('../config/settings.json');
var withings = require('withings-api');
var beginning = '2015-02-25';
var utcbegin = Date.UTC(2015, 02, 25) / 1000;

function activityQuery(options) {
  return withings.generateUrl({
    url: "https://wbsapi.withings.net/v2/measure",
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

// Body measurement URL Example:
//https://wbsapi.withings.net/measure?action=getmeas&userid=29&startdate=1222819200&enddate=1223190167
function bodyQuery(options) {
  return withings.generateUrl({
    url: "https://wbsapi.withings.net/measure",
    parameters: {
      action: "getmeas",
      userid: options.userid,
      //startdate: utcbegin,
      //enddate: options.enddate,
      lastupdate :utcbegin,
      category: 1
    },
    consumer_key: settings.withings.key,
    consumer_secret: settings.withings.secret,
    access_token: options.access_token,
    access_token_secret: options.access_secret
  });
}

function sleepSummaryQuery(options) {
  return withings.generateUrl({
    url: "https://wbsapi.withings.net/v2/sleep",
    parameters: {
      action: "getsummary",
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

function userQuery(options) {
  return withings.generateUrl({
    url: "http://wbsapi.withings.net/user",
    parameters: {
      action: "getbyuserid",
      userid: options.userid,
    },
    consumer_key: settings.withings.key,
    consumer_secret: settings.withings.secret,
    access_token: options.access_token,
    access_token_secret: options.access_secret
  });
}

module.exports = {
  activityQuery: activityQuery,
  sleepSummaryQuery: sleepSummaryQuery,
  sleepQuery: sleepQuery,
  bodyQuery: bodyQuery,
  userQuery: userQuery
};