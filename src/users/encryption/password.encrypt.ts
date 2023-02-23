import { hash, verify } from 'argon2';

export const hashPassword = async (password: string) => {
  return await hash(password);
};

export const verifyPassword = async (
  hashPassword: string,
  password: string,
): Promise<Boolean> => {
  return await verify(hashPassword, password);
};
