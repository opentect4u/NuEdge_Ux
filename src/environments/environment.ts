// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const url = "http://192.168.1.5/nuedge/"; // Local URL
// const url = "https://opentech4u.co.in/nuedge_api/"; //Server URL
// const url = "http://localhost/nuedge/"; //Own Machine

export const environment = {
  production: false,
  // apiUrl: 'https://opentech4u.co.in/nuedge_api/api/v1',
  // clientdocUrl: 'https://opentech4u.co.in/nuedge_api/public/client-doc/',
  // app_formUrl: 'https://opentech4u.co.in/nuedge_api/public/application-form/',
  // ack_formUrl:'https://opentech4u.co.in/nuedge_api/public/acknowledgement-copy/',
  // kyc_formUrl:"https://opentech4u.co.in/nuedge_api/public/kyc-form/",
  // kyc_ack_form_url: "https://opentech4u.co.in/nuedge_api/public/kyc-acknowledgement-copy/",
  // app_formUrl_ins:"https://opentech4u.co.in/nuedge_api/public/ins-application-form/",
  // ack_formUrl_for_ins:"https://opentech4u.co.in/nuedge_api/public/ins-acknowledgement-copy/",
  // manual_update_formUrl_for_ins:"https://opentech4u.co.in/nuedge_api/public/ins-policy-copy/",
  // manual_update_formUrl_for_fd:"https://opentech4u.co.in/nuedge_api/public/fd-policy-copy/",
  // ins_app_form_url: "https://opentech4u.co.in/nuedge_api/public/ins-application-form/",
  // ack_formUrl_for_fd:"https://opentech4u.co.in/nuedge_api/public/fd-acknowledgement-copy/",
  // cert_delivery_cu_pod:"https://opentech4u.co.in/nuedge_api/public/fd-pod-copy/",
  // cert_delivery_recv_ack:"https://opentech4u.co.in/nuedge_api/public/fd-received-ack/",
  // soa_copy_url:"https://opentech4u.co.in/nuedge_api/public/soa_copy/",
  // amc_logo_url:"https://opentech4u.co.in/nuedge_api/public/amc-logo/",
  // scheme_upload_forms:"https://opentech4u.co.in/nuedge_api/public/application-forms/"




   /****** NuEdge *****/
  // apiUrl:"https://opentech4u.co.in/nuedge_api/api/v1",
  // clientdocUrl:"https://opentech4u.co.in/nuedge_api/public/client-doc/",

  //   /*************COMPANY START **********************/
  //   company_logo_url: "https://opentech4u.co.in/nuedge_api/public/company/",
  //   /*************END ***************************** */
  //  /*********************Start KYC *************************/
  // kyc_formUrl:"https://opentech4u.co.in/nuedge_api/public/kyc-form/",
  // kyc_ack_form_url: "https://opentech4u.co.in/nuedge_api/public/kyc-acknowledgement-copy/",
  // kyc_scan_copy: "https://opentech4u.co.in/nuedge_api/public/kyc-scan-copy/",
  // kyc_reject_memo: "https://opentech4u.co.in/nuedge_api/public/kyc-reject-memo/",
  // /******************END KYC****************/

  // ack_formUrl_for_ins:"https://opentech4u.co.in/nuedge_api/public/ins-acknowledgement-copy/",
  // manual_update_formUrl_for_ins:"https://opentech4u.co.in/nuedge_api/public/ins-policy-copy/",
  // manual_update_formUrl_for_fd:"https://opentech4u.co.in/nuedge_api/public/fd-policy-copy/",
  // ins_app_form_url: "https://opentech4u.co.in/nuedge_api/public/ins-application-form/",
  // renwal_bu_frm_url:"http://192.168.1.5/nuedge/public/renewal-application-form/",

  // app_formUrl_fd:"https://opentech4u.co.in/nuedge_api/public/fd-application-form/",
  // ack_formUrl_for_fd:"https://opentech4u.co.in/nuedge_api/public/fd-acknowledgement-copy/",
  // cert_delivery_cu_pod:"https://opentech4u.co.in/nuedge_api/public/fd-pod-copy/",
  // cert_delivery_recv_ack:"https://opentech4u.co.in/nuedge_api/public/fd-received-ack/",

  // //******************************* Start MUTUAL FUND************************************/
  // app_formUrl:"https://opentech4u.co.in/nuedge_api/public/application-form/",
  // ack_formUrl:"https://opentech4u.co.in/nuedge_api/public/acknowledgement-copy/",
  // soa_copy_url:"https://opentech4u.co.in/nuedge_api/public/soa-copy/",
  // reject_memo: "https://opentech4u.co.in/nuedge_api/public/reject-memo/",
  // /********************************* End MUTUAL FUND **************************************/
  // amc_logo_url:"https://opentech4u.co.in/nuedge_api/public/amc-logo/",
  // scheme_upload_forms:"https://opentech4u.co.in/nuedge_api/public/application-forms/",
  // /****** END *******/
  // commonURL:"https://opentech4u.co.in/nuedge_api/public/"








  /****** NuEdge  Start*****/

  apiUrl:url + "api/v1",
  clientdocUrl:url + "public/client-doc/",

  /*************MAIL BACK LINK MANUAL UPLOAD**********/
  manualUpload: url + "public/mailback/manual/",
  /*************END******************************** */

  /*************COMPANY START **********************/
  company_logo_url: url + "public/company/",
  /*************END ***************************** */
   /*********************Start KYC *************************/
  kyc_formUrl:url + "public/kyc-form/",
  kyc_ack_form_url: url + "public/kyc-acknowledgement-copy/",
  kyc_scan_copy: url + "public/kyc-scan-copy/",
  kyc_reject_memo: "http//192.168.1.5/nuedge/public/kyc-reject-memo/",
  /******************END KYC****************/


  //******************************* Start Insurance************************************/
  ins_app_form_url: url + "public/ins-application-form/",
  ack_formUrl_for_ins:url + "public/ins-acknowledgement-copy/",
  manual_update_formUrl_for_ins:url + "public/ins-policy-copy/",
  renwal_bu_frm_url:url + "public/ins-business-opp/",
    /******************************End Insurance******************************************************** */
//******************************* Start Fd************************************/
  app_formUrl_fd:url + "public/fd-application-form/",
  ack_formUrl_for_fd:url + "public/fd-acknowledgement-copy/",
  cert_delivery_cu_pod:url + "public/fd-pod-copy/",
  cert_delivery_recv_ack:url + "public/fd-received-ack/",
  manual_update_formUrl_for_fd:url + "public/fd-policy-copy/",

  /********************************* End Fd**************************************/


  //******************************* Start MUTUAL FUND************************************/
  app_formUrl:url + "public/application-form/",
  ack_formUrl:url + "public/acknowledgement-copy/",
  soa_copy_url:url + "public/soa-copy/",
  reject_memo: "http//192.168.1.5/nuedge/public/reject-memo/",
  /********************************* End MUTUAL FUND **************************************/
  amc_logo_url:url + "public/amc-logo/",
  scheme_upload_forms:url + "public/application-forms/",
  /************************************************************************************** */
  commonURL:url + "public/"



  /****** NuEdge END *******/


  //Tribarna
  // apiUrl:"http://192.168.1.245/nuedge/api/v1",
  // clientdocUrl:"http://192.168.1.245/nuedge/public/client-doc/",
  // app_formUrl:"http://192.168.1.245/nuedge/public/application-form/"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
