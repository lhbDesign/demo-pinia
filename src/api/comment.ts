
function getUrl(){
  return new Promise((resolve,reject)=>{
    resolve({name:'JACK'}),
    reject({msg:"failed"})
  })
}

export default getUrl