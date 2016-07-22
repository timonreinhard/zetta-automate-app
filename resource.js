var Resource = module.exports = function(rules, webhook) {
  this.rules = rules;
  this.path = '/automate';
  this.webhook = (typeof webhook === 'function') ? webhook : null;
};

Resource.prototype.init = function(config) {
  config
    .path(this.path)
    .produces('application/json')
    .consumes('application/json')
    .get('/', this.list)
    .get('/{id}', this.show)
    .post('/{id}/trigger', this.trigger);
};

Resource.prototype.list = function(env, next) {
  env.response.body = this.rules._rules;
  next(env);
};

Resource.prototype.show = function(env, next) {
  var rule = this.rules.get(env.route.params.id);
  if (rule) {
    env.response.body = rule;
  } else {
    env.response.statusCode = 404;
  }
  next(env);
};

Resource.prototype.trigger = function(env, next) {
  var rule = this.rules.get(env.route.params.id);
  if (!rule || !this.webhook) {
    env.response.statusCode = 404;
  } else {
    env.response.statusCode = 204;
    this.webhook('trigger', rule);
  }
  next(env);
};
