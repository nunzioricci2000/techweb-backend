import { validationResult } from "express-validator";
import HttpError from "../errors/http.error.js";

/**
 * 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {void}
 */
export default function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  next(new HttpError(400, "Missing parameters", { errors: errors.array()}));
};