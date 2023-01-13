import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { DocsModificationComponent } from './docsModification/docsModification.component';

@Component({
  selector: 'master-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {
  __columns: string[] = ['sl_no', 'cl_code', 'cl_name', 'pan','mobile','edit','delete'];
  // __selectClients = new MatTableDataSource();
  // __selectClients: any = [];
  __documents =  new MatTableDataSource();
  constructor(private __dialog: MatDialog,private __dbIntr: DbIntrService) { }
  ngOnInit() {
    this.getDocumentMaster();
  }
  getSearchItem(__ev) {
    // this.__selectClients.length = 0;
    if (__ev.flag == 'A') {
      this.openDialog(__ev.id, '');
    }
    else if(__ev.flag == 'F') {
      this.__documents =new MatTableDataSource([__ev.item]);
    }
    else{
      this.getDocumentMaster();
    }
  }
  populateDT(__items) {
    console.log(__items);
    this.openDialog(__items.id, __items);
  }
  openDialog(id, items) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '100%';
    dialogConfig.autoFocus =false;
    if(id > 0){
      this.__dbIntr.api_call(0,'/documentshowEdit','client_id='+id).pipe((map((x: any) => x.data))).subscribe(res => {
        console.log(res);
        dialogConfig.data = {
          id: id,
          title: 'Update Documents',
          items: items,
          cl_id:id,
          cl_code:items.client_code,
          __docsDetail:res
        };
        const dialogref = this.__dialog.open(DocsModificationComponent, dialogConfig);
        dialogref.afterClosed().subscribe(dt => {
          if (dt?.id > 0) {
            // this.__selectClients[this.__selectClients.findIndex(x => x.id == dt.id)].doc_type = dt.doc_type;
          }
        });
      })

    }
    else{
      dialogConfig.data = {
        id: id,
        title:'Add Documents',
        items: items,
        __docsDetail:[]
      };

      const dialogref = this.__dialog.open(DocsModificationComponent, dialogConfig);
      dialogref.afterClosed().subscribe(dt => {
        if (dt) {
          console.log(dt);
        }
      });
    }
   
   
  }
  addMasters(__id: number,__items){
      this.openDialog(__id, __items);
  }
  getDocumentMaster(){
     this.__dbIntr.api_call(0,'/documentsearch',null).pipe(map((x:any) => x.data)).subscribe(res => {
       console.log(res);
       this.__documents =new MatTableDataSource(res);
    })
  }

}
