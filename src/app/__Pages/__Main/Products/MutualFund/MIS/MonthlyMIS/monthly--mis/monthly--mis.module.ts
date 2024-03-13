import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthlyMisComponent } from './monthly-mis.component';
import { RouterModule, Routes } from '@angular/router';
import { TabModule } from 'src/app/__Core/tab/tab.module';
import { MisCoreModule } from '../core/mis-core.module';
import {FilterByStatusPipe} from 'src/app/__Pipes/filter.pipe'
  const routes:Routes = [{path:'',component:MonthlyMisComponent}]
  // import localePt from '@angular/common/locales/pt';
  // import { registerLocaleData } from '@angular/common';
@NgModule({
  declarations: [
    MonthlyMisComponent,
    FilterByStatusPipe
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TabModule,
    MisCoreModule
  ],
  // providers:[
  //   {
  //     provide: LOCALE_ID,
  //     useValue: 'en-IN'
  //    },
  // ]
})
export class MonthlyMisModule { }
