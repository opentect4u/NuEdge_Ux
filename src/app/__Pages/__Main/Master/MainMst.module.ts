import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainMstComponent } from './MainMst.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [{ 
                        path: '', 
                        component: MainMstComponent,
                        children:[
                              {
                                path:'home',
                                loadChildren:()=> import('./home/home.module').then(m => m.HomeModule),
                                data:{parentId:4,id:1,title: "NuEdge - Master Dashboard",pageTitle:"",has_menubar:'N'}
                              },
                              {
                                path: 'clientmaster',
                                loadChildren: () => import('./client_manage/client_manage.module').then(m => m.Client_manageModule),
                                data: {parentId:4, id: 2, title: "NuEdge - Client Master", pageTitle: "Client Master", has_menubar: 'Y' }
                              },
                              {
                                path: 'rntmaster',
                                loadChildren: () => import('./RNT/RNT.module').then(m => m.RNTModule),
                                data: {parentId:4, id: 13, title: "NuEdge - R&T Master", pageTitle: "R&T Master", has_menubar: 'Y' }
                              },
                              {
                                path:'rntDashboard',
                                loadChildren: () => import('./RNT/rntDashboard/rntDashboard.module').then(m => m.RntDashboardModule),
                                data: {parentId:4, id: 14, title: "NuEdge - R&T Dashboard", pageTitle: "R&T Dashboard", has_menubar: 'Y' }
                              },
                              {
                                path:'rntUpload',
                                loadChildren: () => import('./RNT/uploadCsv/uploadCsv.module').then(m => m.UploadCsvModule),
                                data: {parentId:4, id: 15, title: "NuEdge - R&T Uploadation", pageTitle: "R&T Uploadation", has_menubar: 'Y' }
                              },

                              {
                                path: 'rntmodify/:id',
                                loadChildren: () => import('./RNT/rntModify/rntModify.module').then(m => m.RntModifyModule),
                                data: {parentId:4, id: 3, title: "NuEdge - R&T", pageTitle: "R&T Master", has_menubar: 'Y' }
                                
                              },
                              {
                                path: 'amcmaster',
                                loadChildren: () => import('./AMC/AMC.module').then(m => m.AMCModule),
                                data: { parentId:4,id: 4, title: "NuEdge - AMC Master", pageTitle: "AMC Master", has_menubar: 'Y' }
                              },
                              {
                                path: 'category',
                                loadChildren: () => import('./category/category.module').then(m => m.CategoryModule),
                                data: { parentId:4,id: 5, title: "NuEdge - Category Master", pageTitle: "Category Master", has_menubar: 'Y' }
                              },
                              {
                                path: 'subcategory',
                                loadChildren: () => import('./subcategory/subcategory.module').then(m => m.SubcategoryModule),
                                data: { parentId:4,id: 6, title: "NuEdge - Sub-Category Master", pageTitle: "Sub-Category Master", has_menubar: 'Y' }
                              },
                              {
                                path: 'bank',
                                loadChildren: () => import('./bank/bank.module').then(m => m.BankModule),
                                data: { parentId:4,id: 7, title: "NuEdge - Bank  Master", pageTitle: "Bank Master", has_menubar: 'Y' }
                              },
                              {
                                path: 'scheme',
                                loadChildren: () => import('./scheme/scheme.module').then(m => m.SchemeModule),
                                data: { parentId:4,id: 8, title: "NuEdge - Scheme  Master", pageTitle: "Scheme Master", has_menubar: 'Y' }
                              },
                              {
                                path: 'docsType',
                                loadChildren: () => import('./docsMaster/docsMaster.module').then(m => m.DocsMasterModule),
                                data: { parentId:4,id: 9, title: "NuEdge - Document Type", pageTitle: "Document Type", has_menubar: 'Y' }
                              },
                               {
                                  path:'mstOperations',
                                  loadChildren:()=> import('../Dashboards/mstOpDashboard/mstOpDashboard.module').then(m => m.MstOpDashboardModule),
                                  data:{parentId:4,id:10,title: "NuEdge - Master Operations Dasboard", pageTitle: "", has_member: 'Y'}
                              },
                              {
                                    path:'clntMstHome',
                                    loadChildren:()=> import('../Dashboards/clntMstDashboard/clntMstDashboard.module').then(m => m.ClntMstDashboardModule),
                                    data:{parentId:4,id:11,title: "NuEdge - Client Master Dasboard", pageTitle: "", has_member: 'Y'}
                                },
                                 {
                                    path: 'docs',
                                    loadChildren: () => import('./document/document.module').then(m => m.DocumentModule),
                                    data: {parentId:4, id: 12, title: "NuEdge - Document Master", pageTitle: "Document Master" }
                                  },
                              {
                                path:'',
                                redirectTo:'home',
                                pathMatch:'full'
                              }
                        ]
                      }]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MainMstComponent]
})
export class MainMstModule { }
