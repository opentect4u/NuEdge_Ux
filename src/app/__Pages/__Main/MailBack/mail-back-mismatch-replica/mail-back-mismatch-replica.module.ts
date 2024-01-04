import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MailbackMismatchReplicaComponent } from './mailback-mismatch-replica.component';
import { RouterModule, Routes } from '@angular/router';
import { TabModule } from 'src/app/__Core/tab/tab.module';
import { SharedModule } from 'src/app/shared/shared.module';

const routes:Routes = [{path:'',component:MailbackMismatchReplicaComponent,
data:{breadcrumb:"Mismatch Replica",pageTitle:'Mailback Mismatch Replica',title:'Mailback Mismatch Replica'}}]

@NgModule({
  declarations: [
    MailbackMismatchReplicaComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TabModule,
    SharedModule
  ]
})
export class MailBackMismatchReplicaModule { }
