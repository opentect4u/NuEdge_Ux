import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { FormControl } from '@angular/forms';
import { client } from 'src/app/__Model/__clientMst';
import jsPDF from 'jspdf';
import { Roboto_condensed_medium, Roboto_condensed_normal } from 'src/app/strings/fonts';
import autoTable from 'jspdf-autotable';
/*** Display Footer data on P&L */
export type TotalPLportfolio = {
  purchase: number | undefined,
  switch_in: number | undefined,
  idcw_reinv:number | undefined,
  tot_inflow:number | undefined,
  redemption:number | undefined,
  switch_out:number | undefined,
  idcwp:number | undefined,
  tot_outflow:number | undefined,
  scheme_name:number | undefined,
  curr_val:number | undefined,
  gain_loss:number | undefined,
  xirr:number | undefined,
  ret_abs:number | undefined,
}
/**  End */

export enum BTNTYPE {
   PDF='pdf',
    XLSX='xlsx',
}

@Component({
  selector: 'pl-trxn-dtls',
  templateUrl: './pl-trxn-dtls.component.html',
  styleUrls: ['./pl-trxn-dtls.component.css']
})
export class PlTrxnDtlsComponent implements OnInit {

  constructor(private utility:UtiliService,private datePipe:DatePipe) { }

  btnType = new FormControl();

  @ViewChild('printPdf') elementRf:ElementRef

  /** Footer Table */
   @Input() footerDtls: Partial<TotalPLportfolio>;
  /** End */

  @Input() valuation_as_on

  @Input() form_data;

  @Input() pl_trxn:Partial<IPLTrxn>[] = [];

  @Input() folio_type:string;

  @Input() client_dtls:Partial<client>;

  @Output() getTransactionDetailsFromPL: EventEmitter<any> = new EventEmitter();

  @ViewChild('dt') primaryTbl :Table;

  column:column[] = PLTransaction.column
  ngOnInit(): void {}

  filterGlobal_secondary = ($event) =>{
    let value = $event.target.value;
    this.primaryTbl.filterGlobal(value,'contains')
  }
  getColumns = () =>{
    return this.utility.getColumns(this.column);
  }

  getRowDtls =(rows:Partial<IPLTrxn>) =>{
      this.getTransactionDetailsFromPL.emit(rows)
  }
  // ngOnChanges(changes: SimpleChanges): void {
  //   try{
  //     queueMicrotask(()=>{
  //         this.primaryTbl.reset();
  //         let array_without_negative_curr_val = this.primaryTbl.value;
  //       let total_amt = [];
  //       let total_date = [];
  //       // console.log(this.primaryTbl.value);
  //       array_without_negative_curr_val.forEach((el,index) =>{
  //         if(el.mydata.all_amt_arr.length > 0 && el.mydata.all_date_arr.length > 0){
  //           total_amt=[...total_amt,...el.mydata.all_amt_arr.map(item => Number(item))];
  //           total_date=[...total_date,...el.mydata.all_date_arr];
  //         }
  //       })
  //       const curr_val = global.Total__Count(array_without_negative_curr_val,item => Number(item.curr_val));
  //       total_amt.push(curr_val);
  //       total_date.push(this.datePipe.transform(this.form_data?.valuation_as_on,'YYYY-MM-dd'))
  //       this.footerDtls = {
  //         purchase:global.Total__Count(array_without_negative_curr_val,item => Number(item.purchase)),
  //         switch_in:global.Total__Count(array_without_negative_curr_val,item => Number(item.switch_in)),
  //         idcw_reinv:global.Total__Count(array_without_negative_curr_val,item => item.idcw_reinv ? Number(item.idcw_reinv) : 0),
  //         tot_inflow:global.Total__Count(array_without_negative_curr_val,item => Number(item.tot_inflow)),
  //         redemption:global.Total__Count(array_without_negative_curr_val,item => Number(item.redemption)),
  //         switch_out:global.Total__Count(array_without_negative_curr_val,item => Number(item.switch_out)),
  //         idcwp:global.Total__Count(array_without_negative_curr_val,item => item.idcwp ? Number(item.idcwp) : 0),
  //         tot_outflow:global.Total__Count(array_without_negative_curr_val,item => Number(item.tot_outflow)),
  //         curr_val:global.Total__Count(array_without_negative_curr_val,item => Number(item.curr_val)),
  //         gain_loss:global.Total__Count(array_without_negative_curr_val,item => Number(item.gain_loss)),
  //         ret_abs:(global.Total__Count(array_without_negative_curr_val,item => Number(item.ret_abs)) / array_without_negative_curr_val.length),
  //         xirr:global.XIRR(total_amt,total_date,0)
  //       }
  //       // console.log(this.footerDtls)
  //       })
  //   }
  //   catch(err){
  //     // console.log(err);
  //   }

  // }
  ngAfterViewInit() {
    // this.btnType.valueChanges.subscribe((changes) => {
    //     switch(changes){
    //       case BTNTYPE.PDF:this.generatePDF();break;
    //       case BTNTYPE.XLSX:this.primaryTbl.exportCSV();break;
    //       default:break;
    //     }
    // })
  }


  generatePDF = (mode:string) =>{

    var pdf = new jsPDF('l','pt','a4');
    const html_element = document.getElementById('client_container');
    pdf.addFileToVFS('RobotoCondensed-Regular-normal.ttf', Roboto_condensed_normal);
    pdf.addFileToVFS('RobotoCondensed-Bold-bold.ttf', Roboto_condensed_medium);
    pdf.addFont('RobotoCondensed-Regular-normal.ttf', 'RobotoCondensed-Regular', 'normal');
    pdf.addFont('RobotoCondensed-Bold-bold.ttf', 'RobotoCondensed-Bold', 'bold')
    console.log(pdf.getFontList())
    pdf.html(
      html_element.innerHTML,
      {
        html2canvas:{
          width:pdf.internal.pageSize.getWidth() - 20,
        },
        width:pdf.internal.pageSize.getWidth() - 20,
        windowWidth:pdf.internal.pageSize.getWidth() - 20,
        margin:5,
        x:5,
        y:5,
        callback(doc) {
          autoTable(
            pdf,
            {
              tableLineColor: [189, 195, 199],
              tableLineWidth: 0.75,
              theme:'grid',
              showHead:true,
              showFoot:true,
              html:'#primeTable',
              margin:{
                top:5,
                left:10,
                right:10,
                bottom:5
              },
               pageBreak:'auto',
               rowPageBreak:'avoid',
               styles: {overflow: 'linebreak', font: 'RobotoCondensed-Bold',  
                cellPadding: 3,valign:'middle',halign:'center'},
                headStyles:{
                    fillColor:'#08567c',
                    textColor:'#fff',
                    fontSize:8,
                    cellPadding:{
                      vertical:5,
                      horizontal:3
                    },
                    lineColor:'#fff',
                    font:'RobotoCondensed-Bold'
                },
                footStyles:{
                    fillColor:'#08567c',
                    textColor:'#fff',
                    fontSize:7,
                    font:'RobotoCondensed-Bold',
                    lineColor:'#fff',
                    cellPadding:{
                      vertical:5,
                      horizontal:2
                    },
                },
                bodyStyles:{
                  fontSize:8,
                  cellPadding:2,
                  font:'RobotoCondensed-Regular'
                },
                startY:230,
                columnStyles:{
                      0:{cellWidth:100,halign:'left'},
                      11:{cellWidth:30.64,halign:'center'},
                      12:{cellWidth:30.64,halign:'center'},
                      17:{cellWidth:30.64,halign:'center'},
                },
              tableWidth:pdf.internal.pageSize.getWidth() - 20
            }
          )
          // if(export_mode === 'Print'){
          //   pdf.autoPrint();
          // }
          pdf.output('dataurlnewwindow');
        },
        autoPaging:true
      }
    );
  }
}


export class PLTransaction{
  public static column:column[] = [
      {
        field:'scheme_name',
        header:'Scheme',
        width:'30rem'
      },
      {
        field:'folio_no',
        header:'Folio',
        width:'9rem'
      },
      {
        field:'purchase',
        header:'Purchase',
        width:'7rem'
      },
      {
        field:'switch_in',
        header:'Switch In',
        width:'8rem'
      },
      {
        field:'idcw_reinv',header:'IDCW Reinv',width:"5rem"
      },
      {
        field:'tot_inflow',
        header:'Tot. Inflow',
        width:'8rem'
      },
      {
        field:'redemption',
        header:'Redemption',
        width:'8rem'
      },
      {
        field:'switch_out',
        header:'Switch Out',
        width:'8rem'
      },
      {
        field:'idcwp',header:'IDCW P',width:"4rem"
      },
      {
        field:'tot_outflow',
        header:'Tot. Outflow',
        width:'9rem'
      },
      {
        field:'curr_val',
        header:'Curr. Val',
        width:'7rem'
      },

      {
        field:'gain_loss',
        header:'Gain/Loss',
        width:'8rem'
      },
      {
        field:'ret_abs',
        header:'Abs. Ret',
        width:'7rem'
      },
      {
        field:'xirr',
        header:'XIRR',
        width:'6rem'
      },
      {
        field:'trans_details',
        header:'Trans Details',
        width:''
      }
  ]
}

export interface IPLTrxn{
    scheme_name:string;
    xirr:number;
    ret_abs:number;
    gain_loss:number;
    curr_val:number;
    tot_outflow:number;
    switch_out:number;
    redemption:number;
    tot_inflow:number;
    switch_in:string,
    purchase:string;
    folio_no:number;
    plan_name:string;
    option_name:string;
    mydata:any;
    nav_date:Date;
    tot_units:number;
    idcw_reinv:string;
    idcwp:string
}
