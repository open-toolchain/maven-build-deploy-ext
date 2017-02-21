#!/bin/bash
# Licensed Materials - Property of IBM
# (c) Copyright IBM Corporation 2017. All Rights Reserved.
#
# Note to U.S. Government Users Restricted Rights:
# Use, duplication or disclosure restricted by GSA ADP Schedule
# Contract with IBM Corp.


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
