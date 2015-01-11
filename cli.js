#!/usr/bin/env node

var doorprize = require('./');
var opn = require('opn');
var args = process.argv.splice(2);

doorprize(args[0], function(err, winner) {
  if (err) {
    process.stdout.write(err + '\n');
    return;
  }

  if (args[1] === '-o' || args[1] === '--open') {
    opn(winner);
  } else {
    process.stdout.write(winner + '\n');
  }
});
