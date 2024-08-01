
import { Component, OnInit, ViewChild } from '@angular/core';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import mis_tab from '../../../../../../../../assets/json/Product/MF/MIS/monthly_MIS_Trend.json';
import { column } from 'src/app/__Model/tblClmns';
import { trxnClm } from 'src/app/__Utility/TransactionRPT/trnsClm';
import { TrxnType } from '../../TransactionReport/trxn-rpt/trxn-rpt.component';
import { UtiliService } from 'src/app/__Services/utils.service';
import { pluck} from 'rxjs/operators';
import jsPDF from 'jspdf';
import { Roboto_condensed_medium, Roboto_condensed_normal } from 'src/app/strings/fonts';
import { ExportAs } from 'src/app/__Utility/exportFunc';
import autoTable from 'jspdf-autotable';

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

  disclaimer:string | undefined = ''

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
  constructor(private dbIntr: DbIntrService,private utility:UtiliService) { }

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
      .subscribe((res:Partial<TrxnRpt[]>) =>{
        console.log(res);
        this.__monthly_mis_trxn = res;
        this.total_mis_calculation = {
           tot_inflow_amt:res.filter(item => item.process_type == 'I').map(item => Number(item.tot_gross_amount)).reduce((accumulator, currentValue) => accumulator + currentValue, 0),
           tot_outflow_amt:res.filter(item => item.process_type == 'O').map(item => Number(item.tot_gross_amount)).reduce((accumulator, currentValue) => accumulator + currentValue, 0),
        }

      })
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
