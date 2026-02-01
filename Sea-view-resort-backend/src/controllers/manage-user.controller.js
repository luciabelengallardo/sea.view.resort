import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios", error });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, email, role } = req.body;
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;

    await user.save();

    res
      .status(200)
      .json({ message: "Usuario actualizado correctamente", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al actualizar el usuario",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};
