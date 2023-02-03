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
                                path: 'rntmodify',
                                loadChildren: () => import('./RNT/rntModify/rntModify.module').then(m => m.RntModifyModule),
                                data: {parentId:4, id: 3, title: "NuEdge - R&T", pageTitle: "R&T Master", has_menubar: 'Y' }
                              },
                              {
                                path: 'amcmaster',
                                loadChildren: () => import('./AMC/AMC.module').then(m => m.AMCModule),
                                data: { parentId:4,id: 4, title: "NuEdge - AMC Master", pageTitle: "AMC Master", has_menubar: 'Y' }
                              },
                              {
                                path: 'amcDashboard',
                                loadChildren: () => import('./AMC/amcDashBorad/amcDashBorad.module').then(m => m.AmcDashBoradModule),
                                data: { parentId:4,id: 16, title: "NuEdge - AMC Dashboard", pageTitle: "AMC Dashboard", has_menubar: 'Y' }
                              },
                              
                              {
                                path: 'amcModify',
                                loadChildren: () => import('./AMC/amcModify/amcModify.module').then(m => m.AmcModifyModule),
                                data: { parentId:4,id: 17, title: "NuEdge - AMC Modification", pageTitle: "AMC Addition / updation", has_menubar: 'Y' }
                              },
                              
                              {
                                path: 'amcUpload',
                                loadChildren: () => import('./AMC/uploadAMC/uploadAMC.module').then(m => m.UploadAMCModule),
                                data: { parentId:4,id: 18, title: "NuEdge - AMC Uploadation", pageTitle: "AMC Uploadation", has_menubar: 'Y' }
                              },
                              {
                                path: 'category',
                                loadChildren: () => import('./category/category.module').then(m => m.CategoryModule),
                                data: { parentId:4,id: 5, title: "NuEdge - Category Master", pageTitle: "Category Master", has_menubar: 'Y' }
                              },
                              {
                                path: 'catDashboard',
                                loadChildren: () => import('./category/catDashboard/catDashboard.module').then(m => m.CatDashboardModule),
                                data: { parentId:4,id: 19, title: "NuEdge - Category Dashboard", pageTitle: "Category Dashboard", has_menubar: 'Y' }
                              },
                              {
                                path: 'catModify',
                                loadChildren: () => import('./category/catModify/catModify.module').then(m => m.CatModifyModule),
                                data: { parentId:4,id: 20, title: "NuEdge - Category Modification", pageTitle: "Category Addition / Updation", has_menubar: 'Y' }
                              },
                              {
                                path: 'uploadcategory',
                                loadChildren: () => import('./category/catUpload/catUpload.module').then(m => m.CatUploadModule),
                                data: { parentId:4,id: 21, title: "NuEdge - Category Uploadation", pageTitle: "Category Upload", has_menubar: 'Y' }
                              },
                              {
                                path: 'subcategory',
                                loadChildren: () => import('./subcategory/subcategory.module').then(m => m.SubcategoryModule),
                                data: { parentId:4,id: 6, title: "NuEdge - Sub-Category Master", pageTitle: "Sub-Category Master", has_menubar: 'Y' }
                              },
                              {
                                path: 'subcatDashboard',
                                loadChildren: () => import('./subcategory/subcatDashboard/subcatDashboard.module').then(m => m.SubcatDashboardModule),
                                data: { parentId:4,id: 22, title: "NuEdge - Sub-Category Dashboard", pageTitle: "Sub-Category Dashboard", has_menubar: 'Y' }
                              },
                              {
                                path: 'subcatModify',
                                loadChildren: () => import('./subcategory/subcatModify/subcatModify.module').then(m => m.SubcatModifyModule),
                                data: { parentId:4,id: 23, title: "NuEdge - Sub-Category Modification", pageTitle: "Sub-Category Addtion / Updation", has_menubar: 'Y' }
                              },
                              {
                                path: 'uploadSubcat',
                                loadChildren: () => import('./subcategory/uploadSubcat/uploadSubcat.module').then(m => m.UploadSubcatModule),
                                data: { parentId:4,id: 24, title: "NuEdge - Sub-Category Modification", pageTitle: "Sub-Category Addtion / Updation", has_menubar: 'Y' }
                                
                              },
                              {
                                path: 'bank',
                                loadChildren: () => import('./bank/bank.module').then(m => m.BankModule),
                                data: { parentId:4,id: 7, title: "NuEdge - Bank  Master", pageTitle: "Bank Master", has_menubar: 'Y' }
                              },
                              {
                                path:'bnkDashboard',
                                loadChildren:() => import('./bank/bankDashboard/bankDashboard.module').then(m => m.BankDashboardModule),
                                data:{parentId:4,id:25,title: "NuEdge - Bank Dashboard", pageTitle: "Bank Dashboard", has_menubar: 'Y'}
                              },
                              {
                                path:'bnkModify',
                                loadChildren:() => import('./bank/bankModify/bankModify.module').then(m => m.BankModifyModule),
                                data:{parentId:4,id:26,title: "NuEdge - Bank Modification", pageTitle: "Bank Addtion / Updation", has_menubar: 'Y'}
                              },
                              {
                                path:'uploadbnk',
                                loadChildren:() => import('./bank/bankUpload/bankUpload.module').then(m => m.BankUploadModule),
                                data:{parentId:4,id:27,title: "NuEdge - Bank Uploadation", pageTitle: "Bank Upload", has_menubar: 'Y'}
                              },
                              {
                                path: 'scheme',
                                loadChildren: () => import('./scheme/scheme.module').then(m => m.SchemeModule),
                                data: { parentId:4,id: 8, title: "NuEdge - Scheme  Master", pageTitle: "Scheme Master", has_menubar: 'Y' }
                              },
                              {
                                path: 'scmDashboard',
                                loadChildren: () => import('./scheme/scmDashboard/scmDashboard.module').then(m => m.ScmDashboardModule),
                                data: { parentId:4,id: 29, title: "NuEdge - Scheme Dashboard", pageTitle: "Scheme Dashboard", has_menubar: 'Y' }
                              },
                              {
                                path: 'scmModify',
                                loadChildren: () => import('./scheme/scmModify/scmModify.module').then(m => m.ScmModifyModule),
                                data: { parentId:4,id: 30, title: "NuEdge - Scheme Modification", pageTitle: "Scheme Modification", has_menubar: 'Y' }
                              },
                              {
                                path: 'uploadScm',
                                loadChildren: () => import('./scheme/uploadScm/uploadScm.module').then(m => m.UploadScmModule),
                                data: { parentId:4,id: 31, title: "NuEdge - Scheme Uploadation", pageTitle: "Scheme Upload", has_menubar: 'Y' }
                              },
                              {
                                path: 'scmType',
                                loadChildren: () => import('./scheme/scmType/scmType.module').then(m => m.ScmTypeModule),
                                data: { parentId:4,id: 32, title: "NuEdge - Choose Scheme Type", pageTitle: "Scheme Type", has_menubar: 'Y' }
                              },
                               {
                                  path:'mstOperations',
                                  loadChildren:()=> import('../Dashboards/mstOpDashboard/mstOpDashboard.module').then(m => m.MstOpDashboardModule),
                                  data:{parentId:4,id:10,title: "NuEdge - Master Operations Dasboard", pageTitle: "", has_member: 'Y'}
                              },
                              {
                                    path:'clntMstHome',
                                    loadChildren:()=> import('./client_manage/clntMstDashboard/clntMstDashboard.module').then(m => m.ClntMstDashboardModule),
                                    data:{parentId:4,id:11,title: "NuEdge - Client Master Dasboard", pageTitle: "", has_member: 'Y'}
                                },
                                {
                                     path:'clOption',
                                     loadChildren:()=> import('./client_manage/clietCdDaasboard/clietCdDaasboard.module').then(m => m.ClietCdDaasboardModule),
                                     data:{parentId:4,id:41,title: "NuEdge - Client Options", pageTitle: "", has_member: 'Y'}
                                },
                                {
                                  path:'claddnew',
                                  loadChildren:()=> import('./client_manage/clExistOrAddnew/clExistOrAddnew.module').then(m => m.ClExistOrAddnewModule),
                                  data:{parentId:4,id:42,title: "NuEdge - Client Add New Options", pageTitle: "", has_member: 'Y'}
                                },
                                  {
                                    path:'clModify',
                                    loadChildren:()=> import('./client_manage/clientModify/clientModify.module').then(m => m.ClientModifyModule),
                                    data:{parentId:4,id:43,title: "NuEdge - Client Modification", pageTitle: "", has_member: 'Y'}
                                  },
                                  {
                                    path:'clUploadCsv',
                                    loadChildren:()=> import('./client_manage/uploadCsv/uploadCsv.module').then(m => m.UploadCsvModule),
                                    data:{parentId:4,id:51,title: "NuEdge - Client Uploadation", pageTitle: "NuEdge - Client Upload", has_member: 'Y'}
                                  },
                                {
                                    path: 'docs',
                                    loadChildren: () => import('./document/document.module').then(m => m.DocumentModule),
                                    data: {parentId:4, id: 12, title: "NuEdge - Document Master", pageTitle: "Document Master" }
                                  },
                                  {
                                    path:'docsDashboard',
                                    loadChildren:()=> import('./document/docsDashboard/docsDashboard.module').then(m => m.DocsDashboardModule),
                                    data:{parentId:4,id:44,title:"NuEdge - Document Dashboard" ,pageTitle:"Document Dashboard"}
                                  },
                                  {
                                     path:'docsModify',
                                     loadChildren:()=> import('./document/docModify/docModify.module').then(m => m.DocModifyModule),
                                    data:{parentId:4,id:45,title:"NuEdge - Document Modification" ,pageTitle:"Document Addition / Modification"}
                                  },
                                  {
                                     path:'uploadCsv',
                                     loadChildren:()=> import('./document/uploadDocCsv/uploadDocCsv.module').then(m => m.UploadDocCsvModule),
                                     data:{parentId:4,id:46,title:"NuEdge - Document Uploadation",pageTitle:"NuEdge - Document Upload"}
                                  },
                                  /**Documnet Type */
                                  {
                                    path:'docType',
                                    loadChildren:()=> import('./docsMaster/docsMaster.module').then(m => m.DocsMasterModule),
                                    data:{parentId:4,id:50,title:"NuEdge - Document Type Master",pageTitle:"Document Type Master"}
                                  },
                                  {
                                    path:'docTypeDashboard',
                                    loadChildren:()=> import('./docsMaster/docTypeDashboard/docTypeDashboard.module').then(m => m.DocTypeDashboardModule),
                                    data:{parentId:4,id:47,title:"NuEdge - Document Type Dashboard",pageTitle:"NuEdge - Document Type Dashboard"}
                                  },
                                  {
                                    path:'docTypeModify',
                                    loadChildren:()=> import('./docsMaster/docTypeModify/docTypeModify.module').then(m => m.DocTypeModifyModule),
                                    data:{parentId:4,id:48,title:"NuEdge - Document Type Modification",pageTitle:"NuEdge - Document Type Modification"}
                                  },
                                  {
                                    path:'uploadDocTypeCsv',
                                    loadChildren:()=> import('./docsMaster/uploadCsv/uploadCsv.module').then(m => m.UploadCsvModule),
                                    data:{parentId:4,id:49,title:"NuEdge - Document Type Uploadation",pageTitle:"NuEdge - Document Type Upload"}
                                  },
                                  /**End */

                                  /**PLAN */
                                  {
                                    path: 'plan',
                                    loadChildren: () => import('./Plan/plan/plan.module').then(m => m.PlanModule),
                                    data: {parentId:4, id: 33, title: "NuEdge - Plan Master", pageTitle: "Plan Master" }
                                  },
                                  {
                                    path: 'planDashboard',
                                    loadChildren: () => import('./Plan/plnDashboard/plnDashboard.module').then(m => m.PlnDashboardModule),
                                    data: {parentId:4, id: 34, title: "NuEdge - Plan Dashboard", pageTitle: "Plan Dashboard" }
                                  },
                                  {
                                    path: 'uploadPln',
                                    loadChildren: () => import('./Plan/uploadPln/uploadPln.module').then(m => m.UploadPlnModule),
                                    data: {parentId:4, id: 35, title: "NuEdge - Plan Uploadation", pageTitle: "Plan Upload" }
                                  },
                                  {
                                    path: 'plnModify',
                                    loadChildren: () => import('./Plan/planModify/planModify.module').then(m => m.PlanModifyModule),
                                    data: {parentId:4, id: 36, title: "NuEdge - Plan Modification", pageTitle: "Plan Modification / Addition" }
                                  },

                                  /**END */

                                /** Options*/
                                {
                                  path: 'option',
                                  loadChildren: () => import('./Option/option/option.module').then(m => m.OptionModule),
                                  data: {parentId:4, id: 37, title: "NuEdge - Option Master", pageTitle: "Option Master" }
                                },
                                {
                                  path: 'optionDashboard',
                                  loadChildren: () => import('./Option/optionDashboard/optionDashboard.module').then(m => m.OptionDashboardModule),
                                  data: {parentId:4, id: 38, title: "NuEdge - Option Dashboard", pageTitle: "Option Dashboard" }
                                },
                                {
                                  path: 'uploadOption',
                                  loadChildren: () => import('./Option/uploadOption/uploadOption.module').then(m => m.UploadOptionModule),
                                  data: {parentId:4, id: 39, title: "NuEdge - Option Uploadation", pageTitle: "Option Upload" }
                                },
                                {
                                  path: 'optionModify',
                                  loadChildren: () => import('./Option/optionModify/optionModify.module').then(m => m.OptionModifyModule),
                                  data: {parentId:4, id: 40, title: "NuEdge - Option Modification", pageTitle: "Option Modification / Addition" }
                                },
                                /**End */



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
