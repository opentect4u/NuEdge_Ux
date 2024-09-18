import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
// import { menuBodyList } from 'src/app/__Model/menuBody';
import { UtiliService } from 'src/app/__Services/utils.service';
import { IQueryStatus } from '../../Master/queryDesk/query-desk-report/query-desk-report.component';
import { FormControl, FormGroup } from '@angular/forms';
import { column } from 'src/app/__Model/tblClmns';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { ModifyQueryStatusComponent } from '../modify-query-status/modify-query-status.component';
// import  menu from '../../../../../assets/json/menu.json';
enum API{
  'MF'='/cusService/MutualFundQuery',
  'B'='/cusService/BondQuery',
  'I'='/cusService/InsuranceQuery',
  'FD'='/cusService/FixedDepositQuery'
}

@Component({
  selector: 'app-customer-service-home',
  templateUrl: './customer-service-home.component.html',
  styleUrls: ['./customer-service-home.component.css']
})



export class CustomerServiceHomeComponent implements OnInit {
  // __menu:any = [];
  constructor(private router:Router,
    private overlay: Overlay,
    public __utility:UtiliService,
    private __actdt: ActivatedRoute,
    private dbIntr:DbIntrService,
    private __dialog: MatDialog
  ) {
    // this.__menu = menu.filter((x: menuBodyList) => x.id == 3)[0].sub_menu;
  }

  productId:string | undefined;
  queryId:string | undefined = this.__utility.encrypt_dtls(JSON.stringify(0));

  query_column:column[] = [];
  customerServiceForm = new  FormGroup({
    query_status_id:new FormControl(''),
    query_mode_id: new FormControl('')
  })

  queryDataSource = [];

  md_product = [];
  md_query_status:Partial<IQueryStatus>[] = [];
  ngOnInit(): void {
    this.fetchProduct();
    this.fetchQueryStatus();
  }


  setColumns = (productId:number) =>{
      this.query_column = queryColumn.QueryColumn.filter(el => el.isVisible.includes(Number(productId)))
  }

  TabDetails(ev){
      console.log(ev);
      this.customerServiceForm.patchValue({
        query_status_id:'',
        query_mode_id: ''
      });
      this.queryDataSource = [];
      this.productId = this.__utility.encrypt_dtls(JSON.stringify((ev.tabDtls?.id)));
      this.fetchQuery(ev.tabDtls?.flag);
      this.setColumns(ev.tabDtls?.id)
  }
 

  fetchQuery = (flag) =>{

      this.dbIntr.api_call(1,'/cusService/queryShow',this.__utility.convertFormData({
        ...this.customerServiceForm.value,
        product_id: this.__utility.decrypt_dtls(this.productId)
      }))
      .pipe(pluck('data'))
      .subscribe((res:any) =>{
        this.queryDataSource = res.map(el =>{
          el.cust_query_id = this.__utility.encrypt_dtls(JSON.stringify((el.id)))
          return el
        });
      })
  }


  fetchProduct = () =>{
    this.dbIntr.api_call(0,'/product',null).pipe(pluck('data')).subscribe((res:any) => {
      this.productId =this.__utility.encrypt_dtls(JSON.stringify((res.length > 0 ? res[0].id : 0))) 
      this.md_product = res.map(el => {
          return {
                id:el.id,
                tab_name:el.product_name.toUpperCase(),
                img_src:'',
                flag: this.initialName(el.product_name)
          }
        });
        this.setColumns(res.length > 0 ? res[0].id : 1)
        // console.log(this.productId);
        // console.log()
        // this.fetchQuery(this.md_product[0].flag);
    })
  }

  

  getColumns = () =>{
    return this.__utility.getColumns(this.query_column);
  }

  fetchQueryStatus = () =>{
    this.dbIntr.api_call(0,'/cusService/queryStatus',null).pipe(pluck('data')).subscribe((res:Partial<IQueryStatus>[]) =>{
          this.md_query_status = res;
    })
  }

  initialName(words) {
    return words
        .replace(/\b(\w)\w+/g, '$1')
        .replace(/\s/g, '')
        .replace(/\.$/, '')
        .toUpperCase();
  }

  searchQuery = () =>{
    const product_id = this.__utility.decrypt_dtls(this.productId);
    const flag = this.md_product.filter(el => el.id == product_id);
    this.fetchQuery(flag[0].flag)
  }

  setQuery = (queryDtls) =>{
        console.log(queryDtls);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = false;
        dialogConfig.closeOnNavigation = false;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = false;
        dialogConfig.width = '40%';
        dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
        dialogConfig.data = {
          flag:queryDtls?.query_id,
          data:queryDtls,
          title:`Change Status (${queryDtls?.query_id})`
        };
        dialogConfig.id = queryDtls?.query_id.toString();
        try {
          const dialogref = this.__dialog.open(
            ModifyQueryStatusComponent,
            dialogConfig
          );
          dialogref.afterClosed().subscribe((dt) => {
              if(dt){
                const response = dt.response;
                this.queryDataSource = this.queryDataSource.filter(el =>{
                    if(el.id == queryDtls.id){
                          el.status_name = response.status_name;
                          el.color_code = response.color_code;
                          el.query_status_id = response.query_status_id;
                          el.overall_feedback =  response.overall_feedback;
                          el.query_feedback =  response.query_feedback;
                    }
                    return el;
                })
              }
          });
        } catch (ex) {
          const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
          dialogRef.updateSize('40%');
          console.log(ex);
          this.__utility.getmenuIconVisible({
            id: dialogConfig.id.toString(),
            isVisible: false,
            flag: queryDtls?.query_id.toString(),
          });
        }
  }
}

export class queryColumn{
  public static QueryColumn:column[] = [
    {
      field:'query_id',
      header:'Query ID',
      width:'5rem',
      isVisible:[1,2,3,4]
    },
    {
      field:'status_name',
      header:'Query Status',
      width:'5rem',
      isVisible:[1,2,3,4]
    },
    {
      field:'date_time',
      header:'Date & Time',
      width:'5rem',
      isVisible:[1,2,3,4]
    },
    {
      field:'invester_name',
      header:'Invester',
      width:'5rem',
      isVisible:[1,2]
    },
    {
      field:'invester_name',
      header:'Policy Holder',
      width:'5rem',
      isVisible:[3]
    },{
      field:'invester_name',
      header:'FD Holder',
      width:'5rem',
      isVisible:[4]
    },
    {
      field:'invester_email',
      header:'Email',
      width:'5rem',
      isVisible:[1,2,3,4]
    },
    {
      field:'invester_mobile',
      header:'Mobile',
      width:'5rem',
      isVisible:[1,2,3,4]
    },
    // {
    //   field:'invester_name',
    //   header:'Invester'
    // },
    {
      field:'folio_no',
      header:'Folio',
      width:'5rem',
      isVisible:[1,2]
    }, {
      field:'policy_no',
      header:'Policy No',
      width:'5rem',
      isVisible:[3]
    }, {
      field:'fd_no',
      header:'FD No',
      width:'5rem',
      isVisible:[4]
    },
    {
      field:'scheme_name',
      header:'Scheme',
      width:'20rem',
      isVisible:[1,2]
    },
    {
      field:'plan_name',
      header:'Plan',
      width:'10rem',
      isVisible:[3,4]
    },
    {
      field:'query_details',
      header:'Query Details',
      width:'30rem',
      isVisible:[1,2,3,4]
    },
    {
      field:'action',
      header:'Action',
      width:'10rem',
      isVisible:[1,2,3,4]
    }
  ]
}






