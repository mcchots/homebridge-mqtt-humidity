# homebridge-mqtt-humidity
Get Humidity Sensor data via MQTT in Homebridge

Installation
--------------------
    sudo npm install -g homebridge-mqtt-humidity


Sample HomeBridge Configuration
--------------------
    {
      "bridge": {
        "name": "HomeBridge",
        "username": "CC:33:3B:D3:CE:32",
        "port": 51826,
        "pin": "321-45-123"
      },

      "description": "",

      "accessories": [
				{
          "accessory": "mqtt-humidity",
          "name": "Living Room Humidity",
          "url": "mqtt://10.0.0.5",
          "topic": "home/livingroom/humidity",
          "username": "username",
          "password": "password",
          "serial": "HMH-54D3X"
				}
      ],

      "platforms": []
    }

----    

`serial` allows you to change the serial number to a custom value if you need it.

It is optional as well as `username` and `password` if you don't use MQTT authentication.


####  Credits

[homebridge-mqttswitch](https://github.com/ilcato/homebridge-mqttswitch)

[homebridge-mqttgaragedoor](https://github.com/tvillingett/homebridge-mqttgaragedoor)

[homebridge-ds18b20](https://github.com/DanTheMan827/homebridge-ds18b20)
