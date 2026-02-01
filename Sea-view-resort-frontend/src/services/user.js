const urlUser = import.meta.env.VITE_APP_USUARIOS;

export const createUser = async(data)=>{
    try {
        const respuesta = await fetch(urlUser,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(data)
        });

        const usuario = {
            data: await respuesta.json(),
            status: respuesta.status
        }

        return usuario

    } catch (error) {
        console.log(error);
    }
}

export const getUser = async()=>{
    try {
        const respuesta = await fetch(urlUser);
        const listaUsuarios = await respuesta.json();
        return listaUsuarios;
    } catch (error) {
        console.log(error)
    }
}

export const loginUsuario = async (dato) => {
    try {
    const respuesta = await fetch(urlUserlogin, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(dato),
    });

    if (respuesta.status !== 200) {
        return false;
    }

    const usuario = {
        data: await respuesta.json(),
        status: respuesta.status,
    };

    return usuario;
    } catch (error) {
console.log(error);
return false;
    }
  };