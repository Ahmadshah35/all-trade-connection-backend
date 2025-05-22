const func = require("../functions/admin");
const jwt = require("jsonwebtoken");
const adminModel = require("../models/admin");

const signUpAdmin = async (req, res) => {
  try {
    const validate = await func.validiateAdminEmail(req);

    if (validate) {
      return res
        .status(400)
        .json({ message: "Email already exists", success: false });
    }

    const admin = await func.signUpAdmin(req);
    if (!admin) {
      return res
        .status(400)
        .json({ message: "Admin creation failed", success: false });
    }

    const token = jwt.sign(
      { userId: admin._id, email: admin.email },
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: "5d" }
    );

    const adminWithoutPassword = {
      _id: admin._id,
      email: admin.email,
      isVerified: admin.isVerified,
    };

    return res.status(200).json({
      message: "Successfully created",
      success: true,
      data: adminWithoutPassword,
      token: token,
    });
  } catch (error) {
    console.error("error :", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const validate = await func.validiateAdminEmail(req);
    if (!validate) {
      return res
        .status(400)
        .json({ message: "Email not found", success: false });
    }

    const { password } = req.body;
    const id = validate._id;
    const admin = await func.getAdmin(id);

    if (!admin) {
      return res
        .status(404)
        .json({ message: "Admin not found", success: false });
    }

    const compare = await func.comparePassword(password, admin.password);
    if (!compare) {
      return res
        .status(401)
        .json({ message: "Invalid password", success: false });
    }

    const token = jwt.sign(
      { userId: admin._id, email: admin.email },
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: "5d" }
    );
    const email = admin.email
const verified = await func.isVerifiedAdmin(email)
    const adminWithoutPassword = await adminModel
      .findById(admin._id)
      .select("-password")
      .lean();

    return res.status(200).json({
      message: "Login successful",
      success: true,
      data: adminWithoutPassword,
      token: token,
    });
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};


const resetAdminPassword = async (req, res) => {
  try {
    const validate = await func.validiateAdminEmail(req);

    if (validate) {
      const { newPassword } = req.body;
      const email = validate.email;
      const resetPassword = await func.resetAdminPassword(email, newPassword);

      if (resetPassword) {
        const adminWithoutPassword = await adminModel
          .findById(resetPassword._id)
          .select("-password")
          .lean();
        return res.status(200).json({
          message: "Password updated successfully",
          success: true,
          data: adminWithoutPassword,
        });
      } else {
        return res
          .status(400)
          .json({ message: "Password update failed", success: false });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Invalid email provided", success: false });
    }
  } catch (error) {
    console.error("Password reset failed:", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};

const resetAdminEmail = async (req, res) => {
  try {
    const admin = await func.getAdmin(req);

    if (admin) {
      const { email } = req.body;
      const id = admin._id;
      const resetEmail = await func.updateAdminEmail(id, email);

      if (resetEmail) {
        const adminWithoutPassword = await adminModel
          .findById(resetEmail._id)
          .select("-password")
          .lean();
        return res.status(200).json({
          message: "Email updated successfully",
          success: true,
          data: adminWithoutPassword,
        });
      } else {
        return res
          .status(400)
          .json({ message: "Email update failed", success: false });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Invalid email provided", success: false });
    }
  } catch (error) {
    console.error("Email update failed:", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  signUpAdmin,
  loginAdmin,
  resetAdminPassword,
  resetAdminEmail,
};
