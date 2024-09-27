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

 searchItems(__url,__searchTerm):Observable<any>{
  return this.__http.get<any>(`${environment.apiUrl + __url +'?search='+__searchTerm}`, { context: new HttpContext().set(BYPASS_LOG,  true) })
 }
 searchTin(__url,__searchTerm):Observable<any>{
  return this.__http.get<any>(`${environment.apiUrl + __url +'?temp_tin_no='+__searchTerm}`, { context: new HttpContext().set(BYPASS_LOG,  true) })
 }
 ReportTINSearch(__url,__searchTerm):Observable<any>{
  return this.__http.get<any>(`${environment.apiUrl + __url +'?tin_no='+__searchTerm}`, { context: new HttpContext().set(BYPASS_LOG,  true) })
 }

 getpaginationData(url){
  return this.__http.get<any>(url, { context: new HttpContext().set(BYPASS_LOG,  true) })
 }

  callApiOnChange(api_name,dt){
    var __data = dt ? '?' + dt : '';
  return this.__http.get<any>(`${environment.apiUrl + api_name + __data}`,{ context: new HttpContext().set(BYPASS_LOG,  true) })


  }

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

  sendHtmlRequest(payload,header,url){
    console.log('s')
    return this.__http.post(url,payload,header)
  }

  public downloadPdf(url) {
    return this.__http.get(url,{observe:'response',responseType:'blob'});
  }


}
