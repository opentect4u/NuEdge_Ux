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

  fetchQueryDetails = (query_id:string) =>{
      console.log(query_id)
      this.dbIntr.api_call(1,`/cus_service/queryShow?id=${13}`,null)
      .pipe(pluck('data'))
      .subscribe(res =>{
            console.log(res);
            this.query_dtls = res;
      })
  }

}
