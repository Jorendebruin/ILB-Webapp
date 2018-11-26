import React from 'react';
import { shallow } from 'enzyme';

import EmptyState from './empty-state';

it("renders without crasching", () => {
  shallow(<EmptyState />);
});
