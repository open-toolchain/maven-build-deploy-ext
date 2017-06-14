
var request = require('request');
var async = require('async');
var argslib = require('./args');

/**
 This function does the following
 1. Verify that the environment is available, variables, config file etc
 2. Query the toolchain to see if DevOps Insights card has been added by the user
 3. If the card is added then query the SonarQube to get the data of the latest run
 4. Query Bluemix to get org_name give org_id
 5. Upload the SonarQube data to DLMS-RS
*/
function perform(configfile) {

    var toolchains_api;
    var toolchain_id;
    var app_name;
    var build_prefix;
    var build_number;
    var config;

    async.auto({
        verifyenvironment: function(cb) {
            async.series([
                function(cb1) {
                    toolchains_api = process.env.TOOLCHAINS_API;
                    if(typeof(toolchains_api) === 'undefined') {
                        cb1("TOOLCHAINS_API environment variable missing");
                    } else {
                        cb1(null, null);
                    }
                },
                function(cb1) {
                    toolchain_id = process.env.PIPELINE_TOOLCHAIN_ID;
                    if(typeof(toolchain_id) === 'undefined') {
                        cb1("PIPELINE_TOOLCHAIN_ID environment variable missing");
                    } else {
                        cb1(null, null);
                    }
                },
                function(cb1) {
                    toolchain_token = process.env.TOOLCHAIN_TOKEN;
                    if(typeof(toolchain_token) === 'undefined') {
                        cb1("TOOLCHAIN_TOKEN environment variable missing");
                    } else {
                        cb1(null, null);
                    }
                },
                function(cb1) {
                    app_name = process.env.LOGICAL_APP_NAME;
                    if(typeof(app_name) === 'undefined') {
                        cb1("LOGICAL_APP_NAME environment variable missing");
                    } else {
                        cb1(null, null);
                    }
                },
                function(cb1) {
                    build_prefix = process.env.BUILD_PREFIX;
                    if(typeof(build_prefix) === 'undefined') {
                        cb1("BUILD_PREFIX environment variable missing");
                    } else {
                        cb1(null, null);
                    }
                },
                function(cb1) {
                    build_number = process.env.BUILD_NUMBER;
                    if(typeof(build_number) === 'undefined') {
                        cb1("BUILD_NUMBER environment variable missing");
                    } else {
                        cb1(null, null);
                    }
                },
                function(cb1) {
                    config = argslib.readConfigFileSync(configfile);
                    if(config === null) {
                        cb1("Failed to read the config file");
                    } else {
                        cb1(null, null);
                    }
                }
              ],
              function(err, results) {
                  cb(err, null);
              });
        },
        finddevopsinsightsservice: ['verifyenvironment', function(results, cb) {
            var options = {
                url: toolchains_api + "/" + toolchain_id + "/services",
                headers: {authorization: toolchain_token},
                json: true,
                timeout: 5000
            };
            request.get(options, function(err, resp, body){
                if(err) {
                    cb("Failed to find DevOps Insights service ", JSON.stringify(err));
                } else if(resp.statusCode !== 200) {
                    cb("Failed to find DevOps Insights service response code: " + resp.statusCode + " body: " + JSON.stringify(body));
                } else {
                    //console.log("services - ", JSON.stringify(body.services, null, 4))
                    var servicefound = false;
                    if(typeof(body.services) !== 'undefined') {
                        for(var i = 0; i < body.services.length; i++) {
                            if(body.services[i].service_id === 'draservicebroker') {
                                servicefound = true;
                                cb(null, body.services[i]);
                            }
                        }
                    }
                    if(servicefound === false) {
                        cb(null, null);
                    }
                }
            });
        }],
        querysonarqube: ['verifyenvironment', 'finddevopsinsightsservice', function(results, cb) {
            if(results.finddevopsinsightsservice === null) {
                cb(null, "DevOps Insights service not found");
            } else {
                var sonarpayload = {};
                var sonaruserid = process.env.SONAR_USER_ID;
                var sonarusertoken = process.env.SONAR_USER_TOKEN;
                var headers = {authorization: null};
                if((typeof(sonaruserid) !== 'undefined') && (typeof(sonarusertoken) !== 'undefined')){
                    headers.authorization = "Basic " + new Buffer(sonaruserid + ":" + sonarusertoken).toString("base64");
                } else if ((typeof(sonaruserid) === 'undefined') && (typeof(sonarusertoken) !== 'undefined')){
                    headers.authorization = "Basic " + new Buffer(sonarusertoken).toString("base64");
                } else {
                    headers = null;
                }
                var options = {
                    url: config.serverUrl + '/api/qualitygates/project_status?projectKey=' + config.projectKey,
                    headers: headers,
                    json: true,
                    timeout: 5000
                };
                async.series([
                    function(cb2) {
                        request.get(options, function(err, resp, body){
                            if(err) {
                                cb2("Failed to query the SonarQube server: ", JSON.stringify(err));
                            } else if(resp.statusCode !== 200) {
                                cb2("Failed to query the SonarQube server: " + resp.statusCode + " body: " + JSON.stringify(body));
                            } else {
                                //console.log("data - ", JSON.stringify(body.projectStatus, null, 4));
                                sonarpayload.qualityGate = body.projectStatus;
                                cb2(null, null);
                            }
                        });
                    },
                    function(cb2) {
                        options.url = config.serverUrl + '/api/issues/search?statuses=OPEN&componentKeys=' + config.projectKey,
                        request.get(options, function(err, resp, body){
                            if(err) {
                                cb2("Failed to query the SonarQube server: ", JSON.stringify(err));
                            } else if(resp.statusCode !== 200) {
                                cb2("Failed to query the SonarQube server: " + resp.statusCode + " body: " + JSON.stringify(body));
                            } else {
                                //console.log("data - ", JSON.stringify(body, null, 4));
                                sonarpayload.issues = body.issues;
                                cb2(null, null);
                            }
                        });
                    },
                    function(cb2) {
                        options.url = config.serverUrl + '/api/measures/component?metricKeys=reliability_rating,security_rating,sqale_rating&componentKey=' + config.projectKey,
                        request.get(options, function(err, resp, body){
                            if(err) {
                                cb2("Failed to query the SonarQube server: ", JSON.stringify(err));
                            } else if(resp.statusCode !== 200) {
                                cb2("Failed to query the SonarQube server: " + resp.statusCode + " body: " + JSON.stringify(body));
                            } else {
                                //console.log("data - ", JSON.stringify(body, null, 4));
                                sonarpayload.ratings = body.component.measures;
                                cb2(null, null);
                            }
                        });
                    }
                ],
                function(err, results) {
                    cb(err, sonarpayload);
                });
            }
        }],
        uploadtodevopsinsights: ['verifyenvironment', 'finddevopsinsightsservice', 'querysonarqube', function(results, cb) {
            if(results.finddevopsinsightsservice === null) {
                cb(null, "DevOps Insights service not found");
            } else {
                var cf_controller = results.finddevopsinsightsservice.parameters.cf_controller;
                var dlms_server = results.finddevopsinsightsservice.parameters.dlms_server;
                var org_id = results.finddevopsinsightsservice.organization_guid;
                var build_id = build_prefix + ":" + build_number;

                async.auto({
                    getorgname: function(cb3) {
                        getOrganizationName(cf_controller, org_id, function(err, organizationname) {
                              cb3(err, organizationname);
                        });
                    },
                    uploadtodlmsrs: ['getorgname', function(innerresults, cb3) {
                        var dlms_url = dlms_server + "/v2/organizations/" + innerresults.getorgname
                                        + "/toolchainids/" + toolchain_id
                                        + "/buildartifacts/" + app_name
                                        + "/builds/" + build_id + "/results";
                        var sonarqubedashboard = config.serverUrl + "/dashboard?id=" + config.projectKey;
                        var payload = {
                            lifecycle_stage: "sonarqube",
                            tool_name: "sonarqube",
                            url: [sonarqubedashboard],
                            contents_type: "application/json",
                            contents: new Buffer(JSON.stringify(results.querysonarqube)).toString('base64')
                        }

                        var options = {
                            url: dlms_url,
                            headers: {authorization: toolchain_token},
                            body: payload,
                            json: true,
                            timeout: 5000
                        };
                        request.post(options, function(err, resp, body){
                            if(err) {
                                cb3("Failed to upload to DLMS-RS server: ", JSON.stringify(err));
                            } else if(resp.statusCode !== 200) {
                                cb3("Failed to upload to DLMS-RS server: " + resp.statusCode + " body: " + JSON.stringify(body));
                            } else {
                                cb3(null, "Successfully uploaded the data to DLMS-RS");
                            }
                        });
                    }]
                }, function(err1, results1) {
                    cb(err1, results1);
                });
            }
        }],
    }, function(err, results) {
        //console.log("-----", err, results);
        if (err) {
            console.log("Failed to upload SonarQube data to DevOps Insights: ",  err);
        } else {
            if(results.uploadtodevopsinsights === "DevOps Insights service not found"){
                console.log("DevOps Insights service not found... ignoring upload");
            } else {
                console.log("Successfully uploaded SonarQube data to DevOps Insights ");
            }
        }
    });
}

function getOrganizationName(cf_controller, org_id, callback) {
    var options = {
        url: cf_controller + "/v2/organizations/" + org_id + "/summary",
        headers: {authorization: toolchain_token},
        json: true,
        timeout: 5000
    };
    request.get(options, function(err, resp, body){
        if(err) {
            callback("Failed to get org name: ", JSON.stringify(err));
        } else if(resp.statusCode !== 200) {
            callback("Failed to get org name: " + resp.statusCode + " body: " + JSON.stringify(body));
        } else {
            callback(null, body.name);
        }
    });
};

if(process.argv.length !== 3) {
    console.log("The Config file needs to be passed as an argument");
} else {
    perform(process.argv[2]);
}
