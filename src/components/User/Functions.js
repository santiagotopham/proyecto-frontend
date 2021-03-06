import axios from 'axios';

const getUserById = async (url, id) => {
    let usuario = await fetch(`${url}/api/user/${id}`)
              .then(res => (
                res.json()
              ))
              .then(data => {
                return data;
              })
              .catch(err => {
                console.log(`Error al buscar Usuario : ${err}`);
              });
    return usuario;
};

const modificarPerfil = async (url, token, userId, companyId, request) => {
    let response = await axios({
        method: 'put',
        url: `${url}/api/auth/update/user/${userId}/company/${companyId}`,
        headers: { 'Content-Type': 'application/json', token: token },
        data: request
    })
    .then(res => {
        if (res) return { status: res.status, message: res.data.message };
        else return{status: 500, message: 'Ocurrio un error al procesar la solicitud'};
    })
    .catch(err => {
        console.log('entro a catch', err.response)
        if(err.response.data.message) return {status: err.response.status, errores: err.response.data.message};
        return {status: err.response.status, errores: err.response.data};
    });

    return response;
};

export default {
    getUserById,
    modificarPerfil
}