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
            message: "Otp verified sucessfully for resetPassword User ",
            success: true,
          });
       
         
        } else {
          const validatePro = await userFunc.validiateEmailPro(req);
          if(validatePro){
            const deleteOtp = await otpFunc.deleteOtp(req);
            res.status(200).json({
              message: "Otp verified sucessfully for resetPassword professional ",
              success: true,
            });
          }else{
            res.status(200).json({
              message: "email not found for resset password ",
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
            const token = jwt.sign(
              {
                id: user._id,
                email: user.email,
                userName: user.userName,
              },
              process.env.JWT_SECRET_TOKEN,
              { expiresIn: "1y" }
            );
            const deleteOtp = await otpFunc.deleteOtp(req);
            return res.status(200).json({
              message: "sucessfully verify",
              success: true,
              data: {
                id: user._id,
                email: user.email,
                userName: user.userName,
                type: user.type,
                profileCreated:user.profileCreated
                
              },
              accessToken: token,
            });
          }
        } else {
          if (type === "Professional") {
            const validate = await userFunc.validiateEmailPro(req);
            if (validate) {
              res.status(200).json({ message: "already signUp", success: true });
            } else {
              const decode = jwt.verify(
                addSignUpToken,
                process.env.JWT_SECRET_TOKEN
              );
              const pro = await userFunc.SignUpPro(decode);
              const email = pro.email;
              const verify = await userFunc.isVerifiedPro(email);
              const token = jwt.sign(
                {
                  id: pro._id,
                  email: pro.email,
                  userName: pro.userName,
                },
                process.env.JWT_SECRET_TOKEN,
                { expiresIn: "1y" }
              );
              const deleteOtp = await otpFunc.deleteOtp(req);
              return res.status(200).json({
                message: "sucessfully verify",
                success: true,
                data: {
                  id: pro._id,
                  email: pro.email,
                  userName: pro.userName,
                  type: pro.type,
                  profileCreated:pro.profileCreated
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
