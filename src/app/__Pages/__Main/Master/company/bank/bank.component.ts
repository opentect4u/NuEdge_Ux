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

  get bknDtls(): FormArray{
    return this.bank.get('bnkDtls') as FormArray;
  }
  addBank(bnkDtls?: any){
   this.bknDtls.push(this.setBankForm(bnkDtls));
  }
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
  removeBank(index){
    this.bknDtls.removeAt(index);
  }
  reset(){
   this.bknDtls.clear();
   this.addBank();
  }
  populateDT(bank){
    console.log(bank);

    this.bknDtls.clear();
    this.addBank(bank);
  }
  onTabChange(ev){
    console.log(ev);
    this.cmpId = ev.tabDtls.id;
    this.bknDtls.controls.forEach(el =>{
      el.get('cm_profile_id').setValue(this.cmpId);
    });
    this.getbankDtls(this.cmpId);

  }
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
