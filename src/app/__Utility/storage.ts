
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

  /**
   * Function for set item inside localstorage
   * @param key used to identify localstorage item
   * @param val is stored in the value scection
   */
  static setItemInLocalStorage = (key:string,val:string) =>{
    try{
      localStorage.setItem(key,val);
    }
    catch(ex){
      console.log(ex);
    }
  }
  /**
   * Funcion for getting data from localStorage
   * @param key used to identify localstorage item
   * @returns if somenthing went wrong it will return null
   */
  static getItemFromLocalStorage = (key:string): string | null =>{
    try{
      let  item = localStorage.getItem(key);
      return item;
    }
    catch(ex){
      return null;
    }
  }
   /**
   * Funcion for Remove data from localStorage by its key
   * @param key used to identify localstorage item
   */
   static removeItemFromLocalStorage = (key:string) =>{
    try{
      localStorage.removeItemItem(key);
    }
    catch(ex){
     console.log(ex);
    }
  }
  /**
   * Function for Clearing LocalStorage
   */
  static clearStorage = () =>{
    try{
      localStorage.clear();
    }
    catch(ex){
     console.log(ex);
    }
  }

}
