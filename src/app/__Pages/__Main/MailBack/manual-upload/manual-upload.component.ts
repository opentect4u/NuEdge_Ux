import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, pluck } from 'rxjs/operators';
import { rnt } from 'src/app/__Model/Rnt';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
// import fileMenu from '../../../../../assets/json/file.json';
import fileTypeMenu from '../../../../../assets/json/fileType.json';
import { UtiliService } from 'src/app/__Services/utils.service';
// import { fileValidators } from 'src/app/__Utility/fileValidators';
import { uploadManual } from 'src/app/__Utility/MailBack/upload';
import { column } from 'src/app/__Model/tblClmns';
import { manualUpload } from 'src/app/__Model/MailBack/manualUpload';
import { environment } from 'src/environments/environment';

export interface rec_response {
  start_count: number;
  end_count: number;
  row_id?: number;
  upload_file_name: string | null;
  file_type_id: number;
  file_id: number;
  rnt_id: number;
  file?: string | null;
  upload_file?: string | null;
  total_count?: number;
}

export class file {
  id: number;
  name: string;
  parent_id: number;
}

export class fileType {
  id: number;
  name: string;
  sub_menu: file[];
}

@Component({
  selector: 'app-manual-upload',
  templateUrl: './manual-upload.component.html',
  styleUrls: ['./manual-upload.component.css'],
})
export class ManualUploadComponent implements OnInit {
  /**
   *  set Validation of extension
   */
  allowedExtensions: string[] = ['csv'];

  __pageNumber: string | number = '10';

  manualUpldFrm = new FormGroup({
    file_type_id: new FormControl('', [Validators.required]),
    file_id: new FormControl('', [Validators.required]),
    upload_file: new FormControl(''),
    rnt_id: new FormControl('', [Validators.required]),
    file: new FormControl('', [
      Validators.required,
      // fileValidators.fileExtensionValidator(this.allowedExtensions),
    ]),
  });
  constructor(private dbIntr: DbIntrService, private utility: UtiliService) {}

  /**
   * Holding columns of Data Table
   */
  columns: column[] = uploadManual.columns;

  /**
   * Holding Menu For Tab comming from backend API
   */
  TabMenu: any = [];

  /**
   * Holding file dropdown value comming from json file (/assets/json/fileType.json)
   */
  fileMst: file[] = [];

  /**
   * Holding file type dropdown value comming from json file (/assets/json/fileType.json)
   */
  fileTypeMst: fileType[] = fileTypeMenu;

  /**
   * holding index number of currently active Tab
   */
  tabindex: number = 0;

  /**
   * Holding uploaded file master data
   */
  FileMstData: manualUpload[] = [];

  paginate: any = [];

  ngOnInit(): void {
    this.getrntMst();
  }

  ngAfterViewInit() {
    this.manualUpldFrm.controls['file_type_id'].valueChanges.subscribe(
      (res) => {
        this.fileMst = this.getFileMst(res);
      }
    );
  }

  /**
   * Getting R&T details from backend API and sent this to the tab section
   */
  getrntMst = () => {
    this.dbIntr
      .api_call(0, '/rnt', null)
      .pipe(pluck('data'))
      .subscribe((res: rnt[]) => {
        this.TabMenu = res
          .sort((a, b) => a.id - b.id)
          .filter((item) => item.id == 2 || item.id == 1)
          .map(({ id, rnt_name }) => ({ tab_name: rnt_name, img_src: '', id }));
      });
  };

  /**
   * Event fired after tab change and set the selected tab id inside the form
   */
  onTabChange = (ev) => {
    this.manualUpldFrm.get('rnt_id').setValue(ev.tabDtls.id);
    this.fileMst = this.getFileMst(this.manualUpldFrm.value.file_type_id);
    this.getFileMstDT(ev.tabDtls.id);
  };

  /**
   * get File master Data According to R&T and selected File Type (Location: /assets/json/fileType.json)
   * @param file_type_id
   */
  getFileMst = (file_type_id: number) => {
    return file_type_id
      ? fileTypeMenu
          .filter((item) => item.id == Number(file_type_id))
          .map((item) => item.sub_menu)[0]
          .filter((item) => item.parent_id == this.manualUpldFrm.value.rnt_id)
      : [];
  };

  /**
   * set event.target.files insideanother fortmcontrol after browse
   */
  getFile(ev) {
    if (this.manualUpldFrm.get('file').status == 'VALID') {
      this.manualUpldFrm.get('upload_file').setValue(ev.target.files[0]);
    } else {
      this.manualUpldFrm.get('upload_file').setValue('');
    }
  }
  /**
   * Submit data on server
   */
  uploadFile = () => {
    if (this.manualUpldFrm.invalid) {
      return;
    }
    let start_count = 1;
    let end_count = 500;
    const dt: rec_response = {
      ...this.manualUpldFrm.value,
      end_count: end_count,
      start_count: start_count,
    };
    this.reccursiveUpload(dt);
  };

  reccursiveUpload = (dt: rec_response) => {
    // if(dt.total_count == dt.end_count){
    this.dbIntr
      .api_call(1, '/mailbackProcess', this.utility.convertFormData(dt))
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        if (res.total_count == dt.end_count) {
          this.utility.showSnackbar('File Successfully Uploaded',1);
          // this.utility.showSnackbar(res.suc == 1 ? 'File Uploaded Successfully' : res.msg,res.suc);
          this.updateRow(res.upload_data);
          return;
        }
        dt.upload_file_name = res?.upload_file_name;
        dt.file = '';
        dt.upload_file = '';
        dt.row_id = res?.row_id;
        dt.start_count = Number(dt.end_count) + 1;
        dt.end_count =
          Number(res.end_count) + 500 > Number(res.total_count)
            ? Number(res.total_count)
            : Number(res.end_count) + 500;
        dt.total_count = res.total_count;
        console.log(dt);

        this.reccursiveUpload(dt);
      });
    // }
  };

  updateRow = (row_obj) => {
    console.log(row_obj);
    // if(this.FileMstData.length != Number(this.__pageNumber)){
    // this.FileMstData.push(row_obj);
    this.FileMstData.splice(-1, 1);
    this.FileMstData.unshift(row_obj);
    // }
    // else if(this.FileMstData.length == Number(this.__pageNumber)){
    //   // Nothing to deal with
    // }
  };

  getFileMstDT = (
    rnt_id: number,
    itemsPerPage: number | string | null = 10
  ) => {
    this.dbIntr
      .api_call(
        0,
        '/mailbackProcessDetails',
        'rnt_id=' + rnt_id + '&paginate=' + itemsPerPage
      )
      .pipe(
        pluck('data'),
        map((item: { data: manualUpload[]; links: any }) => {
          this.paginate = item.links;
          this.FileMstData = item.data.map((res) => {
            return {
              ...res,
              upload_file: `${environment.manualUpload + res.upload_file}`,
            };
          });
        })
      )
      .subscribe((res) => {
        // Nothing to deal with in here
        // as i take the data and modify the data before subscribe
        console.log(this.FileMstData);
      });
  };
  onSelectItem = (ev) => {
    this.getFileMstDT(this.manualUpldFrm.value.rnt_id, ev);
    this.__pageNumber = ev;
  };
  getPaginate = (paginate) => {
    if (paginate.url) {
      this.dbIntr
        .getpaginationData(
          paginate.url +
            ('&paginate=' +
              this.__pageNumber +
              '&rnt_id=' +
              this.manualUpldFrm.value.rnt_id)
        )
        .pipe(
          pluck('data'),
          map((item: { data: manualUpload[]; links: any }) => {
            this.paginate = item.links;
            this.FileMstData = item.data.map((res) => {
              return {
                ...res,
                upload_file: `${environment.manualUpload + res.upload_file}`,
              };
            });
          })
        )
        .subscribe((res) => {
          // Nothing to deal with in here
          // as i take the data and modify the data before subscribe
          console.log(this.FileMstData);
        });
    }
  };

  downloadFile = async (url) =>{

    // let blob = await fetch(url).then(r => r.blob());
    // console.log(blob);
    // const blob = new Blob([data], { type: 'text/csv' });
    // const url1= window.URL.createObjectURL(blob);
  }
}
