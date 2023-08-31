import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { amc } from 'src/app/__Model/amc';

@Component({
  selector: 'mrg-rplc-acq-scm',
  templateUrl: './mrg-rplc-acq-scm.component.html',
  styleUrls: ['./mrg-rplc-acq-scm.component.css']
})
export class MrgRplcAcqScmComponent implements OnInit {

  @Input() parent_id:string | null;

   /**
   * Holding AMC Master data comming from parent component
   */
    @Input() amcMstDt:amc[] = [];

  /**
   * Search Form For Scheme Search
   */
    @Input() search_scm:FormGroup | undefined;

  /**
   * Holding settings for AMC Multiselect Dropdown  comming from Parent Component
   */
    @Input() settings:any;
  constructor() { }

  ngOnInit(): void {
  }

}
