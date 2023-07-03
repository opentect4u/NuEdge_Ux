import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class RPTService {

constructor() { }

downloadReport(__tblName,dt,_doc_name){
  console.log(__tblName)
  let pdf = new jsPDF('l', 'pt', [3000,792]);
  pdf.setFontSize(10);
  // pdf.text(dt.date, 35, 30);
  var width = pdf.internal.pageSize.getWidth();
  pdf.addImage("../../assets/images/logo.jpg", "JPG", ((width / 2) - 68), 40, 140, 50);
  pdf.setFont("times", "normal");
  pdf.setFontSize(12);
  pdf.text("NuEdge Corporate Private Limited", width / 2, 115, { align: "center" });
  pdf.setFontSize(10);
  pdf.text("AMC - 21/01/2023", width / 2, 135, { align: "center" });
  autoTable(pdf, {
   useCss:false,
    html:__tblName,
    startY: 170,
    headStyles: {
      fillColor: '#fff', textColor: "black", halign: "center", valign: "middle",
      lineColor: "black", lineWidth:0.79,
      fontSize:10
    },
    showHead:'everyPage',
    theme: 'grid',
    // tableWidth: (width / 2) + 230,
    styles: {
      cellWidth: 80,
      fontSize:8,
      fillColor: '#fff', textColor: "black", halign: "center", valign: "middle",
      lineColor: "black", lineWidth: 0.79,

    },
  },
  );
  pdf.save(_doc_name);
}

printRPT(__id){
  let WindowObject ;
  const divToPrint = document.getElementById(__id);
  // console.log(divToPrint.innerHTML);
 WindowObject = window.open('', 'Print-Window');
 WindowObject.document.open();
 WindowObject.document.writeln('<!DOCTYPE html>');
 WindowObject.document.writeln('<html><head><title></title><style type="text/css">');
 WindowObject.document.writeln( '@media print { .center { text-align: center;}' +
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

}
