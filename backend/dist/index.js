"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db/db"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userModel_1 = __importDefault(require("./models/userModel"));
const contentModel_1 = __importDefault(require("./models/contentModel"));
const linkModel_1 = __importDefault(require("./models/linkModel"));
const userMiddleware_1 = __importDefault(require("./middlewares/userMiddleware"));
const utils_1 = __importDefault(require("./utils/utils"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET_KEY;
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // ✅ Replace with frontend URL
    credentials: true, // ✅ Allow cookies/auth headers
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.post('/api/v1/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, userPassword } = req.body;
    try {
        console.log(userName + userPassword);
        const user = yield userModel_1.default.findOne({ userName: userName });
        if (!user) {
            userModel_1.default.create({
                userName,
                userPassword
            });
            res.status(200).json({ message: "User Created" });
        }
        else {
            console.log(user);
            console.log("User already exists");
            res.status(200).json({ message: "User already Exist" });
        }
    }
    catch (err) {
        console.log("Chud Gaye Guru!!!");
    }
}));
app.post('/api/v1/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, userPassword } = req.body;
    try {
        const user = yield userModel_1.default.findOne({
            userName,
            userPassword
        });
        if (user) {
            const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET);
            res.cookie('userToken', token, {
                httpOnly: true, // Prevents client-side access to the cookie
                secure: process.env.NODE_ENV === "production", // Use secure cookies in production
                sameSite: "strict", // Helps prevent CSRF attacks
                maxAge: 24 * 60 * 60 * 1000,
            });
            //console.log(req.cookies + "cookies");
            res.status(200).json({ token: token });
        }
        else {
            res.status(301).json({ message: "user not found" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ message: "Chud Gaye Guru!!!" });
    }
}));
app.post('/api/v1/content', userMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, type, title } = req.body;
    console.log(link + " " + type + " " + title);
    //@ts-ignore
    const userId = req.id;
    yield contentModel_1.default.create({
        link,
        type,
        title,
        tag: [],
        userId: userId
    });
    res.status(200).json({ message: "Content Added" });
}));
app.get('/api/v1/content', userMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.id;
    const content = yield contentModel_1.default.find({ userId: userId }).populate("userId", "userName");
    res.json(content);
}));
app.delete('/api/v1/content', userMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.body.contentId;
    //@ts-ignore
    console.log("user : " + req.id);
    //@ts-ignore
    yield contentModel_1.default.deleteOne({ _id: contentId, userId: req.id });
    res.json({ message: "Deleted" });
}));
app.post('/api/v1/share', userMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const share = req.body;
    if (share) {
        //@ts-ignore
        const oldLink = yield linkModel_1.default.findOne({ userId: req.id });
        if (oldLink) {
            // ✅ Update `sharedAt` to the current date & time
            oldLink.sharedAt = new Date();
            yield oldLink.save();
            res.json({
                hash: oldLink.hash
            });
            return;
        }
        // Generate a new hash if no previous link exists
        const hash = (0, utils_1.default)(10);
        yield linkModel_1.default.create({
            //@ts-ignore
            userId: req.id,
            hash: hash,
            sharedAt: new Date() // ✅ Set initial timestamp
        });
        res.json({
            hash: hash
        });
        return;
    }
    else {
        res.json({
            message: "Not shared!!!"
        });
    }
}));
//@ts-ignore
app.get('/api/v1/brain/:shareLink', userMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const str = req.params.shareLink;
        if (!str) {
            return res.status(400).json({ message: "shareLink is required" });
        }
        const link = yield linkModel_1.default.findOne({ hash: str });
        if (!link) {
            return res.status(404).json({ message: "Incorrect share link!!!" });
        }
        // ✅ Fetch only content created BEFORE the link was shared
        const content = yield contentModel_1.default.find({
            userId: link.userId.toString(),
            createdAt: { $lte: link.sharedAt } // ✅ Only fetch content before `sharedAt`
        });
        const user = yield userModel_1.default.findOne({ _id: link.userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            content: content,
            ownerName: user.userName
        });
    }
    catch (error) {
        console.error("Error fetching brain data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
app.listen(3000, () => {
    (0, db_1.default)();
    console.log('Server running on 3000');
});
