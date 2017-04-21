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

var sonar_service = findServiceInstance(services, process.env.SONAR_SERVICE_INSTANCE);
if (sonar_service) {
	var sonar_id = sonar_service.parameters.name,
		dashboard_url = sonar_service.parameters.dashboard_url,
		user_login = sonar_service.parameters.user_login,
		user_password = sonar_service.parameters.user_password;
	console.log('export SONAR_INSTANCE_NAME="' + sonar_id + '"');
	console.log('export SONAR_SERVER_URL="' + dashboard_url + '"');
	if (user_login) {
		console.log('export SONAR_USER_ID="' + user_login + '"');
	}
	if (user_password) {
		console.log('export SONAR_USER_TOKEN="' + user_password + '"');
	}
}

function findServiceInstance(services, serviceName) {
	var sonar = services.filter(function(v) {
		return v.service_id === 'sonarqube' &&
			(serviceName === '(default)' ||
				v.parameters && v.parameters.name === serviceName);
	});
	if (sonar.length > 0) {
		return sonar[0];
	}
}