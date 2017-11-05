'use strict';

var request = require('request');
var fs = require('fs');
var VisaAPIClient = require('../../server/visa/visaapiclient.js');
var config = require('../../server/config/configuration.json');

var req = request.defaults();
var userId = config.userId;
var password = config.password;
var keyFile = config.key;
var certificateFile = config.cert;

var visaAPIClient = new VisaAPIClient();
var strDate = new Date().toISOString();
// 'longitude': -48.60609132008005,
// 'latitude': -28.844737680202572,
var atmInquiryRequest = JSON.stringify({
  'requestData': {
    'culture': 'en-US',
    'distance': '2000',
    'distanceUnit': 'mi',
    'location': {
      'address': null,
      'geocodes': {
        'longitude': '>long<',
        'latitude': '>lat<',
      },
      'placeName': null,
    },
    'metaDataOptions': 0,
    'options': {
      'findFilters': [{
        'filterName': 'PLACE_NAME',
        'filterValue': 'FORT FINANCIAL CREDIT UNION|ULTRON INC|U.S. BANK',
      },
      {
        'filterName': 'OPER_HRS',
        'filterValue': 'C',
      },
      {
        'filterName': 'AIRPORT_CD',
        'filterValue': '',
      },
      {
        'filterName': 'WHEELCHAIR',
        'filterValue': 'N',
      },
      {
        'filterName': 'BRAILLE_AUDIO',
        'filterValue': 'N',
      },
      {
        'filterName': 'BALANCE_INQUIRY',
        'filterValue': 'N',
      },
      {
        'filterName': 'CHIP_CAPABLE',
        'filterValue': 'N',
      },
      {
        'filterName': 'PIN_CHANGE',
        'filterValue': 'N',
      },
      {
        'filterName': 'RESTRICTED',
        'filterValue': 'N',
      },
      {
        'filterName': 'PLUS_ALLIANCE_NO_SURCHARGE_FEE',
        'filterValue': 'N',
      },
      {
        'filterName': 'ACCEPTS_PLUS_SHARED_DEPOSIT',
        'filterValue': 'N',
      },
      {
        'filterName': 'V_PAY_CAPABLE',
        'filterValue': 'N',
      },
      {
        'filterName': 'READY_LINK',
        'filterValue': 'N',
      },
      ],
      'operationName': 'or',
      'range': {
        'count': 99,
        'start': 0,
      },
      'sort': {
        'direction': 'desc',
        'primary': 'city',
      },
      'useFirstAmbiguous': true,
    },
  },
  'wsRequestHeaderV2': {
    'applicationId': 'VATMLOC',
    'correlationId': '909420141104053819418',
    'requestMessageId': 'test12345678',
    'requestTs': strDate,
    'userBid': '10000108',
    'userId': 'CDISIUserID',
  },
});

module.exports = function(Cajero) {
  Cajero.listado = function(lat, long, cb) {
    var baseUri = 'globalatmlocator/';
    var resourcePath = 'v1/localatms/atmsinquiry';
    atmInquiryRequest = atmInquiryRequest.replace(/>long</g, long);
    atmInquiryRequest = atmInquiryRequest.replace(/>lat</g, lat);
    console.log('long: ' + long + ';' + lat);
    console.log(atmInquiryRequest);
    visaAPIClient.doMutualAuthRequest(baseUri + resourcePath, atmInquiryRequest, 'POST', {}, cb);
  };

  Cajero.remoteMethod(
    'listado', {
      http: {
        path: '/listado',
        verb: 'get',

      },
      accepts: [{arg: 'lat', type: 'number'}, {arg: 'long', type: 'number'}],
      returns: {
        arg: 'listado',
        type: 'string',
      },
    }
  );
};
