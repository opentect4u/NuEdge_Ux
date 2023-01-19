import { ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
export class fileValidators {
 
    /************* Check file size must not exceed than 2mb ***************** */
    static fileSizeValidator(files: FileList | null = null): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if(control.value &&  files.length > 0){
                const fileSize = files[0].size;
                const fileSizeInKB = Math.round(fileSize / 1024);
                if (fileSizeInKB > 2048) {
                return  {
                    fileSizeValidator: true
                  };
                } else {
                return null;
                }
                }
                return null;

                };
            }
    /************* End ***************** */


    /************* Check file extension***************** */
    static fileExtensionValidator(validExt: Array<string>): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
          let forbidden = true;
          if (control.value) {
            console.log(control.value);
            
            const fileExt = control.value.split('.').pop();
            validExt.forEach(ext => {                
              if (ext == fileExt) {
                forbidden = false;
              }
            });
             return forbidden ? { 'inValidExt': true } : null;
          }
          return null;
        };
      } 
    /************* End ***************** */

}