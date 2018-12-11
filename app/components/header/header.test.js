import React from 'react';
import { shallow, mount } from 'enzyme';

import MainHeader from './header';

describe("Render component", () => {
  it("renders without crasching", () => {
    const wrapper = shallow(<MainHeader />);

    expect(wrapper.exists()).toBe(true);
  });
});

describe("UI actions", () => {
  it("should be able to toggle night mode", () => {
    const wrapper = mount(<MainHeader />);

    let nightModus = false;

    expect(nightModus).toBe(wrapper.instance().state.nightModus);
    wrapper.instance().toggleNightModus(nightModus);
    expect(nightModus).not.toBe(wrapper.instance().state.nightModus);
  });
})
