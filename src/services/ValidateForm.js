export function ValidateForm(form) {
    var childs = form.children 
    // var val = false      
    for(var I = 0; I < childs.length; I++) {                    
        var Value = childs[I].getAttribute('value')                             
        if(Value==="") return false
        if(Value!=="" && I === childs.length-1) return true
    }
}


export function ValidateObject(obj) {
    for (var key in obj) {
        if (obj[key] === null || obj[key] === undefined || obj[key] === "")
            return false
    }
    return true
}