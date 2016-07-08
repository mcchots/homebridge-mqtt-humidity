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
  
  this.service = new Service.HumiditySensor(this.name);
  this.client  = mqtt.connect(this.url);
  var that = this;
  this.client.subscribe(this.topic);
 
  this.client.on('message', function (topic, message) {
    // message is Buffer 
    data = JSON.parse(message);
    if (data === null) {return null}
    that.humidity = parseFloat(data);
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
  return [this.service];
}


