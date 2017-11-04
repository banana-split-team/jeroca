'use strict';

var connect = require('connect');
var http = require('http');
var loopback = require('loopback');

const geolocation = require('google-geolocation')({
  key: 'AIzaSyA27HjYihRX4mTIaYmO2JF98amfNMIk8L0',
});

const params = {
  wifiAccessPoints: [
    {
      macAddress: '01:23:45:67:89:AB',
      signalStrength: -65,
      signalToNoiseRatio: 40,
    },
  ],
};

module.exports = function(Cajero) {
  Cajero.localizacion = function(cb) {
    geolocation(params, (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(data);
      cb(data);
    });
  };

  Cajero.remoteMethod(
    'localizacion', {
      http: {
        path: '/localizacion',
        verb: 'get',
      },
      returns: {
        arg: 'localizacion',
        type: 'string',
      },
    }
  );
};
