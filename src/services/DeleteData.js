// const toUrlEncoded = obj => Object.keys(obj).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&')
const config = require('../config')        
export function DeleteData(type, userData, form) {
    // let BaseURL = 'https://api.thewallscript.com/restful/'
    let BaseURL = config.server_url

    let method_param = 'DELETE'//(!method_param)?'POST':method_param
    let token_saved = sessionStorage.getItem("token")

    if(form){
      const resultados = {}
      return new Promise((resolve, reject) =>{
        fetch(BaseURL+type, {
            method: method_param,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'token': token_saved
            },
            data: JSON.stringify(userData)
          })
          .then((response) => {
            resultados.status = response.status
            return response.json()
          })
          .then((res) => {
            if(resultados.status>201) reject(res)
            resolve(res)
          })
          .catch((err) => {            
            reject({error: err, status: resultados.status})
          })
      })  
    }

    return new Promise((resolve, reject) =>{
    
         
        fetch(BaseURL+type, {
            method: method_param,
            headers: {
              // 'Content-Type': 'application/x-www-form-urlencoded',
              'token': token_saved
            },
            data: JSON.stringify(userData)
          })
          .then((response) => response.json())
          .then((res) => {
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })

  
      })
}