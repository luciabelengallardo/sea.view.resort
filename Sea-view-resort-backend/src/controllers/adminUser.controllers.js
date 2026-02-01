import User from "../models/user.model.js";


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -verificationToken -passwordResetToken -passwordResetExpires");
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


export const updateUser = async (req, res) => {
  try {
    const { username, email, role, active } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, role, active },
      { new: true }
    ).select("-password -verificationToken -passwordResetToken -passwordResetExpires");

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


export const toggleUserActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    user.active = !user.active;
    await user.save();

    res.status(200).json({ message: `Usuario ${user.active ? "activado" : "suspendido"}` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
