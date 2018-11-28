import React from 'react';
import { shallow } from 'enzyme';

import EmptyState from './empty-state';

describe("Render component", () => {
  it("renders without crasching", () => {
    const wrapper = shallow(<EmptyState />);

    expect(wrapper.exists()).toBe(true);
  });
});
