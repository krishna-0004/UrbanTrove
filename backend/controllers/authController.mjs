import generateToken from "../util/generateToken.mjs";

export const googleAuthSuccess = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "No user authenticated" });

  const token = generateToken(req.user);

  // ✅ Cookie fix for CORS + cross-site
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,               // ✅ must be true in production (HTTPS)
    sameSite: "None",           // ✅ must be "None" for cross-origin
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const redirectPath = req.user.role === "admin" ? "/admin" : "/";
  return res.redirect(`${process.env.FRONTEND_URL}${redirectPath}`);
};

export const googleAuthFailure = (req, res) => {
  res.status(401).json({ message: "Google authentication failed" });
};

export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.status(200).json({ message: "Logged out successfully" });
};
