/* eslint-disable prettier/prettier */
import { SessionOptions } from "express-session";
export const sessionConfigs: SessionOptions = {
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60, // 60 minutes
  },
};
