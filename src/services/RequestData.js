// import {Redirect} from 'react-router-dom'
const toUrlEncoded = obj => Object.keys(obj).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&')
const config = require('../config') 

export function RequestData(route, data, method_param) {
    let endpoint = config.server_url+route

    method_param = (!method_param)?'POST':method_param
    let token_saved = sessionStorage.getItem("token")
    let http_header = {}
    if(method_param==="POST" || method_param==="post" || method_param==="PUT" || method_param==="put" || method_param==="DELETE" || method_param==="delete")
        http_header = {
            method: method_param,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'token': token_saved
            },
            body: toUrlEncoded(data)
        }
    else 
        http_header = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'token': token_saved
            },
            data: JSON.stringify(data)
        }
      const resultados = {}
      return new Promise((resolve, reject) =>{
        fetch(endpoint, http_header)
          // .then(function(response) {
          //     if (!response.ok) {
          //         throw Error(response.statusText);
          //     }
          //     return response;
          // })
          .then((response) => {
            resultados.status = response.status
            return response.json()
          })
          .then((res) => {
            if(resultados.status>201) reject({error: res, status: resultados.status})
            resolve(res)
          })
          .catch((err) => {      
            reject({error: err, status: resultados.status})
          })
      })  
}
export async function handleRequest(route, data, method_param, obj_name, component) {
  try {
    component.setState({isLoading: true})
    const result = await RequestData(route, data, method_param)  
    if(obj_name!==null){
      component.setState({[obj_name]: result, isLoading: false})
    }else {
      component.setState({isLoading: false})
      return result
    }
  } catch (error) {
    console.log('error',error)
    if(error.status === 401) document.getElementById('logoutBtn').click()
    handleErrors(error,component)
    component.setState({isLoading: false})
  }
}

function handleErrors(error,component){
  if(error.status===500){
    console.log('error',error)
    component.props.alert.error('Houve um probleminha no servidor.')
  }else{
    if(error.error){
      if(Array.isArray(error.error)){
        loopErros(error.error,component)
      }
    }else{
      if(Array.isArray(error)){
        loopErros(error,component)
      }else{
        component.props.alert.error(error)
      }
    }
  }
}

function loopErros(list,component){
  list.map((v,i) => {
    component.props.alert.error(v.message||v.error||v)
    return null
  })
}
