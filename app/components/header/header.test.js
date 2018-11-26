import React from 'react';
import { shallow } from 'enzyme';

import MainHeader from './header';

it("renders without crasching", () => {
  shallow(<MainHeader />);
});
