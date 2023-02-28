
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AckmainComponent } from './ackMain.component';
import {RouterModule, Routes} from '@angular/router';
  const routes: Routes =[
    {
      path:'',
      component:AckmainComponent,
      data:{breadcrumb:null},
      children:[
            {
              path:'',
              loadChildren:()=>import('./ackHome/ackhome.module').then(m => m.AckhomeModule),
              data:{breadcrumb:null}
            },
            {
              path:'ackEntry',
              loadChildren:()=>import('./ackEntryfin/ackEntry.module').then(m => m.AckentryModule),
              data:{breadcrumb:null}
            }
      ]
    }
  ]


@NgModule({

 declarations: [
    AckmainComponent
  ],
    imports: [
      CommonModule,
      RouterModule.forChild(routes)
    ],

providers: []
})
export class AckmainModule { }
