import { BadRequestException } from "@nestjs/common";
import { Request } from "express";
import { diskStorage, FileFilterCallback } from "multer";
import { extname } from "path";

export const storage = diskStorage({
  destination: "./public/uploads",
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const name = file.originalname.split(".")[0];
    const cleanFileName = name.replace(/\s+/g, "-").toLowerCase();
    const extension = extname(file.originalname);
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join("");
    cb(null, `${cleanFileName}-${randomName}${extension}`);
  },
});

export const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/webp",
    "image/svg+xml",
  ];
  if (!allowedTypes.includes(file.mimetype)) {
    return callback(
      new BadRequestException(
        "only files with the following extensions are allowed: " +
          allowedTypes.join(", ")
      )
    );
  }

  callback(null, true);
};
