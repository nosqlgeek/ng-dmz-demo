const fs = require('fs');
const redis = require('redis');


//Redis Client
var client = redis.createClient();


client.on("error", function (err) {
    console.log("Error " + err);
});


function usage() {
 
  console.log("Use: node index.js <file.json> <port>");

}

function main() {

  var args = process.argv;

  if (args.length == 4) {
	console.log("Loading data ...");

	var file = args[2];
	var port =  parseInt(args[3]);

        //Init Redis
	var client = redis.createClient(port);

	client.on("error", function (err) {
          console.log("Error " + err);
        });

        //Read file
	fs.readFileSync(file).toString().split('\n').forEach(function (line) {
	
	  //console.log("line = " + line);
          if (line != '') {
	
            parts = line.split('{');
	
	    key_in = parts[0].split('"').join('');
            key_parts = key_in.split(':');
         
	    key = "";

            for (var i = 0, len = key_parts.length; i < len; i++) {
              
              if (key_parts[i] != '') key = key + key_parts[i];
	      if (i < len-2) key = key + ":";

            }
	    
            key = key.trim();

            console.log("key = " + key);
	    value = "{" + parts[1];
	    console.log("value = " + value);            

            json_value = JSON.parse(value);
       

            //Maintain year index
            if (json_value.hasOwnProperty("born")) {
              client.zadd("idx::born", parseInt(json_value.born), key, function (err, res) {

                console.log(res);

	      });
            }


            //Insert as HashMap
            value_arr = []; 

	    for (prop in json_value) {

              value_arr.push(prop);
              value_arr.push(json_value[prop]);
            }

            client.hmset(key, value_arr, function (err, res) {
              
              console.log(res);

            });
          }

	});
  }
  else {

   usage();
  }

};


main();
