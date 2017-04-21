/*eslint-env node, request-promise, bluebird */

var request = require("request-promise"),
	Promise = require("bluebird"),
	configFile = process.argv[2],
	attemptsLeft = 100,
	argslib = require('./args');

// convert properties file to json
var config = argslib.readConfigFileSync(configFile);
var FAILED_VALUE = "export SONARQUBE_RESULT=FAILED";
var SUCCESS_VALUE = "export SONARQUBE_RESULT=SUCCESS";
var credentials = null;
if (process.argv.length === 4) {
	credentials = process.argv[3];
}
function promiseWhile(value, url, serverUrl) {
	return Promise.resolve(value).then(function() {
		return collectCFRespond(url)
			.then(function(result) {
				if (!result.data[0] && result.attemptsLeft > 0) {
					return promiseWhile(result.attemptsLeft, url, serverUrl);
				} else if (result.data[0] && result.attemptsLeft > 0) {
					var taskResult = JSON.parse(result.data);
					var task = taskResult.task;
					if (task.status === "FAILED" || task.status === "CANCELED") {
						return FAILED_VALUE;
					} else if (task.status === "SUCCESS") {
						var rq = {
							url: serverUrl + '/api/qualitygates/project_status?analysisId=' + task.analysisId
						};
						if (credentials) {
							var auth = "Basic " + new Buffer(credentials).toString("base64");
							rq.headers = {
								"Authorization": auth
							};
						}
						return request(rq)
							.then(function(body) {
								try {
									var analysisResult = JSON.parse(body);
									if (analysisResult.projectStatus && analysisResult.projectStatus.status === "ERROR") {
										return FAILED_VALUE;
									}
									return SUCCESS_VALUE;
								} catch(e) {
									return reject(e);
								}
							})
							.catch(function(err) {
								return reject(err);
							});
					}
					return promiseWhile(result.attemptsLeft, url, serverUrl);
				} else if (result.attemptsLeft === 0) {
					return FAILED_VALUE;
				}
			});
	});
}

function collectCFRespond(url) {
	return new Promise(function(fulfill, reject) {
		setTimeout(function() {
			var rq = {
				url: url
			};
			if (credentials) {
				var auth = "Basic " + new Buffer(credentials).toString("base64");
				rq.headers = {
					"Authorization": auth
				};
			}
			return request(rq)
				.then(function(result) {
					fulfill({
						"data": result,
						"attemptsLeft": --attemptsLeft
					});
				})
				.catch(function(err) {
					return reject(err);
				});
		}, 2000);
	});
}
try {
	var url = config.ceTaskUrl;
	return promiseWhile(attemptsLeft, url, config.serverUrl).then(function(result) {
		console.log(result);
	}).catch(/* @callback */ function(err) {
		// ignore
	});
} catch (e) {
	// ignore
}