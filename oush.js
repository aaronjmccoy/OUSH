#!/usr/bin/env node
const OU_API_URL = "https://a.cms.omniupdate.com"
const OU_USERNAME = process.env.OU_UN;
const OU_PASSWORD = process.env.OU_PW;
const OU_ACCOUNT = process.env.OU_ACC;
var OU_SKIN = "outc19";
var request = require('request');

// Wrap all calls in an auth request so you have a valid gadget token
request.post({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url: OU_API_URL + "/authentication/cas_login",
  body: "skin=" + OU_SKIN + "&username=" + OU_USERNAME + "&password=" + OU_PASSWORD + "&account=" + OU_ACCOUNT,
},
function(error, response, body) {
  var obj = JSON.parse(body);
  var gadget_token = obj['gadget_token'];
  // if the gadget token isn't set something went wrong with login
  if (!gadget_token) {
    console.log("Failed to login :(");
    return;
  }
  else {
    // console.log("Login Successful. Token: " + gadget_token);

    // Take specific commands from the terminal and run them.
    //command format: oush (post|get) ENDPOINT_SEGMENT1 ENDPOINT_SEGMENT2 PARAM1=VALUE1 PARAM2=VALUE2
    // GET POST or HELP
    var method = process.argv[2];
    // ENDPOINT SEGMENTS 1 AND 2
    var endpoint = process.argv[3]+'/'+process.argv[4];
    //prepare the params string object
    var params = '';
    if(process.argv.length > 4){
      for(p = process.argv.length-1;p>4;p--){
        params += '&'+process.argv[p];
      }
    }
    if (method == 'help') {
      ou_help();
    }else{
      try {
    		ou_sh(method,gadget_token,endpoint,params);
    	} catch(e) {
    		console.log(e);
    	}
    }
  }
});
/*
OUSH FUNCTION
*/
function ou_sh(method,gadget_token,endpoint,params) {
  var reqString = OU_API_URL+"/"+endpoint+"?authorization_token="+gadget_token+params;
  if(method=='get'){
    // console.log('GET STARTED');
    // console.log('REQ STRING: '+reqString);
    request.get(reqString, function(error, response, body) {
      if(!error){
        var obj = JSON.parse(body);
        console.log(body);
        console.log('Success for call to '+endpoint+' with params '+params);
        return obj;
      }else{
        console.log(error);
      }
    });
  }else
  if(method=='post'){
    // console.log('POST STARTED');
    // console.log('REQ STRING: '+reqString);
    request.post(reqString, function(error, response, body) {
      if(!error){
        var obj = JSON.parse(body);
        paramsList = params.split('&');
        paramsList.shift();
        console.log('Success for call to '+endpoint+' with params '+paramsList);
        return obj;
      }else{
        console.log(error);
      }
    });
  }else{
    console.log('Invalid method as first arg - valid values are post and get,'+method+' provided');
  }
}

/**
 * List all available oush commands.
 */
function ou_help() {
  console.log("OmniUpdate Shell - Version 1");
  console.log("OUSH assumes the user is familiar with the api at developers.omniupdate.com");
  console.log("Users can use the endpoints there in the following command structure:");
  console.log("oush (post|get) ENDPOINT_SEGMENT1 ENDPOINT_SEGMENT2 PARAM1=VALUE1 PARAM2=VALUE2...");
  console.log("Example Commands:");
  console.log(" - oush help (Show this list of commands.)");
  console.log(" - oush get users list (List all users in the system.)");
  console.log(" - oush post users new username=<username> password=<password> (Create a new user.)");
  console.log(" - oush post files checkout site=<site> path=<path> (Checkout a page.)");
  console.log(" - oush post files checkin site=<site> path=<path> (Check in a page.)");
  console.log(" - oush post sites publish site=<site> (Publish an entire site.)");
  console.log("NOTE: The OU API pluralizes the object segment of the endpoint.");
  console.log("NOTE: Params can be listed in any order, but you must include all of the required params.");
}
