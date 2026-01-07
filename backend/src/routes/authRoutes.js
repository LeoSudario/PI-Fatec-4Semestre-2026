import express from 'express';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Username and password are required' 
      });
    }
    
    const token = 'fake-jwt-token-123';
    
    return res.status(200).json({ 
      message: 'Login successful',
      token:  token,
      username: username
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      message: 'Login failed',
      error: error.message 
    });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Username and password are required' 
      });
    }
    
    const token = 'fake-jwt-token-456';
    
    return res. status(201).json({ 
      message: 'User created successfully',
      token: token,
      username: username
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ 
      message: 'Signup failed',
      error: error.message 
    });
  }
});

export default router;