import axios from 'axios';

const getAllProducts = async (url) => {
    let productos = await fetch(`${url}/api/product`)
                                .then(response => (
                                response.json()
                                ))
                                .then(data => {
                                    if(!data.message){
                                        let response = data.map(prod => {
                                            prod.imageUrl = `${url}/${prod.imagePath}`;
                                            prod.esPackage = false;
                                            return prod;
                                            });
                                        return response;
                                    }
                                    else{
                                        return null;
                                    }
                                })
                                .catch(err => console.log(err));
    return productos;
};

const getProductsByCompany = async (url, id) => {
    let productos = await fetch(`${url}/api/product/company/${id}`)
                            .then(response => (
                                response.json()
                            ))
                            .then(data => {
                                // console.log('data', data);
                                if(data){ //ver que pasa aca
                                    let response = data.map(prod => {
                                        prod.imageUrl = `${url}/${prod.imagePath}`;
                                        prod.esPackage = false;
                                        return prod;
                                    });
                                    return response;
                                }
                                else{
                                    return null;
                                }                                
                            })
                            .catch(err => console.log(err));
    return productos;
};

const getProductById = async (url, id) =>{
    let producto = await fetch(`${url}/api/product/${id}`)
                                .then(response => (
                                  response.json()
                                ))
                                .then(data => {
                                  // console.log('data', data);
                                  /*let response = data.map(prod => {
                                              prod.imageUrl = `${url}/${prod.imagePath}`;
                                              return prod;
                                            });
                                  return response;*/
                                  data.imageUrl = `${url}/${data.imagePath}`;
                                  return data;
                                })
                                .catch(err => console.log(err));
      return producto;
};

const getCompanyProductsByProduct = async (url, id) => {
    let productos = await fetch(`${url}/api/product/${id}/companies`)
                                .then(response => (
                                  response.json()
                                ))
                                .then(data => {
                                  // console.log('data', data);
                                  let response = data.map(prod => {
                                              prod.imageUrl = `${url}/${prod.imagePath}`;
                                              prod.esPackage = false;
                                              return prod;
                                            });
                                  return response;
                                })
                                .catch(err => console.log(err));
    return productos;
};

const getNotAssociated = async(url, id) => {
    let productos = await fetch(`${url}/api/product/company/${id}/notassociated`)
                            .then(response => (response.json()))
                            .then(data => {
                            // console.log('data', data);
                            let response = data.map(prod => {
                                        prod.imageUrl = `${url}/${prod.imagePath}`;
                                        prod.esPackage = false;
                                        return prod;
                                        });
                            return response;
                            })
                            .catch(err => console.log(err));
    return productos;
}

const registroProducto = async (url, token, request) => {

    let response = await axios({
        method: 'post',
        url: `${url}/api/product/company`,
        headers: { 'Content-Type': 'application/json', token: token },
        data: request
    })
    .then(res => {
        if (res) return { status: res.status, message: res.data.message, producto: res.data.product };
        else return{status: 500, message: 'Ocurrio un error al procesar la solicitud'};
    })
    .catch(err => {
        console.log(`Error al dar de alta el producto ${err}`);
        return {status: 500, message: err};
    });

    return response;
};

const asociarProducto = async (url, token, request) => {

    let response = await axios({
        method: 'post',
        url: `${url}/api/product/associate`,
        headers: { 'Content-Type': 'application/json', token: token },
        data: request
    })
    .then(res => {
        if (res) return { status: res.status, message: res.data.message, producto: res.data.product };
        else return{status: 500, message: 'Ocurrio un error al procesar la solicitud'};
    })
    .catch(err => {
        console.log(`Error al asociar el producto ${err}`);
        return {status: 500, message: err};
    });

    return response;
};

const modificarProducto = async (url, token, request, productId, companyId) => {

    let response = await axios({
        method: 'put',
        url: `${url}/api/product/${productId}/company/${companyId}`,
        headers: { 'Content-Type': 'application/json', token: token },
        data: request
    })
    .then(res => {
        if (res) return { status: res.status, message: res.data.message, producto: res.data.product };
        else return{status: 500, message: 'Ocurrio un error al procesar la solicitud'};
    })
    .catch(err => {
        console.log(`Error al modificar el producto ${err}`);
        return {status: 500, message: err};
    });

    return response;
};

const eliminarProducto = async (url, token, id) =>{
    let request = new Request(`${url}/api/product/company/${id}`, {
        method: 'DELETE',
        headers: new Headers({ 'Content-Type': 'application/json', token: token})
        });

        let status;
        let message = await fetch(request)
                        .then((response) => {
                            status = response.status
                            return response.json();
                        })
                        .then(data => {
                            if(data) return data.message;
                            else return null;
                        })
                        .catch(err => {
                            console.log(`Error al eliminar producto : ${err}`);
                        });
    return { status, message };
};

const registroProductosBulk = (url, token, request) => {
    if(token){
        let instance = axios.create({
            baseURL: `${url}/api/product/bulk`,
            method: 'post',
            headers: {token: token},
            data: request
        });

        instance()
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
    }
    else{
        console.log('No hay token');
        return null;
    }
};

export default {
    getAllProducts,
    getProductsByCompany,
    // getProductCategories,
    registroProducto,
    asociarProducto,
    modificarProducto,
    eliminarProducto,
    getProductById,
    getCompanyProductsByProduct,
    getNotAssociated,
    registroProductosBulk
}