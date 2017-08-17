var Service, Characteristic;
var mqtt    = require('mqtt');

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-mqtt-humidity", "mqtt-humidity", RelativeHumidityAccessory);
}

function RelativeHumidityAccessory(log, config) {
  this.log = log;
  this.name = config["name"];
  this.url = config['url'];
  this.topic = config['topic'];
  this.client_Id = 'mqttjs_' + Math.random().toString(16).substr(2, 8);
  this.options = {
    keepalive: 10,
    clientId: this.client_Id,
    protocolId: 'MQTT',
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    serialnumber: config["serial"] || this.client_Id,
    will: {
      topic: 'WillMsg',
      payload: 'Connection Closed abnormally..!',
      qos: 0,
      retain: false
    },
    username: config["username"],
    password: config["password"],
    rejectUnauthorized: false
  };

  this.service = new Service.HumiditySensor(this.name);
  this.client  = mqtt.connect(this.url, this.options);
  var that = this;
  this.client.subscribe(this.topic);

  this.client.on('message', function (topic, message) {
    // message is Buffer
    data = JSON.parse(message);
    if (data === null) {return null}
    that.humidity = parseFloat(data);
    that.service
      .setCharacteristic(Characteristic.CurrentRelativeHumidity, that.humidity);

  });

  this.service
    .getCharacteristic(Characteristic.CurrentRelativeHumidity)
    .on('get', this.getState.bind(this));
}

RelativeHumidityAccessory.prototype.getState = function(callback) {
    this.log(this.name, " - MQTT : ", this.humidity);
    callback(null, this.humidity);
}

RelativeHumidityAccessory.prototype.getServices = function() {
  var informationService = new Service.AccessoryInformation();
  informationService
    .setCharacteristic(Characteristic.Manufacturer, "MQTT Sensor")
    .setCharacteristic(Characteristic.Model, "MQTT Humidity")
    .setCharacteristic(Characteristic.SerialNumber, this.options["serialnumber"]);

  return [informationService, this.service];
}
