import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KycTraxComponent } from './kyc-trax.component';
import { RouterModule, Routes } from '@angular/router';

 const routes: Routes = [{
  path:'',
  component:KycTraxComponent,
  data:{breadcrumb:'KYC Trax'},
  children:[
    {
      path:'',
      loadChildren:()=> import('./kyc-home/kyc-home.module').then(m => m.KycHomeModule)
    },
    {
      path:'acknowledgement',
      loadChildren:()=> import('./Acknowledgement/acknowledgement.module').then(ack => ack.AcknowledgementModule)
    },
    {
      path:'manualupdate',
      loadChildren:()=> import('../kycTrax/ManualUpdate/manual-update.module').then(manualupdate => manualupdate.ManualUpdateModule)
    }
  ]
}]


@NgModule({
  declarations: [
    KycTraxComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

  ]
})
export class KycTraxModule { }
