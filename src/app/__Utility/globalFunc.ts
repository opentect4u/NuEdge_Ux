export class global{

    public static randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
      }
    public static  getActualVal(__item): any{
      console.log(__item);
      return  __item ? __item : ''
    }
    public static containsSpecialChars(str) {
      const specialChars = /[ ]/;
      console.log(str);

      return specialChars.test(str);
    }

   public static getType(__str){
   if(typeof(__str) == 'string'){
     return __str == 'true' ? true : false;
   }
    return __str;
   }

}
