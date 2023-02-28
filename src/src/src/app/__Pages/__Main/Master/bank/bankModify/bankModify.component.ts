import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { bank } from 'src/app/__Model/__bank';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';

@Component({
  selector: 'app-bankModify',
  templateUrl: './bankModify.component.html',
  styleUrls: ['./bankModify.component.css']
})
export class BankModifyComponent implements OnInit {
  __bankForm = new FormGroup({
    ifs_code: new FormControl('', [Validators.required]),
    bank_name: new FormControl('', [Validators.required]),
    id: new FormControl(0),
    branch_name: new FormControl('',[Validators.required]), 
    micr_code:new FormControl('',[Validators.required]), 
    branch_addr:new FormControl('',[Validators.required])
  })
  __bankId: number = 0;
  __columns: string[] = ['sl_no', 'bank_name', 'edit', 'delete'];
  __selectbnk = new MatTableDataSource<bank>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public __route: ActivatedRoute,
    private __router: Router,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService) { this.previewlatestbankEntry();}

  ngOnInit() { this.previewParticularBank(); }
  preventNonumeric(__ev) {
    dates.numberOnly(__ev)
  }

  submit() {
    if (this.__bankForm.invalid) {
      this.__utility.showSnackbar('Submition failed due to some error',0);
      return;
    }
    const __bank = new FormData();
    __bank.append("ifs_code",this.__bankForm.value.ifs_code);
    __bank.append("bank_name",this.__bankForm.value.bank_name);
    __bank.append("id",this.__bankForm.value.id);
    __bank.append("branch_name",this.__bankForm.value.branch_name);
    __bank.append("micr_code",this.__bankForm.value.micr_code);  
    __bank.append("branch_addr",this.__bankForm.value.branch_addr);


    this.__dbIntr.api_call(1, '/depositbankAddEdit', __bank).subscribe((res: any) => {
      if (res.suc == 1) {
        if (this.__bankId > 0) {
          if (this.__selectbnk.data.findIndex((x: bank) => x.id == res.data.id) != -1) {
            this.updateRow(res.data);
          }
          //if the particular id is not presenet in current list then only route by url with out doing any changes
          this.__router.navigateByUrl('/main/master/bnkModify/' + {queryParams:{id:btoa('0')}}, { skipLocationChange: false }).then(res => {
            // set logic if needed
           })
        }
        else {
          this.__selectbnk.data.unshift(res.data);
          this.__selectbnk._updateChangeSubscription();
        }
      }
      this.__utility.showSnackbar(res.suc == 1 ? (this.__bankId > 0 ? 'Bank updated successfully' : 'Bank added successfully') : 'Something went wrong! please try again later', res.suc);
      this.reset();
    })

  }
  populateDT(__items: bank) {
    this.setRNT(__items);
    this.__bankId = __items.id;
  }
  setRNT(__items: bank) {
    this.__bankForm.setValue({
      ifs_code: __items.ifs_code,
      bank_name: __items.bank_name,
      id: __items.id,
      branch_name:__items.branch_name,
      micr_code:__items.micr_code,
      branch_addr:__items.branch_addr
    });
  }
  previewParticularBank() {
    if (this.__route.snapshot.queryParamMap.get('id') != null) {
      this.__dbIntr.api_call(0, '/depositbank', 'id=' + atob(this.__route.snapshot.queryParamMap.get('id'))).pipe(map((x: any) => x.data)).subscribe(res => {
        this.populateDT(res[0]);
      })
    }
  }
  previewlatestbankEntry() {
    this.__dbIntr.api_call(0, '/depositbank', null).pipe((map((x: any) => x.data))).subscribe((res: bank[]) => {
      this.populateCategory(res);
    })
  }
  populateCategory(_Rnts: bank[]) {
    this.__selectbnk = new MatTableDataSource(_Rnts);
    this.__selectbnk._updateChangeSubscription();
    this.__selectbnk.paginator = this.paginator;
  }
  reset() {
    this.__bankForm.reset();
    this.__bankForm.patchValue({
      id: 0
    });
    this.__bankId = 0;
  }
  private updateRow(row_obj: bank) {
    this.__selectbnk.data = this.__selectbnk.data.filter((value: bank, key) => {
      if (value.id == row_obj.id) {
        value.bank_name = row_obj.bank_name;
        value.ifs_code = row_obj.ifs_code;
        value.branch_name=row_obj.branch_name;
        value.micr_code=row_obj.micr_code;
        value.branch_addr=row_obj.branch_addr;
      }
      return true;
    });
  }
}
