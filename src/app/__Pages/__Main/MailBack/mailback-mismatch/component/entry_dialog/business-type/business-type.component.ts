import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import buisnessType from '../../../../../../../../assets/json/buisnessType.json';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UtiliService } from '../../../../../../../__Services/utils.service';
import { DbIntrService } from '../../../../../../../__Services/dbIntr.service';
import { Overlay } from '@angular/cdk/overlay';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { global } from '../../../../../../../__Utility/globalFunc';
import { responseDT } from '../../../../../../../__Model/__responseDT';
import { ADD_MESSAGE, ERROR_MESSAGE, MAP_BU_TYPE } from 'src/app/strings/message';

@Component({
  selector: 'app-business-type',
  templateUrl: './business-type.component.html',
  styleUrls: ['./business-type.component.css']
})
export class BusinessTypeComponent implements OnInit {

  /**
   * Hold Business Type and populate in select dropdown
   */
  _bu_type = buisnessType;

  /**
   * EUIN List hide show
   */
  display_Euin: string | undefined = 'none';

  /**
   * EUIN loader hide /show
   */
  isEuinPending: boolean = false;

  /**
   * Holding EUIN
   */
  __euin_mst: any = [];


  /**
   * SUB BROKER ARN LOADER VISIBILITY
   */
  __isSubBrkArnSpinner: boolean = false;

  /**
   * SUB BROKER ARN MASTER DATA HOLDER
   */
  __subbrkArnMst: any = [];

  /**
   * SUB BROKER LIST VISIBILITY
   */
  displayMode_forSub_arn_no: string | undefined = 'none'



  /**
   * Business Type Form
   */
  business_form = new FormGroup({
    bu_type_id: new FormControl('', [Validators.required]),
    euin_no: new FormControl('', [Validators.required]),
    sub_brk_cd: new FormControl(''),
    sub_arn_no: new FormControl(''),
    id: new FormControl(this.data.id)
  })

  constructor(
    public dialogRef: MatDialogRef<BusinessTypeComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog,
    private overlay: Overlay
  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }

  ngAfterViewInit() {

    // EUIN NUMBER SEARCH
    this.business_form.controls['euin_no'].valueChanges
      .pipe(
        tap(() => (this.isEuinPending = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1
            ? this.__dbIntr.searchItems(
              '/employee',
              (global.containsSpecialChars(dt) ? dt.split(' ')[0] : dt) +
              (this.business_form.value.bu_type_id == 'B'
                ? (this.business_form.controls['sub_arn_no'].value
                  ? ('&sub_arn_no=' +
                  this.business_form.controls['sub_arn_no'].value.split(' ')[0])
                  : '&sub_arn_no=""')
                : '')
            )
            : []
        ),
        map((x: responseDT) => x.data),
        tap(() => (this.isEuinPending = false))
      )
      .subscribe({
        next: (value) => {
          this.__euin_mst = value;
          this.searchResultVisibilityForEuin('block');
          this.isEuinPending = false;
        },
        complete: () => console.log(''),
        error: (err) => console.log(),
      });


      // SUB ARN NUMBER SEARCHABLE

    this.business_form.controls['sub_arn_no'].valueChanges
      .pipe(
        tap(() => (
          this.__isSubBrkArnSpinner = true,
          this.business_form.controls['sub_brk_cd'].setValue('')
        )),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.__dbIntr.searchItems('/showsubbroker', dt) : []
        ),
        map((x: responseDT) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.__subbrkArnMst = value;
          this.searchResultVisibilityForSubBrkArn('block');
          this.business_form.controls['sub_brk_cd'].setValue('');
          this.__isSubBrkArnSpinner = false;
        },
        complete: () => console.log(''),
        error: (err) => {
          this.__isSubBrkArnSpinner = false;
        },
      });


      //Business Type Change
    this.business_form.get('bu_type_id').valueChanges.subscribe((res) => {
      this.business_form.controls['sub_arn_no'].setValue('', {
        onlySelf: true,
        emitEvent: false,
      });
      this.business_form.controls['euin_no'].setValue('', {
        onlySelf: true,
        emitEvent: false,
      });
      this.business_form.controls['sub_brk_cd'].setValue('', {
        onlySelf: true,
        emitEvent: false,
      });
      if (res == 'B') {
        this.setValidations([
          { name: 'sub_brk_cd', valid: [Validators.required] },
          { name: 'sub_arn_no', valid: [Validators.required] },
        ]);
      } else {
        this.removeValidations([
          { name: 'sub_brk_cd', valid: [Validators.required] },
          { name: 'sub_arn_no', valid: [Validators.required] },
        ]);
      }
    });
  }

  setValidations(__frmCtrl) {
    __frmCtrl.forEach((element) => {
      this.business_form.controls[element.name].setValidators(element.valid);
      this.business_form.controls[element.name].updateValueAndValidity({
        emitEvent: false,
      });
    });
  }
  removeValidations(__frmCtrl) {
    __frmCtrl.forEach((element) => {
      this.business_form.controls[element.name].removeValidators(element.valid);
      this.business_form.controls[element.name].updateValueAndValidity({
        emitEvent: false,
      });
    });
  }
  searchResultVisibilityForEuin = (display_mode: string) => {
    this.display_Euin = display_mode;
  }

  getSelectedItemsFromParent = (ev) => {
    console.log(ev.item);
    switch (ev.flag) {
      case 'E': this.business_form.controls['euin_no'].setValue(
        ev.item.euin_no + ' - ' + ev.item.emp_name,
        { onlySelf: true, emitEvent: false }
      );
        this.searchResultVisibilityForEuin('none');
        break;

      case 'S': this.business_form.controls['sub_arn_no'].reset(ev.item.arn_no, {
                onlySelf: true,
                emitEvent: false,
              });
        this.business_form.controls['sub_brk_cd'].setValue(ev.item.code);
                this.searchResultVisibilityForSubBrkArn('none');
                break;
    }

  }

  searchResultVisibilityForSubBrkArn = (display_mode: string) => {
    this.displayMode_forSub_arn_no = display_mode;
  }

  submitBusinessType = () => {
    let object = Object.assign({}, this.business_form.getRawValue(), {
      ...this.data.transaction,
      sub_file_type:this.data.sub_file_type,
      file_type:this.data.file_type,
      new_euin_no: this.business_form.getRawValue().euin_no ?
        (global.containsSpecialChars(this.business_form.getRawValue().euin_no)
          ? this.business_form.getRawValue().euin_no.split(' ')[0] : this.business_form.getRawValue().euin_no) : '',
      new_bu_type_id:  this.business_form.getRawValue().bu_type_id,
      new_sub_arn_no:  this.business_form.getRawValue().bu_type_id == 'B' ? global.getActualVal(this.business_form.getRawValue().sub_arn_no) : '',
      new_sub_brk_cd:  this.business_form.getRawValue().bu_type_id == 'B' ? global.getActualVal(this.business_form.getRawValue().new_sub_brk_cd) : '',
    });
    console.log(object);
    this.__dbIntr.api_call(1, '/mailbackMismatchLock', this.__utility.convertFormData(object))
     .subscribe((res: any) => {
       if (res.suc == 1) {
         this.dialogRef.close(res);
       }
      this.__utility.showSnackbar(res.suc == 1 ? MAP_BU_TYPE : ERROR_MESSAGE,res.suc);
     })

  }
}
