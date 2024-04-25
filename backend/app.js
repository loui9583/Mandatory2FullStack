import express from "express";
import mongoose from "mongoose";
import db from "./db.js";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import { sendLoginMail, sendForgotPasswordEmail } from "./nodemail.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
db();

app.use(cors());
app.use(express.json());

const userSchema = new mongoose.Schema({
    id: String,
    username: String,
    password: String,
    email: String,
    notes: [String]
});

const resend = new Resend(process.env.RESEND_API_KEY);

const UserModel = mongoose.model("users", userSchema);

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.get("/user", authenticateToken, async (req, res) => {
    try {
        const { username } = req.user;
        const user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            Username: user.username,
            id: user._id
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching user data");
    }
});

app.get("/users", authenticateToken, async (req, res) => {
    try {
        const userData = await UserModel.find();
        res.json(userData);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching users");
    }
});

app.post('/users/signup', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new UserModel({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
        });
        await user.save();
        res.status(201).send();
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating user");
    }
});


// ###### 

app.post('/users/changepassword', authenticateToken, async (req, res) => {
    const { username } = req.user;
    try {
        const user = await UserModel.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
        await user.save();
        res.status(201).send(); 
    } catch (error) {
        console.error(error);
        res.status(500).send("Error changing password");
    }
})

app.post("/users/forgotpassword", async (req, res) => {
    const { username } = req.body;
    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            // Informing the user that an email has been sent
            return res.status(200).json({ message: "Reset email sent. Check your inbox (and spam folder)." });
        }

        const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
        sendForgotPasswordEmail(user.email, user.username, token);
        // Informing the user that an email has been sent
        res.status(200).json({ message: "Reset email sent. Check your inbox (and spam folder)." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error occurred. Please try again later." });
    }
})


// ###### 

app.post('/users/addnote', authenticateToken, async (req, res) => {
    const { username } = req.user;
    try {
        const user = await UserModel.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.notes.push(req.body.note);
        await user.save();
        res.status(201).send();
    } catch (error) {
        console.error(error);
        res.status(500).send("Error adding note");
    }
});

app.post('/users/deletenote', authenticateToken, async (req, res) => {
    const { username } = req.user;
    const noteToDelete = req.body.note;

    try {
        const user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the note exists
        const noteIndex = user.notes.indexOf(noteToDelete);
        if (noteIndex === -1) {
            return res.status(404).json({ message: "Note not found" });
        }

        // Remove the note from the user's notes array
        user.notes.splice(noteIndex, 1);

        // Save the updated user object
        await user.save();

        res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting note");
    }
});

app.get("/users/getnotes", authenticateToken, async (req, res) => {
    const { username } = req.user;
    try {
        const user = await UserModel.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ notes: user.notes }); // Return the user's notes
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching notes");
    }
});

app.post("/users/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await UserModel.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ username: user.username }, JWT_SECRET);
        sendLoginMail(user.email, user.username);
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error logging in");
    }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server is running on port", PORT)); 