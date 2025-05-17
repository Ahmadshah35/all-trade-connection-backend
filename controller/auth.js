const func = require("../functions/auth");
const funcOtp = require("../functions/otp");
const jwt = require("jsonwebtoken");
const mailer = require("../helper/mailer");
const mongoose = require("mongoose");
const userProfile = require("../models/userProfile");
const proProfile = require("../models/proProfile");
const locationModel = require("../models/location");

const signUp = async (req, res) => {
  try {
    const {
      email,
      firstName,
      lastName,
      phoneNumber,
      address,
      password,
      type,
      image,
      locationName,
      latitude,
      longitude,
      bio,
      includingTheseDays,
      startTime,
      endTime,
      certificate,
      state,
      city,
      zipCode,
    } = req.body;
    if (type === "User") {
      const validate = await func.validiateEmailUser(req);
      if (validate) {
        return res.status(200).json({
          sucess: false,
          message: "Email is Already Taken!",
        });
      } else {
        const images = req.files.image[0].filename;
        const token = jwt.sign(
          {
            email,
            firstName,
            lastName,
            image: images,
            phoneNumber,
            address,
            password,
            type,
            locationName,
            latitude,
            longitude,
            state,
            city,
            zipCode,
          },
          process.env.JWT_SECRET_TOKEN,
          { expiresIn: "1y" }
        );
        const createOtp = await funcOtp.generateOtp(email);

        const userData = {
          email,
          Otp: createOtp.otp,
        };

        const send = await mailer.sendMail(userData);

        return res.status(200).json({
          sucess: true,
          message: "Otp sent Successfully!",
          data: {
            email,
            firstName,
            lastName,
            image: images,
            phoneNumber,
            address,
            type,
            locationName,
            latitude,
            longitude,
            state,
            city,
            zipCode,
            otp: createOtp.otp,
          },
          accessToken: token,
        });
      }
    } else if (type === "Professional") {
      const validate = await func.validiateEmailPro(req);
      if (validate) {
        return res.status(200).json({
          sucess: false,
          message: "Email is Already Taken!",
        });
      } else {
        const certificates = req.files.certificate.map((file) => file.filename);
        const token = jwt.sign(
          {
            email,
            firstName,
            lastName,
            phoneNumber,
            address,
            password,
            type,
            locationName,
            latitude,
            longitude,
            state,
            city,
            zipCode,
            bio,
            includingTheseDays,
            startTime,
            endTime,
            certificate: certificates,
          },
          process.env.JWT_SECRET_TOKEN,
          { expiresIn: "1y" }
        );
        const createOtp = await funcOtp.generateOtp(email);

        const userData = {
          email,
          Otp: createOtp.otp,
        };

        const send = await mailer.sendMail(userData);

        return res.status(200).json({
          sucess: true,
          message: "Otp sent Successfully!",
          data: {
            email,
            firstName,
            lastName,
            phoneNumber,
            address,
            type,
            locationName,
            latitude,
            longitude,
            state,
            city,
            zipCode,
            bio,
            includingTheseDays,
            startTime,
            endTime,
            certificate: certificates,
            otp: createOtp.otp,
          },
          accessToken: token,
        });
      }
    } else {
      return res.status(200).json({
        sucess: false,
        message: "invalid type",
      });
    }
  } catch (error) {
    console.log("Having Errors:", error);
    return res.status(403).json({
      sucess: false,
      message: "Having Errors",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const validate = await func.validiateEmailUser(req);
    if (!validate) {
      const validates = await func.validiateEmailPro(req);
      if (!validates) {
        return res
          .status(200)
          .json({ message: "email not found", sucess: false });
      } else {
        const { password } = req.body;
        const pro = await func.getPro(req);
        if (!pro) {
          return res
            .status(200)
            .json({ message: "professional not found", sucess: false });
        }
        const compare = await func.comparePassword(password, pro.password);
        if (!compare) {
          return res
            .status(200)
            .json({ message: "Invalid password", sucess: false });
        }
        const token = jwt.sign(
          { userId: pro._id, email: pro.email },
          process.env.JWT_SECRET_TOKEN,
          { expiresIn: "5d" }
        );
        const proWithoutPassword = await proProfile
          .findById(pro._id)
          .select("-password")
          // .populate("locations")
          .lean();
        return res.status(200).json({
          status: "successful",
          sucess: true,
          data: proWithoutPassword,
          token: token,
        });
      }
    } else {
      const { password } = req.body;
      const user = await func.getUser(req);
      if (!user) {
        return res
          .status(200)
          .json({ message: "User not found", sucess: false });
      }
      const compare = await func.comparePassword(password, user.password);
      if (!compare) {
        return res
          .status(200)
          .json({ message: "Invalid password", sucess: false });
      }
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET_TOKEN,
        { expiresIn: "5d" }
      );

      const userWithoutPassword = await userProfile
        .findById(user._id)
        .select("-password")
        // .populate("locations")
        .lean();
      return res.status(200).json({
        status: "successful",
        sucess: true,
        data: userWithoutPassword,
        token: token,
      });
    }
  } catch (error) {
    console.error("login failed:", error);
    return res.status(500).json({
      message: "Something went wrong",
      sucess: false,
      error: error.message,
    });
  }
};

const setNewPassword = async (req, res) => {
  try {
    const validiate = await func.validiateEmailUser(req);

    if (!validiate) {
      const validates = await func.validiateEmailPro(req);
      if (!validates) {
        return res
          .status(200)
          .json({ message: "email not found", sucess: false });
      } else {
        const { email, newPassword } = req.body;

        const resetPassword = await func.resetPasswordPro(email, newPassword);
        if (!resetPassword) {
          return res.status(200).json({
            message: "Password reset failed",
            sucess: "false",
          });
        }

        const userWithoutPassword = await proProfile
          .findById(resetPassword._id)
          .select("-password")
          .lean();

        return res.status(200).json({
          message: " Password reset successfully ",
          sucess: true,
          data: userWithoutPassword,
        });
      }
    } else {
      const { email, newPassword } = req.body;

      const resetPassword = await func.resetPasswordUser(email, newPassword);
      if (!resetPassword) {
        return res.status(200).json({
          message: "Password reset failed",
          sucess: "false",
        });
      }

      const userWithoutPassword = await userProfile
        .findById(resetPassword._id)
        .select("-password")
        .lean();

      return res.status(200).json({
        message: "Password reset successfully",
        sucess: true,
        data: userWithoutPassword,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong",
      sucess: false,
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const profile = await func.deleteUser(req);
    if (profile) {
      return res.status(200).json({
        sucess: true,
        message: "user deleted sucessfully",
      });
    } else {
      return res
        .status(200)
        .json({ sucess: false, message: "Can not find any user to delete!" });
    }
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      sucess: false,
    });
  }
};

const deletePro = async (req, res) => {
  try {
    const profile = await func.deletePro(req);
    if (profile) {
      return res.status(200).json({
        sucess: true,
        message: "user deleted sucessfully",
      });
    } else {
      return res.status(200).json({
        sucess: false,
        message: "Can not find any professional to delete!",
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      sucess: false,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { id, password, newPassword } = req.body;

    const validateUser = await func.validiatelUserById(id);
    if (!validateUser) {
      const validatePro = await func.validiatelProById(id);
      if (!validatePro) {
        return res
          .status(200)
          .json({ message: "user not found", sucess: false });
      } else {
        const proPassword = await func.comparePassword(
          password,
          validatePro.password
        );
        if (!proPassword) {
          return res
            .status(200)
            .json({ message: "incorrect Password", sucess: false });
        } else {
          const reset = await func.resetProPasswordById(
            validatePro._id,
            newPassword
          );
          return res
            .status(200)
            .json({ message: " password reset sucessfully", sucess: true });
        }
      }
    } else {
      const userPassword = await func.comparePassword(
        password,
        validateUser.password
      );
      if (!userPassword){
        return res
          .status(200)
          .json({ message: "incorrect Password", sucess: false });
      } else {
        const reset = await func.resetUserPasswordById(
          validateUser._id,
          newPassword
        );
        return res.status(200).json({ message: "password reset sucessfully", sucess:true });
      }
    }
  } catch (error) {
    console.log("error", error);
    return res
      .status(400)
      .json({ message: "something went wrong", sucess: false });
  }
};

module.exports = {
  signUp,
  login,
  setNewPassword,
  deleteUser,
  deletePro,
  resetPassword
};
