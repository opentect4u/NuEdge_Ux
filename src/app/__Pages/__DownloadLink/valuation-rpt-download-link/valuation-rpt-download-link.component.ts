import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { AU_TK } from 'src/app/strings/localStorage_key';
import { environment, url } from 'src/environments/environment';

@Component({
  selector: 'app-valuation-rpt-download-link',
  templateUrl: './valuation-rpt-download-link.component.html',
  styleUrls: ['./valuation-rpt-download-link.component.css']
})
export class ValuationRptDownloadLinkComponent implements OnInit {

  hasLocalStorage: string = localStorage.getItem(AU_TK);
  @ViewChild('link') linkRef: ElementRef
  is_pdf_valid: boolean = false;
  pdf_url: string = '';
  constructor(private routedtls: ActivatedRoute,
    private route: Router,
    private dbIntr: DbIntrService) {
  }
  getPdf(token) {
    console.log(this.hasLocalStorage)
    const fb = new FormData();
    fb.append('token', token)
    this.dbIntr.api_call(1, 
      '/clients/downloadValuation', 
      
      fb).pipe(pluck('data')).subscribe((res: any) => {
      this.is_pdf_valid = res.count > 0;
      this.pdf_url = res.details.length > 0 ? res.details[0].url : 'err';
      if (res.count > 0) {
        fetch(
          this.pdf_url
        ).then(res => res.blob()).then(res => {
          const aElement = document.createElement('a');
          aElement.setAttribute('download', 'VALUATIONREPORT.pdf');
          const href = URL.createObjectURL(res);
          aElement.href = href;
          aElement.setAttribute('target', '_blank');
          aElement.click();
          URL.revokeObjectURL(href);
        })
      }

    })
  }
  ngOnInit(): void {
    this.routedtls.paramMap.subscribe(res => {
      console.log(res.get('token'));
      if (res.get('token')) {
        this.getPdf(res.get('token'));
      }
      else {
        this.route.navigate(['not-found'])
      }
    })
  }
}
