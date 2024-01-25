import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveMfPortFolioComponent } from './live-mf-port-folio.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';


const routes: Routes = [{path:'',component:LiveMfPortFolioComponent}]

@NgModule({
  declarations: [
    LiveMfPortFolioComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class LiveMfPortFolioModule { }
