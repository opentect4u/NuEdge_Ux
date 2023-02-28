import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { docType } from 'src/app/__Model/__docTypeMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-docTypeModify',
  templateUrl: './docTypeModify.component.html',
  styleUrls: ['./docTypeModify.component.css']
})
export class DocTypeModifyComponent implements OnInit {
  __columns: string[] = ['sl_no', 'doc_type', 'edit', 'delete'];
  __selectDocs = new MatTableDataSource<docType>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  __docTypeId: number = 0;
  __docsForm = new FormGroup({
    doc_type: new FormControl('', [Validators.required]),
    id: new FormControl(0)
  })
  constructor(
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    private __router: Router,
    private __rtData: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getDocumentmaster();
    if(this.__rtData.snapshot.queryParamMap.get('id')){
      console.log(this.__rtData.snapshot.queryParamMap.get('id'));
      
      this.setParticularDocumentType((Number(atob(this.__rtData.snapshot.queryParamMap.get('id')))));
    }
  }

  populateDT(_docTYpeDtls){
    this.setDoctype(_docTYpeDtls);
  }

  setParticularDocumentType(_id){
       this.__dbIntr.api_call(0,'/documenttype','id='+_id).pipe(map((x: any) => x.data)).subscribe((res: docType[]) =>{
                 this.setDoctype(res[0]);
       })
  }
  setDoctype(_docTYpeDtls){
    this.__docsForm.patchValue({
      doc_type:_docTYpeDtls.doc_type,
      id:_docTYpeDtls.id
    })
    this.__docTypeId =_docTYpeDtls.id;
  }
  submit() {
    if (this.__docsForm.invalid) {
      this.__utility.showSnackbar('Submition failed due to some error', 0);
      return;
    }
    const __docType = new FormData();
    __docType.append("doc_type", this.__docsForm.value.doc_type);
    __docType.append("id", this.__docsForm.value.id);

    this.__dbIntr.api_call(1, '/documenttypeAddEdit', __docType).subscribe((res: any) => {

      if (res.suc == 1) {
        if (this.__docTypeId > 0) {
          if (this.__selectDocs.data.findIndex((x: docType) => x.id == res.data.id) != -1) {
            this.updateRow(res.data);
          }
          //if the particular id is not presenet in current list then only route by url with out doing any changes
          this.__router.navigateByUrl('/main/master/docTypeModify?id=' + btoa('0'), { skipLocationChange: false }).then(res => {
            // set logic if needed
          })
        }
        else {
          this.__selectDocs.data.unshift(res.data);
          this.__selectDocs._updateChangeSubscription();
        }
      }
      this.__utility.showSnackbar(res.suc == 1 ? (this.__docTypeId > 0 ? 'Document type updated successfully' : 'Document type added successfully') : 'Something went wrong! please try again later', res.suc);
      this.reset();

    })
  }
  reset() {
    this.__docsForm.reset();
    this.__docsForm.patchValue({
      id: 0
    });
    this.__docTypeId = 0;
  }
  private getDocumentmaster() {
    this.__dbIntr.api_call(0, '/documenttype', null).pipe(map((x: responseDT) => x.data)).subscribe((res: docType[]) => {
      this.__selectDocs = new MatTableDataSource(res);
      this.__selectDocs.paginator = this.paginator;
    })
  }
  updateRow(row_obj: docType) {
    this.__selectDocs.data = this.__selectDocs.data.filter((value: docType, key) => {
      if (value.id == row_obj.id) {
        value.doc_type = row_obj.doc_type;
        value.id = row_obj.id;
      }
      return true;
    });
  }

}
