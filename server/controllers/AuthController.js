import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

const maxAge = 3 * 24 * 60 * 60; // in seconds

const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge });
};

export const signup = async (request, response, next) => {
    console.log("Incoming Signup Request");
    try {
        console.log("Request Body:", request.body);
        const { username, email, password } = request.body;

        if (!email || !password || !username) {
            return response.status(400).json({ error: "Username, email, and password are required." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("Email already exists");
            return response.status(409).json({ error: "Email is already in use." });
        }
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            console.log("Username already exists");
            return response.status(409).json({ error: "Username is already in use." });
        }

        const user = await User.create({ username, email, password });

        const token = createToken(user.email, user._id);
        response.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        });

        return response.status(201).json({
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                profileSetup: user.profileSetup || false,
            },
        });
    } catch (error) {
        console.error("Signup Error:", error.message);
        return response.status(500).json({ error: error.message || "Internal Server Error" });
    }
};

export const login = async (request, response, next) => {
    console.log("Incoming Signup Request");
    try {
        console.log("Request Body:", request.body);
        const { username, password } = request.body;

        if (!password || !username) {
            return response.status(400).json({ error: "Username and Password are required." });
        }

        const user = await User.findOne({username});
        
        if(!user){
            return response.status(404).send("User with the given username not found");
        }

        const auth = await compare(password,user.password)
        if (!auth){
            return response.status(400).json({ error: "Password is incorrect"}) 
        }
        const token = createToken(user.email, user._id);
        
        response.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        });

        return response.status(201).json({
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                profileSetup: user.profileSetup || false,
            },
        });
    } catch (error) {
        console.error("Signup Error:", error.message);
        return response.status(500).json({ error: error.message || "Internal Server Error" });
    }
};
