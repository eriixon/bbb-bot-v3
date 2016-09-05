'use strict';

const https = require('https'),
    config = require('config'),
    constants = require('../constants/constants'),
    googleMapsClient = require('@google/maps').createClient({ key: constants.GM_KEY });


class MapsApi {

  findCityState(coordinates, callback) {
    let data = {
        latlng: { 
          latitude: coordinates.lat, 
          longitude: coordinates.long},
        result_type: "postal_code"
      };
    googleMapsClient.reverseGeocode(data, (err, response) => {
      if (!err) {
          console.log(`Current address id ${response.json.results[0].formatted_address}`);
          let cityState = {};
          let addressComponents = response.json.results[0].address_components;

          for (let i = 0; i < addressComponents.length; i++) {
            let currentComp = addressComponents[i];
            let compTypes = currentComp.types;
            for (let j = 0; j < compTypes.length; j++) {
              let currentType = compTypes[j];
              if (currentType === "locality") cityState.city = currentComp.short_name;
              else if (currentType === "administrative_area_level_1") cityState.state = currentComp.short_name;
            };
          };
          callback(cityState);
      }});
}};

module.exports = new MapsApi;