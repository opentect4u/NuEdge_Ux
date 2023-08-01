import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwpHomeComponent } from './swp-home.component';
import { RouterModule, Routes } from '@angular/router';
import { RegisteredSwpComponent } from '../registered-swp/registered-swp.component';
import { PauseSwpComponent } from '../pause-swp/pause-swp.component';
import { LiveSwpComponent } from '../live-swp/live-swp.component';
import { TerminateSwpComponent } from '../terminate-swp/terminate-swp.component';
import { MatureSwpComponent } from '../mature-swp/mature-swp.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabModule } from 'src/app/__Core/tab/tab.module';

const routes:Routes = [{ path:'',component:SwpHomeComponent,data:{title:'SWP Report',pageTitle:'SWP Report'}}]


@NgModule({
  declarations: [
    SwpHomeComponent,
    RegisteredSwpComponent,
    PauseSwpComponent,
    LiveSwpComponent,
    TerminateSwpComponent,
    MatureSwpComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    TabModule
  ]
})
export class SwpHomeModule { }
