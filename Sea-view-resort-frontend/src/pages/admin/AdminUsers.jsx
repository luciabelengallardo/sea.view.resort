// import React, { useState, useEffect } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import axios from "axios";

// export default function AdminUsers() {
//   const [users, setUsers] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);
//   const [formData, setFormData] = useState({ username: "", email: "", role: "user", active: true });
//   const [confirmData, setConfirmData] = useState({ open: false, action: null, message: "" });

//   const API_URL = "http://localhost:3000/api/admin/users";

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const { data } = await axios.get(API_URL);
//       setUsers(data);
//     } catch (err) {
//       console.error(err);
//       toast.error("Error al cargar usuarios");
//     }
//   };

//   const openModal = (user = null) => {
//     if (user) {
//       setEditingUser(user);
//       setFormData({
//         username: user.username,
//         email: user.email,
//         role: user.role,
//         active: user.active,
//       });
//     } else {
//       setEditingUser(null);
//       setFormData({ username: "", email: "", role: "user", active: true });
//     }
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
//   };

//   const handleSave = () => {
//     if (!formData.username.trim() || !formData.email.trim()) {
//       toast.error("Completa todos los campos obligatorios");
//       return;
//     }

//     setConfirmData({
//       open: true,
//       message: "¿Deseas guardar los cambios?",
//       action: async () => {
//         try {
//           if (editingUser) {
//             const { data } = await axios.put(`${API_URL}/${editingUser._id}`, formData);
//             setUsers(users.map(u => (u._id === editingUser._id ? data : u)));
//             toast.success("Usuario actualizado");
//           } else {
//             const { data } = await axios.post(API_URL, formData);
//             setUsers([...users, data]);
//             toast.success("Usuario agregado");
//           }
//           setIsModalOpen(false);
//         } catch (err) {
//           console.error(err);
//           toast.error("Error guardando usuario");
//         }
//       },
//     });
//   };

//   const handleToggleActive = (id) => {
//     setConfirmData({
//       open: true,
//       message: "¿Deseas cambiar el estado del usuario?",
//       action: async () => {
//         try {
//           const { data } = await axios.patch(`${API_URL}/${id}/suspend`);
//           setUsers(users.map(u => (u._id === id ? { ...u, active: !u.active } : u)));
//           toast.success(data.message);
//         } catch (err) {
//           console.error(err);
//           toast.error("Error cambiando estado");
//         }
//       },
//     });
//   };

//   const handleDelete = (id) => {
//     setConfirmData({
//       open: true,
//       message: "¿Seguro que deseas eliminar este usuario?",
//       action: async () => {
//         try {
//           await axios.delete(`${API_URL}/${id}`);
//           setUsers(users.filter(u => u._id !== id));
//           toast.error("Usuario eliminado");
//         } catch (err) {
//           console.error(err);
//           toast.error("Error eliminando usuario");
//         }
//       },
//     });
//   };

//   return (
//     <div className="container py-8">
//       <Toaster position="top-right" />
//       <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>

//       <button
//         onClick={() => openModal()}
//         className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//       >
//         + Agregar Usuario
//       </button>

//       <div className="overflow-x-auto hidden md:block">
//         <table className="min-w-full bg-white rounded-lg shadow">
//           <thead>
//             <tr className="bg-gray-100 text-left">
//               <th className="py-3 px-4">Nombre</th>
//               <th className="py-3 px-4">Email</th>
//               <th className="py-3 px-4">Rol</th>
//               <th className="py-3 px-4">Activo</th>
//               <th className="py-3 px-4">Acciones</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map(user => (
//               <tr key={user._id} className="border-t">
//                 <td className="py-3 px-4">{user.username}</td>
//                 <td className="py-3 px-4">{user.email}</td>
//                 <td className="py-3 px-4">{user.role}</td>
//                 <td className="py-3 px-4">{user.active ? "Sí" : "No"}</td>
//                 <td className="py-3 px-4">
//                   <div className="flex flex-col gap-2 w-max">
//                     <button onClick={() => openModal(user)} className="bg-gray-600 text-white px-3 py-1 rounded hover:opacity-90">Editar</button>
//                     <button onClick={() => handleToggleActive(user._id)} className="bg-yellow-600 text-white px-3 py-1 rounded hover:opacity-90">{user.active ? "Suspender" : "Activar"}</button>
//                     <button onClick={() => handleDelete(user._id)} className="bg-red-600 text-white px-3 py-1 rounded hover:opacity-90">Borrar</button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="grid gap-4 md:hidden">
//         {users.map(user => (
//           <div key={user._id} className="bg-white rounded-lg shadow p-4">
//             <h3 className="text-lg font-bold">{user.username}</h3>
//             <p className="text-gray-600">Email: {user.email}</p>
//             <p className="text-gray-500">Rol: {user.role}</p>
//             <p className="text-gray-500">Activo: {user.active ? "Sí" : "No"}</p>
//             <div className="mt-3 flex space-x-2">
//               <button onClick={() => openModal(user)} className="flex-1 bg-gray-600 text-white px-3 py-2 rounded hover:opacity-90 text-sm">Editar</button>
//               <button onClick={() => handleToggleActive(user._id)} className="flex-1 bg-yellow-600 text-white px-3 py-2 rounded hover:opacity-90 text-sm">{user.active ? "Suspender" : "Activar"}</button>
//               <button onClick={() => handleDelete(user._id)} className="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:opacity-90 text-sm">Borrar</button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
//           <div className="bg-white p-6 rounded-lg shadow w-full max-w-md">
//             <h2 className="text-xl font-bold mb-4">{editingUser ? "Editar Usuario" : "Agregar Usuario"}</h2>
//             <input
//               type="text"
//               name="username"
//               placeholder="Nombre"
//               value={formData.username}
//               onChange={handleChange}
//               className="w-full border p-2 rounded mb-3"
//             />
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full border p-2 rounded mb-3"
//             />
//             <select
//               name="role"
//               value={formData.role}
//               onChange={handleChange}
//               className="w-full border p-2 rounded mb-3"
//             >
//               <option value="user">Usuario</option>
//               <option value="admin">Administrador</option>
//             </select>
//             <label className="flex items-center gap-2 mb-3">
//               <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} />
//               Activo
//             </label>

//             <div className="flex justify-end gap-2">
//               <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
//               <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {confirmData.open && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
//           <div className="bg-white p-6 rounded-lg shadow w-full max-w-md">
//             <h3 className="text-lg">{confirmData.message}</h3>
//             <div className="flex justify-end gap-2 mt-4">
//               <button
//                 onClick={() => setConfirmData({ open: false, action: null, message: "" })}
//                 className="bg-gray-500 text-white px-4 py-2 rounded"
//               >
//                 Cancelar
//               </button>
//               <button
//                 onClick={() => {
//                   confirmData.action();
//                   setConfirmData({ open: false, action: null, message: "" });
//                 }}
//                 className="bg-red-600 text-white px-4 py-2 rounded"
//               >
//                 Confirmar
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
