import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StpHomeComponent } from './stp-home.component';
import { RouterModule, Routes } from '@angular/router';
import { LiveStpComponent } from '../live-stp/live-stp.component';
import { TerminateStpComponent } from '../terminate-stp/terminate-stp.component';
import { MaturedStpComponent } from '../matured-stp/matured-stp.component';
import { PauseStpComponent } from '../pause-stp/pause-stp.component';
import { RegisteredStpComponent } from '../registered-stp/registered-stp.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabModule } from 'src/app/__Core/tab/tab.module';

const routes:Routes = [{ path:'',component:StpHomeComponent,data:{title:'STP Report',pageTitle:'STP Report'}}]


@NgModule({
  declarations: [
    StpHomeComponent,
    LiveStpComponent,
    TerminateStpComponent,
    MaturedStpComponent,
    PauseStpComponent,
    RegisteredStpComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TabModule,
    RouterModule.forChild(routes)
  ]
})
export class StpHomeModule { }
