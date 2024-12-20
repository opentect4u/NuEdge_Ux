import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';

@Component({
  selector: 'app-customer-service-attachment-download',
  templateUrl: './customer-service-attachment-download.component.html',
  styleUrls: ['./customer-service-attachment-download.component.css']
})
export class CustomerServiceAttachmentDownloadComponent implements OnInit {

  pdfURL:SafeResourceUrl;
  constructor(private rtDt: ActivatedRoute,
     private router:Router,
    private sanitizer: DomSanitizer,
    private dbIntr:DbIntrService) { }

  ngOnInit(): void {
    this.rtDt.params.subscribe(res =>{
      if(res.queryId){
        this.fetchAttachmentsForCustomerService(res.queryId);
      }
      else{
        this.router.navigate(['not-found']);
      }
    })
  }

  fetchAttachmentsForCustomerService = (query_id) =>{
      const fd = new FormData();
      fd.append('query_id',query_id);
      this.dbIntr.api_call(
        1,
        '/cus_service/downloadFile',
        fd
      ).subscribe((res:any) =>{
        console.log(res);
        this.pdfURL = this.sanitizer.bypassSecurityTrustResourceUrl(res.data);
        // fetch(
        //   res.data
        // ).then(ele => ele.blob()).then(el => {
        //   if(res.data){
        //     const ext = res.data.split('.').pop().split(/\#|\?/)[0];
        //     const aElement = document.createElement('a');
        //     aElement.setAttribute('download', `file.${ext}`);
        //     const href = URL.createObjectURL(el);
        //     aElement.href = href;
        //     aElement.setAttribute('target', '_blank');
        //     aElement.click();
        //     URL.revokeObjectURL(href);
        //     // window.close();
        //   }
          
        // })
      })
  } 


}
