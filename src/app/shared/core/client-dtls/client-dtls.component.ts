import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { client } from 'src/app/__Model/__clientMst';
import { UtiliService } from 'src/app/__Services/utils.service';
import { Roboto_condensed_medium, Roboto_condensed_normal } from 'src/app/strings/fonts';

export enum ScheduleType{
  VALUATION = 'Valuation',
  REPORT = 'Report'
}
@Component({
  selector: 'client-dtls',
  templateUrl: './client-dtls.component.html',
  styleUrls: ['./client-dtls.component.css']
})
export class ClientDtlsComponent implements OnInit {

  private _clientDtls:Partial<client>;

  @ViewChild('client_container') client_element:ElementRef

  @Output() Expand_mode:EventEmitter<'single' | 'multiple'> = new EventEmitter();

  @Input()
  get clientDtls(){
      return this._clientDtls;
  }

  set clientDtls(values:Partial<client>){
    this._clientDtls = values
  }

  @Input() ScheduleType:string | undefined = ScheduleType.VALUATION

  @Input() date: any;

  @Input() isDateRange:boolean | undefined = false;

  constructor(private spinner:NgxSpinnerService) { }

  ngOnInit(): void {}


  exportAs(export_mode:string){
    try{


      // this.spinner.show();
      // console.log(export_mode);
      this.Expand_mode.emit('single');
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
            if(export_mode === 'Print'){
              pdf.autoPrint();
            }
            pdf.output('dataurlnewwindow');
          },
          autoPaging:true
        }
      );
      // this.spinner.hide();
    }
    catch(err){
      // this.spinner.hide();
    }

  }

}
