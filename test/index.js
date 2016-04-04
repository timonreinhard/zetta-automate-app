var expect = require('must');

var Rules = require('../lib/rules');

/* eslint-env mocha */

describe('Rules', function() {

  var rules;

  beforeEach(function() {
    rules = new Rules({
      filename: __dirname + '/fixture.yml'
    });
  });

  describe('.get(id)', function() {
    it('should return rule with given id', function() {
      var result = rules.get('flood-the-basement');
      expect(result).to.exist();
    });
  });

  describe('.getByTrigger(devicename, state)', function() {
    it('should return rules that match a devicename', function() {
      var result = rules.getByTrigger('Red Light');
      expect(result).to.have.length(2);
      expect(result[0]).to.have.property('id', 'tv-mood');
      expect(result[1]).to.have.property('id', 'flood-the-basement');
    });

    it('should return rules that match a devicename and state', function() {
      var result = rules.getByTrigger('Red Light', 'on');
      expect(result).to.have.length(1);
      expect(result[0]).to.have.property('id', 'flood-the-basement');
    });
  });

});

describe('Rule', function() {

  var rule;

  beforeEach(function(done) {
    var rules = new Rules();
    rules.loadFile(__dirname + '/fixture.yml', function(err, result) {
      if (err) throw err;
      rule = result[0];
      done();
    });
  });

  describe('.getActions()', function() {
    it('should return actions for the rule', function() {
      var result = rule.getActions();
      expect(result).to.have.length(2);
      expect(result[0]).to.have.property('device', 'backlight');
      expect(result[1]).to.have.property('action', 'do nothing');
    });
  });

});
