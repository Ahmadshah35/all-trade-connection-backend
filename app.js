const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const app = express();
const path = require("path");
const connectDb = require("./config/configDb");
const PORT = process.env.PORT
const Router = require("./routes/route");

app.use(cors());
app.use(express.json());

app.use("/", express.static(path.resolve(__dirname, "./public/profile")));
app.use("/", express.static(path.resolve(__dirname, "./public/project")));
// app.use("/", express.static(path.resolve(__dirname, "./public/proProfile")));

app.use("/api/user", Router);


const start = () => {
  try {
    connectDb();
    app.listen(PORT, () => {
        console.log(`Server is Running on PORT: ${PORT}`);
    })
  } catch (error) {
    console.log(`Having Errors Running On Port : ${PORT}`)
  }  
};

start();
