import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryHomeComponent } from './country-home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { CountryEntryComponent } from '../Dialog/country-entry/country-entry.component';
import { CountryRPTComponent } from '../Dialog/country-rpt/country-rpt.component';

const routes: Routes = [{path:'',component:CountryHomeComponent}]

@NgModule({
  declarations: [
    CountryHomeComponent,
    CountryEntryComponent,
    CountryRPTComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class CountryHomeModule { }
