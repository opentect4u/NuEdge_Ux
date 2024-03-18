import { NgModule } from '@angular/core';
import { AuthComponent } from './Auth.component';
import { RouterModule, Routes } from '@angular/router';
import { SignInGuard } from 'src/app/__Gaurd/canActivate/sign-in.guard';
// import { SignInGuard } from 'src/app/__Gaurd/canActivate/sign-in.guard';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    canActivate:[SignInGuard],
    children: [
      {
        path: 'signIn',
        loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
        data: { id: 1, title: 'NuEdge Corporate Pvt LTD - Login' }
      },
      {
        path:'',
        redirectTo:'signIn',
        pathMatch:'full'
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
export class AuthModule {}
