import React from 'react';
import { shallow } from 'enzyme';

import App from './app';

describe("Render component", () => {
  it("renders without crasching", () => {
    const wrapper = shallow(<App />);

    expect(wrapper.exists()).toBe(true);
  });
});

describe("UI actions", () => {
  it("should set the state on user authentication", () => {
    const wrapper = shallow(<App />);

    expect(wrapper.instance().state.isAuthenticated).toBe(false);
    wrapper.instance().userHasAuthenticated(true);
    expect(wrapper.instance().state.isAuthenticated).toBe(true);
  });

  it("should handle a logout event", async () => {
    const wrapper = shallow(<App />);

    wrapper.instance().userHasAuthenticated(true);
    expect(wrapper.instance().state.isAuthenticated).toBe(true);
    await wrapper.instance().handleLogoutevent();
    expect(wrapper.instance().state.isAuthenticated).toBe(false);
  });
});
