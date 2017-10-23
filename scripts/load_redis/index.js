const fs = require('fs');
const redis = require('redis');

/**
 * Usage of this script
 */
function _usage() {

  console.log("Use: node index.js <json_file> <redis_port>");

}

/**
 * Validate arguments
 */
function _isValid(file, port) {

  var result = true;

  if (!fs.existsSync(file)) result = false;
  if (typeof parseInt(port,10) !== "number") result = false;

  return result;
}

/**
 * Connect to Redis
 */
function _connect(port) {

  var client = redis.createClient(port);

  client.on("error", function (err) {
    console.error(err);
  });

  return client;
}

/**
 * Parse the key and the value of the line
 */
function _parse(line) {

  var result = [];

  //Split between key and data
  var parts = line.split('{');
  var keyIn = parts[0].split('"').join('');

  //Split key by delimitter
  var keyParts = keyIn.split(':');

  //Construct key from parts
  var key = "";
  for (var i = 0, len = keyParts.length; i < len; i++) {
    if (keyParts[i] != '') key = key + keyParts[i];
    if (i < len-2) key = key + ":";
  }
  key = key.trim();

  //Reconstruct value
  value = "{" + parts[1].trim();


  result.push(key);
  result.push(JSON.parse(value));
  return result;
}


/**
 * Main entry point
 */
function main() {

  var args = process.argv;

  if (args.length == 4) {

    console.log("START - Loading data ...");

    //Arguments
    var file = args[2];
    var port =  parseInt(args[3]);

    if (_isValid(file, port)) {

      //Connect to Redis
      var client = _connect(parseInt(port,10));

      //Read the file
      fs.readFileSync(file, 'utf8').split('\n').forEach(function (line) {

        //Skip empty lines
        if (line != '') {

          var kvPair = _parse(line);

          //Maintain year index
          if (kvPair[1].hasOwnProperty("born")) {
            client.zadd("idx::born", parseInt(kvPair[1].born), kvPair[0], function (err, res) {
              console.log(res);
            });
          }

          //Insert as HashMap
          //BTW: Plain JSON is automatically converted to a Hash
          client.hmset(kvPair[0], kvPair[1], function (err, res) {
            console.log(res);
          });

        }
      });

    } else {
      _usage();
    }
  } else {
   _usage();
  }
}

//Run the main function
main();
