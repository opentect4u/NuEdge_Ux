import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualupdateComponent } from './manualupdate.component';
import { RouterModule, Routes } from '@angular/router';

 const routes: Routes = [{
     path:'',
     component:ManualupdateComponent,
     data:{breadcrumb:'Manual Update'},
     children:[
      {
        path:'',
         loadChildren:()=> import('./Home/home.module').then(m => m.HomeModule)
      }
     ]
    }]

@NgModule({
  declarations: [
    ManualupdateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ManualUpdateModule { }
