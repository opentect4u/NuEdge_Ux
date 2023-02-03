import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { responseDT } from 'src/app/__Model/__responseDT';
import { scheme } from 'src/app/__Model/__schemeMst';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'master-scheme',
  templateUrl: './scheme.component.html',
  styleUrls: ['./scheme.component.css']
})
export class SchemeComponent implements OnInit {
  __columns: string[] = ['sl_no', 'scm_name', 'edit','delete'];
  __selectScheme = new MatTableDataSource<scheme>([]);
  @ViewChild(MatPaginator) paginator:MatPaginator;
  constructor(private __dbIntr:DbIntrService,private __utility: UtiliService) { }
  ngOnInit(): void {this.getSchememaster();}
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {}
    else if(__ev.flag == 'F'){this.setPaginator([__ev.item]);}
    else{this.getSchememaster();}
  }
  populateDT(__items: scheme) {
    // this.openDialog(__items.id, __items);
    this.__utility.navigatewithqueryparams('/main/master/scmModify',{queryParams:{id:btoa(__items.id.toString()),flag:btoa(__items.scheme_type)}});
  }
  getSchememaster(){
    this.__dbIntr.api_call(0,'/scheme',null).pipe(map((x:responseDT) => x.data)).subscribe((res: scheme[]) => {
      this.setPaginator(res);
    })
  }

  setPaginator(__res){
    this.__selectScheme = new MatTableDataSource(__res);
    this.__selectScheme.paginator =this.paginator;
  }
}

