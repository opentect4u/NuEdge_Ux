import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';



@Component({
  selector: 'summary-report',
  templateUrl: './summary-report.component.html',
  styleUrls: ['./summary-report.component.css']
})
export class SummaryReportComponent implements OnInit {

  fund_title = 'FUND HOUSE WISE INVESTMENT SUMMARY';
  cat_title='CATEGORY WISE INVESTMENT SUMMARY';
  subcat_title = 'SUBCATEGORY WISE INVESTMENT SUMMARY';
  @ViewChild('fundHouse') fundHouseTble:Table
  @ViewChild('cat') catTble:Table
  @ViewChild('subcat') subcatTble:Table

  // private __FoundHouseInvestment:Required<IFoundHouseInvestment>[] = [];
  // _totalFundHouse:Partial<ITableFooter>;

  @Input() _totalFundHouse

  @Input() __isGraphShow:boolean = false;

  // private __CategoryWiseInvestment:Required<IcategoryWiseInvestment>[] = [];
  // _totalCategory:Partial<ITableFooter>;

  valuation_as_on:string = '';
  
  // private __subcategoryWiseInvestment:Required<IsubcategoryWiseInvestment>[] = [];
  // _totalSubCategory:Partial<ITableFooter>;

  @Input() FoundHouseInvestment:Required<IFoundHouseInvestment>[] = []

  // @Input()
  // public get FoundHouseInvestment():Required<IFoundHouseInvestment>[]{
  //  return this.__FoundHouseInvestment;
  // }

  // public set FoundHouseInvestment(FoundHouseInvestment:Required<IFoundHouseInvestment>[]){
  //   this.__FoundHouseInvestment = FoundHouseInvestment;
  //     // let total_amt = [];
  //     // let total_date = [];
  //     // FoundHouseInvestment.forEach((el,index) =>{
  //     //   total_amt = [...total_amt,...el.total_amt];
  //     //   total_date = [...total_date,...el.total_date];
  //     //   if(index == (FoundHouseInvestment.length - 1)){
  //     //     this.valuation_as_on = el.valuation_as_on;
  //     //   }
  //     // })
  //     // const curr_val = global.Total__Count(FoundHouseInvestment,(item:IFoundHouseInvestment)=> Number(item.curr_val));
  //     // this._totalFundHouse ={
  //     //   inv_cost:global.Total__Count(FoundHouseInvestment,(item:Required<IFoundHouseInvestment>) => item.inv_cost),
  //     //   curr_val: curr_val,
  //     //   gain_loss: global.Total__Count(FoundHouseInvestment,(item:IFoundHouseInvestment)=> Number(item.gain_loss)),
  //     //   idcw:global.Total__Count(FoundHouseInvestment,(item:IFoundHouseInvestment)=> Number(item.idcw)),
  //     //   ret_abs:global.Total__Count(FoundHouseInvestment,(item:IFoundHouseInvestment) => Number(item.ret_abs)) / FoundHouseInvestment.length,
  //     //   xirr:global.XIRR([...total_amt,curr_val],[...total_date,this.valuation_as_on],0)
  //     // }
  // }

  @Input() CategoryWiseInvestment:Required<IcategoryWiseInvestment>[] = []
  // @Input()
  // public get CategoryWiseInvestment():Required<IcategoryWiseInvestment>[]{
  //  return this.__CategoryWiseInvestment;
  // }

  // public set CategoryWiseInvestment(CategoryWiseInvestment:Required<IcategoryWiseInvestment>[]){
  //   this.__CategoryWiseInvestment= CategoryWiseInvestment;
  //     // this._totalCategory ={
  //     //   inv_cost:global.Total__Count(CategoryWiseInvestment,(item:Required<IcategoryWiseInvestment>) => item.inv_cost),
  //     //   curr_val: global.Total__Count(CategoryWiseInvestment,(item:IcategoryWiseInvestment)=> Number(item.curr_val)),
  //     //   gain_loss: global.Total__Count(CategoryWiseInvestment,(item:IcategoryWiseInvestment)=> Number(item.gain_loss)),
  //     //   idcw:global.Total__Count(CategoryWiseInvestment,(item:IcategoryWiseInvestment)=> Number(item.idcw)),
  //     //   ret_abs:global.Total__Count(CategoryWiseInvestment,(item:IcategoryWiseInvestment) => Number(item.ret_abs)) / CategoryWiseInvestment.length,
  //     // }
  // }

  @Input() subcategoryWiseInvestment:Required<IsubcategoryWiseInvestment>[] = []
  // @Input()
  // public get subcategoryWiseInvestment():Required<IsubcategoryWiseInvestment>[]{
  //  return this.__subcategoryWiseInvestment;
  // }

  // public set subcategoryWiseInvestment(subcategoryWiseInvestment:Required<IsubcategoryWiseInvestment>[]){
  //   this.__subcategoryWiseInvestment = subcategoryWiseInvestment;
  //     // this._totalSubCategory ={
  //     //   inv_cost:global.Total__Count(subcategoryWiseInvestment,(item:Required<IsubcategoryWiseInvestment>) => item.inv_cost),
  //     //   curr_val: global.Total__Count(subcategoryWiseInvestment,(item:IsubcategoryWiseInvestment)=> Number(item.curr_val)),
  //     //   gain_loss: global.Total__Count(subcategoryWiseInvestment,(item:IsubcategoryWiseInvestment)=> Number(item.gain_loss)),
  //     //   idcw:global.Total__Count(subcategoryWiseInvestment,(item:IsubcategoryWiseInvestment)=> Number(item.idcw)),
  //     //   ret_abs:global.Total__Count(subcategoryWiseInvestment,(item:IsubcategoryWiseInvestment) => Number(item.ret_abs)) / subcategoryWiseInvestment.length,
  //     // }
  // }

  FundHouseColumn:column[] = SummaryColumn.FundHouseColumn;
  CategoryWiseColumn:column[] = SummaryColumn.CategoryColumn;
  SubcategoryColumn:column[] = SummaryColumn.subCategoryColumn;

  constructor(private utility:UtiliService,private datePipe:DatePipe) { }

  ngOnInit(): void {}

  getColumnsForFundHouse(){
      return this.utility.getColumns(this.FundHouseColumn);
  }

  getColumnsForCategory(){
    return this.utility.getColumns(this.CategoryWiseColumn);
  }

  getColumnsForSubcategory(){
    return this.utility.getColumns(this.SubcategoryColumn);
  }

  filterGlobal_FundHouse = ($event) =>{
    let value = $event.target.value;
    this.fundHouseTble.filterGlobal(value,'contains')
  }
  filterGlobal_Category = ($event) =>{
    let value = $event.target.value;
    this.catTble.filterGlobal(value,'contains')
  }
  filterGlobal_Subcategory = ($event) =>{
    let value = $event.target.value;
    this.subcatTble.filterGlobal(value,'contains')
  }

}

export interface IFoundHouseInvestment{
   fund_name:string;
   inv_cost:number;
   curr_val:number;
   idcw:number;
   gain_loss:number;
   ret_abs:number;
   xirr:number;
}

export interface IcategoryWiseInvestment{
  cat_name:string;
    inv_cost:number;
    curr_val:number;
    idcw:number;
    gain_loss:number;
    ret_abs:number;
    xirr:number;
}

export interface IsubcategoryWiseInvestment{
  subcat_name:string;
  inv_cost:number;
  curr_val:number;
  idcw:number;
  gain_loss:number;
  ret_abs:number;
  xirr:number;
}

export class SummaryColumn{
  public static FundHouseColumn:column[] = [
    {
      field:'fund_name',
      header:'Fund House',
      width:'40rem'
    },
    {
      field:'inv_cost',
      header:'Investment',
      width:'10rem'
    },{
      field:'curr_val',
      header:'Current Value',
      width:'10rem'
    },{
      field:'idcw',
      header:'IDCW',
      width:'5rem'
    },{
      field:'gain_loss',
      header:'Gain/Loss',
      width:'10rem'
    },{
      field:'ret_abs',
      header:'Abs.Rtn',
      width:'10rem'
    },{
      field:'xirr',
      header:'XIRR',
      width:'10rem'
    }
  ]

  public static CategoryColumn:column[] = [
    {
      field:'cat_name',
      header:'Category',
      width:''
    },
    {
      field:'inv_cost',
      header:'Investment',
      width:''
    },{
      field:'curr_val',
      header:'Current Value',
      width:''
    },{
      field:'idcw',
      header:'IDCW',
      width:''
    },{
      field:'gain_loss',
      header:'Gain/Loss',
      width:''
    },{
      field:'ret_abs',
      header:'Abs.Rtn',
      width:''
    },{
      field:'xirr',
      header:'XIRR',
      width:''
    }
  ]

  public static subCategoryColumn:column[] = [
    {
      field:'subcat_name',
      header:'Subcategory',
      width:'27rem'
    },
    {
      field:'inv_cost',
      header:'Investment',
      width:''
    },{
      field:'curr_val',
      header:'Current Value',
      width:''
    },{
      field:'idcw',
      header:'IDCW',
      width:''
    },{
      field:'gain_loss',
      header:'Gain/Loss',
      width:''
    },{
      field:'ret_abs',
      header:'Abs.Rtn',
      width:''
    },{
      field:'xirr',
      header:'XIRR',
      width:''
    }
  ]
}

export interface ITableFooter{
    inv_cost:number;
    curr_val:number;
    idcw:number;
    gain_loss:number;
    ret_abs:number;
    xirr:number;
}