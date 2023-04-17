import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchemeComponent } from './scheme.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { ScmModificationComponent } from './scmModification/scmModification.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScmRptComponent } from './scmRpt/scmRpt.component';
import { DateArrayPipe } from 'src/app/__Pipes/dates.pipe';
import { FreqWiseAmtPipe } from 'src/app/__Pipes/freqWise.pipe';
const routes: Routes = [{ path: '', component: SchemeComponent }]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SearchModule,
    SharedModule
  ],
  declarations: [SchemeComponent,ScmModificationComponent,ScmRptComponent,DateArrayPipe,FreqWiseAmtPipe]
})
export class SchemeModule {

  constructor() {
    console.log('Scheme Module Loaded');
  }
}
