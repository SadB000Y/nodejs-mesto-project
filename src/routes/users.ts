import express from 'express';
import {
  getUsers,
  getUser,
  updateUserAvatar,
  updateUserProfile,
  getUserMe,
} from '../controllers/users';
import {
  validateAvatarUpdateSchema,
  validateUpdateUserProfileSchema,
  validateUserIdSchema,
} from '../shared/validators/request-validators';

export const usersRouter = express.Router();

usersRouter.get('/', getUsers);
usersRouter.get('/me', getUserMe);
usersRouter.patch('/me', validateUpdateUserProfileSchema, updateUserProfile);
usersRouter.patch('/me/avatar', validateAvatarUpdateSchema, updateUserAvatar);
usersRouter.get('/:userId', validateUserIdSchema, getUser);
