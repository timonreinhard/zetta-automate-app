var zetta = require('zetta');
var Led = require('zetta-led-mock-driver');
var Window = require('zetta-window-mock-driver');
var Simulator = require('./simulator');
var App = require('../app');

zetta()
.use(Led, 'Red Light')
.use(Window)
.use(Simulator)
.use(App)
.listen(1337, function() {
  console.log('Zetta is running at http://127.0.0.1:1337');
});
