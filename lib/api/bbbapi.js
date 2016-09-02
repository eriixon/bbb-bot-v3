'use strict';
const https = require('https'),
      config = require('config'),
      rs = require('../constants/sentences');

let constants = require('../constants/constants');

// BBB API searching
// This object take Session object and return array of businesses

class BBBapi {

// MAKE A LIST WITH OPTIONS FROM SESSION AND RETURN IT TO BOT

  createList (session, callback){
    let newList = [];
    let link = '/api/orgs/search?PageSize=10'+this.makeLink(session);
    
    this.callBBBapi(link, function (list) {

      let count = list.length;
      if (count == 0) { 
          newList = false;
        } else {
            for(let i=0; i < count; i++) {
              let curr = list[i];
              var obj = scoreCard(curr);
              newList.push(obj);
        }

        function scoreCard (curr){
          let obj = new Object();
          obj.title = curr.OrganizationName;
          if(curr.RatingIcons.length !=0) { obj.image_url = curr.RatingIcons[0].Url;
          } else { 
            obj.image_url = "http://origin-concept.eu/portal/images/no_data.png"
          };
          obj.buttons = [];
            let fButton = new Object();
              fButton.type = "web_url";
              fButton.url = curr.ReportURL;
              fButton.title = "Link to BBB";
            obj.buttons.push(fButton);
            let sButton = new Object();
              if (curr.BusinessURLs) {
                sButton.type = "web_url";
                sButton.url = curr.BusinessURLs[0];
                sButton.title = "Business Link";
                }else{
                sButton.type = "postback";
                sButton.title = "No Website";
                sButton.payload = 'NO_SITE';
                };
            obj.buttons.push(sButton);
          return obj;
        };
      };


      let messageData = {};
            if (!newList) {
                messageData = {
                recipient: { id: session.fbid },
                message: { text: rs.NOT_FOUND , metadata: "TEXT" }
                };
            } else {
                messageData = {
                recipient: { id: session.fbid },
                message: { attachment: { type: "template", payload: { template_type: "generic", elements: newList } } }
                };
                console.log("Send list of business to sender " + session.fbid);
            };
        callback(messageData);
    });
  };

// REQUEST TO BBB API
  callBBBapi (path, callback) {

    let options = {
        host: 'api.bbb.org',
        port: 443,
        path: path,
        method: 'GET',
        headers: {
        'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13',
        'Authorization': constants.BBB_TOKEN
    }};
    
    let request = https.request(options, function(response){
        console.log('Status: ' + response.statusCode);
        response.setEncoding('utf8');
        let body = '';
        response.on('data', (chunk) => body+=chunk);
        response.on('end', function () {
            let nodes = JSON.parse(body);
            if(nodes.TotalResults)  console.log("Total Results: " + nodes.TotalResults);
            if(nodes.SearchResults) callback(nodes.SearchResults);
    })});

    request.on('error', (error) => {
      console.log('***PROBLEM with request: '+error.message)
    });
    request.end();
  };

// CREATE A NEW PATH FOR REQUEST
  makeLink(session) {

    var link = '';
      if(session.context.name)      link += '&OrganizationName=' + session.context.name.trim().replace(/ /ig, '+');
      if(session.context.city)      link += '&City=' + session.context.city.trim().replace(/ /ig,'+');
      if(session.context.state)     link += '&StateProvince=' + session.context.state.trim();
      if(session.context.zip)       link += '&PostalCode='+session.context.zip;
    return link;
  }

};

module.exports = new BBBapi;