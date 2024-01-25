import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveMfPortFolioComponent } from './live-mf-port-folio.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{path:'',component:LiveMfPortFolioComponent}]

@NgModule({
  declarations: [
    LiveMfPortFolioComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class LiveMfPortFolioModule { }
