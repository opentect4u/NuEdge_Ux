import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { DocsModificationComponent } from './docsModification/docsModification.component';

@Component({
  selector: 'master-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {
  __selectClients: any = [];
  __documents: any=[];
  constructor(private __dialog: MatDialog,private __dbIntr: DbIntrService) { }
  ngOnInit() {
    this.getDocumentMaster();
  }
  getSearchItem(__ev) {
    this.__selectClients.length = 0;
    if (__ev.flag == 'A') {
      this.openDialog(__ev.id, '');
    }
    else {
      this.__selectClients.push(__ev.item);
      this.__dbIntr.api_call(0,'/document','search='+ __ev.item.client_code).pipe(map((x:any) => x.data)).subscribe(res =>{
        this.__documents = res;
      })
    }
  }
  populateDT(__items) {
    console.log(__items);
    
    this.openDialog(__items.id, __items);
  }
  openDialog(id, items) {
    const disalogConfig = new MatDialogConfig();
    disalogConfig.width = '100%';

    if(id > 0){
      this.__dbIntr.api_call(0,'/documentshowEdit','client_id='+id).pipe((map((x: any) => x.data))).subscribe(res => {
        // console.log(res);
        disalogConfig.data = {
          id: id,
          title: 'Update Documents',
          items: items,
          cl_id:id,
          cl_code:items.client_code,
          __docsDetail:res
        };
        const dialogref = this.__dialog.open(DocsModificationComponent, disalogConfig);
        dialogref.afterClosed().subscribe(dt => {
          if (dt?.id > 0) {
            // this.__selectClients[this.__selectClients.findIndex(x => x.id == dt.id)].doc_type = dt.doc_type;
          }
        });
      })

    }
    else{
      disalogConfig.data = {
        id: id,
        title:'Add Documents',
        items: items,
        cl_id:this.__selectClients[0].id,
        cl_code:this.__selectClients[0].client_code,
        __docsDetail:[]
      };

      const dialogref = this.__dialog.open(DocsModificationComponent, disalogConfig);
      dialogref.afterClosed().subscribe(dt => {
        if (dt?.id > 0) {
          // this.__selectClients[this.__selectClients.findIndex(x => x.id == dt.id)].doc_type = dt.doc_type;
        }
      });
    }
   
   
  }
  addMasters(__id: number,__items){
      this.openDialog(__id, __items);
  }
  getDocumentMaster(){
    this.__dbIntr.api_call(0,'/documentsearch',null).pipe(map((x:any) => x.data)).subscribe(res => {
      this.__documents = res;
    })
  }

}
