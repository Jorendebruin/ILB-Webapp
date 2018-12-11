import React from 'react';
import { shallow } from 'enzyme';

import InstanceOverview from './InstanceOverview';

const instance = {
  instance: { startuptime: "2018-11-23T14:45:56.000Z", state: 80, type: "t2.micro" },
  location: { branch: "Aalsmeer", availabilityZone: "eu-west-1b", environment: 4 },
  metadata: { name: "ILB-prd-rbg.instance-2", instanceId: "i-07f63f9ce4f6e8211", verbose: "ILB-prd-rbg.instance-2" },
  status: { alarm: 1, health: { amount: 2, passed: 0, state: 0 } }
};

const closeModalMock = jest.fn();

describe("Render component", () => {
  it("renders without crasching", () => {
    const wrapper = shallow(<InstanceOverview currentInstance={instance} closeModal={closeModalMock} />);

    expect(wrapper.exists()).toBe(true);
  });
});

describe("UI actions", () => {
  it("closes the modal", () => {
    const wrapper = shallow(<InstanceOverview currentInstance={instance} closeModal={closeModalMock} />);

    wrapper.instance().close();

    expect(closeModalMock).toBeCalled();
  });
});
