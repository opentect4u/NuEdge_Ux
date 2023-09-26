import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabModule } from 'src/app/__Core/tab/tab.module';
import { FileHelpTblComponent } from './file-help-tbl/file-help-tbl.component';

 const routes:Routes = [{path:'',component:HomeComponent,data:{title:' File Help',pageTitle:'File Help'}}]

@NgModule({
  declarations: [
    HomeComponent,
    FileHelpTblComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    TabModule
  ]
})
export class HomeModule { }
