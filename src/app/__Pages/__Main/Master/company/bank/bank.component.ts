import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { pluck } from 'rxjs/operators';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { bankClmns } from 'src/app/__Utility/Master/Company/bank';
import { global } from 'src/app/__Utility/globalFunc';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit {
   chq_url =`${environment.company_logo_url + '/bank-chq/'}`;
   cmpId: number;
   TabMenu: any = [];
   @Input() set cmpDtlsMst(value){
    this.TabMenu = value.map(({id,name,establishment_name,type_of_comp}) => ({id,tab_name:type_of_comp == 4 ? establishment_name : name,img_src:''}))

  };
  //  @Input() bankMstDtls : any=[];
    bankMstDtls : any=[];

   columns:column[] = bankClmns.columns;
   bank = new FormGroup({
    bnkDtls: new FormArray([])
   })
  constructor(private utility: UtiliService,private dbIntr: DbIntrService,private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
   this.cmpId = this.TabMenu[0].id;
   this.getbankDtls(this.cmpId);

   this.addBank();
  }

  /**
   *  * This function is used to get the bank details form array.
   *  * It returns the FormArray instance containing the bank details.
   *  * @returns {FormArray} - The FormArray instance containing bank details.
   */
  get bknDtls(): FormArray{
    return this.bank.get('bnkDtls') as FormArray;
  }
  /**
   * * This function is used to add a new bank details form group to the bank details form array.
   * * It creates a new FormGroup instance with the specified bank details and adds it to the form array.
   * * @param {any} [bnkDtls] - Optional parameter containing the bank details to be added.
   */
  addBank(bnkDtls?: any){
   this.bknDtls.push(this.setBankForm(bnkDtls));
  }
  /**
   * * This function is used to create a FormGroup for bank details.
   * * It initializes the form controls with the provided bank details or default values.
   * * @param {any} [bnkDtls] - Optional parameter containing the bank details to be used for initialization.
   * * @returns {FormGroup} - The FormGroup instance containing the bank details form controls.
   */
  setBankForm(bnkDtls){
   return new FormGroup({
    id: new FormControl(bnkDtls ? bnkDtls?.id : 0),
    cm_profile_id: new FormControl(bnkDtls ? global.getActualVal(bnkDtls.cm_profile_id) : this.cmpId),
    file: new FormControl(''),
    upload_chq: new FormControl(bnkDtls ? ( global.getActualVal(bnkDtls.upload_chq) ? (this.chq_url+bnkDtls.upload_chq) : '') : ''),
    chq_preview: new FormControl(bnkDtls ? ( global.getActualVal(bnkDtls.upload_chq) ? (this.chq_url+bnkDtls.upload_chq ) : '') : ''),
    acc_no: new FormControl(bnkDtls ? global.getActualVal(bnkDtls.acc_no) : '',[Validators.required]),
    bank_name: new FormControl(bnkDtls ? global.getActualVal(bnkDtls.bank_name) : '',[Validators.required]),
    ifsc: new FormControl(bnkDtls ? global.getActualVal(bnkDtls.ifsc) : '',[Validators.required]),
    micr: new FormControl(bnkDtls ? global.getActualVal(bnkDtls.micr) : '',[Validators.required]),
    branch_name: new FormControl(bnkDtls ? global.getActualVal(bnkDtls.branch_name) : '',[Validators.required]),
    branch_add: new FormControl(bnkDtls ? global.getActualVal(bnkDtls.branch_add) : '',[Validators.required])
   })
  }
  /**
   * * This function is used to submit the bank details form.
   * * It creates a FormData object, appends the bank details and uploaded cheque files to it,
   * * and makes an API call to save the bank details.
   */
  submitBnk(){
    const bank = new FormData();
    bank.append('bank_dtls',JSON.stringify(this.bknDtls.value));
    // bank.append('upload_chq[]',this.)

    this.bknDtls.value.forEach((el,key) =>{
      console.log(el);

       bank.append('upload_chq[]',typeof(el.upload_chq) != 'string' ? el.upload_chq : '');
    })
    this.dbIntr.api_call(1,'/comp/bankAddEdit',bank).subscribe((res: any) =>{
        this.utility.showSnackbar(res.suc == 1 ? 'Bank saved successfully' : res.msg,res.suc);
        this.modifyBank(res.data);
        this.reset();
    })
  }
  /**
   * * This function is used to modify the bank details in the bank master data.
   * * It checks if the bank details already exist in the bank master data and updates them accordingly.
   * * If the bank details do not exist, it adds them to the bank master data.
   * * @param {any[]} res - The array of bank details to be modified.
   */
  modifyBank(res){
      res.forEach(element => {
              if(this.bankMstDtls.findIndex((obj) => obj.id == element.id)!= -1){
                this.bankMstDtls = this.bankMstDtls.filter((data,key) =>{
                  if(data.id == element.id){
                    data.cm_profile_id = element.cm_profile_id,
                    data.acc_no = element.acc_no,
                    data.bank_name = element.bank_name,
                    data.ifsc = element.ifsc,
                    data.micr = element.micr,
                    data.branch_name = element.branch_name,
                    data.branch_add = element.branch_add,
                    data.upload_chq = element.upload_chq,
                    data.type_of_comp = element.type_of_comp,
                    data.cm_profile_name = element.cm_profile_name,
                    data.establishment_name = element.establishment_name

                  }
                  return true;
                })
              }
              else{
                this.bankMstDtls.push(element)
              }
      });
  }
  /**
   * * * This function is used to remove a bank details form group from the bank details form array.
   * * * It takes the index of the form group to be removed as a parameter.
   * * * @param {number} index - The index of the form group to be removed.
   * * * @returns void
   */
  removeBank(index){
    this.bknDtls.removeAt(index);
  }
  /**
   * * * This function is used to reset the bank details form array.
   * * * It clears the existing bank details and adds a new empty bank details form group
   */
  reset(){
   this.bknDtls.clear();
   this.addBank();
  }
  /**
   * * * This function is used to populate the bank details form array with the provided bank details.
   * * * It clears the existing bank details and adds the provided bank details to the form array.
   * * * @param {any} bank - The bank details to be populated in the form array.
   * * * @returns void
   */
  populateDT(bank){
    console.log(bank);

    this.bknDtls.clear();
    this.addBank(bank);
  }
  /**
   * * * This function is called when the tab is changed.
   * * * It updates the company ID and fetches the bank details for the selected company.
   * * * @param {any} ev - The event object containing the tab details.
   * * * @returns void
   */
  onTabChange(ev){
    console.log(ev);
    this.cmpId = ev.tabDtls.id;
    this.bknDtls.controls.forEach(el =>{
      el.get('cm_profile_id').setValue(this.cmpId);
    });
    this.getbankDtls(this.cmpId);

  }
  /**
   * * * This function is used to get the file from the input event and set it in the form control.
   * * * It also sets the preview URL for the uploaded cheque file.
   * * * @param {any} ev - The input event containing the file.
   * * * @param {number} index - The index of the form control in the form array.
   * * * @returns void
   */
  getFile(ev,index){
    this.bknDtls.controls[index].get('upload_chq').setValue(ev.target.files[0]);
    this.bknDtls.controls[index].get('chq_preview')?.patchValue(
      this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(ev.target.files[0]))
      );
  }
    /** Call Api For Get Bank Master Data from Backend */
    getbankDtls(cm_profile_id) {
      this.dbIntr
        .api_call(0, '/comp/bank', 'cm_profile_id='+ cm_profile_id)
        .pipe(pluck('data'))
        .subscribe((res) => {
          this.bankMstDtls = res;
        });
    }
    /**** End */
}
