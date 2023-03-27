import { Injectable } from '@angular/core';
import {HttpClient, HttpContext, HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BYPASS_LOG,IS_CACHE } from '../__Interceptors/network.interceptor';
// import { environment } from 'src/environments/environment';
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

 getpaginationData(url){
  console.log(url);

  return this.__http.get<any>(url, { context: new HttpContext().set(BYPASS_LOG,  true) })
 }

 api_call(__flag: number,__url:string, __dt: any,__bypass_log: any | undefined = false){
  if(__flag > 0){
    console.log(__bypass_log);

        return this.__http.post(`${environment.apiUrl + __url}`,__dt,{context: new HttpContext().set(IS_CACHE,  __bypass_log) });
  }
  else{
       var __data = __dt ? '?' + __dt : '';
       return this.__http.get(`${environment.apiUrl + __url + __data}`);
  }
 }


}
