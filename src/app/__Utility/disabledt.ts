

export  class dates{
  constructor(){}
     public static disabeldDates(){
            console.log(new Date().toISOString().split('T')[0]);
          return new Date().toISOString().split('T')[0]
      }
      public static numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          return false;
        }
        return true;
    
      } 
}