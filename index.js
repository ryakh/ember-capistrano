/* jshint node: true */
'use strict';

var commands = require('./lib/commands');

module.exports = {
  name: 'ember-capistrano',

  includedCommands: function() {
    return commands;
  }
};
