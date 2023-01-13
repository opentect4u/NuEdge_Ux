// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api_url: "https://my-json-server.typicode.com/Uxtrendz/apis/videoList",
  // apiUrl: "https://opentech4u.co.in/nuedge_api/api/v1",
  // clientdocUrl: "https://opentech4u.co.in/nuedge_api/public/client-doc"
  apiUrl:"http://192.168.1.25/nuedge/api/v1",
  clientdocUrl:"http://192.168.1.25/nuedge/public/client-doc/"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
