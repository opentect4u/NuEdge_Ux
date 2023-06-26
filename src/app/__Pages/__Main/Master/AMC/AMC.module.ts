import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AMCComponent } from './AMC.component';
import { RouterModule, Routes } from '@angular/router';
import { AmcModificationComponent } from './amcModification/amcModification.component';
import { RplcePipe } from 'src/app/__Pipes/rplce.pipe';
import { AmcrptComponent } from './amcRpt/amcRpt.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReplaceAMCComponent } from './replace-amc/replace-amc.component';
import { MergeAmcComponent } from './merge-amc/merge-amc.component';
import { ImageModule } from 'primeng/image';
const routes: Routes =[{path:'',component:AMCComponent}]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ImageModule
  ],
  declarations: [
    AMCComponent,
    AmcModificationComponent,
    RplcePipe,
    AmcrptComponent,
    ReplaceAMCComponent,
    MergeAmcComponent
  ]
})
export class AMCModule {
  constructor() {
    console.log("AMC Module Loaded");
  }
 }
