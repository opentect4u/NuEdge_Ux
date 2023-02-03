import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { option } from 'src/app/__Model/option';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-optionModify',
  templateUrl: './optionModify.component.html',
  styleUrls: ['./optionModify.component.css']
})
export class OptionModifyComponent implements OnInit {

  __optId: number = 0;
  __columns: string[] = ['sl_no', 'opt_name', 'edit', 'delete'];
  __selectOpt = new MatTableDataSource<option>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  __optForm = new FormGroup({
    opt_name: new FormControl('', [Validators.required]),
    id: new FormControl(0)
  })
  constructor(private __dbIntr:DbIntrService,private __util: UtiliService,private __router: Router,private __route: ActivatedRoute) { 
    this.previewLatestPlan();
  }

  ngOnInit() {
    this.previewparticularPlan();
  }
  previewLatestPlan(){
    this.__dbIntr.api_call(0,'/option',null).pipe(map((x: responseDT) => x.data)).subscribe((res: option[])=>{
          console.log(res);
          this.__selectOpt = new MatTableDataSource(res);
          this.__selectOpt.paginator =this.paginator;
    })
  }
  previewparticularPlan(){
    if (this.__route.snapshot.queryParamMap.get('id') != null) {
      this.__dbIntr.api_call(0, '/option', 'id=' + atob(this.__route.snapshot.queryParamMap.get('id'))).pipe(map((x: any) => x.data)).subscribe(res => {
        this.populateDT(res[0]);
      })
    }
  }
  populateDT(__items: option) {
    this.setRNT(__items);
    this.__optId = __items.id;
  }
  setRNT(__items: option) {

    this.__optForm.patchValue({
       id:__items.id,
       opt_name:__items.opt_name
    });
  }
  submit(){
    if (this.__optForm.invalid) {
      this.__util.showSnackbar('Submition failed due to some error', 0);
      return;
    }
    const __plan = new FormData();
    __plan.append("opt_name", this.__optForm.value.opt_name);
    __plan.append("id", this.__optForm.value.id);
    this.__dbIntr.api_call(1, '/optionAddEdit', __plan).subscribe((res: any) => {
      if (res.suc == 1) {
        if (this.__optId > 0) {
          if (this.__selectOpt.data.findIndex((x: option) => x.id == res.data.id) != -1) {
            this.updateRow(res.data);
          }
          //if the particular id is not presenet in current list then only route by url with out doing any changes
          this.__router.navigateByUrl('/main/master/optionModify/' + { queryParams: { id: btoa('0') } }, { skipLocationChange: false }).then(res => {
            // set logic if needed
          })
        }
        else {
          this.__selectOpt.data.unshift(res.data);
          this.__selectOpt._updateChangeSubscription();
        }
      }
      this.__util.showSnackbar(res.suc == 1 ? (this.__optId > 0 ? 'Option updated successfully' : 'Option added successfully') : 'Something went wrong! please try again later', res.suc);
      this.reset();

    })
  }
  reset(){
    this.__optForm.reset();
    this.__optForm.patchValue({
      id: 0
    });
    this.__optId = 0;
  }
  updateRow(row_obj: option){
    this.__selectOpt.data = this.__selectOpt.data.filter((value: option, key) => {
      if (value.id == row_obj.id) {
       value.id = row_obj.id,
       value.opt_name = row_obj.opt_name
      }
      return true;
    });
  }

}
