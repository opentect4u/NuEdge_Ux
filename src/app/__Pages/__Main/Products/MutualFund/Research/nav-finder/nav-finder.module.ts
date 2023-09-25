import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavFinderComponent } from './nav-finder.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabModule } from 'src/app/__Core/tab/tab.module';

 const routes:Routes = [{path:'',component:NavFinderComponent}]

@NgModule({
  declarations: [
    NavFinderComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    TabModule
  ]
})
export class NavFinderModule { }
