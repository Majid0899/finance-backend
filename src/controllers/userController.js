import * as userService from '../services/userService.js';

const getAllUsers = async (req, res) => {
  try {
    const { page, limit, search, role, isActive } = req.query;
    const result = await userService.getAllUsers({ page, limit, search, role, isActive });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Something went wrong.',
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);

    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Something went wrong.',
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body, req.user);

    res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      data: { user },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Something went wrong.',
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully.',
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Something went wrong.',
    });
  }
};

const changePassword = async (req, res) => {
  try {
    await userService.changePassword(req.user._id, req.body);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Something went wrong.',
    });
  }
};

export {getAllUsers,getUserById,updateUser,deleteUser,changePassword}