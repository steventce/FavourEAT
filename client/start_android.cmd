REM simple script to start build without having to do it manually

@ECHO OFF
REM start the packager
start cmd /k react-native start

REM run the application
react-native run-android

pause