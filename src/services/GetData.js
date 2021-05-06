// const toUrlEncoded = obj => Object.keys(obj).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&');
const config = require('../config')        
export async function GetData (type, userData, form) {
    // let BaseURL = 'https://api.thewallscript.com/restful/';
    let BaseURL = config.server_url;

    let method_param = 'GET'//(!method_param)?'POST':method_param;
    let token_saved = sessionStorage.getItem("token");

    if(form){
        // try {
        //   const response = await fetch(BaseURL+type, {
        //     method: method_param,
        //     headers: {
        //       'Content-Type': 'application/x-www-form-urlencoded',
        //       'token': token_saved
        //     },
        //     data: JSON.stringify(userData)
        //   })
        //   const json = await response.json();
        //   if(response.status > 201) throw(json)
        //   else return json
        // } catch (error) {
        //   console.log(error)
          
        //   throw(error)
        // }
        const resultados = {}
      return new Promise((resolve, reject) =>{
        fetch(BaseURL+type, {
            method: 'GET',
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
            if(resultados.status>201) reject({error: res, status: resultados.status})
            resolve(res)
          })
          .catch((err) => {            
            reject({error: err, status: resultados.status})
          })
      })  
      // }
    // }
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
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });

  
      });
}