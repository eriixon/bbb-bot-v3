'use strict';

const https = require('https'),
    config = require('config'),
    constants = require('../constants/constants'),
    googleMapsClient = require('@google/maps').createClient({ key: constants.GM_KEY });


class MapsApi {

  findCityState(locationObj, callback) {

    if (locationObj[0].payload.coordinates) {
      var coordinates = locationObj[0].payload.coordinates;
      // var coordinates = {lat: 43.592982, long: -116.331367}
      // Geocode an address.
      googleMapsClient.reverseGeocode({
        latlng: {
          latitude: coordinates.lat,
          longitude: coordinates.long
        },
        result_type: "postal_code"
        // result_type: ''
      }, function (err, response) {
        if (!err) {
          console.log(response.json.results);

          var cityState = {};
          var addressComponents = response.json.results[0].address_components;

          for (var i = 0; i < addressComponents.length; i++) {
            var currentComp = addressComponents[i];
            var compTypes = currentComp.types;

            for (var j = 0; j < compTypes.length; j++) {
              var currentType = compTypes[j];
              if (currentType === "locality") {
                cityState.city = currentComp.short_name;
              } else if (currentType === "administrative_area_level_1") {
                cityState.state = currentComp.short_name;
              }
            }
          }
          callback(cityState);
        }
      });
    } else {
      callback(false);
    }
  }

}

module.exports = new MapsApi;




// Each API method returns a RequestHandle. The handle can be used to cancel the request, or to obtain a Promise for the response.

// NOTE: Promises are only available if you supply a Promise constructor to the createClient() method.