"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
dotenv_1.default.config();
const userMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.userToken;
    console.log("in middleware");
    console.log(token);
    console.log(req.cookies);
    if (!token) {
        res.status(401).json({ message: "Unauthorized, no token provided" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        //@ts-ignore
        req.id = decoded.id;
        next();
    }
    catch (err) {
        console.log("Invalid token");
        res.status(401).json({ message: "Invalid or expire token" });
        return;
    }
};
exports.default = userMiddleware;
