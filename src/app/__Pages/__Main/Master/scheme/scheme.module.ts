import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchemeComponent } from './scheme.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { ScmModificationComponent } from './scmModification/scmModification.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScmRptComponent } from './scmRpt/scmRpt.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {MatCheckboxModule} from '@angular/material/checkbox';
const routes: Routes = [{ path: '', component: SchemeComponent }]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SearchModule,
    SharedModule,
    NgMultiSelectDropDownModule,
    MatCheckboxModule
  ],
  declarations: [SchemeComponent,ScmModificationComponent,ScmRptComponent]
})
export class SchemeModule {

  constructor() {
    console.log('Scheme Module Loaded');
  }
}
