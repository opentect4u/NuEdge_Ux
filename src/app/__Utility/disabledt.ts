

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
      public static getminDate(){
        var dt = new Date();
        dt.setDate(dt.getDate() - 15);
        return dt.toISOString().substring(0,10);
      }
      public static getTodayDate(){
        var today = new Date();
        console.log(today.toISOString().substring(0,10));
        return today.toISOString().substring(0,10);
      }
      public static isNumber(evt) {
         console.log(evt);

        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(evt.key);

        if (!pattern.test(inputChar)) {
          // invalid character, prevent input
          event.preventDefault();
        }
    }
    public static calculateDT(__mode){
     var dt = new Date();
     switch(__mode){
      case 'W': dt.setDate(dt.getDate() - 7);break;
      case 'M': dt.setMonth(dt.getMonth() - 1);break;
      case 'Y': dt.setFullYear(dt.getFullYear() - 1);break;
      case 'D': break;
      default: break;
     }
     console.log(dt.toISOString().substring(0,10));

     return dt.toISOString().substring(0,10);
    }

}
