#!/bin/bash
# Licensed Materials - Property of IBM
# (c) Copyright IBM Corporation 2017. All Rights Reserved.
#
# Note to U.S. Government Users Restricted Rights:
# Use, duplication or disclosure restricted by GSA ADP Schedule
# Contract with IBM Corp.

cat - >> /tmp/settings.xml <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<settings xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.1.0 http://maven.apache.org/xsd/settings-1.1.0.xsd" xmlns="http://maven.apache.org/SETTINGS/1.1.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <servers>
EOF

# Add all available servers
if [ ! -z "${MAVEN_MIRROR_URL}" ]; then
cat - >> /tmp/settings.xml <<EOF
    <server>
      <username>${MAVEN_USER_ID}</username>
      <password>${MAVEN_TOKEN}</password>
      <id>central</id>
    </server>
EOF
fi
if [ ! -z "${MAVEN_SNAPSHOT_URL}" ]; then
cat - >> /tmp/settings.xml <<EOF
    <server>
      <username>${MAVEN_USER_ID}</username>
      <password>${MAVEN_TOKEN}</password>
      <id>snapshots</id>
    </server>
EOF
fi
if [ ! -z "${MAVEN_RELEASE_URL}" ]; then
cat - >> /tmp/settings.xml <<EOF
    <server>
      <username>${MAVEN_USER_ID}</username>
      <password>${MAVEN_TOKEN}</password>
      <id>releases</id>
    </server>
EOF
fi
cat - >> /tmp/settings.xml <<EOF
  </servers>
  <profiles>
    <profile>
      <id>${MAVEN_NAME}</id>
      <repositories>
EOF


if [ ! -z "${MAVEN_MIRROR_URL}" ]; then
cat - >> /tmp/settings.xml <<EOF
        <repository>
          <id>central</id>
          <url>${MAVEN_MIRROR_URL}</url>
          <snapshots>
            <enabled>false</enabled>
          </snapshots>
        </repository>
EOF
fi
if [ ! -z "${MAVEN_SNAPSHOT_URL}" ]; then
cat - >> /tmp/settings.xml <<EOF
        <repository>
          <id>snapshots</id>
          <url>${MAVEN_SNAPSHOT_URL}</url>
          <snapshots>
            <enabled>true</enabled>
          </snapshots>
          <releases>
            <enabled>false</enabled>
          </releases>
        </repository>
EOF
fi
if [ ! -z "${MAVEN_RELEASE_URL}" ]; then
cat - >> /tmp/settings.xml <<EOF
        <repository>
          <id>releases</id>
          <url>${MAVEN_RELEASE_URL}</url>
          <snapshots>
            <enabled>false</enabled>
          </snapshots>
          <releases>
            <enabled>true</enabled>
          </releases>
        </repository>
EOF
fi

cat - >> /tmp/settings.xml <<EOF
      </repositories>
     <pluginRepositories>
EOF

if [ ! -z "${MAVEN_MIRROR_URL}" ]; then
cat - >> /tmp/settings.xml <<EOF
        <pluginRepository>
          <id>central</id>
          <url>${MAVEN_MIRROR_URL}</url>
          <snapshots>
            <enabled>false</enabled>
          </snapshots>
        </pluginRepository>
EOF
fi
if [ ! -z "${MAVEN_SNAPSHOT_URL}" ]; then
cat - >> /tmp/settings.xml <<EOF
        <pluginRepository>
          <id>snapshots</id>
          <url>${MAVEN_SNAPSHOT_URL}</url>
          <snapshots>
            <enabled>true</enabled>
          </snapshots>
          <releases>
            <enabled>false</enabled>
          </releases>
        </pluginRepository>
EOF
fi
if [ ! -z "${MAVEN_RELEASE_URL}" ]; then
cat - >> /tmp/settings.xml <<EOF
        <pluginRepository>
          <id>releases</id>
          <url>${MAVEN_RELEASE_URL}</url>
          <snapshots>
            <enabled>false</enabled>
          </snapshots>
          <releases>
            <enabled>true</enabled>
          </releases>
        </pluginRepository>
EOF
fi

cat - >> /tmp/settings.xml <<EOF
     </pluginRepositories>
    </profile>
  </profiles>
  <activeProfiles>
    <!--make the profile active all the time -->
    <activeProfile>${MAVEN_NAME}</activeProfile>
  </activeProfiles>
</settings>
EOF
