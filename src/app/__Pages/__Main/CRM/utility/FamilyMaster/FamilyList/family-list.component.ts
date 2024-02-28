import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { map, pluck, tap } from 'rxjs/operators';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-family-list',
  templateUrl: './family-list.component.html',
  styleUrls: ['./family-list.component.css'],
})
export class FamilyListComponent implements OnInit {
  @ViewChild('pTable') pTable: Table;

  constructor(private __dbIntr: DbIntrService, private utility: UtiliService) {}

  parent_column: column[] = FamilyListClm.column;

  sub_column: column[] = FamilyListClm.sub_column;

  dataSource: IFamilyList[] = [];

  ngOnInit(): void {
    this.getFamilyList();
  }

  getFamilyList = () => {
    this.__dbIntr
      .api_call(0, '/clientFamilyDetailSearch', null)
      .pipe(
        pluck('data'),
        tap((item: IFamilyList[]) => {
          return item.map((item: IFamilyList) => {
            const arr = [
              item.add_line_1,
              item.add_line_2,
              item.city_name,
              item.state_name,
              item.district_name,
              item.pincode,
            ];
            item.add_line_1 = arr.filter(item => {return item}).toString();
            return item;
          });
        })
      )
      .subscribe((res: IFamilyList[]) => {
        this.dataSource = res.map((item: IFamilyList) => ({
          ...item,
          family_member: [],
        }));
      });
  };

  onRowExpand = (
    ev: Required<{ originalEvent: PointerEvent; data: IFamilyList }>
  ) => {
    // console.log(ev);
    this.__dbIntr
      .api_call(0, '/clientFamilyDetail', 'family_head_id=' + ev.data.client_id)
      .pipe(
        pluck('data'),
        tap((items: IFamilyList[]) => {
          return items.map((item: IFamilyList) => {
            const arr = [
              item.add_line_1,
              item.add_line_2,
              item.city_name,
              item.state_name,
              item.district_name,
              item.pincode,
            ];
            item.add_line_1 = arr.filter(item => {return item}).toString();
            return item;
          });
        })
      )
      .subscribe((res: IFamilyList[]) => {
        try {
          const index = this.dataSource
            .map((item) => item.id)
            .indexOf(ev.data.id);
          this.dataSource[index].family_member.length = 0;
          this.dataSource[index].family_member = res;
        } catch (ex) {
          console.log(ex);
        }
      });
  };
  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.pTable.filterGlobal(value, 'contains');
  };
  getColumns = () => {
    return this.utility.getColumns(this.parent_column);
  };
}
export interface IFamilyList {
  id: number;
  client_id: number;
  family_id: number;
  relationship: string;
  client_name: string;
  client_code: string;
  pan: string;
  mobile: number;
  email: string;
  add_line_1: string;
  add_line_2: any;
  city_name: string;
  district_name: string;
  state_name: string;
  type_name: string;
  pincode: number;
  family_member: IFamilyList[];
}

export class FamilyListClm {
  public static column: column[] = [
    {
      field: 'sl_no',
      header: 'Sl No.',
      width: '5rem',
    },
    {
      field: 'client_name',
      header: 'Family Head',
      width: '18rem',
    },
    {
      field: 'client_code',
      header: 'Family Head Code',
      width: '7rem',
    },
    {
      field: 'pan',
      header: 'PAN',
      width: '7rem',
    },
    {
      field: 'mobile',
      header: 'Mobile',
      width: '7rem',
    },
    {
      field: 'email',
      header: 'Email',
      width: '15rem',
    },
    {
      field: 'add_line_1',
      header: 'Address',
      width: '23rem',
    },
    {
      field: 'login_status',
      header: 'Login Status',
      width: '10rem',
    },
  ];

  public static sub_column: column[] = [
    {
      field: 'sl_no',
      header: 'Sl No.',
      width: '5rem',
    },
    {
      field: 'client_name',
      header: 'Family Member',
      width: '18rem',
    },
    {
      field: 'client_code',
      header: 'Member Code',
      width: '7rem',
    },
    {
      field: 'pan',
      header: 'PAN',
      width: '7rem',
    },
    {
      field: 'mobile',
      header: 'Mobile',
      width: '7rem',
    },
    {
      field: 'email',
      header: 'Email',
      width: '15rem',
    },
    {
      field: 'add_line_1',
      header: 'Address',
      width: '23rem',
    },
    {
      field: 'login_status',
      header: 'Login Status',
      width: '10rem',
    },
  ];
}
