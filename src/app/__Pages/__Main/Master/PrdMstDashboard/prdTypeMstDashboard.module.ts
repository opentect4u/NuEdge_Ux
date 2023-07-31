
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrdtypemstdashboardComponent } from './PrdTypeMstDashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [{path:'',component:PrdtypemstdashboardComponent,data:{breadcrumb:null,id:100,title:'Master Product'}}]

@NgModule({
    declarations: [PrdtypemstdashboardComponent],
    imports: [
      CommonModule,
      SharedModule,
      RouterModule.forChild(routes)
    ],
    providers: []
})
export class PrdtypemstdashboardModule { }
