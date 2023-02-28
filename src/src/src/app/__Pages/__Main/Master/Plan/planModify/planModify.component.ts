import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { plan } from 'src/app/__Model/plan';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-planModify',
  templateUrl: './planModify.component.html',
  styleUrls: ['./planModify.component.css']
})
export class PlanModifyComponent implements OnInit {
  __planId: number = 0;
  __columns: string[] = ['sl_no', 'plan_name', 'edit', 'delete'];
  __selectPLN = new MatTableDataSource<plan>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  __plnForm = new FormGroup({
    plan_name: new FormControl('', [Validators.required]),
    id: new FormControl(0)
  })
  constructor(private __dbIntr:DbIntrService,private __util: UtiliService,private __router: Router,private __route: ActivatedRoute) { 
    this.previewLatestPlan();
  }

  ngOnInit() {
    this.previewparticularPlan();
  }
  previewLatestPlan(){
    this.__dbIntr.api_call(0,'/plan',null).pipe(map((x: responseDT) => x.data)).subscribe((res: plan[])=>{
          this.__selectPLN = new MatTableDataSource(res);
          this.__selectPLN.paginator =this.paginator;
    })
  }
  previewparticularPlan(){
    if (this.__route.snapshot.queryParamMap.get('id') != null) {
      this.__dbIntr.api_call(0, '/plan', 'id=' + atob(this.__route.snapshot.queryParamMap.get('id'))).pipe(map((x: any) => x.data)).subscribe(res => {
        this.populateDT(res[0]);
      })
    }
  }
  populateDT(__items: plan) {
    this.setRNT(__items);
    this.__planId = __items.id;
  }
  setRNT(__items: plan) {

    this.__plnForm.patchValue({
       id:__items.id,
       plan_name:__items.plan_name
    });
  }
  submit(){
    if (this.__plnForm.invalid) {
      this.__util.showSnackbar('Submition failed due to some error', 0);
      return;
    }
    const __plan = new FormData();
    __plan.append("plan_name", this.__plnForm.value.plan_name);
    __plan.append("id", this.__plnForm.value.id);
    this.__dbIntr.api_call(1, '/planAddEdit', __plan).subscribe((res: any) => {
      if (res.suc == 1) {
        if (this.__planId > 0) {
          if (this.__selectPLN.data.findIndex((x: plan) => x.id == res.data.id) != -1) {
            this.updateRow(res.data);
          }
          //if the particular id is not presenet in current list then only route by url with out doing any changes
          this.__router.navigateByUrl('/main/master/plnModify/' + { queryParams: { id: btoa('0') } }, { skipLocationChange: false }).then(res => {
            // set logic if needed
          })
        }
        else {
          this.__selectPLN.data.unshift(res.data);
          this.__selectPLN._updateChangeSubscription();
        }
      }
      this.__util.showSnackbar(res.suc == 1 ? (this.__planId > 0 ? 'PLAN updated successfully' : 'PLAN added successfully') : 'Something went wrong! please try again later', res.suc);
      this.reset();

    })
  }
  reset(){
    this.__plnForm.reset();
    this.__plnForm.patchValue({
      id: 0
    });
    this.__planId = 0;
  }
  updateRow(row_obj: plan){
    this.__selectPLN.data = this.__selectPLN.data.filter((value: plan, key) => {
      if (value.id == row_obj.id) {
       value.id = row_obj.id,
       value.plan_name = row_obj.plan_name
      }
      return true;
    });
  }
}
