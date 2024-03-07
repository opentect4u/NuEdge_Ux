import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClModifcationComponent } from '../client/addNew/client_manage/home/clModifcation/clModifcation.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    ClModifcationComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[SharedModule]
})
export class SharedClModuleModule { }
