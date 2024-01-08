import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MfLandingComponent } from './mf-landing.component';
import { RouterModule, Routes } from '@angular/router';

const routes:Routes=[
  {
    path:'',
    component:MfLandingComponent,
    data:{breadcrumb:'Mutual Fund'},
    children:[
      {
        path:'dashboard',
        loadChildren:()=> import('./Dashboard/dashboard.module').then(m => m.DashboardModule),
        data:{title: "NuEdge - MF", pageTitle: "MF"}
      },
      {
        path:'mis',
        loadChildren:()=> import('./MIS/mis.module').then(m => m.MisModule),

      },
      {
        path:'portfolio',
        loadChildren:()=> import('./PortFolio/portfolio.module').then(portfolio => portfolio.PortfolioModule)
      },
      {
        path:'taxpackage',
        loadChildren:()=> import('./TaxPackage/tax-pkg.module').then(taxpackage => taxpackage.TaxPkgModule)
      },
      {
         path:'buinsidetype',
         loadChildren:()=> import('./BIR/business-inside-rpt.module').then(m => m.BusinessInsideRPTModule)
      },
      {
          path:'analyticaltool',
          loadChildren:()=> import('./AnalyticalTool/analytical-tool.module').then(m => m.AnalyticalToolModule)
      },
      {
          path:'finPlan',
          loadChildren:()=> import('./FinancialPLN/fin-plan.module').then(m => m.FinPlanModule)
      },
      {
          path:'research',
          loadChildren:()=> import('./Research/research.module').then(m => m.ResearchModule)
      },
      {
           path:'sipreport',
           loadChildren:()=>import('./SIP/sip-main.module').then(m => m.SipMainModule)
      },
      {
        path:'swpreport',
        loadChildren:()=>import('./SWP/swp-main.module').then(m => m.SwpMainModule)
      },
      {
           path:'stpreport',
          loadChildren:()=>import('./STP/stp-main.module').then(m => m.StpMainModule)
      },
      {
        path:'scmbenchmarkrpt',
        loadChildren:()=> import('./ScmBenchMarkRpt/scm-bnch-mark-rpt.module').then(m => m.ScmBnchMarkRptModule)
      },
      {
        path: 'invStaticRpt',
        loadChildren: () => import('./investor-static-report/investor-static-report.module').then(m => m.InvestorStaticReportModule)
      },
      {path:'',redirectTo:'dashboard',pathMatch:'full'}
    ]
  }]

@NgModule({
  declarations: [
    MfLandingComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class MfLandingModule {}
