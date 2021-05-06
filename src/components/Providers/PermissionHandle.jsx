export function hasGroup(groupName) {
    let user = JSON.parse(sessionStorage.getItem("user"))
    const res = user.grupos.filter(gr => gr.nome_grupo === groupName)
    return (res.length>0) ? true : false
}
export function hasAtLeastOneGroup(groupsName) {
  return groupsName.some(gp => hasGroup(gp))
}

