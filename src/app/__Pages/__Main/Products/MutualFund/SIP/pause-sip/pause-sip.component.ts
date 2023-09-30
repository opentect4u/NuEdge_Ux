import { Component, Input, OnInit } from '@angular/core';
import { amc } from 'src/app/__Model/amc';

@Component({
  selector: 'pause-sip',
  templateUrl: './pause-sip.component.html',
  styleUrls: ['./pause-sip.component.css']
})
export class PauseSIPComponent implements OnInit {

  __title: string = 'Pause SIP Report';

  @Input() sip_stp_swp_type_mst:any = [];

    /**
   * For Holding AMC Master Data
   */
    @Input() amc: amc[] = [];

    /**
     *
     */
    @Input() sipType: string;

    /**
     *
     */
    @Input() report_type:string;

  constructor() { }

  ngOnInit(): void {
  }


  searchSipReport(ev){
    console.log(ev);

  }

}
