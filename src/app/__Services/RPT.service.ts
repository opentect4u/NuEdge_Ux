import { DOCUMENT } from '@angular/common';
import { Injectable ,Inject} from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class RPTService {

constructor(
  @Inject(DOCUMENT) private doc: Document
) { }

downloadReport(__tblName,dt,
  _doc_name,
  pdf_orientantion?: "p" | "portrait" | "l" | "landscape",
  page_width:number[] | undefined =[],
  divide_by:number | undefined = 7
  ){
  let pdf = page_width.length == 0 ?  new jsPDF(pdf_orientantion ? pdf_orientantion : 'p', 'pt')
  : new jsPDF(pdf_orientantion ? pdf_orientantion : 'l', 'pt',page_width);
  pdf.setFontSize(10);
  var width = pdf.internal.pageSize.getWidth();
  pdf.addImage("../../assets/images/logo.jpg", "JPG", ((width / 2) - 68), 40, 140, 50);
  pdf.setFont("times", "normal");
  pdf.setFontSize(12);
  pdf.text("NuEdge Corporate Private Limited", width / 2, 115, { align: "center" });
  pdf.setFontSize(10);
  pdf.text(dt.title, width / 2, 135, { align: "center" });
  let pageWidth = pdf.internal.pageSize.getWidth();
  let wantedTableWidth = 100;
   let margin = ((pageWidth  - wantedTableWidth) / divide_by);
  autoTable(pdf, {
   useCss:false,
    html:__tblName,
    startY: 170,
    margin: {left: margin, right: margin},
    headStyles: {
      fillColor: '#fff', textColor: "#555", halign: "center", valign: "middle",
      lineColor: "#d7d7d7", lineWidth:0.79,
      fontSize:7,
      fontStyle:'bold',
      cellWidth: "auto"

    },
    showHead:'everyPage',
    theme: 'grid',
    // tableWidth: (width / 2) + 230,
    styles: {
      // cellWidth: "auto",
      fontSize:8,
      fillColor: '#fff', textColor: "#555", halign: "center", valign: "middle",
      lineColor: "#d7d7d7", lineWidth: 0.79,
      fontStyle:'normal'
    },
  },
  );
  pdf.save(_doc_name);
}

printRPT(__id){
  let WindowObject ;
  const divToPrint = document.getElementById(__id);
  // console.log(divToPrint.innerHTML);
 WindowObject = window.open('','Print-Window');
 WindowObject.document.open();
 WindowObject.document.writeln('<!DOCTYPE html>');
 WindowObject.document.writeln('<html><head><title></title><style type="text/css">');
 WindowObject.document.writeln(   '@media print { .center { text-align: center;}' +
 '                                         .inline { display: inline; }' +
 '                                         .underline { text-decoration: underline; }' +
 '                                         .left { margin-left: 315px;} ' +
 '                                         .right { margin-right: 375px; display: inline; }' +
 '                                          table { border-collapse: collapse; font-size: 10px;}' +
 '                                          th, td { border: 1px solid black; border-collapse: collapse; padding: 6px;}' +
 '                                           th, td { }' +
 '                                         .border { border: 1px solid black; } ' +
 '                                         .bottom { bottom: 5px; width: 100%; position: fixed; } ' +
 '                                           footer { position: fixed; bottom: 0;text-align: center; }' +
 '                                         td.dashed-line { border-top: 1px dashed gray; } } </style>'
);
   WindowObject.document.writeln('</head><body onload="window.print()">');
   WindowObject.document.writeln('<center><img src="/assets/images/logo.jpg" alt="">'+
    '<h3>NuEdge Corporate Pvt. Ltd</h3>'+
    '<h5> Day Sheet Report</h5></center>');
   WindowObject.document.writeln(divToPrint.innerHTML);
    console.log(WindowObject);

   WindowObject.document.writeln('<footer><small>This is an electronically generated report, hence does not require any signature</small></footer>');
   WindowObject.document.writeln('</body></html>');
   WindowObject.document.close();
  setTimeout(() => {
    console.log("CLose");
   WindowObject.close();
  }, 100);
}

exportExl(__dt,excelHeaders){
  console.log(__dt);

  import("xlsx").then(xlsx => {
    const worksheet = xlsx.utils.json_to_sheet(__dt,{skipHeader:true}); // Data
    // const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    // const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    xlsx.utils.sheet_add_json(worksheet,__dt,{skipHeader:true,origin:'A2'});

    xlsx.utils.sheet_add_aoa(worksheet,excelHeaders);
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    // this.saveAsExcelFile(excelBuffer, "sales");
    let EXCEL_TYPE =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const data: Blob = new Blob([excelBuffer], {
      type: EXCEL_TYPE
    });
    var blobURL = window.URL.createObjectURL(data);
    let link: HTMLElement = this.doc.createElement('a'); // create Element
     link.setAttribute('href',blobURL);
     link.click();
});

}

}
