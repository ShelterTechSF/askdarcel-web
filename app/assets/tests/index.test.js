import { expect } from 'chai';
import { images } from '..';

describe('images', () => {
  describe('icon', () => {
    it('should support mixed case icon names', () => {
      expect(images.icon('SheLTer')).toMatch(/ic-shelter@3x-[^.]*\.png$/);
    });
  });

  describe('background', () => {
    it('should expose the large background image', () => {
      expect(images.background).toMatch(/bg-[^.]*\.png$/);
    });
  });

  describe('logoSmall', () => {
    it('should expose the small logo image', () => {
      expect(images.logoSmall).toMatch(/logo-small-white@3x-[^.]*\.png$/);
    });
  });
});
