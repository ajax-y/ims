/**
 * Shared password hashing utility (SHA-256 + salt)
 * Same salt as UserContext for backward compatibility.
 */
export const hashPassword = async (password) => {
  if (!password) return '';
  try {
    const msgUint8 = new TextEncoder().encode(password + '_ims_secure_salt_v2');
    if (!window.crypto || !window.crypto.subtle) {
      console.warn('Crypto subtle not available. Falling back to plain text.');
      return password;
    }
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    console.error('hashPassword error:', err);
    return password;
  }
};
