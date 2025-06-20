import { Injectable } from '@angular/core';
import {HttpClient, HttpContext, HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BYPASS_LOG,IS_CACHE } from '../__Interceptors/network.interceptor';
@Injectable({
  providedIn: 'root'
})
export class DbIntrService {

constructor(private __http:HttpClient) {

}

/**
 * @description This function is used to search items based on a search term.
 * It makes an HTTP GET request to the specified URL with the search term as a query parameter
 */
 searchItems(__url,__searchTerm):Observable<any>{
  return this.__http.get<any>(`${environment.apiUrl + __url +'?search='+__searchTerm}`, { context: new HttpContext().set(BYPASS_LOG,  true) })
 }
 /**
  * @description This function is used to search items by folio number.
  * It makes an HTTP GET request to the specified URL with the folio number as a query parameter.
  * @param __url - The URL to which the request is sent.
  */
 searchByFolio(__url,__searchTerm):Observable<any>{
  return this.__http.get<any>(`${environment.apiUrl + __url +'?folio_no='+__searchTerm}`, { context: new HttpContext().set(BYPASS_LOG,  true) })
 }
 /**
  * @description This function is used to search items by TIN number.
  * It makes an HTTP GET request to the specified URL with the TIN number as a query parameter.
  * @param __url - The URL to which the request is sent.
  */
 searchTin(__url,__searchTerm):Observable<any>{
  return this.__http.get<any>(`${environment.apiUrl + __url +'?temp_tin_no='+__searchTerm}`, { context: new HttpContext().set(BYPASS_LOG,  true) })
 }
 /**
  * @description This function is used to search items by TIN number for reporting purposes.
  * It makes an HTTP GET request to the specified URL with the TIN number as a query parameter.
  * @param __url - The URL to which the request is sent.
  */
 ReportTINSearch(__url,__searchTerm):Observable<any>{
  return this.__http.get<any>(`${environment.apiUrl + __url +'?tin_no='+__searchTerm}`, { context: new HttpContext().set(BYPASS_LOG,  true) })
 }

 /**
  *   @description This function is used to get pagination data from the specified URL.
  *   It makes an HTTP GET request to the URL with a context that bypasses logging.
  *   @param url - The URL from which to fetch pagination data.
  *   @returns An Observable of type any containing the pagination data.
  */
 getpaginationData(url){
  return this.__http.get<any>(url, { context: new HttpContext().set(BYPASS_LOG,  false) })
 }

 /**
  * @description This function is used to call an API based on the provided API name and data.
  * It makes an HTTP GET request to the specified API URL with the provided data as query parameters.
  */
  callApiOnChange(api_name,dt){
    var __data = dt ? '?' + dt : '';
  return this.__http.get<any>(`${environment.apiUrl + api_name + __data}`,{ context: new HttpContext().set(BYPASS_LOG,  true) })


  }

  /**
   * @description This function is used to make API calls.
   * It can perform both GET and POST requests based on the provided flag.
   * If the flag is greater than 0, it performs a POST request; otherwise, it performs a GET request.
   */
 api_call(__flag: number,
  __url:string,
   __dt: any,
  __bypass_log: any | undefined = false,
  rptProgress:boolean | undefined = false,
  is_nav: boolean | undefined = false
  ){
  if(__flag > 0){
        // return this.__http.post(`${environment.apiUrl + __url}`,
        // __dt,
        // {
        //   context: new HttpContext().set(IS_CACHE,  __bypass_log),
        //   reportProgress: rptProgress
        // });
        return this.__http.post(`${(!is_nav ? environment.apiUrl : environment.nav_url) + __url}`,
        __dt,
        {
          context: new HttpContext().set(BYPASS_LOG,  __bypass_log),
          reportProgress: rptProgress
        });
  }
  else{
       var __data = __dt ? '?' + __dt : '';
       return this.__http.get(`${(!is_nav ? environment.apiUrl : environment.nav_url) + __url + __data}`,{ context: new HttpContext().set(BYPASS_LOG,  __bypass_log) });
  }
 }


 /**
  * @description This function is used to make API calls for the NuEdge online service.
  * It can perform both GET and POST requests based on the provided flag.
  */
 api_call_for_nuedge_online(__flag: number,
  __url:string,
   __dt: any,
  __bypass_log: any | undefined = false,
  rptProgress:boolean | undefined = false
  ){
  if(__flag > 0){
        // return this.__http.post(`${environment.apiUrl + __url}`,
        // __dt,
        // {
        //   context: new HttpContext().set(IS_CACHE,  __bypass_log),
        //   reportProgress: rptProgress
        // });
        return this.__http.post(`${environment.nuedge_onlne_api_url + __url}`,
        __dt,
        {
          context: new HttpContext().set(BYPASS_LOG,  __bypass_log),
          reportProgress: rptProgress
        });
  }
  else{
       var __data = __dt ? '?' + __dt : '';
       return this.__http.get(`${environment.nuedge_onlne_api_url + __url + __data}`,{ context: new HttpContext().set(BYPASS_LOG,  __bypass_log) });
  }
 }


 /**
  *   @description This function is used to make API calls for generating documents.  
  * It can perform both GET and POST requests based on the provided flag.
  * If the flag is greater than 0, it performs a POST request; otherwise, it performs a GET request.
  * @param __flag - The flag indicating whether to perform a GET or POST request.
  */

 api_call_for_gen_doc(__flag: number,
  __url:string,
   __dt: any,
  __bypass_log: any | undefined = false,
  rptProgress:boolean | undefined = false,
  is_nav: boolean | undefined = false
  ){
  if(__flag > 0){
        // return this.__http.post(`${environment.apiUrl + __url}`,
        // __dt,
        // {
        //   context: new HttpContext().set(IS_CACHE,  __bypass_log),
        //   reportProgress: rptProgress
        // });
        return this.__http.post(`${(!is_nav ? environment.protfolio_pdf_gen_url : environment.nav_url) + __url}`,
        __dt,
        {
          context: new HttpContext().set(BYPASS_LOG,  __bypass_log),
          reportProgress: rptProgress
        });
  }
  else{
       var __data = __dt ? '?' + __dt : '';
       return this.__http.get(`${(!is_nav ? environment.protfolio_pdf_gen_url : environment.nav_url) + __url + __data}`,{ context: new HttpContext().set(BYPASS_LOG,  __bypass_log) });
  }
 }

 /**
  * @description This function is used to make API calls with a promise-based approach.
  * It can perform both GET and POST requests based on the provided flag.
  * If the flag is greater than 0, it performs a POST request; otherwise, it performs a GET request.
  */
 call_promise(__flag: number,
  __url:string,
   __dt: any,
  __bypass_log: any | undefined = false,
  rptProgress:boolean | undefined = false,
  is_nav: boolean | undefined = false){
    let promise = new Promise<any>((resolve, reject) => {
                if(__flag > 0){
                  return this.__http.post(`${(!is_nav ? environment.apiUrl : environment.nav_url) + __url}`,
                  __dt,
                  {
                    context: new HttpContext().set(BYPASS_LOG,  __bypass_log),
                    reportProgress: rptProgress
                  }).toPromise().then(
                    res => { // Success
                      // let result = res.json()
                      resolve(res);
                    }
                  );
            }
            else{
                var __data = __dt ? '?' + __dt : '';
                return this.__http.get(`${(!is_nav ? environment.apiUrl : environment.nav_url) + __url + __data}`,
                { context: new HttpContext().set(BYPASS_LOG,  __bypass_log) }).toPromise().then(
                  res => { // Success
                    // console.log(res.json());
                    resolve(res);
                  }
                );
            }
    });
    return promise;
  }

  /**
   * @description This function is used to send an HTML request.
   * It makes an HTTP POST request to the specified URL with the provided payload and header.
   * @param {Object} payload - The data to be sent in the request body.
   */
  sendHtmlRequest(payload,header,url){
    console.log('s')
    return this.__http.post(url,payload,header)
  }

  /**
   * @description This function is used to download a PDF file from the specified URL.
   * It makes an HTTP GET request to the URL and returns the response as a blob.
   * @param {string} url - The URL from which the PDF file will be downloaded.
   * @returns {Observable<any>} An observable that emits the response containing the PDF file as a blob.
   */
  public downloadPdf(url) {
    return this.__http.get(url,{observe:'response',responseType:'blob'});
  }





}
