import generateToken from "../util/generateToken.mjs";

export const googleAuthSuccess = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "No user authenticated" })

  const token = generateToken(req.user);

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 1000
  });

  // res.status(200).json({
  //   message: "Login Successful",
  //   user: {
  //     id: req.user._id,
  //     name: req.user.name,
  //     email: req.user.email,
  //     avatar: req.user.avatar,
  //     role: req.user.role
  //   }
  // });

  const redirectPath = req.user.role === 'admin' ? "/admin" : "/";

  res.redirect(`${process.env.FRONTEND_URL}${redirectPath}`);
};

export const googleAuthFailure = (req, res) => {
  res.status(401).json({ message: "Google authentication failed" });
};

export const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" })
}