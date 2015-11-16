require('shelljs/global');

var path         = require('path');
var chalk        = require('chalk');
var timestamp    = Date.now();
var outputPath   = `tmp${path.sep}${timestamp}`;
var projectRoot  = '/home/airglow/airglow-ui/';
var releasesPath = `${projectRoot}releases/`;

module.exports = {
  name:        'capistrano',
  description: 'Builds and deploys your ember-cli app',
  works:       'insideProject',

  run: function() {
    var buildCommand = `ember build -e -prod -o ${outputPath}`;

    this.log('Building application. This may take a while.', { color: 'yellow' });
    exec(buildCommand, { silent: true }).output;
    this.log('Application built.', { color: 'green' });

    var scpCommand = `scp -r ${outputPath} airglow@airglow.io:${releasesPath}`

    this.log('Uploading application to server.', { color: 'yellow' });
    exec(scpCommand, { silent: true }).output;

    this.log('Setting up links', { color: 'yellow' });
    var rmCommand = "ssh airglow@airglow.io 'cd "+releasesPath+" && rm -rf `ls -t | tail -n +6`'";
    exec(rmCommand).output;

    exec(`ssh airglow@airglow.io 'cd ${projectRoot} && ln -sfn ${releasesPath}${timestamp} current'`).output;

    this.log('All done!', { color: 'green' });
  },

  log: function(message, opts) {
    var ui        = this.ui;
    var timestamp = new Date().toJSON().slice(0,19).replace('T', ' ');

    opts       = opts || { color: 'blue' };
    opts.color = opts.color || 'blue';

    var messageColor = chalk[opts.color];
    ui.writeLine(chalk.bold(timestamp) + ' ' + messageColor(message));
  }
};
