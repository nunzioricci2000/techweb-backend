import dotenv from "dotenv";

dotenv.config();

export const DB_URI = process.env["DB_URI"] || "sqlite:mydb.sqlite";
export const JWT_SECRET = process.env["JWT_SECRET"] || "shhhhhh";
export const HASH_SALT_ROUNDS = Number(process.env["HASH_SALT_ROUNDS"]) || 10;
export const PORT = Number(process.env["HASH_SALT_ROUNDS"]) || 3000;