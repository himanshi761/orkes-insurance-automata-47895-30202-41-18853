import jwt from "jsonwebtoken";

export const gentoken = async (user) => {
  try {
    let token = jwt.sign(
      {
        userId: user._id,
        role: user.role, // 🔥 ADD THIS
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return token;

  } catch (error) {
    console.log("Token Error");
  }
};