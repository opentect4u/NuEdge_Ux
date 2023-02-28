import { NgModule } from '@angular/core';
import { AuthComponent } from './Auth.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
        data: { id: 1, title: 'NuEdge Corporate Pvt LTD - Login' }
      }
    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  declarations: [AuthComponent]
})
export class AuthModule {
  constructor(){
    console.log("Auth Module Loaded");
    
  }
}
