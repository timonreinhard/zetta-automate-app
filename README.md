# zetta-automate-app

A minimal [Zetta](https://github.com/zettajs/zetta) application for automating devices based on simple if-than-that rules described by a [YAML](https://github.com/timonreinhard/zetta-automate-app/blob/master/example/rules.yml) file.

## Install

Install it into your existing Zetta project by running:

```bash
$ npm install timonreinhard/zetta-automate-app --save
```

## Usage

Add the module to your existing `server.js`, e.g.:

```js
var zetta = require('zetta');
var Automate = require('zetta-automate-app');

zetta()
  .use(Automate)
  .listen(1337);
```

Then create a custom `rules.yml` in the root of your project directory. See the following section on how to write rules.

## Rule Syntax

```yaml
# rules.yml
my_rule:
  trigger:
    Water Sensor: wet
    Button: pressed
  action:
    Pump: turn-on
```

### my_rule

An unique identifier for the subsequent rule. Used for logging purposes and for triggering rules via Webhooks (see below).

### trigger

The optional `trigger` contains a list of device names and their corresponding state that should trigger the rule. In the example above the rule *my_rule* would be triggered if the device with `name` *Water Sensor* changes its `state` property to *wet*. Or if the device named _Button_ changes to _pressed_.

### action

The `action` holds one or more device transitions that should be run whenever the rule gets triggered. In the given example the transition `turn-on` would be called for the device named _Pump_.

## Webhooks

Rules can be triggered externally by sending `POST` requests to `http://localhost:1337/rule_name/trigger`.

## Limitations

* Only state changes are considered for triggering rule actions, other streams (_monitors_) are not supported.
* Devices are identified by their human-friendly `name` property, which is however not necessarily unique.

## Alternatives

I quickly hacked together this module, because I love the simplicity behind Zetta.js and wanted to do some [basic home automation](https://gist.github.com/timonreinhard/b6182a293867041bd4b667bbc339d807) with it. If you're looking for something way more sophisticated, you might like one of those fine FOSS projects:

* [openHAB](http://www.openhab.org) (Java)
* [Home Assistent](https://home-assistant.io) (Python)
* [pimatic](https://pimatic.org) (Coffee Script)

## License

Published under the [MIT License](https://github.com/timonreinhard/zetta-automate-app/blob/master/LICENSE).
