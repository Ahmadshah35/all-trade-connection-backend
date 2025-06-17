const { default: mongoose } = require("mongoose");
const func = require("../functions/otp");
const jwt = require("jsonwebtoken");
const userFunc = require("../functions/auth");
const mailer = require("../helper/mailer");
const otpFunc = require("../functions/otp");
const locationFunc = require("../functions/location");

const verifyOtp = async (req, res) => {
  try {
    const verify = await func.verifyOtp(req);
    if (verify) {
      const { addSignUpToken, type } = req.body;
      if (!addSignUpToken) {
        const validate = await userFunc.validiateEmailUser(req);
        if (validate) {
          const deleteOtp = await otpFunc.deleteOtp(req);
          res.status(200).json({
            message: "Otp verified sucessfully for resetPassword User",
            success: true,
          });
        } else {
          const validatePro = await userFunc.validiateEmailPro(req);
          if (validatePro) {
            const deleteOtp = await otpFunc.deleteOtp(req);
            res.status(200).json({
              message:
                "Otp verified sucessfully for resetPassword professional",
                success: true,
            });
          } else {
            res.status(200).json({
              message: "email not found for resset password",
              success: false,
            });
          }
        }
      } else {
        if (type === "User") {
          const validate = await userFunc.validiateEmailUser(req);
          if (validate) {
            res.status(200).json({ message: "already signUp", success: true });
          } else {
            const decode = jwt.verify(
              addSignUpToken,
              process.env.JWT_SECRET_TOKEN
            );
            const user = await userFunc.signUpUser(decode);
            const email = user.email;
            const verify = await userFunc.isVerifiedUser(email);
            const userProfileId = user._id;
            const location = await locationFunc.createLocationByOtp(
              decode,
              userProfileId,
              null
            );
            const token = jwt.sign(
              {
                _id: user._id,
                email: user.email,
              },
              process.env.JWT_SECRET_TOKEN,
              { expiresIn: "1y" }
            );
            const deleteOtp = await otpFunc.deleteOtp(req);
            return res.status(200).json({
              message: "sucessfully verify",
              success: true,
              data: {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName || null,
                image: user.image,
                phoneNumber: user.phoneNumber,
                address: user.address,
                type: user.type,
                currentLocation: user.currentLocation,
                locationName: user.locationName,
                latitude: user.latitude,
                longitude: user.longitude,
                state: user.state,
                city: user.city,
                zipCode: user.zipCode,
                isVerified: verify.isVerified,
                profileCreated: user.profileCreated,
              },
              accessToken: token,
            });
          }
        } else {
          if (type === "Professional") {
            // console.log("data",req.body)
            const validate = await userFunc.validiateEmailPro(req);
            if (validate) {
              res.status(200).json({ message: "already signUp", success: true });
            } else {
              const decode = jwt.verify(
                addSignUpToken,
                process.env.JWT_SECRET_TOKEN
              );
              // console.log("data",req.body)
              const pro = await userFunc.SignUpPro(decode);
              const email = pro.email;
              const verify = await userFunc.isVerifiedPro(email);
              const proProfileId = pro._id;
              const location = await locationFunc.createLocationByOtp(
                decode,
                null,
                proProfileId
              );
              const token = jwt.sign(
                {
                  id: pro._id,
                  email: pro.email,
                  firstName: pro.firstName,
                },
                process.env.JWT_SECRET_TOKEN,
                { expiresIn: "1y" }
              );
              const deleteOtp = await otpFunc.deleteOtp(req);
              return res.status(200).json({
                message: "sucessfully verify",
                success: true,
                data: {
                  _id: pro._id,
                  email: pro.email,
                  firstName: pro.firstName,
                  lastName: pro.lastName || null,
                  image : pro.image, 
                  phoneNumber: pro.phoneNumber,
                  address: pro.address,
                  type: pro.type,
                  currentLocation: pro.currentLocation,
                  locationName: pro.locationName,
                  latitude: pro.latitude,
                  longitude: pro.longitude,
                  category:pro.category,
                  state: pro.state,
                  city: pro.city,
                  zipCode: pro.zipCode,
                  bio: pro.bio,
                  includingTheseDays: pro.includingTheseDays,
                  startTime: pro.startTime,
                  endTime: pro.endTime,
                  certificate: pro.certificate,
                  isVerified: verify.isVerified,
                  profileCreated: pro.profileCreated,
                },
                accessToken: token,
              });
            }
          } else {
            res.status(200).json({ message: "invalid Type", success: false });
          }
        }
      }
    } else {
      res.status(200).json({ message: "invalid Otp", success: false });
    }
  } catch (error) {
    console.log("Error :", error);
    res.status(400).json({
      message: "somrthing went wrong",
      success: false,
      error: error.message,
    });
  }
};

const verify = async (req, res) => {
  try {
    const verify = await func.verifyOtp(req, session);
    if (verify) {
     return res.status(200).json({
        message: "sucessfully verify",
        success: true,
        data: verify,
      });

      
    } else {
      res.status(200).json({ message: "invalid Otp", success: false });
    }
  } catch (error) {
    console.log("Error :", error);
    res.status(400).json({
      message: "somrthing went wrong",
      success: false,
      error: error.message,
    });
  }
};

const resendOtp = async (req, res) => {
  try {
    // const resendOtp = await func.resendOtp(req);

    const email = req.body.email;
    const getUser = await userFunc.getUser(req);
    if (!getUser) {
      const getPro = await userFunc.getPro(req);
      if (!getPro) {
        res.status(200).json({
          message: "email not found",
          success: false,
        });
      } else {
        const gen = await func.generateOtp(email);
        const userData = {
          email: req.body.email,
          Otp: gen.otp,
        };
        const send = await mailer.sendMail(userData);
        const _id = getPro._id;
        res
          .status(200)
          .json({
            message: "sucessfully otp  sent",
            success: true,
            data: { ...userData, _id },
          });
      }
    } else {
      const gen = await func.generateOtp(email);
      const userData = {
        email: req.body.email,
        Otp: gen.otp,
      };
      const send = await mailer.sendMail(userData);
      const _id = getUser._id;
      res
        .status(200)
        .json({
          message: "sucessfully otp  sent",
          success: true,
          data: { ...userData, _id },
        });
    }
  } catch (error) {
    res.status(400).json({
      message: "somrthing went wrong",
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  verifyOtp,
  resendOtp,
  verify,
};
