
import { Component, OnInit, ViewChild } from '@angular/core';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import mis_tab from '../../../../../../../../assets/json/Product/MF/MIS/monthly_MIS_Trend.json';
import { column } from 'src/app/__Model/tblClmns';
import { trxnClm } from 'src/app/__Utility/TransactionRPT/trnsClm';
import { TrxnType } from '../../TransactionReport/trxn-rpt/trxn-rpt.component';
import { UtiliService } from 'src/app/__Services/utils.service';
import { groupBy, mergeMap, pluck, toArray} from 'rxjs/operators';
import jsPDF from 'jspdf';
import { Roboto_condensed_medium, Roboto_condensed_normal } from 'src/app/strings/fonts';
import { ExportAs } from 'src/app/__Utility/exportFunc';
import autoTable from 'jspdf-autotable';
import { FilterByStatusPipe } from 'src/app/__Pipes/filter.pipe';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { from, of,zip } from 'rxjs';
import { global } from 'src/app/__Utility/globalFunc';
import { IDisclaimer } from '../../../PortFolio/LiveMFPortFolio/live-mf-port-folio.component';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
declare type MisFlag = "I" | "O";

export class MonthlyCalculation{
   tot_inflow_amt:number
   tot_outflow_amt:number
}

@Component({
  selector: 'app-monthly-mis',
  templateUrl: './monthly-mis.component.html',
  styleUrls: ['./monthly-mis.component.css']
})
export class MonthlyMisComponent implements OnInit {


  form__data:any;

  netFlow:Partial<{"Sl No.":number,Inflow:number,Netflow:number,Outflow:number,"Transaction Type":string}>[] = []

  disclaimer:Partial<IDisclaimer>;

  @ViewChild('MISTABLE') __MisTbleComponent;

  mis_tab: { id: number, tab_name: string, img_src: string, flag: string }[] = [];

  /**
   * Hold column for transaction table
   */
  __monthly__MIS_Column: column[] = trxnClm.column.filter((item: column) => (item.field != 'amc_link' && item.field != 'scheme_link' && item.field != 'isin_link' && item.field != 'plan_name' && item.field != 'option_name' && item.field != 'plan_opt' && item.field != 'divident_opt' && item.field != 'lock_trxn'))
                                    .filter((el) => el.isVisible.includes('T'));
 

  /**
   * Holding Monthly MIS Master Data
   */
  __monthly_mis_trxn: Partial<TrxnRpt[]> = []

  transType: string = 'Total';

  trxn_count: TrxnType;

  flag:MisFlag = "I";

  total_mis_calculation:MonthlyCalculation;
  is_virtual:boolean = true;
  constructor(private dbIntr: DbIntrService,private utility:UtiliService,private datePipe:DatePipe) { }

  ngOnInit(): void {
    this.mis_tab = mis_tab.monthly_mis.map((item) => ({ ...item, img_src: ('../../../../../assets/images/monthlyMIS/' + item.img_src) }))
  }


  getMisReport = (filter__criteria):void =>{
    // console.log(filter__criteria);
    const {view_by,fin_year,month,upto,duration,...rest} = filter__criteria
    const dt = {
      ...rest,
      flag:this.flag,
      mis_month:filter__criteria?.mis_month?.actual
    }
      this.dbIntr.api_call(1,'/showMonthlyMisReport',this.utility.convertFormData(dt))
      .pipe(pluck('data'))
      .subscribe((res:Partial<{data:TrxnRpt[],disclaimer:Partial<IDisclaimer>}>) =>{
        this.__monthly_mis_trxn = res.data;
        this.disclaimer = res.disclaimer;
        this.total_mis_calculation = {
           tot_inflow_amt:res.data.filter(item => item.process_type == 'I').map(item => Number(item.tot_gross_amount)).reduce((accumulator, currentValue) => accumulator + currentValue, 0),
           tot_outflow_amt:res.data.filter(item => item.process_type == 'O').map(item => Number(item.tot_gross_amount)).reduce((accumulator, currentValue) => accumulator + currentValue, 0),
        }
        this.GroupBySchemeNameForNetInflow(res.data);

      })
  }

  GroupBySchemeNameForNetInflow = (arr) =>{
    let net_Flow = [];
    let sl_no = 0;
    from(arr)
            .pipe(
              groupBy((data: any) => data.transaction_subtype),
              mergeMap(group => zip(of(group.key), group.pipe(toArray())))
            ).subscribe(dt => {
              sl_no += 1;
              const inflow = global.Total__Count(dt[1].filter(el => el.process_type == 'I'), (x:TrxnRpt) => Number(x.tot_gross_amount));
              const outflow = global.Total__Count(dt[1].filter(el => el.process_type == 'O'), (x:TrxnRpt) => Number(x.tot_gross_amount));
              const netflow = inflow - outflow;
              net_Flow.push({
                  "Sl No.":sl_no,
                  "Transaction Type":dt[0],
                  Inflow:inflow,
                  Outflow:outflow,
                  Netflow:netflow
              })
    })
    this.netFlow = net_Flow;
  }

  exportAsPdf(){
    this.is_virtual = !this.is_virtual;
    var pdf = new jsPDF('l','pt','a4',true);
    // let finalY ;
    // const html_element = document.getElementById('container');
    // pdf.addFileToVFS('RobotoCondensed-Regular-normal.ttf', Roboto_condensed_normal);
    // pdf.addFileToVFS('RobotoCondensed-Bold-bold.ttf', Roboto_condensed_medium);
    // pdf.addFont('RobotoCondensed-Regular-normal.ttf', 'RobotoCondensed-Regular', 'normal');
    // pdf.addFont('RobotoCondensed-Bold-bold.ttf', 'RobotoCondensed-Bold', 'bold');
    // ExportAs.exportMonthlySummary(
    //   'pdf',pdf,50,html_element,'pr_id_1-table','','We'
    // ).then(res =>{
    //   console.log(res);
    //   this.is_virtual = !this.is_virtual;
    // })
    // console.log(this.__monthly_mis_trxn.filter(el => el.process_type === this.flag))
    // console.log(this.__monthly__MIS_Column.map(el => el.header));
    const result = this.__monthly_mis_trxn.filter(el => el.process_type === this.flag).map(({bu_type,branch,rm_name,sub_brk_cd,euin_no,first_client_name,first_client_pan,trans_date,
      amc_name,scheme_name,cat_name,subcat_name,folio_no,transaction_type,transaction_subtype,trans_no,tot_gross_amount,
      tot_stamp_duty,tot_tds,tot_amount,units,pur_price,bank_name,acc_no,stt,trans_mode,remarks,...rest}) => {return [bu_type,branch,rm_name,sub_brk_cd,euin_no,first_client_name,first_client_pan,trans_date,amc_name,
      `${scheme_name}-${rest.plan_name}-${rest.option_name}`,
      cat_name,subcat_name,folio_no,transaction_type,transaction_subtype,trans_no,tot_gross_amount,
      tot_stamp_duty,tot_tds,tot_amount,units,pur_price,bank_name,acc_no,stt,trans_mode,remarks
    ]})
    console.log(this.__monthly__MIS_Column.map(el => el.header));
    console.log(result)
  //   const html_element = document.getElementById('container');
  //   pdf.addFileToVFS('RobotoCondensed-Regular-normal.ttf', Roboto_condensed_normal);
  //   pdf.addFileToVFS('RobotoCondensed-Bold-bold.ttf', Roboto_condensed_medium);
  //   pdf.addFont('RobotoCondensed-Regular-normal.ttf', 'RobotoCondensed-Regular', 'normal');
  //   pdf.addFont('RobotoCondensed-Bold-bold.ttf', 'RobotoCondensed-Bold', 'bold');
    autoTable(
      pdf,
      {
          head:[this.__monthly__MIS_Column.map(el => el.header)],
          body:result,
          tableLineColor: [189, 195, 199],
          tableLineWidth: 0.75,
          theme:'grid',
          showHead:true,
          showFoot:true,
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
            startY:20,
            // columnStyles:{
            //     0:{cellWidth:120.64,halign:'left'}
            // },
          tableWidth:pdf.internal.pageSize.getWidth() - 20
      }
    )
    pdf.setProperties({
      title: "ValuationRPT"
    }).output('dataurlnewwindow');
    // console.log(
    //   result
    // )
  }


  exportAsExcel = () =>{
    const filterPipe = new FilterByStatusPipe();
    const monthly_inflow = filterPipe.transform(this.__monthly_mis_trxn,'I');
    const monthly_outflow = filterPipe.transform(this.__monthly_mis_trxn,'O');
    const column = this.__monthly__MIS_Column.map(el => el.header);
    let excel_dt_for_monthly_inflow = [];
    let excel_dt_for_monthly_outflow = [];

    monthly_inflow.forEach((el,index) =>{
      excel_dt_for_monthly_inflow.push(
            [(index + 1),
            el.bu_type,
            el.branch,
            el.rm_name,
            el.sub_brk_cd,
            el.euin_no,
            el.first_client_name,
            el.first_client_pan,
            this.datePipe.transform(el.trans_date,'dd-MM-YYYY'),
            el.amc_name,
            `${el.scheme_name}-${el.plan_name}-${el.option_name}`,
            el.cat_name,
            el.subcat_name,
            el.folio_no,
            el.transaction_type,
            el.transaction_subtype,
            el.trans_no,
            el.tot_gross_amount,
            el.tot_stamp_duty,
            el.tot_tds,
            el.tot_amount,
            el.units,
            el.pur_price,
            el.bank_name,
            el.acc_no,
            el.stt,
            el.trans_mode,
            el.remarks]
        )
    });
    monthly_outflow.forEach((el,index) =>{
      excel_dt_for_monthly_outflow.push([
        (index + 1),
        el.bu_type,
         el.branch,
        el.rm_name,
        el.sub_brk_cd,
        el.euin_no,
        el.first_client_name,
        el.first_client_pan,
          this.datePipe.transform(el.trans_date,'dd-MM-YYYY'),
        el.amc_name,
        `${el.scheme_name}-${el.plan_name}-${el.option_name}`,
        el.cat_name,
        el.subcat_name,
        el.folio_no,
        el.transaction_type,
        el.transaction_subtype,
        el.trans_no,
        el.tot_gross_amount,
        el.tot_stamp_duty,
        el.tot_tds,
        el.tot_amount,
        el.units,
        el.pur_price,
        el.bank_name,
        el.acc_no,
        el.stt,
        el.trans_mode,
        el.remarks
    ])
    })
    this.handleExport(excel_dt_for_monthly_inflow,excel_dt_for_monthly_outflow,column,monthly_inflow,monthly_outflow);
    // const wb = XLSX.utils.book_new();
    // const ws = XLSX.utils.json_to_sheet(excel_dt_for_monthly_inflow, { header:column});
    // ws['A1'].s = {
    //   fill: {
    //     patternType: 'solid',
    //     fgColor: { rgb: 'FF939393' }
    //   },
    //   font: {
    //     name: 'Times New Roman',
    //     sz: 16,
    //     color: { rgb: '#FF000000' },
    //     bold: false,
    //     italic: false,
    //     underline: false
    //   }
    // };
    // XLSX.utils.book_append_sheet(wb, ws, 'MONTHLYINFLOW');
    // const ws1 = XLSX.utils.json_to_sheet(excel_dt_for_monthly_outflow, { header:column});
    // XLSX.utils.book_append_sheet(wb, ws1, 'MONTHLYOUTFLOW');
    // const netFlowSheet = XLSX.utils.json_to_sheet(this.netFlow,{header:["Sl No.","Transaction Type","Inflow","Outflow","Netflow"]});
    // XLSX.utils.book_append_sheet(wb, netFlowSheet, 'NETFLOW');
    // var wbout = XLSX.write(wb, {
    //   bookType: 'xlsx',
    //   bookSST: true,
    //   type: 'binary'
    // });
    // const url = window.URL.createObjectURL(new Blob([this.s2ab(wbout)]));
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.setAttribute('download', 'MISREPORT.xlsx');
    //     document.body.appendChild(link);
    //     link.click();
    //     link.remove();
  }

  handleExport = (monthly_inflow,monthly_outflow,column,inflow,outflow) =>{
    let workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet('MONTHLYINFLOW'
      ,
      {
        views:[
          {state: 'frozen', xSplit: 0, ySplit: 0}
        ]
      }
    );
    // const column = this.column.map(el => el.header);
    // console.log(column)
    let headerRow = worksheet.addRow(column);
    headerRow.eachCell((cell) =>{
      cell.fill={
        type:'pattern',
        pattern:'solid',
        fgColor:{argb:'FFFFFF00'},
        bgColor:{argb:'FF0000FF'},
      }
    })
    worksheet.addRows(monthly_inflow);
    const footerDetails = [
      'GRAND TOTAL',
     '',
     '',
     '',
     '',
     '',
     '',
     '',
     '',
     '',
     '',
     '',
     '',
     '',
     '',
     '',
     '',
     global.Total__Count(inflow,(x:any)=> x.tot_gross_amount ? Number(x.tot_gross_amount) : 0),
     global.Total__Count(inflow,(x:any)=> x.tot_stamp_duty ? Number(x.tot_stamp_duty) : 0),
     global.Total__Count(inflow,(x:any)=> x.tot_amount ? Number(x.tot_amount) : 0),
     global.Total__Count(inflow,(x:any)=> x.tot_amount ? Number(x.tot_amount) : 0),
     '',
     '',
     '',
     '',
     '',
     '',
     ''
    ];
    console.log(footerDetails);
    let footerRow = worksheet.addRow(footerDetails);
    footerRow.eachCell((cell) =>{
      cell.fill={
        type:'pattern',
        pattern:'solid',
        fgColor:{argb:'FFFFFF00'},
        bgColor:{argb:'FF0000FF'},
      }
    })
    const currentRowIdx = worksheet.rowCount; // Find out how many rows are there currently
    const endColumnIdx = worksheet.columnCount; // Find out how many columns are in the worksheet
    let disclaimerRow = worksheet.addRow([
      `Disclaimer - ${this.disclaimer.dis_des}`
    ]);
    disclaimerRow.eachCell((cell) =>{
     cell.font = {
        color :{argb:this.disclaimer.color_code}
     }
     cell.font.size= this.disclaimer.font_size
    })
    worksheet.mergeCells((currentRowIdx + 1), 1, (currentRowIdx + 1), endColumnIdx,'MONTHLYINFLOW');
    let worksheet_trans_summary = workbook.addWorksheet('MONTHLYOUTFLOW',
      {
        views:[
          {state: 'frozen', xSplit: 0, ySplit: 0}
        ]
      }
    );
    const trans_summary_header = worksheet_trans_summary.addRow(column);
    trans_summary_header.eachCell((cell) =>{
      cell.fill={
        type:'pattern',
        pattern:'solid',
        fgColor:{argb:'FFFFFF00'},
        bgColor:{argb:'FF0000FF'},
      }
    })
    worksheet_trans_summary.addRows(monthly_outflow);
    const footerDetails_outflow = [
      'GRAND TOTAL',
     '',
     '',
     '',
     '',
     '',
     '',
     '',
     '',
     '',
     '',
     '',
     '',
     '',
     '',
     '',
     '',
     global.Total__Count(outflow,(x:any)=> x.tot_gross_amount ? Number(x.tot_gross_amount) : 0),
     global.Total__Count(outflow,(x:any)=> x.tot_stamp_duty ? Number(x.tot_stamp_duty) : 0),
     global.Total__Count(outflow,(x:any)=> x.tot_amount ? Number(x.tot_amount) : 0),
     global.Total__Count(outflow,(x:any)=> x.tot_amount ? Number(x.tot_amount) : 0),
     '',
     '',
     '',
     '',
     '',
     '',
     ''
    ];
    let footerRow_summary = worksheet_trans_summary.addRow(footerDetails);
    footerRow_summary.eachCell((cell) =>{
      cell.fill={
        type:'pattern',
        pattern:'solid',
        fgColor:{argb:'FFFFFF00'},
        bgColor:{argb:'FF0000FF'},
      }
    })
    const currentRowIdx_Outflow = worksheet_trans_summary.rowCount; // Find out how many rows are there currently
    const endColumnIdx_Outflow = worksheet_trans_summary.columnCount; // Find out how many columns are in the worksheet
    let disclaimerRow_outflow= worksheet_trans_summary.addRow([
     `Disclaimer- ${this.disclaimer.dis_des}`
    ]);
    disclaimerRow_outflow.eachCell((cell) =>{
     cell.font = {
        color :{argb:this.disclaimer.color_code}
     }
     cell.font.size= this.disclaimer.font_size
    })
    worksheet_trans_summary.mergeCells((currentRowIdx_Outflow + 1), 1, (currentRowIdx_Outflow + 1), endColumnIdx_Outflow,'MONTHLYOUTFLOW');
    let worksheet_netFlow = workbook.addWorksheet('NETFLOW'
      ,
      {
        views:[
          {state: 'frozen', xSplit: 0, ySplit: 0}
        ]
      }
    );
    // const column = this.column.map(el => el.header);
    // console.log(column)
    let headerRow_NetFlow = worksheet_netFlow.addRow(["Sl No.","Transaction Type","Inflow","Outflow","Netflow"]);
    headerRow_NetFlow.eachCell((cell) =>{
      cell.fill={
        type:'pattern',
        pattern:'solid',
        fgColor:{argb:'FFFFFF00'},
        bgColor:{argb:'FF0000FF'},
      }
    })
    const net_flow = [];
    this.netFlow.forEach((el,index) =>{
        net_flow.push([
           (index + 1),
           el['Transaction Type'],
           el.Inflow,
           el.Outflow,
           el.Netflow
        ])
    })

    worksheet_netFlow.addRows(net_flow);
    const footerDetails_netflow = [
      'GRAND TOTAL',
      '',
     global.Total__Count(this.netFlow,(x:any)=> x.Inflow ? Number(x.Inflow) : 0),
     global.Total__Count(this.netFlow,(x:any)=> x.Outflow ? Number(x.Outflow) : 0),
     global.Total__Count(this.netFlow,(x:any)=> x.Netflow ? Number(x.Netflow) : 0)
    ];
    let footerRow_netFlow = worksheet_netFlow.addRow(footerDetails_netflow);
    footerRow_netFlow.eachCell((cell) =>{
      cell.fill={
        type:'pattern',
        pattern:'solid',
        fgColor:{argb:'FFFFFF00'},
        bgColor:{argb:'FF0000FF'},
      }
    })
    const currentRowIdx_Netflow = worksheet_netFlow.rowCount; // Find out how many rows are there currently
    const endColumnIdx_Netflow  = worksheet_netFlow.columnCount; // Find out how many columns are in the worksheet
    let disclaimerRow_netflow= worksheet_netFlow.addRow([
     `Disclaimer- ${this.disclaimer.dis_des}`
    ]);
    disclaimerRow_netflow.eachCell((cell) =>{
     cell.font = {
        color :{argb:this.disclaimer.color_code}
     }
     cell.font.size= this.disclaimer.font_size
    })
    worksheet_netFlow.mergeCells((currentRowIdx_Netflow + 1), 1, (currentRowIdx_Netflow + 1), endColumnIdx_Netflow,'NETFLOW');

    workbook.xlsx.writeBuffer().then((data)=>{
      let blob = new Blob([data],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
      saveAs(blob, `MONTHLYMISREPORT.xlsx`);
    })
  }
s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}



  changeWheelSpeed(container, speedY) {
    var scrollY = 0;
    var handleScrollReset = function () {
      scrollY = container.scrollTop;
    };
    var handleMouseWheel = function (e) {
      e.preventDefault();
      scrollY += speedY * e.deltaY
      if (scrollY < 0) {
        scrollY = 0;
      } else {
        var limitY = container.scrollHeight - container.clientHeight;
        if (scrollY > limitY) {
          scrollY = limitY;
        }
      }
      container.scrollTop = scrollY;
    };

    var removed = false;
    container.addEventListener('mouseup', handleScrollReset, false);
    container.addEventListener('mousedown', handleScrollReset, false);
    container.addEventListener('mousewheel', handleMouseWheel, false);

    return function () {
      if (removed) {
        return;
      }
      container.removeEventListener('mouseup', handleScrollReset, false);
      container.removeEventListener('mousedown', handleScrollReset, false);
      container.removeEventListener('mousewheel', handleMouseWheel, false);
      removed = true;
    };
  }

  ngAfterViewInit() {
    const el = document.querySelector<HTMLElement>('.cdk-virtual-scroll-viewport');
    this.changeWheelSpeed(el, 0.99);
  }

  /***** SEARCH MONTHLY MIS REPORT*/
  searchFilter = (ev) => {
    this.form__data = ev;
    this.getMisReport(ev)
  }
  /*******END */

  TabDetails = (ev) => {
    this.flag = ev?.tabDtls?.flag;
    // this.getMisReport(this.form__data)
  }

  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.__MisTbleComponent.primeTbl.filterGlobal(value, 'contains')
  }
}
