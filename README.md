# homebridge-mqtt-humidity
Get Himidity Sensor data via MQTT in Homebridge

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
          "url": "mqtt://localhost",
          "topic": "home/livingroom/humidity"
    		}
      ],

      "platforms": []
    }
