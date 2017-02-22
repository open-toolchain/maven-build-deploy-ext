/**
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 */
/*eslint-env node */
var fs = require('fs'); 
var services = JSON.parse(fs.readFileSync(process.env.SERVICE_INSTANCE_FILE)).services;

var maven_service = findServiceInstance(services, process.env.SERVICE_INSTANCE_TYPE, process.env.SERVICE_INSTANCE);
if (maven_service) {
    var id = maven_service.parameters.name,
        release_url = maven_service.parameters.release_url,
        mirror_url = maven_service.parameters.mirror_url,
        snapshot_url = maven_service.parameters.snapshot_url,
        user_id = maven_service.parameters.user_id,
        token = maven_service.parameters.token;
    console.log('export MAVEN_NAME="' + id + '"');
    console.log('export MAVEN_USER_ID="' + user_id + '"');
    console.log('export MAVEN_TOKEN="' + token + '"');
    console.log('export MAVEN_RELEASE_URL="' + release_url + '"');
    console.log('export MAVEN_SNAPSHOT_URL="' + snapshot_url + '"');
    console.log('export MAVEN_MIRROR_URL="' + mirror_url + '"');
}

function findServiceInstance(services, type, serviceName) {
    var maven = services.filter(function (v) {
        return v.service_id === type
            && (serviceName  === '(default)'
                || v.parameters && v.parameters.name === serviceName);
    });
    if (maven.length>0) {
        return maven[0];
    }
}
