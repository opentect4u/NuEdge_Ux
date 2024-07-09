import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelcapitalgainComponent } from './relcapitalgain.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabModule } from 'src/app/__Core/tab/tab.module';
const routes: Routes = [
  {
    path:'',
    component: RelcapitalgainComponent
  }
]

@NgModule({
  declarations: [
    RelcapitalgainComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    TabModule
  ]
})
export class RelcapitalgainModule { }
