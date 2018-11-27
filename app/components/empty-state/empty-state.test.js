import React from 'react';
import { shallow } from 'enzyme';

import EmptyState from './empty-state';

it("renders without crasching", () => {
  shallow(<EmptyState />);
});

it("should render the title", () => {
  let title = "Test";

  const wrapper = shallow(<EmptyState title={title} />);
  const element = wrapper.find('.c-empty-state__title').first();

  expect(element.text()).toEqual(title);
});

it("should render the subtitle", () => {
  let subtitle = "test";

  const wrapper = shallow(<EmptyState subtitle={subtitle} />);
  const element = wrapper.find('.c-empty-state__subtitle').first();

  expect(element.text()).toEqual(subtitle);
});
