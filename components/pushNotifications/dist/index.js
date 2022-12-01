"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lambdaHandler = async (event, context) => {
    console.log(`Event: ${JSON.stringify(event, null, 2)}`);
    console.log(`Context: ${JSON.stringify(context, null, 2)}`);
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "hello world",
        }),
    };
};
exports.default = lambdaHandler;
