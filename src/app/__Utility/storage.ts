
export class storage{
  static get  get_scmDtls(){
    return JSON.parse(localStorage.getItem('__scmDtls'));
  }
  static set set__scmDtls(__dt){
    console.log(__dt);
    localStorage.setItem('__scmDtls',JSON.stringify(__dt))
  }

  public static setScmDtls(__dt){
    console.log(__dt);
    localStorage.setItem('__scmDtls',JSON.stringify(__dt))
  }

}
