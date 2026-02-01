export const authRole = (allowedRoles) => (req, res, next) => {
  const userRole = req.user.role;

  if (!allowedRoles.includes(userRole)) {
    return res
      .status(403)
      .json({ message: "No tienes permisos para esta acción" });
  }

  return next();
};
