import jwt from "jsonwebtoken";
const generateToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRETKEY, {
    expiresIn: "90d",
  });

  return token;
};

export default generateToken;
