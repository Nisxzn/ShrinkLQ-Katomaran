const net = require('net');
const dns = require('dns').promises;

/**
 * SMTP Email Verification
 * 
 * Connects to the recipient's mail server and uses the SMTP RCPT TO
 * command to check whether a mailbox actually exists.
 * 
 * How it works:
 *   1. Resolve MX records for the email domain
 *   2. Connect to the highest-priority mail server on port 25
 *   3. Send EHLO → MAIL FROM → RCPT TO commands
 *   4. If server responds 550 to RCPT TO → email does NOT exist
 *   5. If server responds 250 to RCPT TO → email exists (or catch-all)
 * 
 * Limitations:
 *   - Some providers (Gmail) accept all RCPT TO and bounce later (catch-all)
 *   - Port 25 may be blocked in some hosting environments
 *   - Falls back to "assume valid" when verification isn't possible
 */

/**
 * Perform a single SMTP check against a specific mail server.
 * 
 * @param {string} mxHost - The MX server hostname
 * @param {string} email - The email address to verify
 * @returns {Promise<{valid: boolean, reason?: string} | null>}
 *          Returns null if the server couldn't be reached or gave inconclusive results
 */
const checkSMTP = (mxHost, email) => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let step = 0;
    let buffer = '';
    let resolved = false;

    const done = (result) => {
      if (!resolved) {
        resolved = true;
        try { socket.destroy(); } catch (e) { /* ignore */ }
        resolve(result);
      }
    };

    // 10-second timeout for the entire SMTP exchange
    socket.setTimeout(10000);

    socket.on('data', (chunk) => {
      buffer += chunk.toString();

      // SMTP multi-line responses: intermediate lines use "250-..." and the final line uses "250 ..."
      // We only process once we get the final line (code followed by space, not dash)
      const lines = buffer.split('\r\n').filter(l => l.length > 0);
      if (lines.length === 0) return;

      const lastLine = lines[lines.length - 1];
      // If the last complete line still has a dash at position 3, it's a multi-line response in progress
      if (lastLine.length >= 4 && lastLine[3] === '-') return;

      const code = parseInt(lastLine.substring(0, 3));
      if (isNaN(code)) return;

      buffer = ''; // Clear buffer after processing

      try {
        switch (step) {
          case 0: // Server greeting (expect 220)
            if (code === 220) {
              socket.write('EHLO verify.shortly.app\r\n');
              step = 1;
            } else {
              done(null); // Unexpected greeting, can't verify
            }
            break;

          case 1: // EHLO response (expect 250)
            if (code === 250) {
              socket.write('MAIL FROM:<verify@shortly.app>\r\n');
              step = 2;
            } else {
              done(null); // Server rejected EHLO
            }
            break;

          case 2: // MAIL FROM response (expect 250)
            if (code === 250) {
              socket.write(`RCPT TO:<${email}>\r\n`);
              step = 3;
            } else {
              done(null); // Server rejected MAIL FROM
            }
            break;

          case 3: // RCPT TO response - THIS IS THE KEY CHECK
            // Always send QUIT to be polite
            socket.write('QUIT\r\n');

            if (code === 250 || code === 251) {
              // 250 = OK, 251 = user not local but will forward
              done({ valid: true });
            } else if (code >= 550 && code <= 553) {
              // 550 = mailbox not found
              // 551 = user not local, no forwarding
              // 552 = exceeded storage
              // 553 = mailbox name not allowed
              done({ valid: false, reason: 'This email address does not exist. Please enter a real email address.' });
            } else if (code >= 400 && code < 500) {
              // 4xx = temporary failure (greylisting, etc.)
              done(null); // Can't determine, try next MX or assume valid
            } else {
              done(null); // Unknown response
            }
            break;
        }
      } catch (err) {
        done(null);
      }
    });

    socket.on('timeout', () => done(null));
    socket.on('error', () => done(null));
    socket.on('close', () => {
      if (!resolved) done(null);
    });

    try {
      socket.connect(25, mxHost);
    } catch (err) {
      done(null);
    }
  });
};

/**
 * Verify if an email address actually exists by performing SMTP verification.
 * 
 * @param {string} email - The email address to verify
 * @returns {Promise<{valid: boolean, reason?: string}>}
 */
const verifyEmailExists = async (email) => {
  const domain = email.split('@')[1].toLowerCase();

  // Step 1: Resolve MX records
  let mxRecords;
  try {
    mxRecords = await dns.resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      return { valid: false, reason: 'This email domain does not have a mail server and cannot receive emails.' };
    }
  } catch (err) {
    return { valid: false, reason: 'This email domain does not exist. Please check your email address.' };
  }

  // Step 2: Sort MX records by priority (lower number = higher priority)
  mxRecords.sort((a, b) => a.priority - b.priority);

  // Step 3: Try SMTP verification against the top MX servers
  // Try up to 2 MX servers in case the first one is unresponsive
  for (const mx of mxRecords.slice(0, 2)) {
    console.log(`[EmailVerifier] Checking SMTP: ${email} via ${mx.exchange}`);
    const result = await checkSMTP(mx.exchange, email);

    if (result !== null) {
      console.log(`[EmailVerifier] SMTP result for ${email}:`, result);
      return result;
    }

    console.log(`[EmailVerifier] MX server ${mx.exchange} was inconclusive, trying next...`);
  }

  // Step 4: All MX servers were unreachable or inconclusive
  // This can happen when port 25 is blocked or servers use greylisting
  console.log(`[EmailVerifier] Could not verify ${email} via SMTP, assuming valid`);
  return { valid: true };
};

module.exports = { verifyEmailExists };
