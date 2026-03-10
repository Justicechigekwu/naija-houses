
import jwt from "jsonwebtoken";

const generateToken = (id, extra = {}) => {
  return jwt.sign({ id, ...extra }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export default generateToken; 