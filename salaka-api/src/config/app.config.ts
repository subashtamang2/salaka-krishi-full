/* eslint-disable prettier/prettier */
import { ConfigModuleOptions } from "@nestjs/config";
import envConfig from "./env.config";

export const appConfig: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: [".env"],
  load: [envConfig],
};
