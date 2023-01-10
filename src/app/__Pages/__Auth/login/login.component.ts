import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  constructor(private __utils: UtiliService) { }

  ngOnInit() { }
  signIn() {
     if(this.loginForm.invalid){
      return;
     }
    this.__utils.navigate('/main/',null);
  }
}
