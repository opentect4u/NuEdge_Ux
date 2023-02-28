
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DaysheetrptComponent } from './daysheetRpt.component';

 const routes: Routes =[{path:'',component:DaysheetrptComponent,data:{breadcrumb:'Reports'}}]

@NgModule({
    declarations: [DaysheetrptComponent],
    imports: [
      CommonModule,
      RouterModule.forChild(routes)
    ],
    providers: []
})
export class DaysheetrptModule { }
