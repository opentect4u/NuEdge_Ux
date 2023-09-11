import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { pluck } from 'rxjs/operators';
import { rnt } from 'src/app/__Model/Rnt';
import { category } from 'src/app/__Model/__category';
import { responseDT } from 'src/app/__Model/__responseDT';
import { scheme } from 'src/app/__Model/__schemeMst';
import { subcat } from 'src/app/__Model/__subcategory';
import { amc } from 'src/app/__Model/amc';
import { insComp } from 'src/app/__Model/insComp';
import { option } from 'src/app/__Model/option';
import { plan } from 'src/app/__Model/plan';
import { Ibenchmark } from 'src/app/__Pages/__Main/Master/benchmark/home/home.component';
// import { Ibenchmark } from 'src/app/__Pages/__Main/Master/benchmark/benchmark.component';
import { Iexchange } from 'src/app/__Pages/__Main/Master/exchange/exchange.component';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { fileValidators } from 'src/app/__Utility/fileValidators';
import { global } from 'src/app/__Utility/globalFunc';

@Component({
  selector: 'shared-upload-csv',
  templateUrl: './upload-csv.component.html',
  styleUrls: ['./upload-csv.component.css']
})
export class UploadCsvComponent implements OnInit {
  @Input() leftHeaderTitle:string;
  @Input() rightHeaderTitle:string;
  @Input() rightHeaderBtnTitle:string;
  @Input() api_name:string;
  @Input() dataSource:any =[];
  @Input() columns:any =[];
  @Input() flag: string = null;
  @Input() prod_id: any;
  @Input() displayedColumns: any =[];
  @Input() file_name: string;
  @Input() RntMst: rnt[] = [];
  @Input() CatMst: category[] = [];
  @Input()  __colcat: string[]= [];
  @Input() amcMaster: amc[] = [];
  @Input() __colAmc:string[] =[];
  @Input() subcatMaster: subcat[] =[];
  @Input() __colsubCate: string[] =[];

  @Input() companyTypeMst: any =[];
  @Input() compMst: insComp[] =[];

  @Input() tableData_forcomp_type: any =[]
  @Input() displayedColumns__forcomp_type: any =[]
  @Input() tableColumns_forcomp_type: any =[]

  @Input() optionMst = new MatTableDataSource<option>([]);
  @Input()  __optcol: string[]= [];
  @Input() plnMst = new MatTableDataSource<plan>([]);
  @Input()  __plncol: string[]= [];
  @Input() schemeMst= new MatTableDataSource<scheme>([]);
  @Input()  __schemecol: string[]= [];

  @Input() exchange:Iexchange[] = [];

  @Input() tableData_forcomp: any =[]
  @Input() tableColumns_forcomp: any =[]
  @Input() displayedColumns_forComp: any =[]
  @Input() countryMst: any=[];
  @Output() setSchemeType = new EventEmitter<string>();
  @Output() setCompanyMst = new EventEmitter<string>();
  @Output() getschemeMst = new EventEmitter<number>();



  stateMst: any =[];
  districtMst: any =[];
  cityMst: any =[];
  benchmarkMst = new MatTableDataSource<Ibenchmark>([]);
  benchmarkClm:string[] = ['sl_no','ex_name','benchmark']
  allowedExtensions = ['csv', 'xlsx'];

  exchangeClm:string[]= ['sl_no','ex_name'];

  constructor(private __dbIntr: DbIntrService,private __utility: UtiliService) { }
  __upload = new FormGroup({
    amc_id: new FormControl(''),
    scheme_type: new FormControl('N'),
    country_id: new FormControl(''),
    company_id: new FormControl(''),
    state_id: new FormControl(''),
    district_id: new FormControl(''),
    cat_id: new FormControl(''),
    city_id: new FormControl(''),
    rnt_id: new FormControl(''),
    ins_type_id: new FormControl(''),
    rntFile: new FormControl('', [
      Validators.required,
      fileValidators.fileExtensionValidator(this.allowedExtensions),
    ]),
    file: new FormControl(''),
    ex_id: new FormControl('')
  });

  ngOnInit(): void {
   this.setValidators(this.flag);
  }
  setValidators(flag){
   switch(flag) {
    case 'A' : this.__upload.controls['rnt_id'].setValidators([Validators.required]);break;
    case 'S' : this.__upload.controls['cat_id'].setValidators([Validators.required]);break;
    case 'SC': this.__upload.controls['scheme_type'].setValidators([Validators.required]);break;
     case 'IP' :this.__upload.controls['company_id'].setValidators([Validators.required]);
                this.__upload.controls['ins_type_id'].setValidators([Validators.required]);
                break;
    case 'FC' :
    case 'IPT' :
    case 'IC': this.__upload.controls['ins_type_id'].setValidators([Validators.required]);break;
    case 'GD': this.__upload.controls['country_id'].setValidators([Validators.required])
               this.__upload.controls['state_id'].setValidators([Validators.required]);break;
    case 'GS': this.__upload.controls['country_id'].setValidators([Validators.required]); break;
    case 'GC': this.__upload.controls['district_id'].setValidators([Validators.required]);
               this.__upload.controls['country_id'].setValidators([Validators.required]);
               this.__upload.controls['state_id'].setValidators([Validators.required]);break;
    case 'GP': this.__upload.controls['district_id'].setValidators([Validators.required]);
               this.__upload.controls['country_id'].setValidators([Validators.required]);
               this.__upload.controls['state_id'].setValidators([Validators.required]);
               this.__upload.controls['city_id'].setValidators([Validators.required]);break;
    // case 'IS': this.__upload.controls['amc_id'].setValidators([Validators.required]); break;
  }
  }

  ngAfterViewInit(){
    this.__upload.controls['scheme_type'].valueChanges.subscribe(res =>{
        this.setSchemeType.emit(res);
    })

      this.__upload.controls['ins_type_id'].valueChanges.subscribe(res =>{
        if(this.flag == 'IP' && res){
          this.setCompanyMst.emit(res);
        }
        else{
          this.compMst.length =0;
        }
      })

      this.__upload.controls['country_id'].valueChanges.subscribe(res =>{
        if(this.flag == 'GD'|| this.flag == 'GC' || this.flag == 'GP'){
           this.getStateMst(res);
        }
      })
      this.__upload.controls['state_id'].valueChanges.subscribe(res =>{
        if(this.flag == 'GC' || this.flag == 'GP'){
           this.getDistrictMst(this.__upload.controls['country_id'].value,res);
        }
      })
      this.__upload.controls['district_id'].valueChanges.subscribe(res =>{
        if(this.flag == 'GP'){
           this.getCityMst(this.__upload.controls['country_id'].value,this.__upload.controls['state_id'].value,res);
        }
      })
      this.__upload.controls['amc_id'].valueChanges.subscribe(res =>{
               if(this.flag == 'IS'){
                this.getschemeMst.emit(res);
               }
      })

      this.__upload.controls['ex_id'].valueChanges.subscribe(res =>{
             this.getBenchmark(res);
      })
  }
  getStateMst(country_id){
    if(country_id){
      this.__dbIntr.api_call(0,'/states','country_id='+country_id).pipe(pluck('data')).subscribe(res =>{
        this.stateMst = res;
    })
    }

  }
  getDistrictMst(country_id,state_id){
    if(country_id && state_id){
      this.__dbIntr.api_call(0,'/districts','country_id='+country_id + '&state_id='+state_id)
      .pipe(pluck('data')).subscribe(res =>{
        this.districtMst = res;
    })
    }

  }
  getCityMst(country_id,state_id,district_id){
  if(country_id && state_id  && district_id){
        this.__dbIntr.api_call(0,'/city','country_id='+country_id + '&state_id='+state_id + '&district_id='+district_id)
        .pipe(pluck('data')).subscribe(res =>{
          this.cityMst = res;
      })
      }
  }

  getBenchmark = (ex_id:number) =>{
    if(ex_id){
      this.__dbIntr.api_call(0,'/benchmark','ex_id='+ex_id).pipe(pluck('data'))
      .subscribe((res:Ibenchmark[]) =>{
        console.log(res);
           this.benchmarkMst = new MatTableDataSource(res);
      })
    }
  }

  getFiles(__ev) {
    this.__upload
      .get('rntFile')
      .setValidators([
        Validators.required,
        fileValidators.fileSizeValidator(__ev.files),
        fileValidators.fileExtensionValidator(this.allowedExtensions),
      ]);
    this.__upload
      .get('file')
      ?.patchValue(
        this.__upload.get('rntFile').status == 'VALID' ? __ev.files[0] : ''
      );
  }
  uploadRnt() {
    if (this.__upload.invalid) {
      this.__utility.showSnackbar(
        'Please recheck the form again & resubmit',
        0
      );
      return;
    }
    const __upload = new FormData();
    if(this.flag == 'C' ){
      __upload.append('product_id',this.prod_id);
    }
    else if(this.flag == 'A'){
      __upload.append('product_id',this.prod_id);
      __upload.append('rnt_id',this.__upload.value.rnt_id);
    }
    else if(this.flag == 'S'){
    __upload.append('cat_id',this.__upload.value.cat_id)
    }
    else if(this.flag == 'SC'){
      __upload.append('scheme_type', this.__upload.value.scheme_type);
      __upload.append('product_id', this.prod_id);
    }
    else if(this.flag == 'FC' || this.flag == 'IC' || this.flag == 'IPT'){
      __upload.append('ins_type_id', this.__upload.get('ins_type_id').value);
    }
    else if(this.flag == 'IP'){
      __upload.append('ins_type_id', this.__upload.get('ins_type_id').value);
      __upload.append('company_id', this.__upload.get('company_id').value);
    }
    else if(this.flag == 'GS'){
      __upload.append('country_id', this.__upload.get('country_id').value);
    }
    else if(this.flag == 'GD'){
      __upload.append('country_id', this.__upload.get('country_id').value);
      __upload.append('state_id', this.__upload.get('state_id').value);
    }
    else if(this.flag == 'GC'){
      __upload.append('country_id', this.__upload.get('country_id').value);
      __upload.append('state_id', this.__upload.get('state_id').value);
      __upload.append('district_id', this.__upload.get('district_id').value);
    }
    else if(this.flag == 'GP'){
      __upload.append('country_id', this.__upload.get('country_id').value);
      __upload.append('state_id', this.__upload.get('state_id').value);
      __upload.append('district_id', this.__upload.get('district_id').value);
      __upload.append('city_id', this.__upload.get('city_id').value);
    }
    else if(this.flag == 'IS'){
      __upload.append('amc_id', this.__upload.get('amc_id').value);
    }
    __upload.append('file', this.__upload.get('file').value);
    this.__dbIntr
      .api_call(1, this.api_name, __upload)
      .subscribe((res: responseDT) => {
        this.__utility.showSnackbar(
          res.suc == 1
            ? 'File Uploadation Successfull'
            : 'Something went wrong! please try again later',
          res.suc
        );
        if (res.suc == 1) {
          this.reset();
        }
      });
  }
  onFileDropped(__ev) {
    this.__upload.get('file').patchValue('');
    this.__upload.controls.rntFile.setErrors({
      checkRequire: __ev.files.length > 0 ? false : true,
    });
    this.__upload.controls.rntFile.setErrors({
      checkSize: !fileValidators.fileSizeValidatorcopy(__ev.files),
    });
    fileValidators
      .fileExtensionValidatorcopy(this.allowedExtensions, __ev.files)
      .then((res) => {
        this.__upload.get('rntFile').setErrors({ checkExt: !res });
        if (res) {
          if (
            __ev.files.length > 0 &&
            fileValidators.fileSizeValidatorcopy(__ev.files)
          ) {
            this.__upload.get('file').patchValue(__ev.files[0]);
            this.__upload.get('rntFile').clearValidators();
            this.__upload.get('rntFile').updateValueAndValidity();
          }
        }
      });
  }
  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes: any, decimals: any = 2) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  deleteFiles() {
    this.__upload.get('rntFile').setValue('',{emitEvent:false});
    this.__upload.get('file').setValue('',{emitEvent:false});
    this.__upload
      .get('rntFile')
      .setValidators([
        Validators.required,
        fileValidators.fileExtensionValidator(this.allowedExtensions),
      ]);
    this.__upload.get('rntFile').updateValueAndValidity();
  }
  reset(){
    this.__upload.reset({emitEvent:false});
    this.__upload
    .get('rntFile')
    .setValidators([
      Validators.required,
      fileValidators.fileExtensionValidator(this.allowedExtensions),
    ]);
    this.__upload.get('rntFile').updateValueAndValidity();
  }
  isAmcScelected = (table_id:string,exl_name:string,dt_corosponding_to:string) =>{
     if((this.__upload.value.amc_id && this.flag == 'A') || (this.__upload.value.ex_id && this.flag == 'SBU')){
      global.exportTableToExcel(table_id,exl_name);
     }
     else{
         this.__utility.showSnackbar(`Please Select ${dt_corosponding_to}`,0);
     }

  }

}
