import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthlymisMenusComponent } from './monthlymis-menus.component';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from '../../../../core/core.module';
 const routes:Routes = [{path:'',component:MonthlymisMenusComponent}]

@NgModule({
  declarations: [
    MonthlymisMenusComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    RouterModule.forChild(routes)
  ]
})
export class MonthlyMisMenusModule { }
