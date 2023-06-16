import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { RouterModule, Routes } from '@angular/router';
import { RcvFrmResolver } from 'src/app/__Core/Resolver/rcv-frm.resolver';

 const routes: Routes = [
  {

  path:'',
  component:MainComponent,
  data:{breadcrumb:' Form Receivable'},
  children:[
    {
      path:'',
      loadChildren:()=> import('./home/home.module').then(m => m.HomeModule)
    },
    {
      path:':type_id',
      loadChildren:()=> import('./ReceiveForm/form-recieve.module').then(m => m.FormRecieveModule),
      resolve:{
        data:RcvFrmResolver
      }
    }
  ]
}]

@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class MainModule { }
