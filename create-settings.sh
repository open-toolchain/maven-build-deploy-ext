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

mkdir -p "$SETTINGS_DIR"
cat - >> "$SETTINGS_FILE" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<settings xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.1.0 http://maven.apache.org/xsd/settings-1.1.0.xsd" xmlns="http://maven.apache.org/SETTINGS/1.1.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <servers>
EOF

# Add all available servers
if [ ! -z "${MAVEN_MIRROR_URL}" ]; then
cat - >> "$SETTINGS_FILE" <<EOF
    <server>
      <username>${MAVEN_USER_ID}</username>
      <password>${MAVEN_TOKEN}</password>
      <id>central</id>
    </server>
EOF
fi
if [ ! -z "${MAVEN_SNAPSHOT_URL}" ]; then
cat - >> "$SETTINGS_FILE" <<EOF
    <server>
      <username>${MAVEN_USER_ID}</username>
      <password>${MAVEN_TOKEN}</password>
      <id>snapshots</id>
    </server>
EOF
fi
if [ ! -z "${MAVEN_RELEASE_URL}" ]; then
cat - >> "$SETTINGS_FILE" <<EOF
    <server>
      <username>${MAVEN_USER_ID}</username>
      <password>${MAVEN_TOKEN}</password>
      <id>releases</id>
    </server>
EOF
fi

cat - >> "$SETTINGS_FILE" <<EOF
  </servers>
EOF

# Setup sonar server url
if [ ! -z "${SONAR_SERVER_URL}" ]; then
cat - >> "$SETTINGS_FILE" <<EOF
    <pluginGroups>
        <pluginGroup>org.sonarsource.scanner.maven</pluginGroup>
    </pluginGroups>
EOF
fi

cat - >> "$SETTINGS_FILE" <<EOF
    <profiles>
EOF

# Setup sonar server url
if [ ! -z "${SONAR_SERVER_URL}" ]; then
cat - >> "$SETTINGS_FILE" <<EOF
    <profile>
        <id>sonar</id>
        <activation>
            <activeByDefault>true</activeByDefault>
        </activation>
        <properties>
            <sonar.host.url>${SONAR_SERVER_URL}</sonar.host.url>
EOF
if [ ! -z "$SONAR_USER_TOKEN" ]; then
if [ -z "$SONAR_USER_ID" ]; then
# user token
cat - >> "$SETTINGS_FILE" <<EOF
            <sonar.login>${SONAR_USER_TOKEN}</sonar.login>
EOF
else
#user login/password
cat - >> "$SETTINGS_FILE" <<EOF
            <sonar.login>${SONAR_USER_ID}</sonar.login>
            <sonar.password>${SONAR_USER_TOKEN}</sonar.password>
EOF
fi
fi

cat - >> "$SETTINGS_FILE" <<EOF
         </properties>
    </profile>
EOF
fi

cat - >> "$SETTINGS_FILE" <<EOF
    <profile>
      <id>${MAVEN_NAME}</id>
      <repositories>
EOF


if [ ! -z "${MAVEN_MIRROR_URL}" ]; then
cat - >> "$SETTINGS_FILE" <<EOF
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
cat - >> "$SETTINGS_FILE" <<EOF
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
cat - >> "$SETTINGS_FILE" <<EOF
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

cat - >> "$SETTINGS_FILE" <<EOF
      </repositories>
     <pluginRepositories>
EOF

if [ ! -z "${MAVEN_MIRROR_URL}" ]; then
cat - >> "$SETTINGS_FILE" <<EOF
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
cat - >> "$SETTINGS_FILE" <<EOF
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
cat - >> "$SETTINGS_FILE" <<EOF
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

cat - >> "$SETTINGS_FILE" <<EOF
     </pluginRepositories>
    </profile>
  </profiles>
  <activeProfiles>
    <!--make the profile active all the time -->
    <activeProfile>${MAVEN_NAME}</activeProfile>
  </activeProfiles>
</settings>
EOF

