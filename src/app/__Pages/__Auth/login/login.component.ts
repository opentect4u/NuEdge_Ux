import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { pluck } from 'rxjs/operators';
import { IUser } from 'src/app/__Model/user_dtls.model';
import { AuthService } from 'src/app/__Services/auth.service';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  __showPassword: boolean = false;
  constructor(
    private __utils: UtiliService,
    private auth:AuthService,
    private dbIntr:DbIntrService) { }

  ngOnInit() {
    console.log(window.outerHeight);
    console.log(window.innerHeight);
  }
  signIn() {
     if(this.loginForm.invalid){
      return;
     }

    try{
      // await this.auth.setUserDtls_into_localStorage({name:'Suman Mitra',emp_id:120});
      // this.__utils.navigate('/main/home',null);
      this.dbIntr.api_call(1,'/login',this.__utils.convertFormData(this.loginForm.value))
     .pipe(pluck('data')).subscribe(async (res:{token:string,user:IUser}) =>{
        // console.log(res);
        if(res){
          try{
            await this.auth.set_Token_in_localStorage(res.token);
            await this.auth.setUserDtls_into_localStorage(res.user);
            this.__utils.navigate('/main/home',null);
          }
          catch(ex){
            console.log(ex);
          }
        }
        else{
             this.__utils.showSnackbar('Please Provide Valid Credential',0);
        }

     })
    }
    catch(ex){
      console.log(ex);
    }
  }
}
