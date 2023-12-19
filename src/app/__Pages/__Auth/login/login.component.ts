import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { pluck } from 'rxjs/operators';
import { IUser } from 'src/app/__Model/user_dtls.model';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { storage } from 'src/app/__Utility/storage';
import { AU_TK, US_IN } from 'src/app/strings/localStorage_key';

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
      this.dbIntr.api_call(1,'/login',this.__utils.convertFormData(this.loginForm.value))
     .pipe(pluck('data')).subscribe(async (res:{token:string,user:IUser}) =>{
        if(res){
          try{
             storage.setItemInLocalStorage(AU_TK,this.__utils.encrypt_dtls(res.token));
             storage.setItemInLocalStorage(US_IN,this.__utils.encrypt_dtls(JSON.stringify(res.user)))
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
