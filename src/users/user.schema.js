import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { UserRoles , UserStatuses} from '../users/user.enums.js'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: UserRoles, default: UserRoles.CLIENT },
  status: { type: String, enum: UserStatuses, default: UserStatuses.ACTIVE }
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.__v;
    delete ret.status;
  }
});

const User = mongoose.model('User', userSchema);
export default User;