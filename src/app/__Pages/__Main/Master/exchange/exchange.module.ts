import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExchangeComponent } from './exchange.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { EntryComponent } from './Dialog/entry/entry.component';

 const routes:Routes = [{path:'',component:ExchangeComponent,data:{breadcrumb:'Exchange',title:'Exchange',pageTitle:'Exchange'}}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [
    ExchangeComponent,
    EntryComponent
  ],
})
export class ExchangeModule { }
