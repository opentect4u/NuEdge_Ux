import { Component, OnInit } from '@angular/core';
import profile from '../../../../assets/json/profile.json';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileTab = profile;
  active_tab:string = profile[0].flag;

  isOldVisibility:boolean = false;
  isnewVisibility:boolean = false;
  isconfVisibility:boolean = false;



  profile = new FormGroup({
      manage_password:new FormGroup({
          old_password:new FormControl('',[Validators.required]),
          password:new FormControl('',{
            validators:[
            Validators.required,
            Validators.pattern(
              /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8}/
            )
          ],

          }
          ),
          c_password:new FormControl('',
          {
            validators: [
              Validators.required
            ],
            asyncValidators:this.ConfirmedValidator(),
          }
          )
      }),
      manage_account:new FormGroup({})
  })

  constructor(private dbIntr:DbIntrService,
    private utility:UtiliService
    ) { }

  ngOnInit(): void {
  }
  changeTab = (tab) =>{
      this.active_tab = tab.flag;
  }
  changePassword(){
    if(this.profile.value.manage_password.old_password === this.profile.value.manage_password.password){
            this.utility.showSnackbar('Old password and new password must not same',2);
            return;
    }
    else if(this.profile.value.manage_password.c_password !== this.profile.value.manage_password.password){
            this.utility.showSnackbar('Please make sure confirm password and new password are same',2);
            return;
    }
    else{
      this.dbIntr.api_call(1,'/changePassword',this.utility.convertFormData(this.profile.value.manage_password))
      .pipe(pluck('suc')).subscribe(res =>{
            this.utility.showSnackbar(res == 1 ? 'Your password has been changed successfully' : 'Something went worng',res);
            if(res == 1){
              this.profile.reset({emitEvent:false});
              this.isOldVisibility = false;
              this.isnewVisibility = false;
              this.isconfVisibility  = false;
            }
          })
    }
  }

  /*********CONFIRM AND OLD PASSWORD MATCHING VALIDATION***************/
  ConfirmedValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.checkIfPasswordMatch(control.value).pipe(
        map((res) => {
          if (control.value) {
            // if res is true, sip_date exists, return true
            return res ? null : { pas_match: true };
            // NB: Return null if there is no error
          }
          return null;
        })
      );
    };
  }
  checkIfPasswordMatch(pass: string): Observable<boolean> {
      return of(pass === this.profile.get(['manage_password','password']).value);
  }
  /******** END */
}
