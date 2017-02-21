#!/bin/bash
# Licensed Materials - Property of IBM
# (c) Copyright IBM Corporation 2017. All Rights Reserved.
#
# Note to U.S. Government Users Restricted Rights:
# Use, duplication or disclosure restricted by GSA ADP Schedule
# Contract with IBM Corp.

cat - >> /tmp/settings.xml <<EOF
<settings>
  <pluginGroups>
    <pluginGroup>org.sonatype.plugins</pluginGroup>
  </pluginGroups>
EOF

if [ ! -z "${MAVEN_MIRROR_URL}" ]; then
cat - >> /tmp/settings.xml <<EOF
  <profiles>
    <profile>
      <id>maven</id>
      <repositories>
        <repository>
          <id>${MAVEN_NAME}</id>
          <url>${MAVEN_MIRROR_URL}</url>
          <snapshots>
            <enabled>true</enabled>
          </snapshots>
        </repository>
      </repositories>
    </profile>
  </profiles>
  <activeProfiles>
    <!--make the profile active all the time -->
    <activeProfile>maven</activeProfile>
  </activeProfiles>
EOF

fi

cat - >> /tmp/settings.xml <<EOF
  <servers>
    <server>
      <id>${MABEN_NAME}</id>
      <username>${MAVEN_USER_ID}</username>
      <password>${MAVEN_TOKEN}</password>
    </server>
  </servers>
EOF


cat - >> /tmp/settings.xml <<EOF
</settings>
EOF
