import User from './user.schema.js';
import { UserStatuses } from '../users/user.enums.js'


export async function createUser(userData) {
  const user = new User(userData);
  return await user.save();
}

export async function updateUser(userId, updateData) {
  return await User.findByIdAndUpdate(userId, updateData, { new: true });
}

export async function getUserById(userId) {
  return await User.findOne({ _id: userId, status: UserStatuses.ACTIVE });
}

export async function deleteUser(userId) {
  return await User.findByIdAndUpdate(userId, { status: 'DELETED' }, { new: true });
}