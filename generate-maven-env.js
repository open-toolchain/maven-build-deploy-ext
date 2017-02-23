/********************************************************************************
 * Copyright 2017 IBM
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 ********************************************************************************/

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
