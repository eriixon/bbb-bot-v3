'use strict';
const http = require('http');
// require('es6-promise').polyfill();
// require('isomorphic-fetch');

// Request for looking for cities in the USA by the state

class CityApi {
    getCities(userInput, state, callback) {

        var requestUrl = "http://api.sba.gov/geodata/city_links_for_state_of/" + state + ".json";

        var request = http.get(requestUrl, function (response) {
            var body = "";
            response.on("data", (chunk) => body += chunk);

            response.on("end", function () {
                if (response.statusCode === 200) {
                    var cityData = JSON.parse(body);
                    var cityList = makeCityList(userInput, cityData);
                    callback(cityList);
                } else {
                    console.log("Status code error: " + response.statusCode)
                }
            });
        });
        request.on('error', (error) => { console.log('Problem with request: ' + error.message) });
    };

};

function makeCityList (userInput, cityData) {
        
        var cities = [];
        userInput = userInput.toUpperCase();
        let len = userInput.length;

        for (var i = 0; i < cityData.length; i++) {
            let nameUp = cityData[i].name.toUpperCase();
            let abbr = cityData[i].name.substring(0, len).toUpperCase();
            if (nameUp === userInput || abbr === userInput) cities.push(cityData[i].name);
        };
        return cities;
};

module.exports = new CityApi;