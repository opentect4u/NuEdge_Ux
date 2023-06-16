import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CmpCrudComponent } from '../Dialog/cmp-crud/cmp-crud.component';
import { CmpRPTComponent } from '../Dialog/cmp-rpt/cmp-rpt.component';

const routes: Routes = [{path:'',component:HomeComponent}]

@NgModule({
  declarations: [
    HomeComponent,
    CmpCrudComponent,
    CmpRPTComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class HomeModule { }
