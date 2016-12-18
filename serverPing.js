//brings in http script availability
var request = require('request');

//set of test servers
var serverSet = [
	  {
	    "url": "http://doesNotExist.boldtech.co",
	    "priority": 1
	  },
	  {
	    "url": "http://boldtech.co",
	    "priority": 7
	  },
	  {
	    "url": "http://offline.boldtech.co",
	    "priority": 2
	  },
	  {
	    "url": "http://google.com",
	    "priority": 4
	  },
	  {
	    "url": "http://yahoo.com",
	    "priority": 6
	  }
];

//inform user of process taking place
console.log("We are about to test some server requests for you, please stand by.");


function serverTest(url, priority) {
	//creates options to allow for request timeout
	var options = {
		url: url,
		timeout: 5000
	};
	return new Promise (
		(resolve, reject) => {
			request(options, (err, res, body) => {
				//if (err) {console.log("There was an error: " + err)};
				//test if server responds with a positive status
				if (res !== undefined) {
					if (res.statusCode >= 200 && res.statusCode <= 299) {
						//console.log("response from online server is " + res.statusCode);
						resolve({"url": url, "priority": priority});
					} else
					if (res.statusCode >= 300 && res.statusCode <= 399) {
						//console.log("response from redirected server is " + res.statusCode);
						reject("The server is not working.");
					} else
					if (res.statusCode >= 400 && res.statusCode <= 499) {
						//console.log("response from not working server is " + res.statusCode);
						reject("The server is broken.");
					}//==> end of inner if/else statement
				} else {
					reject("The server will not respond.");
				}//==> end of outer if/else statement
			});//==> end of get request
		}
	);
};

//call of function to run program
//var test0 = serverTest(serverSet[0].url, serverSet[0].priority).then(function(resolve){console.log("resolution is: "+ JSON.stringify(resolve))}).catch(function(reject){console.log(reject)});
//console.log("Test0: "+ test0);
//var test1 = serverTest(serverSet[1].url, serverSet[1].priority).then(function(resolve){console.log("resolution is: "+ JSON.stringify(resolve))}).catch(function(reject){console.log(reject)});
//console.log("Test1: "+ JSON.stringify(test1));
//var test2 = serverTest(serverSet[2].url, serverSet[2].priority).then(function(resolve){console.log("resolution is: "+ JSON.stringify(resolve))}).catch(function(reject){console.log(reject)});
//console.log("Test2: "+ JSON.stringify(test2));
//var test3 = serverTest(serverSet[3].url, serverSet[3].priority).then(function(resolve){console.log("resolution is: "+ JSON.stringify(resolve))}).catch(function(reject){console.log(reject)});
//console.log("Test3: "+ test3);
//var test4 = serverTest(serverSet[4].url, serverSet[4].priority).then(function(resolve){console.log("resolution is: "+ JSON.stringify(resolve))}).catch(function(reject){console.log(reject)});
//console.log("Test4: "+ JSON.stringify(test4));



function findServer(servers) {
  var build = [];
  var promises = servers.map(server => {
    serverTest(server.url, server.priority)
      .then(resolve => {
        // Do your validation of resolve here
        if (typeof resolve === 'object') {
        	console.log("findServer resolve = " + JSON.stringify(resolve));
  			build.push(resolve);
			console.log("build = " + JSON.stringify(build));
        }
      })
      .catch(error => {
        // By using catch, you ensure this promise chain will continue to 
        // resolve as long as you don't throw an error here or return another
        // Promise that will reject
        console.log("Server " + server.url + " failed with "+ error);
      })  
  })

  return Promise.all(promises).then(values => {
    // At this point you know that all your promises have resolved, and
    // the successful ones have added an element to 'build'
    console.log("values = " + values);
    console.log("returning build = " + build);
    return build;
  });
};

findServer(serverSet).then(result => {
	return console.log("The result is " + JSON.stringify(result));
	}).catch(error =>{
		console.log("The error is " + error);
	});


// function findServer(array) {
// 	var build = [];
// 	return new Promise (
// 		function(resolution, rejection) {
// 			array.forEach(function(server){
// 				serverTest(server.url, server.priority)
// 					.then(function(resolve){
// 						if (typeof resolve === "object") {
// 							console.log("findServer resolve = " + JSON.stringify(resolve));
// 							build.push(resolve);
// 							console.log("build = " + JSON.stringify(build));
// 							return build;
// 						}
// 					})
// 					.catch(function(error){
// 						//console.log("Error: " + error);
// 					});
// 			});
// 					resolution(build);
// 			// if (onlineServers.length == 0) {
// 			// 	//console.log("No online servers.");
// 			// 	reject('Error: No servers are online.');
// 			// }//==> end of if statement
// 		}
// 	)
// };
// function findServer(array) {
// 	return new Promise (
// 		function(resolution, rejection) {
// 			var build = [];
// 			array.forEach(function(server){
// 				serverTest(server.url, server.priority).then(function(resolve){
// 						if (typeof resolve === "object") {
// 							console.log("findServer resolve = " + JSON.stringify(resolve));
// 							build.push(resolve);
// 							console.log("build = " + JSON.stringify(build));
// 							resolution(build);
// 						}
// 					}).catch(function(error){
// 						//console.log("Error: " + error);
// 					});
// 			});
// 			// if (onlineServers.length == 0) {
// 			// 	//console.log("No online servers.");
// 			// 	reject('Error: No servers are online.');
// 			// }//==> end of if statement
// 		}
// 	)
// };




 // findServer(serverSet).then(function(result){
	// 		console.log(result);
	// 		console.log(onlineServers);
	// 		//condition check and modification if more than one server response is successful
	// 		if (result.length > 1) {
	// 			result.sort(function(a,b){
	// 				return a.priority - b.priority;
	// 			})
	// 			console.log(result[0].url + " has the lowest available priority.");
	// 		} else {
	// 			console.log(result[0].url + " has the lowest available priority.");
	// 		}//==> end of if statement
	// 	}).catch(function(error){
	// 		console.log(error);
	// 	});