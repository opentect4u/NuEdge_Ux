import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { rnt } from 'src/app/__Model/Rnt';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';

@Component({
  selector: 'app-rntModify',
  templateUrl: './rntModify.component.html',
  styleUrls: ['./rntModify.component.css']
})
export class RntModifyComponent implements OnInit {
  _rtId: number = 0;
  __columns: string[] = ['sl_no', 'rnt_name', 'edit', 'delete'];
  __selectRNT = new MatTableDataSource<rnt>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  __rntForm = new FormGroup({
    rnt_name: new FormControl('', [Validators.required]),
    id: new FormControl(atob(this.__route.snapshot.queryParamMap.get('id')) ? atob(this.__route.snapshot.queryParamMap.get('id')) : 0),
    ofc_address: new FormControl('', [Validators.required]),
    cust_care_no: new FormControl('', [Validators.pattern("^[0-9]*$")]),
    cust_care_email: new FormControl('', [Validators.email]),
    web_site: new FormControl('')
  })
  constructor(public __route: ActivatedRoute,
    private __router: Router,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService) { this.previewlatestRntEntry(); }

  ngOnInit() { this.previewParticularRNT(); }
  preventNonumeric(__ev) {
    dates.numberOnly(__ev)
  }
  submit() {
    const fb = new FormData();
    fb.append("rnt_name", this.__rntForm.value.rnt_name);
    fb.append("id", this.__rntForm.value.id);
    fb.append("cus_care_no", this.__rntForm.value.cust_care_no > 0 ? this.__rntForm.value.cust_care_no : '');
    fb.append("ofc_addr", this.__rntForm.value.ofc_address);
    fb.append("cus_care_email", this.__rntForm.value.cust_care_email);
    fb.append("website", this.__rntForm.value.web_site);
    this.__dbIntr.api_call(1, '/rntAddEdit', fb).subscribe((res: any) => {
      if (res.suc == 1) {
        if (this._rtId > 0) {
          if (this.__selectRNT.data.findIndex((x: rnt) => x.id == res.data.id) != -1) {
            this.updateRow(res.data);
          }
          //if the particular id is not presenet in current list then only route by url with out doing any changes
          this.__router.navigateByUrl('/main/master/rntmodify/' + {queryParams:{id:btoa('0')}}, { skipLocationChange: false }).then(res => {
            // set logic if needed
           })
        }
        else {
          this.__selectRNT.data.unshift(res.data);
          this.__selectRNT._updateChangeSubscription();
        }
      }
      this.__utility.showSnackbar(res.suc == 1 ? (this._rtId > 0 ? 'RNT updated successfully' : 'RNT added successfully') : 'Something went wrong! please try again later', res.suc);
      this.reset();

    })

  }
  populateDT(__items: rnt) {
    this.setRNT(__items);
    this._rtId = __items.id;
    console.log(this._rtId);

  }
  setRNT(__items: rnt) {
    this.__rntForm.patchValue(
      {
        rnt_name: __items.rnt_name != 'null' ? __items.rnt_name : '',
        id: __items.id,
        ofc_address: __items.ofc_addr != 'null' ? __items.ofc_addr : '',
        cust_care_no: __items.cus_care_no > 0 ? __items.cus_care_no : '',
        cust_care_email: __items.cus_care_email != 'null' ? __items.cus_care_email : '',
        web_site: __items.website != 'null' ? __items.website : ''
      }
    );
  }
  previewParticularRNT() {
    if (this.__route.snapshot.queryParamMap.get('id') != null) {
      this.__dbIntr.api_call(0, '/rnt', 'id=' + atob(this.__route.snapshot.queryParamMap.get('id'))).pipe(map((x: any) => x.data)).subscribe(res => {
        this.populateDT(res[0]);
      })
    }
  }
  previewlatestRntEntry() {
    this.__dbIntr.api_call(0, '/rnt', null).pipe((map((x: any) => x.data))).subscribe((res: rnt[]) => {
      this.poulateRNTMst(res);
    })
  }
  poulateRNTMst(_Rnts: rnt[]) {
    this.__selectRNT = new MatTableDataSource(_Rnts);
    this.__selectRNT._updateChangeSubscription();
    this.__selectRNT.paginator = this.paginator;
  }
  reset() {
    this.__rntForm.reset();
    this.__rntForm.patchValue({
      id: 0
    });
    this._rtId = 0;
  }
  private updateRow(row_obj: rnt) {
    this.__selectRNT.data = this.__selectRNT.data.filter((value: rnt, key) => {
      if (value.id == row_obj.id) {
        value.rnt_name = row_obj.rnt_name;
        value.website = row_obj.website;
        value.ofc_addr = row_obj.ofc_addr;
        value.cus_care_no = row_obj.cus_care_no;
        value.cus_care_email = row_obj.cus_care_email
      }
      return true;
    });
  }
  showCorrospondingAMC(__rntDtls:rnt){
    this.__utility.navigatewithqueryparams('/main/master/amcmaster',{queryParams:{id:btoa(__rntDtls.id.toString())}})
  }
}
