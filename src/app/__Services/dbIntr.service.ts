import { Injectable } from '@angular/core';
import {HttpClient, HttpContext} from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BYPASS_LOG } from '../__Interceptors/network.interceptor';
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

 api_call(__flag: number,__url:string, __dt: any){
  if(__flag > 0){
        return this.__http.post(`${environment.apiUrl + __url}`,__dt);
  }
  else{
       var __data = __dt ? '?' + __dt : '';
       return this.__http.get(`${environment.apiUrl + __url + __data}`);
  }
 }
 

}
