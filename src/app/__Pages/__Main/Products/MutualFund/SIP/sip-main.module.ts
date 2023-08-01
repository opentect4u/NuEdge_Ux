import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SipMainComponent } from './sip-main.component';
import { RouterModule, Routes } from '@angular/router';

  const routes:Routes = [
    {
      path:'',
      component:SipMainComponent,
      data:{breadcrumb:'SIP Report'},
      children:[
            {
              path:'',
              loadChildren:()=>import('./sip-home/sip-home.module').then(m=> m.SipHomeModule)
            }
      ]
    }
  ]

@NgModule({
  declarations: [
    SipMainComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class SipMainModule { }
