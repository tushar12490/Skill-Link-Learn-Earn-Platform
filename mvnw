#!/bin/sh
BASEDIR="$(cd "$(dirname "$0")" >/dev/null 2>&1 && pwd)"
MAVEN_HOME="$BASEDIR/apache-maven-3.9.6"
MVN_CMD="$MAVEN_HOME/bin/mvn"
if [ ! -x "$MVN_CMD" ]; then
  echo "[ERROR] Maven executable not found at '$MVN_CMD'." 1>&2
  echo "        Ensure apache-maven-3.9.6 is present relative to this script." 1>&2
  exit 1
fi
exec "$MVN_CMD" "$@"
