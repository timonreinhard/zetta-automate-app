var parser = require('parser-yaml');

var Rule = function(id, yml) {
  this.id = id;
  this._trigger = yml.if;
  this._actions = yml.do;
};

Rule.prototype.matchTrigger = function(name, state) {
  if (!this._trigger || !this._trigger[name]) return false;
  return state ? this._trigger[name] === state : true;
};

Rule.prototype.getActions = function() {
  var actions = [];
  for (var device in this._actions) {
    actions.push({
      device: device,
      action: this._actions[device]
    });
  }
  return actions;
};

var Rules = module.exports = function() {
  this._rules = [];
};

Rules.prototype.load = function(filename, cb) {
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
