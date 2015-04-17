var settings = require('../config/settings.json');
var withings = require('withings-api');
//  Beginning 25.2.2015
var NORMAL_DATE = 0;
var UTC_DATE = 1;

function formatDate(date, format) {
  var formated = new Date(date).toISOString().slice(0, 10);
  switch (format) {
    case NORMAL_DATE:
      return formated;
      breake;

    case UTC_DATE:
      var utc = date.split('-');
      return Date.UTC(utc[0], utc[1], utc[2]) / 1000;
      breake;
  }
}


function activityQuery(options) {
  return withings.generateUrl({
    url: "https://wbsapi.withings.net/v2/measure",
    parameters: {
      action: "getactivity",
      userid: options.userid,
      startdateymd: options.startDate,
      enddateymd: options.endDate
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
      startdate: options.startDate,
      enddate: options.endDate,
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
      startdate: options.startDate,
      enddate: options.endDate
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
      startdateymd: options.startDate,
      enddateymd: options.endDate
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
      userid: options.userid
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
  userQuery: userQuery,
  constNormal: NORMAL_DATE,
  constUTC: UTC_DATE,
  formatDate: formatDate
};