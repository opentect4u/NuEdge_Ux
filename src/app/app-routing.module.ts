import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./__Pages/__Auth/Auth.module').then(m => m.AuthModule) },
  { path: 'main', loadChildren: () => import('./__Pages/__Main/main.module').then(m => m.MainModule) },
  {path:'',redirectTo:'auth',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
