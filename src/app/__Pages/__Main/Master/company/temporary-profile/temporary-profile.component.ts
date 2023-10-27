import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { tempProfile } from 'src/app/__Utility/Master/Company/tempProfile';
import { fileValidators } from 'src/app/__Utility/fileValidators';
import { global } from 'src/app/__Utility/globalFunc';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-temporary-profile',
  templateUrl: './temporary-profile.component.html',
  styleUrls: ['./temporary-profile.component.css']
})
export class TemporaryProfileComponent implements OnInit {
  logo_url:string = `${environment.company_logo_url+'temp-logo/'}`
  @Input() cmpDtls: any = [];
  @Input() temporaryMstDtls: any =[];
  @Output() setTemporaryDtls = new EventEmitter();
  allowedExtensions = ['jpg','jpeg','png'];
  columns = tempProfile.columns;
  temporaryForm = new FormGroup({
      cm_profile_id: new FormControl('',[Validators.required]),
      upload_logo: new FormControl(''),
      upload_file: new FormControl(''),
      file_preview: new FormControl(''),
      from_dt: new FormControl('',[Validators.required]),
      to_dt: new FormControl('',[Validators.required]),
      id: new FormControl('')
  })
  constructor(private dbIntr: DbIntrService,private utility:UtiliService) { }

  ngOnInit(): void {
  }
  reset(){
    this.temporaryForm.reset();
  }

  submit(){
    const temporaryProfile = new FormData();
    temporaryProfile.append('cm_profile_id',this.temporaryForm.value.cm_profile_id);
    temporaryProfile.append('from_dt',this.temporaryForm.value.from_dt);
    temporaryProfile.append('to_dt',this.temporaryForm.value.to_dt);
    temporaryProfile.append('upload_logo',this.temporaryForm.value.upload_file);
    temporaryProfile.append('id',this.temporaryForm.value.id ? this.temporaryForm.value.id : 0);

    this.dbIntr.api_call(1,'/comp/tempProfileAddEdit',temporaryProfile).subscribe((res: any)=> {
              this.utility.showSnackbar(res.suc == 1 ? 'Temporray profile saved successfully' : res.msg,res.suc);
              this.setTemporaryDtls.emit({data:res.data,id:this.temporaryForm.value.id});
              this.reset();
    })

  }
  getFile(ev){
    this.temporaryForm.get('upload_logo').setValidators(
      [fileValidators.fileSizeValidator(ev.target.files),
        fileValidators.fileExtensionValidator(this.allowedExtensions)])
    this.temporaryForm.get('upload_logo').updateValueAndValidity();
    if (this.temporaryForm.get('upload_logo').status == 'VALID') {
      const file = ev.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.temporaryForm.get('file_preview')?.patchValue(reader.result);
      reader.readAsDataURL(file);
     this.temporaryForm.get('upload_file').patchValue(ev.target.files[0]);
    }
    else{
      this.temporaryForm.get('upload_file').patchValue('');
      this.temporaryForm.get('file_preview')?.patchValue('');
    }
  }
  populateDT(data){
      this.temporaryForm.patchValue({
        cm_profile_id: global.getActualVal(data) ? data.cm_profile_id : '',
        from_dt: global.getActualVal(data) ? data.from_dt : '',
        to_dt: global.getActualVal(data) ? data.to_dt : '',
        file_preview: global.getActualVal(data) ? this.logo_url + data?.upload_logo : '',
        upload_file: global.getActualVal(data) ? this.logo_url + data?.upload_logo : '',
        id:global.getActualVal(data) ? data.id : '',
      })
  }
}
