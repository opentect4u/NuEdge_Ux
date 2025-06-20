import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges,} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { fileValidators } from 'src/app/__Utility/fileValidators';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-documebnt-locker-dtls-entry',
  templateUrl: './documebnt-locker-dtls-entry.component.html',
  styleUrls: ['./documebnt-locker-dtls-entry.component.css']
})
export class DocumebntLockerDtlsEntryComponent implements OnInit {
  allowedExtensions = ['pdf'];
  @Input() companyDtls: any = [];
  cm_profile_id: number;
  @Output() documentModify: EventEmitter<any> = new EventEmitter<any>();
  @Output() resetDocument: EventEmitter<any> = new EventEmitter<any>();

  @Input() set comp_id(value){
    this.cm_profile_id = value;
    this.document.clear();
    this.addDocument(null);
  }
  @Input() set documentDtls(value){
    if(!value){
      this.document.clear();
   }
   this.addDocument(value);
  }
  documentFrm = new FormGroup({
    doc_id: new FormControl(''),
    document: new FormArray([])
  })
  constructor(private dbIntr: DbIntrService,private utility: UtiliService,private sanitizer: DomSanitizer) { }

  ngOnInit(): void {}


  get document(): FormArray{
    return this.documentFrm.get('document') as FormArray;
  }

  /**** Start Document Locker Form Array Functions */
  addDocument(document : any | undefined = null){
    if(document){
      this.document.clear();
    }
    this.document.push(this.setDocument(document));
  }

  /** * * This function is used to set the document form group with the provided document data.
 * * If no document data is provided, it initializes the form controls with default values.
 * * @param {any} [document] - Optional parameter containing the document data to be used for initialization.
 * * @returns {FormGroup} - The FormGroup instance representing the document form.
 */
  setDocument(document){
    return new FormGroup({
        id: new FormControl(document ? document.id : 0),
        cm_profile_id: new FormControl(document ? document.cm_profile_id : this.cm_profile_id),
        doc_name: new FormControl(document ? document.doc_name : '',[Validators.required]),
        doc_no: new FormControl(document ? document.doc_no : '',[Validators.required]),
        valid_from: new FormControl(document ? document.valid_from : '',[Validators.required]),
        valid_to: new FormControl(document ? document.valid_to : '',[Validators.required]),
        doc: new FormControl('', document ? [
          fileValidators.fileExtensionValidator(this.allowedExtensions)] : [Validators.required,fileValidators.fileExtensionValidator(this.allowedExtensions)]),
        file_preview: new FormControl(document ? `${environment.company_logo_url + '/document/' + document?.upload_file}` : ''),
        file: new FormControl(document ? `${environment.company_logo_url + '/document/' + document?.upload_file}` : '')
    })
  }
  /**** End Document Locker Form Array Functions */
  getFile(ev,index){
    this.document.controls[index].get('doc').setValidators([Validators.required, fileValidators.fileSizeValidator(ev.target.files), fileValidators.fileExtensionValidator(this.allowedExtensions)])
    this.document.controls[index].get('file').setValue(ev.target.files[0]);
    this.document.controls[index].get('file_preview')?.patchValue(
      this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(ev.target.files[0]))
      );

  }
  /** * This function is used to submit the document form data.
  * * It creates a FormData object, appends the document details and files to it,
  * * and makes an API call to submit the data.
  * * @returns {void}
  */
  submitDocument(){
    console.log(this.document.value);

      const documentLocker = new FormData();
      documentLocker.append('doc_dtls',
      JSON.stringify(this.document.value.map(
        ({id,cm_profile_id,doc_name,doc_no,valid_from,valid_to,file},key) =>
        ({
          id,
          cm_profile_id,
          doc_name,
          doc_no,
          valid_from,
          valid_to,
          file:documentLocker.append('file_'+key,typeof(file) == 'string' ? '' : file)
        }
        )
        )
        )
      );
      this.dbIntr.api_call(1,'/comp/documentLockerAddEdit',documentLocker).subscribe((res: any) =>{
        this.utility.showSnackbar(res.suc == 1 ? 'Document Uploaded Successfully' : 'Error In Upload',res.suc);
        // this.getDocument(res.data);
        this.documentModify.emit(res.data)
        this.reset();
      })
  }
  /** 
   * * This function is used to add a new document entry to the document form array.
   * * It calls the addDocument function to create a new document form group and adds it to the form array.
   * * @returns {void}
   */
  addItems(){
    this.addDocument();
  }
  /**
   * * This function is used to remove a document entry from the document form array.
   * * It removes the document form group at the specified index from the form array.
   * * @param {number} index - The index of the document entry to be removed.
   * * @returns {void}
   */
  removeAt(index){
    this.document.removeAt(index);
  }
  /**** End */
  /**
   * * This function is used to reset the document form array.
   * * It clears the document form array and adds a new document form group to it.
   * * @returns {void}
   */
  reset(){
    this.document.clear();
    this.addDocument();
    // this.resetDocument.emit();
   }
}
