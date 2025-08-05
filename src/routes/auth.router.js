import express, { Router } from "express"
import HttpError from "../errors/http.error.js";
import checkAuth from "../middleware/auth.middleware.js";

/**
 * Creates an instance of AuthRouter.
 * @param {import("../controllers/auth.controller").default} authController - The authentication
 * service to handle user registration and login
 * @returns {Router} An Express router for authentication routes
 */
export default function AuthRouter(authController) {
    const router = Router();
    router.use(express.json());

    router.post("/register", (req, res, next) => {
        try {
            if (!req.username || !req.password) {
                throw new HttpError(422, "Missing needed parameters!", 
                    { requiredFields: ["username", "password"] });
            }
            const username = req.username;
            const token = authController.register(username, req.password);
            res.json({
                username,
                token
            });
        } catch(err) {
            switch(err.name) {
            case "UserAlreadyRegisteredError":
                next({ status: 409, message: "User already registered" });
                break;
            case "HttpError":
                next({ 
                    status: err.code, 
                    message: err.message, 
                    ...err.custom_fields
                });
                break;
            default:
                next({status: 500, message: "Internal server error!"})
            }
        }
    })

    router.post("/login", (req, res, next) => {
        try {
            if (!req.username || !req.password) {
                throw new HttpError(422, "Missing needed parameters!", 
                    { requiredFields: ["username", "password"] });
            }
            const username = req.username;
            const token = authController.login(username, req.password);
            res.json({
                username,
                token
            });
        } catch(err) {
            switch(err.name) {
            case "UserNotRegisteredError":
                next({ status: 409, message: "User not registered" });
                break;
            case "WrongPasswordError":
                next({ status: 401, message: "Wrong password" });
                break;
            case "HttpError":
                next({ 
                    status: err.code, 
                    message: err.message, 
                    ...err.custom_fields
                });
                break;
            default:
                next({status: 500, message: "Internal server error!"})
            }
        }
    });

    router.get("/me", checkAuth(authController), (req, res) => {
        res.json(req.user);
    })

    return router;
}