import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SipHomeComponent } from './sip-home.component';
import { RouterModule, Routes } from '@angular/router';
import { TabModule } from 'src/app/__Core/tab/tab.module';
import { LiveSIPComponent } from '../live-sip/live-sip.component';
import { RegisteredSIPComponent } from '../registered-sip/registered-sip.component';
import { TerminateSIPComponent } from '../terminate-sip/terminate-sip.component';
import { MaturedSIPComponent } from '../matured-sip/matured-sip.component';
import { PauseSIPComponent } from '../pause-sip/pause-sip.component';
import { CoreModule } from '../../../core/core.module';

 const routes:Routes = [{ path:'',component:SipHomeComponent,data:{title:'SIP Report',pageTitle:'SIP Report'}}]

@NgModule({
  declarations: [
    SipHomeComponent,
    LiveSIPComponent,
    RegisteredSIPComponent,
    TerminateSIPComponent,
    MaturedSIPComponent,
    PauseSIPComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    TabModule,
    RouterModule.forChild(routes)
  ],
})
export class SipHomeModule { }
