import User from '../models/User.js';

export const getAllUsers = async ({ page = 1, limit = 10, search, role, isActive }) => {
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  if (role) query.role = role;
  if (isActive !== undefined) query.isActive = isActive === 'true';

  const skip = (page - 1) * limit;

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    users,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
};

export const getUserById = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    const err = new Error('User not found.');
    err.statusCode = 404;
    throw err;
  }

  return user;
};

export const updateUser = async (id, updateData, requestingUser) => {
  if (requestingUser.role !== 'admin' && requestingUser._id.toString() !== id) {
    const err = new Error('You can only update your own profile.');
    err.statusCode = 403;
    throw err;
  }

  if (requestingUser.role !== 'admin') {
    delete updateData.role;
    delete updateData.isActive;
  }

  const user = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    const err = new Error('User not found.');
    err.statusCode = 404;
    throw err;
  }

  return user;
};

export const deleteUser = async (id, requestingUserId) => {
  if (id === requestingUserId.toString()) {
    const err = new Error('You cannot delete your own account.');
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    const err = new Error('User not found.');
    err.statusCode = 404;
    throw err;
  }
};

export const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');

  if (!user) {
    const err = new Error('User not found.');
    err.statusCode = 404;
    throw err;
  }

  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    const err = new Error('Current password is incorrect.');
    err.statusCode = 400;
    throw err;
  }

  user.password = newPassword;
  await user.save();
};