import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload-help',
  templateUrl: './upload-help.component.html',
  styleUrls: ['./upload-help.component.css']
})
export class UploadHelpComponent implements OnInit {

  /*** File Upload help form */
  file_upload_help_form = new FormGroup({
    file_type_id:new FormControl('',[Validators.required]),
    rnt_id: new FormControl('',[Validators.required]),
    file_name: new FormControl('',[Validators.required]),
    file_format:new FormControl('',[Validators.required]),
    rec_upload_freq: new FormControl('',[Validators.required])
  })

  /**
   * For Holding master data for different type of transaction file
   */
  trxn_file_mst_dt  = [];

  constructor() { }

  ngOnInit(): void {
  }

}
