var request = require('request');
var cheerio = require('cheerio');

module.exports = function (event, callback) {
  request('http://m.lanyrd.com/' + event + '/attendees/', function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var $ = cheerio.load(body);
      var $profiles = $('a[href^="/profile/"]');

      if ($profiles.length === 0) {
        return callback(new Error('No profiles found'));
      }

      var $randomProfile = $profiles.eq(Math.round(Math.random() * $profiles.length));
      callback(null, 'http://lanyrd.com' + $randomProfile.attr('href'));
    } else {
      callback(error || response);
    }
  });
};