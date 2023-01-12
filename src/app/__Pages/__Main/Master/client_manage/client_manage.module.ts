import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client_manageComponent } from './client_manage.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { ClientModificationComponent } from './clientModification/clientModification.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

const routes: Routes = [{path:'',component:Client_manageComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SearchModule,
    MatIconModule,
    MatDialogModule
  ],
  declarations: [Client_manageComponent,ClientModificationComponent]
})
export class Client_manageModule {
  constructor() {
    console.log("Client_manageModule Loaded");
  }
 }