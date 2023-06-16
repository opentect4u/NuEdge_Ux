import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateHomeComponent } from './state-home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { StateRPTComponent } from '../Dialog/state-rpt/state-rpt.component';
import { StateEntryComponent } from '../Dialog/state-entry/state-entry.component';

 const routes: Routes = [{path:'',component:StateHomeComponent}]

@NgModule({
  declarations: [
    StateHomeComponent,
    StateRPTComponent,
    StateEntryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class StateHomeModule { }
