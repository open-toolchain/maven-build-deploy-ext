#!/bin/bash
# Licensed Materials - Property of IBM
# (c) Copyright IBM Corporation 2017. All Rights Reserved.
#
# Note to U.S. Government Users Restricted Rights:
# Use, duplication or disclosure restricted by GSA ADP Schedule
# Contract with IBM Corp.

curl -s -H "Authorization: ${TOOLCHAIN_TOKEN}" \
-H 'Content-Type: application/json' \
https://devops-api.stage1.ng.bluemix.net/v1/toolchains/${PIPELINE_TOOLCHAIN_ID}/services >"$SERVICE_INSTANCE_FILE"
