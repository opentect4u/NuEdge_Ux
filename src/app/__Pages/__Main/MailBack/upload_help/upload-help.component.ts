import { Component, OnInit ,Inject, ViewChild} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { file, fileType } from '../manual-upload/manual-upload.component';
import { rnt } from 'src/app/__Model/Rnt';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';
import { DOCUMENT } from '@angular/common';
import { Table } from 'primeng/table';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { responseDT } from 'src/app/__Model/__responseDT';
import { ADD_MESSAGE, ERROR_MESSAGE, UPDATE_MESSAGE } from 'src/app/strings/message';
@Component({
  selector: 'app-upload-help',
  templateUrl: './upload-help.component.html',
  styleUrls: ['./upload-help.component.css'],
  animations: [
    trigger('bodyExpansion', [
      state('collapsed, void', style({ height: '0px', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed, void => collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger('formbodyExpansion', [
      state('collapsed, void', style({ height: '0px', padding: '0px 20px', visibility: 'hidden' })),
      state('expanded', style({ height: '*', padding: '10px 20px', visibility: 'visible', })),
      transition('expanded <=> collapsed, void => collapsed',
        animate('230ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class UploadHelpComponent implements OnInit {

  @ViewChild('pTableRef') pTableRef: Table;

  state: string | undefined = 'expanded';


  /*** File Upload help form */
  file_upload_help_form = new FormGroup({
    id: new FormControl('0'),
    file_type_id: new FormControl('', [Validators.required]),
    rnt_id: new FormControl('', [Validators.required]),
    file_id: new FormControl('', [Validators.required]),
    file_format_id: new FormControl('', [Validators.required]),
    rec_upload_freq: new FormControl('', [Validators.required]),
    uploaded_mode_id: new FormControl('', [Validators.required]),
  });

  /**
   * For Holding master data for different type of transaction file
   */
  upload_file_help_mst_dt:IFileUploadHelp[] = [];

  /** For holding different type of file */
  fileTypeMst: fileType[] = [];

  /** For holding R&T */
  rnt_mst_dt: rnt[] = [];

  /** For Holding file */
  fileMst: file[] = [];

  /*** File Upload help column */
  file_uploaded_help_column:column[] = uploadFileHelpColumn.column;

  constructor(private dbIntr: DbIntrService,
    private utility:UtiliService,
    @Inject(DOCUMENT) private dom: Document
    ) {}

  ngOnInit(): void {
    this.getmailBackFileType();
    this.getrnt();
    /***************** call API for getting file upload help master data  */
       this.getFileUploadHelpMasterData();
    /****************** END */
  }

  ngAfterViewInit() {
    /** Event trigger after change in rnt select dropdown */
    this.file_upload_help_form.get('rnt_id').valueChanges.subscribe((res) => {
      // console.log('rnt');
      this.getmailbackFileName(
        res,
        this.file_upload_help_form.value.file_type_id
      );
    });
    /*** End */

    this.file_upload_help_form
      .get('file_type_id')
      .valueChanges.subscribe((res) => {
        // console.log('file_type_id');
        this.getmailbackFileName(this.file_upload_help_form.value.rnt_id, res);
      });
  }

  /*** For Getting File Type master Data */
  getmailBackFileType = () => {
    this.dbIntr
      .api_call(0, '/mailbackFileType', null)
      .pipe(pluck('data'))
      .subscribe((res: fileType[]) => {
        this.fileTypeMst = res;
      });
  };
  /**** End */

  /*** For Getting R&T from master data */
  getrnt = () => {
    this.dbIntr
      .api_call(0, '/rnt', null)
      .pipe(
        pluck('data'),
        map((item: rnt[]) =>
          item
            .sort((a, b) => a.id - b.id)
            .filter((item) => item.id == 2 || item.id == 1)
        )
      )
      .subscribe((res: rnt[]) => {
        this.rnt_mst_dt = res;
      });
  };
  /*** End */

  /**
   * For Getting files against corrosponding R&T and File Type
   * @param rnt_id
   * @param file_type_id
   */

  getmailbackFileName = (rnt_id: number, file_type_id: number) => {
    if (rnt_id && file_type_id) {
      this.dbIntr
        .api_call(
          0,
          '/mailbackFileName',
          'rnt_id=' + rnt_id + '&file_type_id=' + file_type_id
        )
        .pipe(pluck('data'))
        .subscribe((res: file[]) => {
          // console.log(res);
          this.fileMst = res.map(({ id, rnt_id, name }) => ({
            rnt_id,
            id,
            name,
            parent_id: rnt_id,
          }));
        });
    }
    else{
      this.fileMst = [];
      this.file_upload_help_form.patchValue({
        file_id:''
      })
    }
  };
  /*** End */

  /** on page load get the file upload help master data */
  getFileUploadHelpMasterData = () =>{
      this.dbIntr.api_call(0,'/fileUploadHelp',null)
      .pipe(pluck('data'))
      .subscribe((res:IFileUploadHelp[]) =>{
        this.upload_file_help_mst_dt = res;
      })
  }
  /**** End *****/

  /*** Save the form and send this data to the backend */
  savefileUploadHelp = () => {
    this.dbIntr.api_call(1,'/fileUploadHelpAddEdit',this.utility.convertFormData(this.file_upload_help_form.value))
    .subscribe((res:responseDT) =>{
        this.modifyMasterData(res,Number(this.file_upload_help_form.value.id));
    })
  };
  /**** END */

  modifyMasterData(res:responseDT,id:number){
    if(res.suc == 1){
            if(id == 0){
              this.upload_file_help_mst_dt.unshift(res.data);
            }
            else{
              this.upload_file_help_mst_dt = this.upload_file_help_mst_dt.filter((item,index) =>{
                          if(item.id == res.data.id){
                              item = res.data;
                          }
                          return item;
              })
            }
        this.reset();
    }
      this.utility.showSnackbar(res.suc == 1 ? (id > 0 ? UPDATE_MESSAGE : ADD_MESSAGE) : ERROR_MESSAGE,res.suc);

  }

  /** Event Trigger When Reset Button Clicked */
  reset = () =>{
      this.populateuploadFileHelpinForm(null);
  }
  /*** End */

  /*** Get Field from column for filter to be worked properly */
  getColumns = ():string[] =>{
    return this.utility.getColumns(this.file_uploaded_help_column);
  }
  /*** End */


  /**
   * Bind selected row with Form
   * @param row
   */
  populateuploadFileHelpinForm = (row) =>{
    this.file_upload_help_form.reset({emitEvent:false,onlySelf:true}); // reset the form if any form field is filled up with value
    // Checked if the Edit button is clicked or not , if edit button is clicked then change the scroll position
    if(row){
      this.dom.documentElement.scrollIntoView({behavior:'smooth',block:'start'});
    }
    /******************Filled Up Form***************************** */
       this.file_upload_help_form.patchValue({
        id:row ? row.id : 0,
        file_type_id: row ? row.file_type_id : '',
        rnt_id: row ? row.rnt_id : '',
        file_id:row ? row.file_id : '',
        file_format_id: row ? row.file_format_id : '',
        rec_upload_freq: row ? row.rec_upload_freq : '',
        uploaded_mode_id: row ? row.uploaded_mode_id : '',
      });
  /********************END****************************** */
    }
  /***** END */
  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.pTableRef.filterGlobal(value,'contains')
  }

  toggle() {
    this.state = this.state === 'collapsed' ? 'expanded' : 'collapsed';
  }
}

export class uploadFileHelpColumn {
  public static column: column[] = [
    {
      field: 'sl_no',
      header: 'Sl No',
      width:'6rem'
    },
    {
      field: 'edit',
      header: 'Edit',
      width:'6rem'
    },
    {
      field: 'file_type_name',
      header: 'File Type',
      width:''
    },
    {
      field: 'rnt_name',
      header: 'R&T',
      width:'15rem'

    },
    {
      field: 'file_name',
      header: 'File Name',
      width:''

    },
    {
      field: 'file_format_id',
      header: 'File Format',
      width:'13rem'

    },
    {
      field: 'uploaded_mode_id',
      header: 'Uploaded Mode',
      width:'14rem'

    },
    {
      field: 'rec_upload_freq',
      header: 'Recommended Uploaded Freq',
      width:''
    }
  ];
}


export interface IFileUploadHelp {
  created_at: string
  created_by: number
  file_format_id: string
  file_id: number
  file_name:string
  file_type_id: number
  id: number
  rec_upload_freq: string
  rnt_id: number
  rnt_name:string;
  file_type_name:string;
  updated_at: string
  updated_by: any
  uploaded_mode_id: string
}

