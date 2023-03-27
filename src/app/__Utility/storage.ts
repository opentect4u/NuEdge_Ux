export class storage{
  static get  get_scmDtls(){
    return JSON.parse(localStorage.getItem('__scmDtls'));
  }
  static set set__scmDtls(__dt){
    localStorage.setItem('__scmDtls',JSON.stringify(__dt))
  }

}
