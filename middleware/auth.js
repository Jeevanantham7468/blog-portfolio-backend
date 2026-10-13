// Verifies a Firebase ID token sent by the client and attaches the account
// to req.user. Every signed-in Firebase user is allowed through (admin = any
// authenticated user for this project), but an anonymous request is rejected.

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const idToken = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!idToken) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const apiKey = process.env.FIREBASE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        message: 'Server is missing FIREBASE_API_KEY. Add it to the backend .env file.',
      });
    }

    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      }
    );

    if (!response.ok) {
      return res
        .status(401)
        .json({ message: 'Invalid or expired session. Please log in again.' });
    }

    const data = await response.json();
    const account = data.users && data.users[0];

    if (!account) {
      return res
        .status(401)
        .json({ message: 'Invalid or expired session. Please log in again.' });
    }

    req.user = {
      id: account.localId,
      email: account.email || '',
      emailVerified: Boolean(account.emailVerified),
    };

    next();
  } catch (err) {
    res.status(401).json({ message: 'Authentication failed.' });
  }
}

module.exports = { requireAuth };
