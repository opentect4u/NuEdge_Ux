// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const url = "http://192.168.1.11/nuedge/";
// export const url = "https://nuedgecorporate.co.in/nuedge_api/";


// const nav_url = "http://127.0.0.1:8000";
export const environment = {
  production: false,
  /****** NuEdge  Start*****/
  nav_url : "http://192.168.1.6:8000", // local
  // nav_url:'https://pyapi.nuedgecorporate.co.in', // server
  apiUrl:url + "api/v1",
  clientdocUrl:url + "public/client-doc/",

  /*************MAIL BACK LINK MANUAL UPLOAD**********/
  manualUpload: url + "public/mailback/manual/",
  /*************END******************************** */

  /*************COMPANY START *~*********************/
  company_logo_url: url + "public/company/",
  /*************END ***************************** */
   /*********************Start KYC *************************/
  kyc_formUrl:url + "public/kyc-form/",
  kyc_ack_form_url: url + "public/kyc-acknowledgement-copy/",
  kyc_scan_copy: url + "public/kyc-scan-copy/",
  kyc_reject_memo: url + "public/kyc-reject-memo/",
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
  reject_memo: url + "public/reject-memo/",
  /********************************* End MUTUAL FUND **************************************/
  amc_logo_url:url + "public/amc-logo/",
  scheme_upload_forms:url + "public/application-forms/",
  /************************************************************************************** */
  commonURL:url + "public/"
  /****** NuEdge END *******/
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
