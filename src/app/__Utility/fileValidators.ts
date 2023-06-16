import { ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
export class fileValidators {

    /************* Check file size must not exceed than 10MB (10240)***************** */
    static fileSizeValidator(files: FileList | null = null): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
          console.log(files.length);

            if(control.value &&  files.length > 0){
                const fileSize = files[0].size;
                const fileSizeInKB = Math.round(fileSize / 1024);
                console.log(fileSizeInKB);

                if (fileSizeInKB > 10240) {
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

    static fileSizeValidatorforEntry(files: FileList | null = null): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } | null => {
        console.log(files.length);

          if(control.value &&  files.length > 0){
              const fileSize = files[0].size;
              const fileSizeInKB = Math.round(fileSize / 1024);
              console.log(fileSizeInKB);

              if (fileSizeInKB > 10240) {
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


    static fileSizeValidatorcopy(files: FileList | null = null): boolean {
          if(files.length > 0){
              const fileSize = files[0].size;
              const fileSizeInKB = Math.round(fileSize / 1024);
              console.log(fileSizeInKB);

              if (fileSizeInKB > 2048) {
              return  false
              } else {
              return true;
              }
              }
              return false;
      };




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

    static fileExtensionValidatorcopy(validExt: Array<string>,files:FileList): Promise<boolean> {
      return new Promise((resolve,reject) =>{
          resolve(((validExt.findIndex((x: string) => x == files[0].name.split('.').pop())) == -1) ? false : true);
      })
    }

}
