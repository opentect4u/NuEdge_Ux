import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionComponent } from './option.component';
import { RouterModule, Routes } from '@angular/router';
import { OptionModificationComponent } from '../optionModification/optionModification.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { OptrptComponent } from '../optRpt/optRpt.component';


const routes: Routes =[{path:'',component:OptionComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [OptionComponent,OptionModificationComponent,OptrptComponent]
})
export class OptionModule { }
