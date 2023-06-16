import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { amc } from 'src/app/__Model/amc';
import { rnt } from 'src/app/__Model/Rnt';
import { product } from 'src/app/__Model/__productMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';

@Component({
  selector: 'app-amcModify',
  templateUrl: './amcModify.component.html',
  styleUrls: ['./amcModify.component.css']
})
export class AmcModifyComponent implements OnInit {
  __amcId: number = 0;
  __columns: string[] = ['sl_no', 'amc_name', 'edit', 'delete'];
  __selectAMC = new MatTableDataSource<amc>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  __RntMaster: rnt[] = [];
  __ProductMaster: product[] = [];
  __amcForm = new FormGroup({
    rnt_id: new FormControl('', [Validators.required]),
    product_id: new FormControl('', [Validators.required]),
    amc_name: new FormControl('', [Validators.required]),
    ofc_address: new FormControl('', [Validators.required]),
    cust_care_no: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
    cust_care_email: new FormControl('', [Validators.required, Validators.email]),
    web_site: new FormControl('', [Validators.required]),
    l1_name: new FormControl('', [Validators.required]),
    l1_email: new FormControl('', [Validators.required, Validators.email]),
    l1_contact_no: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
    l2_name: new FormControl('', [Validators.required]),
    l2_email: new FormControl('', [Validators.required, Validators.email]),
    l2_contact_no: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
    l3_name: new FormControl('', [Validators.required]),
    l3_email: new FormControl('', [Validators.required, Validators.email]),
    l3_contact_no: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
    l4_name: new FormControl('', [Validators.required]),
    l4_email: new FormControl('', [Validators.required, Validators.email]),
    l4_contact_no: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
    l5_name: new FormControl(''),
    l5_email: new FormControl(''),
    l5_contact_no: new FormControl(''),
    l6_name: new FormControl(''),
    l6_email: new FormControl(''),
    l6_contact_no: new FormControl(''),
    id: new FormControl(0),
    sip_start_date: new FormControl('', [Validators.required]),
    sip_end_date: new FormControl('', [Validators.required])
  })
  constructor(
    public __route: ActivatedRoute,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    private __router: Router
  ) {
    this.getRNTMaster();
    this.getProductMaster();
    this.previewlatestAmcEntry();
  }

  ngOnInit() {
    this.previewparticularAmc();
  }
  getRNTMaster() {
    this.__dbIntr.api_call(0, '/rnt', null).pipe(map((x: responseDT) => x.data)).subscribe((res: rnt[]) => {
      this.__RntMaster = res;
    })
  }
  previewlatestAmcEntry() {
    this.__dbIntr.api_call(0, '/amc', null).pipe(map((x: responseDT) => x.data)).subscribe((res: amc[]) => {
      this.__selectAMC.data = res;
      this.__selectAMC.paginator = this.paginator;
      this.__selectAMC._updateChangeSubscription();
    })
  }
  previewparticularAmc() {
    if (this.__route.snapshot.queryParamMap.get('id') != null) {
      this.__dbIntr.api_call(0, '/amc', 'id=' + atob(this.__route.snapshot.queryParamMap.get('id'))).pipe(map((x: any) => x.data)).subscribe(res => {
        this.populateDT(res[0]);
      })
    }
  }

  populateDT(__items: amc) {
    this.setRNT(__items);
    this.__amcId = __items.id;
  }
  setRNT(__items: amc) {
    console.log(__items);
    
    this.__amcForm.patchValue({
      amc_name: __items.amc_name,
      product_id: __items.product_id,
      rnt_id: __items.rnt_id,
      id: __items.id,
      web_site: __items.website,
      ofc_address: __items.ofc_addr,
      cust_care_no: __items.cus_care_no > 0 ? __items.cus_care_no : '',
      cust_care_email: __items.cus_care_email,
      sip_start_date: __items.sip_start_date ? __items.sip_start_date : '',
      sip_end_date: __items.sip_end_date ? __items.sip_end_date : '',
      l1_name: __items.l1_name != 'null' ? __items.l1_name : '',
      l1_email: __items.l1_email != 'null' ? __items.l1_email : '',
      l1_contact_no: __items.l1_contact_no > 0 ? __items.l1_contact_no : '',

      l2_name: __items.l2_name != 'null' ? __items.l2_name : '',
      l2_email: __items.l2_email != 'null' ? __items.l2_email : '',
      l2_contact_no: __items.l2_contact_no > 0 ? __items.l2_contact_no : '',

      l3_name: __items.l3_name != 'null' ? __items.l3_name : '',
      l3_email: __items.l3_email != 'null' ? __items.l3_email : '',
      l3_contact_no: __items.l3_contact_no > 0 ? __items.l3_contact_no : '',

      l4_name: __items.l4_name != 'null' ? __items.l4_name : '',
      l4_email: __items.l3_email != 'null' ? __items.l3_email : '',
      l4_contact_no: __items.l4_contact_no > 0 ? __items.l4_contact_no : '',

      l5_name: __items.l5_name != 'null' ? __items.l5_name : '',
      l5_email: __items.l5_email != 'null' ? __items.l5_email : '',
      l5_contact_no: __items.l5_contact_no > 0 ? __items.l5_contact_no : '',

      l6_name: __items.l6_name != 'null' ? __items.l6_name : '',
      l6_email: __items.l6_email != 'null' ? __items.l6_email : '',
      l6_contact_no: __items.l6_contact_no > 0 ? __items.l6_contact_no : ''
    });
  }
  getProductMaster() {
    this.__dbIntr.api_call(0, '/product', null).pipe(map((x: responseDT) => x.data)).subscribe((res: product[]) => {
      this.__ProductMaster = res;
    })
  }
  preventNonumeric(__ev) {
    dates.numberOnly(__ev);
  }
  submit() {
    if (this.__amcForm.invalid) {
      this.__utility.showSnackbar('Submition failed due to some error', 0);
      return;
    }
    const __amc = new FormData();
    __amc.append("amc_name", this.__amcForm.value.amc_name);
    __amc.append("product_id", this.__amcForm.value.product_id);
    __amc.append("rnt_id", this.__amcForm.value.rnt_id);
    __amc.append("cus_care_no", this.__amcForm.value.cust_care_no > 0 ? this.__amcForm.value.cust_care_no : '');
    __amc.append("ofc_addr", this.__amcForm.value.ofc_address);
    __amc.append("cus_care_email", this.__amcForm.value.cust_care_email);
    __amc.append("website", this.__amcForm.value.web_site);
    __amc.append("sip_start_date", this.__amcForm.value.sip_start_date);
    __amc.append("sip_end_date", this.__amcForm.value.sip_end_date);

    __amc.append("l1_name", this.__amcForm.value.l1_name);
    __amc.append("l1_email", this.__amcForm.value.l1_email);
    __amc.append("l1_contact_no", this.__amcForm.value.l1_contact_no > 0 ? this.__amcForm.value.l1_contact_no : '');


    __amc.append("l2_name", this.__amcForm.value.l2_name);
    __amc.append("l2_email", this.__amcForm.value.l2_email);
    __amc.append("l2_contact_no", this.__amcForm.value.l2_contact_no > 0 ? this.__amcForm.value.l2_contact_no : '');

    __amc.append("l3_name", this.__amcForm.value.l3_name);
    __amc.append("l3_email", this.__amcForm.value.l3_email);
    __amc.append("l3_contact_no", this.__amcForm.value.l3_contact_no > 0 ? this.__amcForm.value.l3_contact_no : '');

    __amc.append("l4_name", this.__amcForm.value.l4_name);
    __amc.append("l4_email", this.__amcForm.value.l4_email);
    __amc.append("l4_contact_no", this.__amcForm.value.l4_contact_no > 0 ? this.__amcForm.value.l4_contact_no : '');

    __amc.append("l5_name", this.__amcForm.value.l5_name);
    __amc.append("l5_email", this.__amcForm.value.l5_email);
    __amc.append("l5_contact_no", this.__amcForm.value.l5_contact_no > 0 ? this.__amcForm.value.l5_contact_no : '');

    __amc.append("l6_name", this.__amcForm.value.l6_name);
    __amc.append("l6_email", this.__amcForm.value.l6_email);
    __amc.append("l6_contact_no", this.__amcForm.value.l6_contact_no > 0 ? this.__amcForm.value.l6_contact_no : '');

    __amc.append("id", this.__amcForm.value.id);

    this.__dbIntr.api_call(1, '/amcAddEdit', __amc).subscribe((res: any) => {
      if (res.suc == 1) {
        if (this.__amcId > 0) {
          if (this.__selectAMC.data.findIndex((x: amc) => x.id == res.data.id) != -1) {
            this.updateRow(res.data);
          }
          //if the particular id is not presenet in current list then only route by url with out doing any changes
          this.__router.navigateByUrl('/main/master/amcModify/' + { queryParams: { id: btoa('0') } }, { skipLocationChange: false }).then(res => {
            // set logic if needed
          })
        }
        else {
          this.__selectAMC.data.unshift(res.data);
          this.__selectAMC._updateChangeSubscription();
        }
      }
      this.__utility.showSnackbar(res.suc == 1 ? (this.__amcId > 0 ? 'AMC updated successfully' : 'AMC added successfully') : 'Something went wrong! please try again later', res.suc);
      this.reset();

    })
  }
  private updateRow(row_obj: amc) {
    this.__selectAMC.data = this.__selectAMC.data.filter((value: amc, key) => {
      if (value.id == row_obj.id) {
        value.amc_name = row_obj.amc_name;
        value.product_id = row_obj.product_id;
        value.rnt_id = row_obj.rnt_id;
        value.website = row_obj.website;
        value.sip_start_date = row_obj.sip_start_date;
        value.sip_end_date = row_obj.sip_end_date;


        value.ofc_addr = row_obj.ofc_addr;
        value.cus_care_no = row_obj.cus_care_no;
        value.cus_care_email = row_obj.cus_care_email;

        value.l1_name = row_obj.l1_name;
        value.l1_email = row_obj.l1_email;
        value.l1_contact_no = row_obj.l1_contact_no;

        value.l2_name = row_obj.l2_name;
        value.l2_email = row_obj.l2_email;
        value.l2_contact_no = row_obj.l2_contact_no;

        value.l3_name = row_obj.l3_name;
        value.l3_email = row_obj.l3_email;
        value.l3_contact_no = row_obj.l3_contact_no;

        value.l4_name = row_obj.l4_name;
        value.l4_email = row_obj.l3_email;
        value.l4_contact_no = row_obj.l4_contact_no;

        value.l5_name = row_obj.l5_name;
        value.l5_email = row_obj.l5_email;
        value.l5_contact_no = row_obj.l5_contact_no;

        value.l6_name = row_obj.l6_name;
        value.l6_email = row_obj.l6_email;
        value.l6_contact_no = row_obj.l6_contact_no;

      }
      return true;
    });

  }
  reset() {
    this.__amcForm.reset();
    this.__amcForm.patchValue({
      id: 0
    });
    this.__amcId = 0;
  }
}
