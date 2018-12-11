import React from 'react';
import { shallow } from 'enzyme';

import Login from './Login';

describe("Render component", () => {
  it("renders without crasching", () => {
    const wrapper = shallow(<Login />);

    expect(wrapper.exists()).toBe(true);
  });
});

describe("UI actions", () => {
  it("should validate the form", () => {
    const wrapper = shallow(<Login />);

    expect(wrapper.instance().validateForm()).toBe(false);
    wrapper.instance().state = {email: 'test@test.nl', password: 'testpassword'};
    expect(wrapper.instance().validateForm()).toBe(true);
  });

  it("should handle a submit", () => {
    const wrapper = shallow(<Login />);
    wrapper.instance().state = {email: 'test@test.nl', password: 'testpassword'};
    expect(wrapper.instance().handleSubmit()).resolves.toBe({});
  });
})
