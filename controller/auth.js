const func = require("../functions/auth");
const funcOtp = require("../functions/otp");
const jwt = require("jsonwebtoken");
const mailer = require("../helper/mailer");
const mongoose = require("mongoose");
const userProfile = require("../models/userProfile");
const proProfile = require("../models/proProfile");
const OtpModel = require("../models/otp");
const locationModel = require("../models/location");

const signUp = async (req, res) => {
  try {
    const { type, email, password } = req.body;
    if (type === "User") {
      const validate = await func.validiateEmailUser(req);
      const validatePro = await func.validiateEmailPro(req);

      if (validate || validatePro) {
        return res.status(200).json({
          success: false,
          message: "Email is Already Taken!",
        });
      } else {
        const token = jwt.sign(
          { email, password, type },
          process.env.JWT_SECRET_TOKEN,
          { expiresIn: "1y" }
        );
        const Otp = Math.floor(100000 + Math.random() * 900000).toString();

        const getOtp = await OtpModel.findOne({ email: email });

        if (getOtp) {
          getOtp.otp = Otp;
          await getOtp.save();
        } else {
          await funcOtp.generateOtp(email, Otp);
        }

        const userData = {
          email,
          Otp: Otp,
        };

        const send = await mailer.sendMail(userData);

        return res.status(200).json({
          success: true,
          message: "Otp sent Successfully!",
          data: { email, type, otp: Otp },
          accessToken: token,
        });
      }
    } else if (type === "Professional") {
      const validate = await func.validiateEmailPro(req);
      const validateUser = await func.validiateEmailUser(req);

      if (validate || validateUser) {
        return res.status(200).json({
          success: false,
          message: "Email is Already Taken!",
        });
      } else {
        const token = jwt.sign(
          { email, password, type },
          process.env.JWT_SECRET_TOKEN,
          { expiresIn: "1y" }
        );
        const Otp = Math.floor(100000 + Math.random() * 900000).toString();

        const getOtp = await OtpModel.findOne({ email: email });

        if (getOtp) {
          getOtp.otp = Otp;
          await getOtp.save();
        } else {
          await funcOtp.generateOtp(email, Otp);
        }

        const userData = {
          email,
          Otp: Otp,
        };

        const send = await mailer.sendMail(userData);

        return res.status(200).json({
          success: true,
          message: "Otp sent Successfully!",
          data: { email, type, otp: Otp },
          accessToken: token,
        });
      }
    } else {
      return res.status(200).json({
        success: false,
        message: "invalid type",
      });
    }
  } catch (error) {
    console.log("Having Errors:", error);
    return res.status(400).json({
      success: false,
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
          .json({ message: "email not found", success: false });
      } else {
        const { password } = req.body;
        const pro = await func.getPro(req);
        if (!pro) {
          return res
            .status(200)
            .json({ message: "professional not found", success: false });
        }
        const compare = await func.comparePassword(password, pro.password);
        if (!compare) {
          return res
            .status(200)
            .json({ message: "Invalid password", success: false });
        }
        const token = jwt.sign(
          { _id: pro._id, email: pro.email, type: pro.type },
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
          success: true,
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
          .json({ message: "User not found", success: false });
      }
      const compare = await func.comparePassword(password, user.password);
      if (!compare) {
        return res
          .status(200)
          .json({ message: "Invalid password", success: false });
      }
      const token = jwt.sign(
        { _id: user._id, email: user.email, type: user.type },
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
        success: true,
        data: userWithoutPassword,
        token: token,
      });
    }
  } catch (error) {
    console.error("login failed:", error);
    return res.status(400).json({
      message: "Something went wrong",
      success: false,
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
          .json({ message: "email not found", success: false });
      } else {
        const { email, newPassword } = req.body;

        const resetPassword = await func.resetPasswordPro(email, newPassword);
        if (!resetPassword) {
          return res.status(200).json({
            message: "Password reset failed",
            success: "false",
          });
        }

        const userWithoutPassword = await proProfile
          .findById(resetPassword._id)
          .select("-password")
          .lean();

        return res.status(200).json({
          message: " Password reset successfully ",
          success: true,
          data: userWithoutPassword,
        });
      }
    } else {
      const { email, newPassword } = req.body;

      const resetPassword = await func.resetPasswordUser(email, newPassword);
      if (!resetPassword) {
        return res.status(200).json({
          message: "Password reset failed",
          success: "false",
        });
      }

      const userWithoutPassword = await userProfile
        .findById(resetPassword._id)
        .select("-password")
        .lean();

      return res.status(200).json({
        message: "Password reset successfully",
        success: true,
        data: userWithoutPassword,
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "something went wrong",
      success: false,
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const profile = await func.deleteUser(req);
    if (profile) {
      return res.status(200).json({
        success: true,
        message: "user deleted sucessfully",
      });
    } else {
      return res
        .status(200)
        .json({ success: false, message: "Can not find any user to delete!" });
    }
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      success: false,
    });
  }
};

const deletePro = async (req, res) => {
  try {
    const profile = await func.deletePro(req);
    if (profile) {
      return res.status(200).json({
        success: true,
        message: "user deleted sucessfully",
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "Can not find any professional to delete!",
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      success: false,
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
          .json({ message: "user not found", success: false });
      } else {
        const proPassword = await func.comparePassword(
          password,
          validatePro.password
        );
        if (!proPassword) {
          return res
            .status(200)
            .json({ message: "incorrect Password", success: false });
        } else {
          const reset = await func.resetProPasswordById(
            validatePro._id,
            newPassword
          );
          return res
            .status(200)
            .json({ message: " password reset sucessfully", success: true });
        }
      }
    } else {
      const userPassword = await func.comparePassword(
        password,
        validateUser.password
      );
      if (!userPassword) {
        return res
          .status(200)
          .json({ message: "incorrect Password", success: false });
      } else {
        const reset = await func.resetUserPasswordById(
          validateUser._id,
          newPassword
        );
        return res
          .status(200)
          .json({ message: "password reset sucessfully", success: true });
      }
    }
  } catch (error) {
    console.log("error", error);
    return res
      .status(400)
      .json({ message: "something went wrong", success: false });
  }
};

module.exports = {
  signUp,
  login,
  setNewPassword,
  deleteUser,
  deletePro,
  resetPassword,
};
