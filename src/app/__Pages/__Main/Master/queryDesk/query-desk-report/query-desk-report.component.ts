import { Component, OnInit } from '@angular/core';
import menu from '../../../../../../assets/json/Master/menu.json';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { pluck } from 'rxjs/operators';
import { ProductEntrySecreenComponent } from '../EntryModelDialog/product-entry-secreen/product-entry-secreen.component';
import { QueryTypeSubTypeComponent } from '../EntryModelDialog/query-type-sub-type/query-type-sub-type.component';
import { QueryNatureEntryScreenComponent } from '../EntryModelDialog/query-nature-entry-screen/query-nature-entry-screen.component';
import { QueryStatusComponent } from '../EntryModelDialog/query-status/query-status.component';
import { QueryGivenComponent } from '../EntryModelDialog/query-given/query-given.component';
import { QueryRecieveGivenThroughComponent } from '../EntryModelDialog/query-recieve-given-through/query-recieve-given-through.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';

enum API{
  'P' =  '/product', // For Product
  'QTS' = '/cusService/queryTypeSubtype', // For Query Type SubType
  'N' = '/cusService/queryNature', // For Query Nature
  'S' = '/cusService/queryStatus', // For Query Status
  'B' = '/cusService/queryGivenBy', // For Query Given By
  'T' = '/cusService/queryGivenThrough' // For Query Receive Given Through
}
@Component({
  selector: 'app-query-desk-report',
  templateUrl: './query-desk-report.component.html',
  styleUrls: ['./query-desk-report.component.css']
})



export class QueryDeskReportComponent implements OnInit {
  __menu = menu.filter(el => el.id == 15)[0]?.sub_menu.filter(el => el.flag != 'R');

  TabMenu: Partial<ITab>[] = [];

  flag = 'P';

  column:column[] = RqueryDeskReportColumn.Column.filter(el => el.isVisible.includes('P'))

  dataSource:Partial<IProductQuery | IQueryNature | IQueryGivenByOrReceiveThrough | IQueryTypeSubType | IQueryStatus>[] = [];

  /**
   * hold the index number for currenctly active Tab
   * By Default index set to 0 as we need to show the content of currently active Tab
  */
  index: number = 0;
  
  constructor(private utility:UtiliService,private dbIntr:DbIntrService,
    private overlay: Overlay,
    private __dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.populateDataSource('P')
    this.TabMenu = this.__menu.map(({ id, menu_name, flag, img }) => ({ tab_name: menu_name, img_src: ('../../../../../assets/images/' + img), id, flag }));
  }

  getColumns = () =>{
    return this.utility.getColumns(this.column);
  }

  changeTabDtls(ev,mode){
    this.dataSource = [];
      this.flag = ev.tabDtls?.flag
      this.column = RqueryDeskReportColumn.Column.filter(el => el.isVisible.includes(ev.tabDtls?.flag));
      this.populateDataSource(ev.tabDtls?.flag);
  }

  populateDataSource = (flag) =>{
      this.dbIntr.api_call(0,API[flag],null)
      .pipe(pluck('data'))
      .subscribe((res:Partial<IProductQuery | IQueryNature | IQueryGivenByOrReceiveThrough | IQueryTypeSubType | IQueryStatus>[]) =>{
                console.log(res);
                this.dataSource = res;
      })
  }

  getItems(item){
    console.log(item);
    let compName;
    if(this.flag == 'P'){
      compName = ProductEntrySecreenComponent
    }
    else if(this.flag == 'QTS'){
      compName = QueryTypeSubTypeComponent
    }
    else if(this.flag == 'N'){
      compName = QueryNatureEntryScreenComponent
    }
    else if(this.flag == 'S'){
      compName = QueryStatusComponent
    }
    else if(this.flag == 'B'){
      compName = QueryGivenComponent
    }
    else if(this.flag == 'T'){
      compName = QueryRecieveGivenThroughComponent
    }
    this.openDialog(null,this.flag,compName,item)
  }

  openDialog(el:any | undefined = null,flag,compName,item){
    if(flag != 'R'){
    const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.closeOnNavigation = false;
      dialogConfig.disableClose = true;
      dialogConfig.hasBackdrop = false;
      dialogConfig.width = '40%';
      dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
      dialogConfig.data = {
        flag:flag,
        data:item,
        title:this.TabMenu.filter(el => el.flag == flag)[0].tab_name
      };
      dialogConfig.id = item?.id.toString();
      try {
        const dialogref = this.__dialog.open(
          compName,
          dialogConfig
        );
        dialogref.afterClosed().subscribe((dt) => {
            console.log(dt);
            if(dt){
              const response = dt.response?.data;
              this.dataSource = this.dataSource.filter((el:any) =>{
                  if(el.id == response.id){
                      if(this.flag == 'P'){
                        el.product_name = response?.product_name;
                      }
                      else if(this.flag == 'QTS'){
                        el.product_name = response?.product_name;
                        el.query_type = response?.query_type,
                        el.query_subtype = response?.query_subtype,
                        el.query_tat = response?.query_tat
                      }
                      else if(this.flag == 'B' || this.flag == 'T'){
                         el.name = response?.name
                      }
                      else if(this.flag == 'N'){
                        el.query_nature = response?.query_nature
                      }
                      else {
                        el.status_name = response?.status_name;
                        el.color_code = response?.color_code;
                      }
                  }
                  return el;
              })
            }
        });
      } catch (ex) {
        const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
        dialogRef.updateSize('40%');
        console.log(ex);
        this.utility.getmenuIconVisible({
          id: Number(dialogConfig.id),
          isVisible: false,
          flag: flag,
        });
      }
    }

  }

}
export interface ITab{
  id:number,
  tab_name:string,
  img_src:string,
  flag:string
}

export class RqueryDeskReportColumn{
        public static Column:column[] = [
          {
              field:'sl_no',
              header:'Sl No.',
              isVisible:['P','QTS','N','B','S','T']
          },
          {
            field:'product_name',
            header:'Product',
            isVisible:['P','QTS']
          },
          {
            field:'query_type',
            header:'Query Type',
            isVisible:['QTS']
          },
          {
            field:'query_subtype',
            header:'Query SubType',
            isVisible:['QTS']
          },
          {
            field:'query_tat',
            header:'Query TAT',
            isVisible:['QTS']
          },
          {
            field:'status_name',
            header:'Query Status',
            isVisible:['S']
          },
          {
            field:'name',
            header:'Query Given By',
            isVisible:['B']
          },
          {
            field:'query_nature',
            header:'Query Nature',
            isVisible:['N']
          },
          {
            field:'name',
            header:'Query Receive/Given Through',
            isVisible:['T']
          },
          {
            field:'action',
            header:'Action',
            isVisible:['P','QTS','N','B','S','T']
          }
        ]
}

export interface IProductQuery{
      id:number,
      product_name:string;
}

export interface IQueryNature{
  id:number,
  query_nature:string;
}

export interface IQueryStatus{
  id:number,
  status_name:string;
  color_code:string;
}

export interface IQueryGivenByOrReceiveThrough{
  id:number,
  name:string;
}


export interface IQueryTypeSubType{
  id:number,
  product_name:string;
  query_type:string,
  query_subtype:string,
  query_tat:number
}


