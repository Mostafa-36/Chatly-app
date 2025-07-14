const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    maxAge: 90 * 24 * 60 * 60 * 1000,
  });
};

export default setTokenCookie;
