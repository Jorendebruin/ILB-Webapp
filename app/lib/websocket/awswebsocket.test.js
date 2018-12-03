import AwsWebsocket from './awswebsocket';

import AWS from 'aws-sdk/global';

import {
  IOT_HOST
} from '../constants/endpoints';

AWS.config.update({
  region: 'eu-west-1', // your region
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'eu-west-1:ef5b9a78-09d0-4a30-9520-e6ffba3ab9fe'
  })
});

describe("Generate correct socket url", () => {
  it("should generate a signed url without a session token", () => {
    const signedUrl = new AwsWebsocket().getSignedUrl(IOT_HOST, AWS.config.region, AWS.config.credentials);

    expect(signedUrl).toMatch(new RegExp(IOT_HOST));
    expect(signedUrl).toMatch(new RegExp(AWS.config.region));
  });

  it("should generate a signed url with a session token", () => {
    AWS.config.credentials.sessionToken = 'testsessiontoken';
    const signedUrl = new AwsWebsocket().getSignedUrl(IOT_HOST, AWS.config.region, AWS.config.credentials);

    expect(signedUrl).toMatch(new RegExp(IOT_HOST));
    expect(signedUrl).toMatch(new RegExp(AWS.config.region));
    expect(signedUrl).toMatch(new RegExp('&X-Amz-Security-Token='));
  });

  it("should generate a signature key", () => {
    const key = 'testkey';
    const date = AWS.util.date.iso8601(new Date()).replace(/[:\-]|\.\d{3}/g, '').substr(0, 8);
    const region = AWS.config.region;
    const service = 'iotdevicegateway'

    const signatureKey = new AwsWebsocket().getSignatureKey(key, date, region, service);

    expect(signatureKey).toEqual(expect.anything());
  });
})
