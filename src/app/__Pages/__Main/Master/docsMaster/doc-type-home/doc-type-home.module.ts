import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocTypeHomeComponent } from './doc-type-home.component';
import { RouterModule, Routes } from '@angular/router';

 const routes: Routes = [{path:'',
                          component:DocTypeHomeComponent,
                          data:{breadcrumb:'Document Type'},
                          children:[
                            {
                              path: '',
                              loadChildren: () =>
                                import('../docsMaster.module').then(
                                  (m) => m.DocsMasterModule
                                ),
                            },
                            {
                              path: 'uploadDocTypeCsv',
                              loadChildren: () =>
                                import('../uploadCsv/uploadCsv.module').then(
                                  (m) => m.UploadCsvModule
                                ),
                              data: {
                                parentId: 4,
                                id: 49,
                                 breadcrumb:'Upload Document Type',
                                title: 'NuEdge - Document Type Uploadation',
                                pageTitle: 'NuEdge - Document Type Upload',
                              },
                            },
                          ]
}]

@NgModule({
  declarations: [
    DocTypeHomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class DocTypeHomeModule { }
