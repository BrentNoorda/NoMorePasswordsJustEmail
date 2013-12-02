#!/bin/bash
#
# deploy new NoMorePasswordsJustEmail to server

password=$(head -n 1 password.txt)

expect -f - <<EOD
set timeout 360
spawn meteor deploy NoMorePasswordsJustEmail.meteor.com --settings settings.json
expect "Password:"
send "$password\r"
expect "Deploying to nomorepasswordsjustemail.meteor.com.  Bundling..."
expect "Uploading..."
expect "Now serving at nomorepasswordsjustemail.meteor.com"
EOD

open https://NoMorePasswordsJustEmail.meteor.com/