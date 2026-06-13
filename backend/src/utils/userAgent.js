/**
 * Extracts browser name and device type from User-Agent string.
 * @param {string} uaString - User agent header string.
 * @returns {object} { browser, device }
 */
function parseUserAgent(uaString) {
  if (!uaString) {
    return { browser: 'Unknown', device: 'Unknown' };
  }

  let browser = 'Other Browser';
  const ua = uaString.toLowerCase();

  if (ua.includes('firefox') && !ua.includes('seamonkey')) {
    browser = 'Firefox';
  } else if (ua.includes('chrome') && !ua.includes('chromium')) {
    browser = 'Chrome';
  } else if (ua.includes('safari') && !ua.includes('chrome') && !ua.includes('chromium')) {
    browser = 'Safari';
  } else if (ua.includes('edg/')) {
    browser = 'Edge';
  } else if (ua.includes('opr/') || ua.includes('opera')) {
    browser = 'Opera';
  } else if (ua.includes('msie') || ua.includes('trident/')) {
    browser = 'Internet Explorer';
  }

  let device = 'Desktop';
  if (ua.includes('mobi') || ua.includes('android') || ua.includes('iphone') || ua.includes('ipod')) {
    device = 'Mobile';
  } else if (ua.includes('ipad') || ua.includes('tablet') || (ua.includes('android') && !ua.includes('mobi'))) {
    device = 'Tablet';
  }

  return { browser, device };
}

module.exports = { parseUserAgent };
