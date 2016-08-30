var path = require('path');

var Rules = require('./lib/rules');
var Resource = require('./resource');

var rules = new Rules({
  filename: path.join(process.cwd(), './rules.yml')
});

module.exports = function(server) {
  var devices = {};

  var deviceCommand = function(d) {
    var device = devices[d.device];
    if (!device) {
      server.warn('Device ' + d.device + ' not found (Rule: ' + this.id + ')');
      return;
    }
    var command = d.action.split(' ');
    device.call.apply(this, command);
  };

  var handleStateUpdate = function(device, state) {
    rules.getByTrigger(device.name, state).forEach(function(triggered) {
      server.info('Rule ' + triggered.id + ' triggered by ' + device.name + ':' + state);
      triggered.getActions().forEach(deviceCommand, triggered);
    });
  };

  var deviceQuery = server.query('type like "%"');
  server.observe([deviceQuery], function(device) {
    devices[device.name] = device;
    device.streams.state.on('data', function(event) {
      handleStateUpdate(device, event.data);
    });
  });

  var webhook = function(name, rule) {
    if (name !== 'trigger') return;
    server.info('Rule ' + rule.id + ' triggered by Webhook');
    rule.getActions().forEach(deviceCommand, rule);
  };

  var titan = server.httpServer.cloud;
  titan.add(Resource, rules, webhook);
};
