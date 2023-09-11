import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { amc } from 'src/app/__Model/amc';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-mrg-rplc-acq-home',
  templateUrl: './mrg-rplc-acq-home.component.html',
  styleUrls: ['./mrg-rplc-acq-home.component.css']
})
export class MrgRplcAcqHomeComponent implements OnInit {

    /**
     * Holding flag of this Component
     */
    flag:string | null;
    /**
     * Holding Parent ID of this Component
     */
    parent_id:string | null;

    /**
     * Holding AMC Master data and share between MERGE/REPLACE/ACQUISITION-AMC/SCHEME
     */
    amcMst:amc[] = [];

    /**
     * Holding settings for AMC Multiselect Dropdown
     */
    settings;

    /**
     *  Form For search AMC / Scheme
     */
     searchFrm_Amc_Scm = new FormGroup({
       amc_id:new FormControl(
        atob(this.route.snapshot.params.flag) == 'A' ? '' : [],
        {updateOn:atob(this.route.snapshot.params.flag) == 'A' ? 'change' : 'blur'}
        ),
       cat_id: new FormControl([],{updateOn:'blur'}),
       sub_cat_id:new FormControl([],{updateOn:'blur'}),
       amc_name:new FormControl(''),
     })


    /**
     * @param __utility => inject UtilService
     * @param dbIntr  => inject DbIntrService
     * @param route  => inject ActivatedRoute
     */
    constructor(private __utility:UtiliService,private dbIntr:DbIntrService,private route:ActivatedRoute) {

    this.flag= atob(route.snapshot.params.flag);

    /** Get Parent Component route Access for getting the parent Id*/
    route.parent.parent.data.subscribe(res =>{
      this.parent_id = res.data.id;
      if(atob(route.snapshot.params.flag)  == 'S'){
      this.settings = this.__utility.settingsfroMultiselectDropdown(
        'id',
        'amc_short_name',
        'Search AMC',
        1,
        139,
        // res.data.id == '44' ? false : true
        true
      );
    }
    })
    /************************End************************************/
  }

  ngOnInit(): void {
    if(this.flag == 'S'){
      this.getAmsMst();
    }
  }

  getAmsMst = () =>{
      this.dbIntr.api_call(0,'/amc',null).pipe(pluck("data")).subscribe((res: amc[]) =>{
        this.amcMst = res;
      })
  }

}


