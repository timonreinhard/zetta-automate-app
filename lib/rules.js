var parser = require('parser-yaml');

var Rule = function(id, yml) {
  this.id = id;
  this.trigger = yml.trigger;
  this.actions = yml.action;
};

Rule.prototype.matchTrigger = function(name, state) {
  if (!this.trigger || !this.trigger[name]) return false;
  return state ? this.trigger[name] === state : true;
};

Rule.prototype.getActions = function() {
  var actions = [];
  for (var device in this.actions) {
    actions.push({
      device: device,
      action: this.actions[device]
    });
  }
  return actions;
};

var Rules = module.exports = function(config) {
  var options = config || {};
  this._rules = [];
  if (options.filename) {
    this.loadFileSync(options.filename);
  }
};

Rules.prototype.loadFileSync = function(filename) {
  var yml = parser.parseFileSync(filename);
  var rules = [];
  for (var key in yml) {
    rules.push(new Rule(key, yml[key]));
  }
  this._rules = rules;
};

Rules.prototype.loadFile = function(filename, cb) {
  cb = (typeof cb === 'function') ? cb : function() {};
  var self = this;
  parser.parseFile(filename, function(err, res) {
    if (err) cb(err);
    for (var id in res) {
      self._rules.push(new Rule(id, res[id]));
    }
    cb(null, self._rules);
  });
};

Rules.prototype.count = function() {
  return this._rules.length;
};

Rules.prototype.get = function(id) {
  return this._rules.find(function(rule) {
    return id === rule.id;
  });
};

Rules.prototype.getByTrigger = function(name, state) {
  return this._rules.filter(function(rule) {
    return rule.matchTrigger(name, state);
  });
};
