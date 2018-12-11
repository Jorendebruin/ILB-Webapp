import React from 'react';
import { shallow, mount } from 'enzyme';
import AWS from 'aws-sdk/global';

import Instance from './instance';
import App from '../app/app';

const instance = {
  instance: { startuptime: "2018-11-23T14:45:56.000Z", state: 80, type: "t2.micro" },
  location: { branch: "Aalsmeer", availabilityZone: "eu-west-1b", environment: 4 },
  metadata: { name: "ILB-prd-rbg.instance-2", instanceId: "i-07f63f9ce4f6e8211", verbose: "ILB-prd-rbg.instance-2" },
  status: { alarm: 1, health: { amount: 2, passed: 0, state: 0 } }
};
const originalInstance = {
  instance: { startuptime: "2018-11-23T14:45:56.000Z", state: 80, type: "t2.micro" },
  location: { branch: "Aalsmeer", availabilityZone: "eu-west-1b", environment: 4 },
  metadata: { name: "ILB-prd-rbg.instance-2", instanceId: "i-07f63f9ce4f6e8211", verbose: "ILB-prd-rbg.instance-2" },
  status: { alarm: 1, health: { amount: 2, passed: 0, state: 0 } }
};

const home = mount(<App />);

describe("Render component", () => {
  it("renders without crasching", () => {
    // Need mock get request to pass test
    AWS.config.credentials = { get: function() {} };
    const wrapper = shallow(<Instance instance={instance} />);

    expect(wrapper.exists()).toBe(true);
  });
});

describe("UI actions", () => {
  it("should change the state on button click", () => {
    const wrapper = shallow(<Instance instance={instance}></Instance>);
    const button = wrapper.find('button').first();

    expect(wrapper.instance().state.instance.instance.state).toEqual(originalInstance.instance.state);
    button.simulate('click');
    expect(wrapper.instance().state.instance.instance.state).not.toEqual(originalInstance.instance.state);
  });
});

describe("Websocket actions", () => {
  it("changes the state", () => {
    const wrapper = shallow(<Instance instance={instance}></Instance>);
    const stateChangeEvent = { type: 'stateChange', message: { state: 16 } };

    expect(wrapper.instance().state.instance.instance.state).toEqual(instance.instance.state);
    wrapper.instance().cloudWatchActionEvent(stateChangeEvent);
    expect(wrapper.instance().state.instance.instance.state).toEqual(stateChangeEvent.message.state);
  });

  it("changes the name", () => {
    const wrapper = shallow(<Instance instance={instance}></Instance>);
    const nameChangeEvent = { type: 'nameChange', message: { name: 'test' } };

    expect(wrapper.instance().state.instance.metadata.name).toEqual(instance.metadata.name);
    wrapper.instance().cloudWatchActionEvent(nameChangeEvent);
    expect(wrapper.instance().state.instance.metadata.name).toEqual(nameChangeEvent.message.name);
  });
});
