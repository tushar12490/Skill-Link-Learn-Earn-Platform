@echo off
setlocal enabledelayedexpansion
set "BASEDIR=%~dp0"
set "MAVEN_HOME=%BASEDIR%apache-maven-3.9.6"
set "MVN_CMD=%MAVEN_HOME%\bin\mvn.cmd"
if not exist "%MVN_CMD%" (
    echo [ERROR] Maven executable not found at "%MVN_CMD%".
    echo         Ensure apache-maven-3.9.6 is present relative to this script.
    exit /b 1
)
"%MVN_CMD%" %*
endlocal
