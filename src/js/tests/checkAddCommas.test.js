/* eslint-disable no-undef */
import { numberWithCommas } from '../list.modules';

it(('check equal number with commas'), () => {
  expect(numberWithCommas(324234)).toEqual('324,234');
});
