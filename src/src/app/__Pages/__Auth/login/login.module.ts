import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { RouterModule, Routes } from '@angular/router';
import { InputModule } from 'src/app/__Core/input/input.module';
import { ReactiveFormsModule } from '@angular/forms';
const routes: Routes = [{ path: '', component: LoginComponent }]

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    InputModule,
    ReactiveFormsModule
  ],
  declarations: [LoginComponent]
})
export class LoginModule {
  constructor(){
    console.log("Login Module Loaded");
    
  }
}
