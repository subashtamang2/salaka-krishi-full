/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable prettier/prettier */
import { ROLE } from "@prisma/client";
export interface ValidatedUserPayload{
sub:string;
username:string;
role?: ROLE;
}
export interface JwtPayload extends ValidatedUserPayload {}

