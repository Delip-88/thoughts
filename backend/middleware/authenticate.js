import jwt from "jsonwebtoken";

export const authenticate = async (req, res, next) => {
  const token = req.cookies.authToken;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded; // Attach user to request
    } catch (err) {
      console.log("Invalid Token")
    }
  }
  next() // Continue even if there's no token
};
