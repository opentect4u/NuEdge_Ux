import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KychomeComponent } from './kychome.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { KyModificationComponent } from './Dialog/kyModification/kyModification.component';
import { KycrptComponent } from './Dialog/KycRpt/kycRPT.component';

 const routes: Routes = [{path:'',component:KychomeComponent}]

@NgModule({
  declarations: [
    KychomeComponent,
    KyModificationComponent,
    KycrptComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class KycHomeModule { }
