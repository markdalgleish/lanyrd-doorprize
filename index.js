var request = require('request');
var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var ejs = require('ejs');
var jsesc = require('jsesc');
var getPort = require('get-port');
var opn = require('opn');

var template = ejs.compile(fs.readFileSync('./template.ejs', 'utf8'));

module.exports = function (event, callback) {
  var url = 'http://m.lanyrd.com/' + event + '/attendees/';

  console.log('Loading attendees from ' + url);

  request(url, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var $ = cheerio.load(body);

      var data = [];

      $('a[href^="/profile"]').each(function() {
        var $this = $(this);
        data.push([
          jsesc($this.find('div.title').text().trim(), { quotes: 'double' }),
          $this.find('img').attr('src')
        ]);
      });

      getPort(function(err, port) {
        if (err) {
          return console.log(err);
        }

        http.createServer(function(request, response) {
          response.writeHead(200, { 'Content-type': 'text/html' });
          response.end(template({ data: JSON.stringify(data) }));
        }).listen(port);

        console.log('Listening on port ' + port);

        opn('http://localhost:' + port);
      });
    } else {
      callback(error || response);
    }
  });
};