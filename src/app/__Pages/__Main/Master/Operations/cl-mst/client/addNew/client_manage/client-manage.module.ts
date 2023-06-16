import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientManageComponent } from './client-manage.component';
import { RouterModule, Routes } from '@angular/router';
import { ClientResolverResolver } from 'src/app/__Core/Resolver/client-resolver.resolver';
import { UploadClientResolver } from 'src/app/__Core/Resolver/upload-client.resolver';

const routes: Routes = [{
                          path:':id',
                          component:ClientManageComponent,
                          resolve:{
                            data:ClientResolverResolver
                           },
                          children:[
                            {
                              path:'',
                              loadChildren:()=> import('./home/home.module').then(m => m.HomeModule),

                            },
                            {
                              path: 'clUploadCsv/:id',
                              loadChildren: () =>
                                import('./uploadCsv/uploadCsv.module').then(
                                  (m) => m.UploadCsvModule
                                ),
                               resolve:{
                                data:UploadClientResolver
                               }
                            },
                          ]

                        }]

@NgModule({
  declarations: [
    ClientManageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ClientManageModule { }
