import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../users/user.schema.js';
import config from '../config/config.js';

export async function login(req, res) {
  const { phone, password } = req.body;

  try {
    // Find user by phone number
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(401).json({ message: 'Invalid phone number or password' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid phone number or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, config.jwtSecret, { expiresIn: config.jwtExpirationTime });

    res.json({ access_token: token });
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function generateToken(userId) {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: config.jwtExpirationTime });
}