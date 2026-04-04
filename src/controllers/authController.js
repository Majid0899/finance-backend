
import * as authService from "../services/authService.js";

const register = async (req, res) => {
  try {
    const { user, token } = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: { user, token },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Something went wrong.',
    });
  }
};

const login = async (req, res) => {
  try {
    const { user, token } = await authService.login(req.body);
    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: { user, token },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Something went wrong.',
    });
  }
};

const getMe = (req, res) => {
  res.status(200).json({
    success: true,
    data: { user: req.user },
  });
};

export { register, login, getMe };
