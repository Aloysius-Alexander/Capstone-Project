import express from "express";
import cookieParser from "cookie-parser"; 
import dotenv from "dotenv";
import { connect } from "../configs/db.js";
import  userRouter  from "../routes/userRoutes.js";
import adminRouter from "../routes/adminRoutes.js";
import cors from "cors";


dotenv.config();

const app = express();
console.log(process.env.PORT)
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.get('/check-cookie', (req, res) => {
    const token = req.cookies.token;
    res.send(`Token from cookie: ${token}`);
})
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);


connect();

app.get("/", (req, res) => {
    res.send("hello world!");
})

app.listen(port, () => {
    console.log(`App listening to port : ${port}`);
});