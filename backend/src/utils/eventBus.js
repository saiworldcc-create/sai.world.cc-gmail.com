const EventEmitter = require('events');

class EnterpriseEventBus extends EventEmitter {}

const eventBus = new EnterpriseEventBus();

module.exports = eventBus;
