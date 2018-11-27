import React from 'react';
import { shallow } from 'enzyme';

import Home from './Home';

describe("Render component", () => {
  it("renders without crasching", () => {
    const wrapper = shallow(<Home />);

    expect(wrapper.exists()).toBe(true);
  });
});
