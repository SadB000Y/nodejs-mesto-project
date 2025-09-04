import mongoose, { Model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import isEmail from 'validator/lib/isEmail';
import { errorMessages } from '../shared/errors/error-messages';
import { UnauthorizedError } from '../shared/errors/unauthorized-error';
import { VALIDATION_MESSAGES } from '../shared/validators/validation-messages';

export type TUser = {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
};

type TUserModel = Model<TUser> & {
  findUserByCredentials(
    email: string,
    password: string,
  ): Promise<Document<unknown, unknown, TUser> & TUser & { _doc: { _id: Types.ObjectId } }>
};

const userSchema = new mongoose.Schema<TUser, TUserModel>(
  {
    name: {
      type: String,
      default: 'Уоррен Баффетт',
      minLength: [2, `${VALIDATION_MESSAGES.name.min}2`],
      maxlength: [30, `${VALIDATION_MESSAGES.name.max}30`],
    },
    about: {
      type: String,
      default: 'Бизнесмен',
      minLength: [2, `${VALIDATION_MESSAGES.about.min}2`],
      maxlength: [200, `${VALIDATION_MESSAGES.about.max}200`],
    },
    avatar: {
      type: String,
      default: 'https://s.yimg.com/ny/api/res/1.2/zxPXvT3uUfs9U4G4LOuXiQ--/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MDtoPTU0MDtjZj13ZWJw/https://media.zenfs.com/en-US/homerun/gobankingrates_644/b0e5620f28d5da6ac519d53e1d9c6003',
      validate: {
        validator(avatar: string) {
          const regexp = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
          return regexp.test(avatar);
        },
        message: VALIDATION_MESSAGES.avatar.incorrectFormat,
      },
    },
    email: {
      type: String,
      required: [true, VALIDATION_MESSAGES.email.required],
      unique: true,
      validate: {
        validator: (value: string) => isEmail(value),
        message: VALIDATION_MESSAGES.email.incorrectFormat,
      },
    },
    password: {
      type: String,
      required: [true, VALIDATION_MESSAGES.password.required],
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.static(
  'findUserByCredentials',
  async function findUserByCredentials(email: string, password: string) {
    const user = await this.findOne({ email }).select('+password');

    if (!user) {
      throw new UnauthorizedError(errorMessages.notCorrectPasswordOrEmail);
    }

    const isMatchedPassword = await bcrypt.compare(password, user.password);

    if (!isMatchedPassword) {
      throw new UnauthorizedError(errorMessages.notCorrectPasswordOrEmail);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPassword, ...filteredUserData } = user;

    return filteredUserData;
  },
);

export const User = mongoose.model<TUser, TUserModel>('User', userSchema);
