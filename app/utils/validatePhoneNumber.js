
/**
 *  @module normalize/validatePhoneNumber
 * Validator for US only phone numbers.
 */

// eslint-disable-next-line import/no-unused-modules
const PHONE_REGEX = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

module.exports = {
  /** @param {string} phoneNumber -  phone number to normalize. */
  normalize(phoneNumber) {
    const numbers = phoneNumber.replace(/\D/g, '');
    const char = { 0: '(', 3: ') ', 6: '-' };
    let normalized = '';
    for (let i = 0; i < numbers.length; i += 1) {
      normalized += (char[i] || '') + numbers[i];
    }
    return normalized;
  },
  /** @param {string} phoneNumber -  phone number to validate. */
  validatePhoneNumber(phoneNumber) {
    return PHONE_REGEX.test(phoneNumber);
  },

};
