import type { IncomingHttpHeaders } from "node:http";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";

type RegisterInput = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
};

type LoginInput = {
  email: string;
  password: string;
};

export const registerUser = ({
  email,
  password,
  firstname,
  lastname,
}: RegisterInput) => {
  return auth.api.signUpEmail({
    body: {
      email,
      password,
      firstname,
      lastname,
      name: `${firstname} ${lastname}`,
    },
  });
};

export const loginUser = ({ email, password }: LoginInput) => {
  return auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });
};

export const logoutUser = (headers: IncomingHttpHeaders) => {
  return auth.api.signOut({
    headers: fromNodeHeaders(headers),
  });
};
