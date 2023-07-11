import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClMstComponent } from './cl-mst.component';
import { RouterModule, Routes } from '@angular/router';


const route: Routes =[
  {
    path:'',
    component:ClMstComponent,
    data:{breadcrumb:'Client Master'},
    children:[
      {
        path:'home',
        loadChildren:()=> import('./home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'docs',
        loadChildren: () =>
          import('./document/document.module').then((m) => m.DocumentModule),
        data: {
          parentId: 4,
          breadcrumb:'Document Master',
          id: 12,
          title: 'NuEdge - Document Master',
          pageTitle: 'Document Master',
        },
      },
      {
        path: 'clOption',
        loadChildren: () =>
          import(
            './client/main.module'
          ).then((m) => m.MainModule),
        data: {
          parentId: 4,
          id: 41,
          title: 'NuEdge - Client Options',
          pageTitle: '',
          has_member: 'Y',
        },
      },
      {
        path:'report',
        loadChildren:()=> import('./client-cmn-rpt/client-cmn-rpt.module').then(m => m.ClientCmnRptModule),
        data:{breadcrumb:'Reports'}
      },
      {
        path:'',
        redirectTo:'home',
        pathMatch:'full'
      }
    ]
  }
 ]

@NgModule({
  declarations: [
    ClMstComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(route)
  ]
})
export class ClMstModule { }
