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
import XLSX from 'xlsx';

export interface rec_response {
  start_count: number;
  end_count: number;
  row_id?: number;
  upload_file_name: string | null;
  file_type_id: number;
  // file_type_name:string | null;
  // file_name:string | null;
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
  rnt_id:number;
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
    rnt_id: new FormControl(1, [Validators.required]),
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
  // fileTypeMst: Partial<fileType>[] = fileTypeMenu;
  fileTypeMst: fileType[] = [];


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
    this.getmailBackFileType();
    this.getrntMst();
  }

  ngAfterViewInit() {
    this.manualUpldFrm.controls['file_type_id'].valueChanges.subscribe(
      (res) => {
        // this.fileMst = this.getFileMst(res);
        this.getmailbackFileName(this.manualUpldFrm.value.rnt_id,res);
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

  /***
   * @description This function is used to get the file type master data
   * It calls the API '/mailbackFileType' to fetch the file type data
   * The response is then assigned to the fileTypeMst variable
   * @returns void
   */
  getmailBackFileType = () =>{

    this.dbIntr.api_call(0,'/mailbackFileType',null)
    .pipe(pluck('data'))
    .subscribe((res:fileType[]) =>{
      this.fileTypeMst = res;
    })
  }

  /**
   * 
   * @param rnt_id - This function fetches the file names based on the provided rnt_id and file_type_id.
   * It makes an API call to '/mailbackFileName' with the rnt_id and file_type_id as parameters.
   * The response is then mapped to create an array of file objects with rnt_id, id, name, and parent_id properties.
   * 
   * @param rnt_id
   * @param file_type_id - This function fetches the file names based on the provided rnt_id and file_type_id.
   * It makes an API call to '/mailbackFileName' with the rnt_id and file_type_id as parameters.
   * The response is then mapped to create an array of file objects with rnt_id, id, name, and parent_id properties.
   * @returns void
   */
  getmailbackFileName = (rnt_id:number,file_type_id:number) =>{
    if(rnt_id && file_type_id)
    {
    this.dbIntr.api_call(0,'/mailbackFileName',
    'rnt_id='+rnt_id
    + '&file_type_id='+file_type_id)
    .pipe(pluck('data'))
    .subscribe((res: any) =>{
        this.fileMst = res.map(({id,rnt_id,name}) => ({rnt_id,id,name,parent_id:rnt_id}));
    })
    }
  }

  /**
   * Event fired after tab change and set the selected tab id inside the form
   */
  onTabChange = (ev) => {
    this.manualUpldFrm.get('rnt_id').setValue(ev.tabDtls.id);
    // this.fileMst = this.getFileMst(this.manualUpldFrm.value.file_type_id);
    this.getmailbackFileName(ev.tabDtls.id,this.manualUpldFrm.value.file_type_id);
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
    let end_count = this.manualUpldFrm.value.file_type_id == 4  ? 150 : 300;
    // let start_count = 20101;
    // let end_count = 20400;
    const dt: rec_response = {
      ...this.manualUpldFrm.value,
      end_count: end_count,
      start_count: start_count,
    };
    this.reccursiveUpload(dt);
  };

  /**
   * 
   * @param dt - This function is used to recursively upload a file in chunks.
   * It takes a response object (dt) as input, which contains information about the file being uploaded.
   * The function checks if the file type is not equal to 4, and if so, it sets the end_count based on the file type.
   * It then makes an API call to '/mailbackProcess' with the converted form data from the response object.
   * If the total_count of the response matches the end_count, it shows a success message
   */
  reccursiveUpload = (dt: rec_response) => {
    if(this.manualUpldFrm.value.file_type_id != 4){
    let end_count = this.manualUpldFrm.value.file_type_id == 4  ? 150 : 300;
    this.dbIntr
      .api_call(1, '/mailbackProcess', this.utility.convertFormData(dt))
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        if (res.total_count == dt.end_count) {
          this.utility.showSnackbar('File Successfully Uploaded',1);
          // this.utility.showSnackbar(res.suc == 1 ? 'File Uploaded Successfully' : res.msg,res.suc);
          this.updateRow(res.upload_data);
          this.resetForm();
          return;
        }
        dt.upload_file_name = res?.upload_file_name;
        dt.file = '';
        dt.upload_file = '';
        dt.row_id = res?.row_id;
        dt.start_count = Number(dt.end_count) + 1;
        dt.end_count =
          Number(res.end_count) + end_count > Number(res.total_count)
            ? Number(res.total_count)
            : Number(res.end_count) + end_count;
        dt.total_count = res.total_count;
        this.reccursiveUpload(dt);
      });
    }
    else{
      // this.dbIntr
      // .api_call(
      //   1,'/uploadNavData', this.utility.convertFormData(dt),
      //   false,false,true
      //   )
      // // .pipe(pluck('data'))
      // .subscribe(res =>{
      //     console.log(res);
      //     this.resetForm();
      // })
      this.dbIntr
      .api_call(
        1,'/manualNavUpload', this.utility.convertFormData(dt),
        false,false,true
        )
      // .pipe(pluck('data'))
      .subscribe(res =>{
          this.utility.showSnackbar('File Successfully Uploaded',1);
          // this.utility.showSnackbar(res.suc == 1 ? 'File Uploaded Successfully' : res.msg,res.suc);
          // this.updateRow(res.upload_data);
          // this.updateRow();
          this.resetForm();
      })
    }

  };

  /**
   * @description This function is used to reset the form fields in the manual upload form
   * It sets the values of file_id, file_type_id, upload_file, and file to empty strings
   * This is typically used to clear the form after a successful upload or when the user wants to start a new upload
   * @returns void
   */
  resetForm = () =>{
     this.manualUpldFrm.patchValue({
      file_id:'',
      file_type_id:'',
      upload_file:'',
      file:'',
     })
  }

  /**
   *  @description This function is used to download a file from a given URL
   * It uses the XLSX library to read the file and convert it to CSV format
   * The function logs the URL to the console for debugging purposes
   * @param url - The URL of the file to be downloaded
   * @returns void
   * 
   * Note: The commented-out code indicates that the function was initially intended to read an Excel file and write it to an output file named 'output.xlsx'.
   * However, the current implementation reads the file as a binary and converts it to CSV format.
   */
  download = (url:string) =>{
      console.log(url);
      // const txt = xlsx.readFile(url)
      // xlsx.writeFile(txt,'output.xlsx');
      var workbook = XLSX.readFile(url, { type:'binary'});
      var wsname = workbook.SheetNames[0];
      const ws = workbook.Sheets[wsname];
      var data = XLSX.utils.sheet_to_csv(ws);
      // this.dbIntr.api_call(0,url,null).subscribe(res =>{
      //   console.log(res);
      // })

  }

  /**
   *  @description This function updates the row in the FileMstData array with the provided row_obj.
   * It logs the row_obj to the console for debugging purposes.
   * @param row_obj - This function updates the row in the FileMstData array with the provided row_obj.
   */
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

  /**
   * 
   * @param rnt_id - This function fetches the file master data based on the provided rnt_id and itemsPerPage.
   * It makes an API call to '/mailbackProcessDetails' with the rnt_id and itemsPerPage as parameters.
   * The response is then mapped to create an array of manualUpload objects, which are stored in the FileMstData property.
   * The upload_file property of each manualUpload object is updated to include the environment's manualUpload URL.
   * @param itemsPerPage - This function fetches the file master data based on the provided rnt_id and itemsPerPage.
   * It makes an API call to '/mailbackProcessDetails' with the rnt_id and itemsPerPage as parameters.
   * The response is then mapped to create an array of manualUpload objects, which are stored in the FileMstData property.
   * The upload_file property of each manualUpload object is updated to include the environment's manualUpload URL.
   * @returns void
   */
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
  /**
   * @description This function is triggered when an item is selected from the pagination dropdown.
   * It calls the getFileMstDT function to fetch the file master data based on the selected item.
   * The selected item is passed as an argument to the getFileMstDT function.
   */
  onSelectItem = (ev) => {
    this.getFileMstDT(this.manualUpldFrm.value.rnt_id, ev);
    this.__pageNumber = ev;
  };
  /**
   * @description This function is used to get the pagination data based on the provided paginate object.
   * It checks if the paginate object has a URL property, and if so, it makes an API call to fetch the pagination data.
   * The API call appends the current page number and rnt_id to the URL.
   */
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
          // console.log(this.FileMstData);
        });
    }
  };

  /**
   * @description This function is used to download a file from a given URL.
   * It currently has no implementation, but it is intended to fetch the file from the provided URL and create a Blob object.
   * The Blob object can then be used to create a downloadable link for the file.
   */
  downloadFile = async (url) =>{

    // let blob = await fetch(url).then(r => r.blob());
    // console.log(blob);
    // const blob = new Blob([data], { type: 'text/csv' });
    // const url1= window.URL.createObjectURL(blob);
  }
}
