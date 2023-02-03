import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { option } from 'src/app/__Model/option';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.css']
})
export class OptionComponent implements OnInit {
  __columns: string[] = ['sl_no', 'opt_name', 'edit', 'delete'];
  __selectAMC = new MatTableDataSource<option>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(  private __utility: UtiliService,private __dbIntr: DbIntrService,private route :ActivatedRoute) { }
  ngOnInit(): void {
    this.getOptionMaster();
  }
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
    }
    else if (__ev.flag == 'F') {
      this.setPaginator([__ev.item]);
    }
    else {
      this.getOptionMaster();
    }
  }
  populateDT(__items: option) {
    this.__utility.navigatewithqueryparams('/main/master/optionModify',{queryParams:{id: btoa(__items.id.toString())}})
  }

  private getOptionMaster(__params: string | null = null) {
    this.__dbIntr.api_call(0, '/option', __params).pipe(map((x: responseDT) => x.data)).subscribe((res: option[]) => {
      this.setPaginator(res);
    })
  }
  private setPaginator(__res) {
    this.__selectAMC = new MatTableDataSource(__res);
    this.__selectAMC.paginator = this.paginator;
  }

}
