import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AMCComponent } from './AMC.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { AmcModificationComponent } from './amcModification/amcModification.component';
import { RplcePipe } from 'src/app/__Pipes/rplce.pipe';
import { AmcrptComponent } from './amcRpt/amcRpt.component';
import { SharedModule } from 'src/app/shared/shared.module';
const routes: Routes =[{path:'',component:AMCComponent}]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SearchModule,
    SharedModule
  ],
  declarations: [
    AMCComponent,
    AmcModificationComponent,
    RplcePipe,
    AmcrptComponent
  ]
})
export class AMCModule {
  constructor() {
    console.log("AMC Module Loaded");
  }
 }
