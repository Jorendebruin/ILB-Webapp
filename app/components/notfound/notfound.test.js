import React from 'react';
import { shallow } from 'enzyme';

import NotFound from './notfound';

describe("Render component", () => {
  it("renders without crasching", () => {
    const wrapper = shallow(<NotFound />);

    expect(wrapper.exists()).toBe(true);
  });
});
