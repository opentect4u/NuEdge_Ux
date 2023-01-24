import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class RPTService {

constructor() { }

downloadReport(__tblName,dt,_doc_name){
  let pdf = new jsPDF('p', 'pt', 'letter');
  pdf.setFontSize(10);
  pdf.text(dt.date, 35, 30);
  var width = pdf.internal.pageSize.getWidth();
  pdf.addImage("../../assets/images/logo.jpg", "JPG", ((width / 2) - 68), 40, 140, 50);
  pdf.setFont("times", "normal");
  pdf.setFontSize(12);
  pdf.text("NuEdge Corporate Private Limited", width / 2, 115, { align: "center" });
  pdf.setFontSize(10);
  pdf.text("Day Sheet Reports - 21/01/2023", width / 2, 135, { align: "center" });
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
    tableWidth: (width / 2) + 230,
    styles: {
      cellWidth: ((width / 2) + 230) / 7,
      fontSize:8,
      fillColor: '#fff', textColor: "black", halign: "center", valign: "middle",
      lineColor: "black", lineWidth: 0.79,
    },
  },
  );  
  pdf.save(_doc_name);
}

}
