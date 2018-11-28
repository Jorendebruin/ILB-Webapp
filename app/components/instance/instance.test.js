import React from 'react';
import { shallow } from 'enzyme';
import AWS from 'aws-sdk/global';

import Instance from './instance';

it("renders without crasching", () => {
  // Need mock get request to pass test
  AWS.config.credentials = {
    get: function() {}
  };
  const instance = {
    instance: {
      startuptime: "2018-11-23T14:45:56.000Z",
      state: 16,
      type: "t2.micro"
    },
    location: {
      branch: "Aalsmeer",
      availabilityZone: "eu-west-1b",
      environment: 4
    },
    metadata: {
      name: "ILB-prd-rbg.instance-2",
      instanceId: "i-07f63f9ce4f6e8211",
      verbose: "ILB-prd-rbg.instance-2"
    },
    status: {
      alarm: 1,
      health: { amount: 2, passed: 0, state: 0 }
    }
  }
  shallow(<Instance instance={instance} />);
});
