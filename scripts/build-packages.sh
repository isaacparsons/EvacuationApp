#!/bin/bash

function packLambda {
    echo "packaging $1 lambda"
    pushd ../components/$1
    npm install
    npm run build

    pushd ./dist
    npm install
    popd
    zip -r -q $1.zip dist
    popd

    mv ../components/$1/$1.zip ../terraform/modules/$1/$1.zip
}

packLambda server
# packLambda email
# packLambda pushNotifications