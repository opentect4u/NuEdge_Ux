import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { pluck } from 'rxjs/operators';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { licenceClmns } from 'src/app/__Utility/Master/Company/licence';
import { fileValidators } from 'src/app/__Utility/fileValidators';
import { global } from 'src/app/__Utility/globalFunc';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-license-dtls',
  templateUrl: './license-dtls.component.html',
  styleUrls: ['./license-dtls.component.css']
})
export class LicenseDtlsComponent implements OnInit {
  cmProfileId:number;
  TabMenu: any= [];
  url:string = `${environment.company_logo_url + 'license/'}`
  @Input() set cmpDtlsMst(value){
    this.TabMenu = value.map(({id,name,establishment_name,type_of_comp}) => ({id,tab_name:type_of_comp == 4 ? establishment_name : name,img_src:''}))
  };
 /** holding licence master Data */
//  @Input() licenseMst: any = [];
  licenseMst: any = []
  /** holding Product master Data */
  // @Input() product: any=[];
  product: any = [];
  allowedExtensions = ['pdf']; /** For Validation of file extension */
  columns:column[] = licenceClmns.column;
  license = new FormGroup({
    id: new FormControl(0),
    product_id: new FormControl('',[Validators.required]),
    licence_no: new FormControl('',[Validators.required]),
    valid_from: new FormControl('',[Validators.required]),
    valid_to: new FormControl('',[Validators.required]),
    file: new FormControl(''),
    file_preview: new FormControl(''),
    upload_file: new FormControl(''),
    cm_profile_id: new FormControl('')
  })
  constructor(
    private sanitizer: DomSanitizer,
    private dbIntr:DbIntrService,
    private utility: UtiliService
    ) { }

  ngOnInit(): void {
    this.setCompanyProfileId(this.TabMenu[0].id);
  }
  /**
   * * This function is used to set the company profile ID and fetch the license details and product master data.
   * * It updates the cmProfileId property and calls the getlicesnseDtls and getProductMst methods to retrieve the respective data.
   * * @param {number} cm_profile_id - The ID of the company profile to be set.
   * * @returns {void}
   */
  setCompanyProfileId(cm_profile_id){
    this.cmProfileId = cm_profile_id;
    this.getlicesnseDtls(cm_profile_id);
    this.license.get('cm_profile_id').patchValue(cm_profile_id);
    this.getProductMst(cm_profile_id);
  }

  /**** Call Api For Get Product Master Data From Backend */
  getProductMst(cm_profile_id) {
    this.dbIntr
      .api_call(0, '/comp/product', 'cm_profile_id='+ cm_profile_id)
      .pipe(pluck('data'))
      .subscribe((res) => {
        this.product = res;
      });
  }
  /**End**/


  ngAfterViewInit(){}
  /**** This function is used to handle the file input change event.
   * It sets the validators for the file input field, checks if the file is valid,
   * and updates the form controls accordingly.
   * @param {Event} ev - The change event triggered by the file input.
   */
  getFile(ev){
    this.license.get('file').setValidators([
      Validators.required,
      fileValidators.fileSizeValidator(ev.target.files),
      fileValidators.fileExtensionValidator(this.allowedExtensions)])
    if(this.license.get('file').status == 'VALID'){
      this.license.get('upload_file').setValue(ev.target.files[0]);
      this.license.get('file_preview')?.patchValue(
        this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(ev.target.files[0]))
        );
    }
    else{
      this.license.get('upload_file').setValue('');
      this.license.get('file_preview')?.patchValue('');
    }
  }
  /**** This function is used to set the license details in the form.
   * It updates the form controls with the provided license data or sets default values if no data is provided.
   * @param {any} res - The license data to be set in the form.
   */
  setLicenceInForm(res){
    this.license.patchValue({
      id:res ? res.id : 0,
      cm_profile_id:res ? res?.cm_profile_id : '',
      product_id:res ? res?.product_id : '',
      licence_no:res ? res?.licence_no : '',
      valid_from:res ? res?.valid_from : '',
      valid_to:res ? res?.valid_to : '',
      upload_file: (res || res?.upload_file) ? (`${environment.company_logo_url + 'license/' + res?.upload_file}`) : '',
      file_preview: (res  || res?.upload_file) ? (`${environment.company_logo_url + 'license/' + res?.upload_file}`) : '',
    });

    this.license.get('file').removeValidators([Validators.required]);
    this.license.get('file').updateValueAndValidity({emitEvent:false});

  }
  /** This function is used to submit the license details form.
   * It creates a FormData object, appends the license details to it,
   * and makes an API call to save the license data.
   * @returns {void}
   */
  submitLicenceDtls(){
    const licence =new FormData();
    licence.append('id', this.license.value.id ? this.license.value.id : 0);
    licence.append('product_id', global.getActualVal(this.license.value.product_id));
    licence.append('licence_no', global.getActualVal(this.license.value.licence_no));
    licence.append('valid_from', global.getActualVal(this.license.value.valid_from));
    licence.append('valid_to', global.getActualVal(this.license.value.valid_to));
    licence.append('upload_file', typeof(this.license.value.upload_file) == 'string' ? '' : this.license.value.upload_file);
    licence.append('cm_profile_id',global.getActualVal(this.license.value.cm_profile_id));
    this.dbIntr.api_call(1,'/comp/licenseAddEdit',licence).subscribe((res: any) =>{
       this.utility.showSnackbar(res.suc == 1 ? 'Licence saved successfully' : res.msg, res.suc);
       this.modifyMasterDT(res.data,this.license.value.id);
       this.reset();
    })
  }

  /** After saved the licence data ,
   * either modify the licence array or modify
   * the particular item of the array */
  modifyMasterDT(res,id){
    if(id > 0){
       this.licenseMst = this.licenseMst.filter((value,key) =>{
        if(value.id == res.id){
            value.product_id = res.product_id,
           value.licence_no = res.licence_no,
           value.valid_from = res.valid_from,
           value.valid_to = res.valid_to,
           value.upload_file = res.upload_file,
           value.cm_profile_id= res.cm_profile_id
        }
        return true;
    })
    }
    else{
      this.licenseMst.push(res);
    }
  }
  /** End */
  /***** Reset The Form */
  reset(){
    this.license.patchValue({
      product_id:'',
      licence_no :'',
      valid_from :'',
      valid_to :'',
      upload_file :'',
      file_preview:'',
      id:0,
      cm_profile_id:this.cmProfileId
    });
    this.license.get('file').reset('',{emitEvent:false});
  }
  /*** End */
  /** This function is used to populate the license details in the form when a tab is changed.
   * It sets the license details in the form based on the selected tab's data.
   * @param {any} ev - The event object containing the tab details.
   */
  populateDT(ev){
    this.setLicenceInForm(ev);
  }
  /** This function is used to handle the tab change event.
   * It updates the company profile ID based on the selected tab and resets the form.
   * @param {any} ev - The event object containing the tab details.
   * * @returns {void}
   */
  onTabChange(ev){
    this.setCompanyProfileId(ev.tabDtls?.id);
    this.reset();
  }
  /** Call Api For Get License Master Data from Backend */
  getlicesnseDtls(cm_profile_id) {
    this.dbIntr
      .api_call(0, '/comp/license', 'cm_profile_id='+ cm_profile_id)
      .pipe(pluck('data'))
      .subscribe((res) => {
        console.log(res);
        this.licenseMst = res;
      });
  }
  /**** End */
}
