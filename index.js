var Service, Characteristic;
var mqtt = require('mqtt');

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
  this.batt_topic = config['batt_topic'];
  this.charge_topic = config['charge_topic'];
  this.batt_low_perc = config['batt_low_perc'] || 20;
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
  this.client.subscribe(this.topic);

  if (this.batt_topic) {
    this.service.addCharacteristic(Characteristic.BatteryLevel)
    .on('get', this.getBattery.bind(this));

    this.service.addCharacteristic(Characteristic.StatusLowBattery)
    .on('get', this.getLowBattery.bind(this));

    this.client.subscribe(this.batt_topic);
  }

  if (this.charge_topic){
    this.service.addCharacteristic(Characteristic.ChargingState)
    .on('get', this.getChargingState.bind(this));

    this.client.subscribe(this.charge_topic);
  }
  var that = this;

  this.client.on('message', function (topic, message) {
    // message is Buffer
    try {
      data = JSON.parse(message);
    } catch (e) {
      return null;
    }
    if (data === null) {return null}
    data = parseFloat(data);
    if (!isNaN(data)) {

      if (topic === that.topic) { 
        that.humidity = data;
        that.log.debug('Sending MQTT.Humidity: ' + that.humidity);
      that.service
        .getCharacteristic(Characteristic.CurrentRelativeHumidity).updateValue(that.humidity);
      }
      if (that.batt_topic) {
        if (topic === that.batt_topic) { 
          that.battery = data;
          that.log.debug('Sending MQTT.Battery: ' + that.battery);
          that.service
            .getCharacteristic(Characteristic.BatteryLevel).updateValue(that.battery);
          
          (data <= that.batt_low_perc) ? that.lowBattery = true : that.lowBattery = false;

          that.service
            .getCharacteristic(Characteristic.StatusLowBattery).updateValue(that.lowBattery);
        }
      }  
      if (topic == that.charge_topic){
        that.chargingState = data;
        that.log.debug('Sending MQTT.BattChargingState: ' + that.chargingState);
        that.service
          .getCharacteristic(Characteristic.ChargingState).updateValue(that.chargingState);
  
      }
    }
  });

  this.service
    .getCharacteristic(Characteristic.CurrentRelativeHumidity)
    .on('get', this.getState.bind(this));
}

RelativeHumidityAccessory.prototype.getState = function(callback) {
    this.log.debug("Get Humidity called: " + this.humidity);
    callback(null, this.humidity);
}

RelativeHumidityAccessory.prototype.getBattery = function(callback) {
  this.log.debug("Get Battery Called: " + this.battery);
  callback(null, this.battery);
}
RelativeHumidityAccessory.prototype.getLowBattery = function(callback) {
  this.log.debug("Get Low Battery Status: " + this.lowBattery);
  callback(null, this.lowBattery);
}

RelativeHumidityAccessory.prototype.getChargingState = function(callback) {
  this.log.debug("Get Charging Status: " + this.chargingState);
  callback(null, this.chargingState);
}

RelativeHumidityAccessory.prototype.getServices = function() {
  var informationService = new Service.AccessoryInformation();
  informationService
    .setCharacteristic(Characteristic.Manufacturer, "MQTT Sensor")
    .setCharacteristic(Characteristic.Model, "MQTT Humidity")
    .setCharacteristic(Characteristic.SerialNumber, this.options["serialnumber"]);

  return [informationService, this.service];
}
