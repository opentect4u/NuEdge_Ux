
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SiptypeComponent } from './sipType.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { SiptypemodificationComponent } from './sipTypeModification/sipTypeModification.component';
import { SiptyperptComponent } from './sipTypeRpt/sipTypeRpt.component';
const routes: Routes = [
  {
    path:'',
    component:SiptypeComponent,
    data: { breadcrumb: 'SIP Type' },
  }]


@NgModule({
    declarations: [SiptypeComponent,SiptypemodificationComponent,SiptyperptComponent],
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
      SharedModule
    ],
    providers: []
})
export class SiptypeModule { }
