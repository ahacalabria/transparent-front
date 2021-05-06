const toUrlEncoded = obj => Object.keys(obj).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&')
const config = require('../config') 

export function PostData(type, userData, form) {
    // let BaseURL = 'https://api.thewallscript.com/restful/'
    let BaseURL = config.server_url

    // method_param = (!method_param)?'POST':method_param
    let token_saved = sessionStorage.getItem("token")

    if(form){
      const resultados = {}
      return new Promise((resolve, reject) =>{
        fetch(BaseURL+type, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'token': token_saved
            },
            body: toUrlEncoded(userData)
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
            method: 'POST',
            headers: {
              // 'Content-Type': 'application/x-www-form-urlencoded',
              // 'token': token_saved
            },
            body: JSON.stringify(userData)
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