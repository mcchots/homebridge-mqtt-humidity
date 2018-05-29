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
          "topic": "home/livingroom/humidity/percentage",
          "charge_topic": "home/livingroom/humidity/charge",
          "batt_topic: "home/livingroom/humidity/battery",
          "batt_low_perc": "25",
          "username": "username",
          "password": "password",
          "serial": "HMH-54D3X"
				}
      ],

      "platforms": []
    }

----    

`serial` allows you to change the serial number to a custom value if you need it.
`batt_topic`, `charge_topic` and `bat_low_perc` are for battery powered sensors. `batt_low_perc` overrides the default 20% value. `charge_topic` is for charging state. It requires values of either 0 or 1 for off and on respectively.

All five are optional including `username` and `password` if you don't use MQTT authentication.


####  Credits

[homebridge-mqttswitch](https://github.com/ilcato/homebridge-mqttswitch)

[homebridge-mqttgaragedoor](https://github.com/tvillingett/homebridge-mqttgaragedoor)

[homebridge-ds18b20](https://github.com/DanTheMan827/homebridge-ds18b20)
