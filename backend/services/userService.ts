import User, { IUser } from "../models/User";
import jwt from "jsonwebtoken";

interface MyJwtPayload extends jwt.JwtPayload {
  _id: string;
}

export const createUser = async (userData: IUser) => {
  const user = new User(userData);
  return await user.save();
};
export const findUserById = async (id: string) => {
  return await User.findById(id);
};
export const verifyUserEmail = async (id: string) => {
  return await User.findByIdAndUpdate(id, { isVerified: true }, { new: true });
};
export const generateVerificationToken = (userId: string): string => {
  const payload: MyJwtPayload = { _id: userId };
  return jwt.sign(payload, process.env.JWT_SECRET as string);
};

export async function deleteUserById(_id: any) {
  return await User.findByIdAndDelete(_id);
}

export async function updateUserById(_id: string, updateData: Partial<IUser>) {
  return await User.findByIdAndUpdate(_id, updateData, {
    new: true,
  });
}
