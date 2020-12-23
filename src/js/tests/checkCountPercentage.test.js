/* eslint-disable no-undef */
import { getPercentage } from '../map';

test('check percent value', () => {
  expect(getPercentage(10, 200)).toBe(5);
});
