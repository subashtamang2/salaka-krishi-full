/* eslint-disable prettier/prettier */
import { HelmetOptions } from "helmet";
export const helmetConfig: HelmetOptions = {
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
};
