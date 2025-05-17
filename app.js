const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const app = express();
const path = require("path");
const connectDb = require("./config/configDb");
const PORT = process.env.PORT

const Router = require("./routes/route");
// const profileRouter = require("./routes/profile");
// const locationRouter = require("./routes/location");
// const projectRouter = require("./routes/project");
// const reviewRouter = require("./routes/review");
// const reportRouter = require("./routes/report");
// const proProfileRouter = require("./routes/proProfile");
// const proposalRouter = require("./routes/proposal");
// const otpRouter = require("./routes/otp");
// const notificationRouter = require("./routes/notification");

app.use(cors());
app.use(express.json());

app.use("/", express.static(path.resolve(__dirname, "./public/profile")));
// app.use("/", express.static(path.resolve(__dirname, "./public/project")));
// app.use("/", express.static(path.resolve(__dirname, "./public/proProfile")));

app.use("/api/user", Router);
// app.use("/api/user", profileRouter);
// app.use("/api/user", locationRouter);
// app.use("/api/user", projectRouter);
// app.use("/api/user", reviewRouter);
// app.use("/api/user", reportRouter);
// app.use("/api/user", proProfileRouter);
// app.use("/api/user", proposalRouter);
// app.use("/api/user", otpRouter);
// app.use("/api/user", notificationRouter);


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
