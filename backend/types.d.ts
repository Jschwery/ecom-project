import { Request as ExpressRequest } from "express";
import { UploadedFile as EFUploadedFile } from "express-fileupload";
import { IUser } from "./models/User";

export interface CustomUploadedFile extends EFUploadedFile {
  mv: {
    (path: string, callback: (error: any) => void): void;
    (path: string): Promise<void>;
  };
}

export interface CustomRequest extends ExpressRequest {
  foundUser?: IUser;
  files?: {
    [filename: string]: CustomUploadedFile | CustomUploadedFile[];
  } | null;
}
