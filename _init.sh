#!/bin/bash

#*******************************************************************************
# Copyright 2017 IBM
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#*******************************************************************************

#############
# Colors    #
#############
export green='\e[0;32m'
export red='\e[0;31m'
export label_color='\e[0;33m'
export no_color='\e[0m' # No Color

##################################################
# Simple function to only run command if DEBUG=1 # 
##################################################
debugme() {
  [[ $DEBUG = 1 ]] && "$@" || :
}

sudo apt-get update &> /dev/null
sudo apt-get -y install curl &> /dev/null

set +e
set +x

###############################
# Configure extension PATH    #
###############################
if [ -n $EXT_DIR ]; then 
    export PATH=$EXT_DIR:$PATH
else
    export EXT_DIR=`pwd`
fi 

export PATH=/opt/IBM/node-v4.6.0/bin:$PATH

export SERVICE_INSTANCE_FILE=/tmp/tc_services.json
export SETTINGS_DIR=$HOME/.m2
export SETTINGS_FILE=$SETTINGS_DIR/settings.xml
