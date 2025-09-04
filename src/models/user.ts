import mongoose from 'mongoose';

export type TUser = {
  name: string;
  about: string;
  avatar: string;
};

const userSchema = new mongoose.Schema<TUser>({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minLength: 2,
    maxlength: 2000,
  },
  avatar: {
    type: String,
    required: true,
  },
}, { versionKey: false });

export const User = mongoose.model<TUser>('User', userSchema);
