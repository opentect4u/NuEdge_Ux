import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';

@Component({
  selector: 'app-query-dtls',
  templateUrl: './query-dtls.component.html',
  styleUrls: ['./query-dtls.component.css']
})
export class QueryDtlsComponent implements OnInit {

  constructor(private urlData:ActivatedRoute,private dbIntr:DbIntrService) { }
  query_dtls:any;
  ngOnInit(): void {
    this.fetchQueryDetails(this.urlData.snapshot.paramMap.get('query_id'))
  }

  /**
   * 
   * @description This function fetches the details of a query based on the provided query_id.
   * It makes an API call to the backend service to retrieve the query details.
   * The response is then processed to extract relevant information such as amc_name and scheme_name.
   */
  fetchQueryDetails = (query_id:string) =>{
      // console.log(query_id)
      // eyJpdiI6IlViYk5XRythYjFwVTltTy9KYnJaZ1E9PSIsInZhbHVlIjoiSUlLMFgyY3prL0kvMktRcC93WVFDUmwzMGxCWDcyTU1qWlY0dUVkbTdzMD0iLCJtYWMiOiIxODczYjBjZDQwOGI5Njc1NGMzY2YyYzg2YWM0NmExZGMxMjRmYzA0ZTAzZjA3YTkzOGY3ZGQ5ODc4ZTAwNjVlIiwidGFnIjoiIn0=
      this.dbIntr.api_call(1,`/cus_service/queryShowDetails?query_id=${query_id}`,null)
      .pipe(pluck('data'))
      .subscribe((res:any) =>{
            this.query_dtls = {
              ...res,
              amc_name:res.allscheme.length > 0 ?  res?.allscheme[0]?.schemename?.amc_name : '',
              scheme_name:res.allscheme.map(el => el?.schemename?.scheme_name).toString()
            };
      })
  }

}
