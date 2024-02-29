import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { pipe } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { client } from 'src/app/__Model/__clientMst';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-non-family-list',
  templateUrl: './non-family-list.component.html',
  styleUrls: ['./non-family-list.component.css'],
})
export class NonFamilyListComponent implements OnInit {

  constructor(private dbIntr: DbIntrService,private utility:UtiliService) {}

  @ViewChild('primeTbl') primeTbl :Table;

  /** Column holder */
  nonFamilyClmn: column[] = NonFamilyListClm.non_family_clm;
  /*** End */

  /*** Holding Non Family  */
  non_family_mst_dt: client[] = [];
  /**  End ****************/

  ngOnInit(): void {
    this.fetchNonFamilyMasterData();
  }

  fetchNonFamilyMasterData = () => {
    this.dbIntr
      .api_call(0, '/nonFamilylist', null)
      .pipe(pluck('data'))
      .subscribe((res: client[]) => {
        this.non_family_mst_dt = res;
      });
  };

  getColumns = () =>{
    return this.utility.getColumns(this.nonFamilyClmn);
  }

  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value,'contains')
  }
}

export class NonFamilyListClm {
  public static non_family_clm: column[] = [
    {
      field: 'sl_no',
      header: 'Sl No',
      width:'5rem'
    },
    {
      field: 'client_name',
      header: 'Client',
      width:'28rem'
    },
    {
      field: 'mobile',
      header: 'Mobile',
      width:'12rem'
    },
    {
      field: 'pan',
      header: 'PAN',
      width:'12rem'
    },
    {
      field: 'email',
      header: 'Email',
      width:'20rem'
    },
    {
      field: 'login_status',
      header: 'Login Status',
      width:'10rem'
    },
  ];
}
