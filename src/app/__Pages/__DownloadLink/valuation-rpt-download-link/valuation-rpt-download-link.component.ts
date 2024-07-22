import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';

@Component({
  selector: 'app-valuation-rpt-download-link',
  templateUrl: './valuation-rpt-download-link.component.html',
  styleUrls: ['./valuation-rpt-download-link.component.css']
})
export class ValuationRptDownloadLinkComponent implements OnInit {
  is_pdf_valid:boolean = false;
  constructor(private routedtls:ActivatedRoute,
    private route:Router,
    private dbIntr:DbIntrService) {
   }
   getPdf(token){
    const fb = new FormData();
    fb.append('token',token)
    this.dbIntr.api_call(1,'/clients/downloadValuation',fb).pipe(pluck('data')).subscribe((res:any) =>{
          console.log(res);
          this.is_pdf_valid = res.count > 0
    })
   }
  ngOnInit(): void {
    this.routedtls.paramMap.subscribe(res =>{
      console.log(res.get('token'));
      if(res.get('token')){
            this.getPdf(res.get('token'));
      }
      else{
          this.route.navigate(['not-found'])
      }
    })
  }

}
