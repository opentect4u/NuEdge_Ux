import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { global } from "./globalFunc";
import { DbIntrService } from "../__Services/dbIntr.service";
import { IDisclaimer } from "../__Pages/__Main/Master/disclaimer/disclaimer.component";

export class ExportAs{

    constructor(public dbIntr:DbIntrService){}
    public static exportAsDtls(mode:string,pdf:jsPDF,
        finalY:number,element_to_print_as,
        final_data,
        disclaimer:string,
        parenttable_id:string,
        subtable_id:string,
        outputIn:string
      ): Promise<File | null>{
            // this.spinner.show();
            let ids;
            let parent_id;
            return new Promise((resolve,reject) =>{
                try{
                    pdf.html(
                        
                        element_to_print_as.innerHTML,
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
                            if(mode === 'Print'){
                              pdf.autoPrint();
                            }
                            pdf.output('dataurlnewwindow');
                            const dataUrl = pdf.output('datauristring');
                            resolve(ExportAs.dataURLtoFile(dataUrl,'report.pdf'))
                            // final_data.forEach((el,index) =>{
                            // autoTable(
                            //   pdf,
                            //   {
                            //     useCss:false,
                            //     didDrawPage: function(data){
                                  
                            //       const body_height = global.Total__Count(data.table.body,(item)=> item.height);
                            //       const head_height = global.Total__Count(data.table.head,(item)=> item.height);
                            //       let calculate_height = finalY + body_height + head_height;
                            //       if(calculate_height >= doc.internal.pageSize.height){
                            //         finalY = data.cursor.y;
                            //       }
                            //       else{
                            //         finalY = calculate_height;
                            //       }

                            //       autoTable(
                            //         pdf,
                            //         {
                            //           useCss:false,
                            //           didDrawPage: function(data1){

                            //                 const body_height = global.Total__Count(data1.table.body,(item)=> item.height);
                            //                 const head_height = global.Total__Count(data1.table.head,(item)=> item.height);
                            //                 let calculate_height_inr = finalY + body_height + head_height;
                            //                 const tble_finalY = data1.cursor.y;
                            //                 if(calculate_height_inr >= doc.internal.pageSize.height){
                            //                     finalY = tble_finalY;
                            //                 }
                            //                 else{
                            //                 finalY = calculate_height_inr;
                            //                 }
                            //                 if(index == (final_data.length - 1)){
                            //                 finalY = data1.cursor.y + 20;
                            //                 let width = pdf.internal.pageSize.getWidth() - 20
                            //                 let textlines = pdf.setFontSize(8).setFont(
                            //                 "RobotoCondensed-Regular",'','400'
                            //                 ).splitTextToSize(`Disclaimer:${disclaimer}`,width);
                            //                 pdf.text(textlines,10,finalY)
                            //                 }
                            //           },
                            //           includeHiddenHtml:false,
                            //           tableLineColor: [189, 195, 199],
                            //           tableLineWidth: 0.75,
                            //           theme:'grid',
                            //           showHead:true,
                            //           showFoot:true,
                            //           tableId:`${subtable_id}${index}`,
                            //           html:`#${subtable_id}${index}`,
                            //           margin:{
                            //             top:5,
                            //             left:10,
                            //             right:10,
                            //             bottom:5
                            //           },
                            //            pageBreak:'auto',
                            //            rowPageBreak:'avoid',
                            //            styles: {overflow: 'linebreak', font: 'RobotoCondensed-Bold',  
                            //             cellPadding: 3,valign:'middle',halign:'center'},
                            //             headStyles:{
                            //                 fillColor:'#1d4ed8',
                            //                 textColor:'#fff',
                            //                 fontSize:8,
                            //                 cellPadding:{
                            //                   vertical:5,
                            //                   horizontal:3
                            //                 },
                            //                 lineColor:'#fff',
                            //                 font:'RobotoCondensed-Bold'
                            //             },
                            //             footStyles:{
                            //                 fillColor:'#08567c',
                            //                 textColor:'#fff',
                            //                 fontSize:7,
                            //                 font:'RobotoCondensed-Bold',
                            //                 lineColor:'#fff',
                            //                 cellPadding:{
                            //                   vertical:5,
                            //                   horizontal:2
                            //                 },
                            //             },
                            //             bodyStyles:{
                            //               fontSize:8,
                            //               cellPadding:2,
                            //               font:'RobotoCondensed-Regular'
                            //             },
                            //             startY:finalY,
                            //             columnStyles:{
                            //                 0:{cellWidth:15.64,halign:'left'}
                            //             },
                            //           tableWidth:pdf.internal.pageSize.getWidth() - 20
                            //             }
                            //         )
                            //         if(index == (final_data.length - 1)){
                            //           if(mode === 'Print'){
                            //             pdf.autoPrint();
                            //           }
                            //           pdf.output('dataurlnewwindow');
                            //           const dataUrl = pdf.output('datauristring');
                            //           resolve(ExportAs.dataURLtoFile(dataUrl,'report.pdf')) 
                            //         }
                                    
                            //     },
                            //     includeHiddenHtml:false,
                            //     tableLineColor: [189, 195, 199],
                            //     tableLineWidth: 0.75,
                            //     theme:'grid',
                            //     showHead:true,
                            //     showFoot:false,
                            //     tableId:`${parenttable_id}${index}`,
                            //     html:`#${parenttable_id}${index}`,
                            //     margin:{
                            //       top:5,
                            //       left:10,
                            //       right:10,
                            //       bottom:5
                            //     },
                            //      pageBreak:'auto',
                            //      rowPageBreak:'avoid',
                            //      styles: {overflow: 'linebreak', font: 'RobotoCondensed-Bold',  
                            //       cellPadding: 3,valign:'middle',halign:'center'},
                            //       headStyles:{
                            //           fillColor:'#08567c',
                            //           textColor:'#fff',
                            //           fontSize:8,
                            //           cellPadding:{
                            //             vertical:5,
                            //             horizontal:3
                            //           },
                            //           lineColor:'#fff',
                            //           font:'RobotoCondensed-Bold'
                            //       },
                            //       footStyles:{
                            //           fillColor:'#08567c',
                            //           textColor:'#fff',
                            //           fontSize:7,
                            //           font:'RobotoCondensed-Bold',
                            //           lineColor:'#fff',
                            //           cellPadding:{
                            //             vertical:5,
                            //             horizontal:2
                            //           },
                            //       },
                            //       bodyStyles:{
                            //         fontSize:8,
                            //         cellPadding:2,
                            //         font:'RobotoCondensed-Regular'
                            //       },
                            //       startY:finalY,
                            //       columnStyles:{
                            //           0:{cellWidth:120.64,halign:'left'}
                            //       },
                            //     tableWidth:pdf.internal.pageSize.getWidth() - 20
                            //   }
                            // )
                            // })
                          },
                          autoPaging:true
                        }
                      );
                }
                catch(err){
                    reject(null)
                }
            })
          
    }

    public static exportAsSummary(mode:string,
        pdf:jsPDF,
        finalY:number,
        element_to_print_as,
        table_id:string,
        disclaimer:Partial<IDisclaimer>,
        outputIn:string
    ): Promise<File | null>
    {
        return new Promise((resolve,reject)=>{
          console.log(element_to_print_as)
             try{
                pdf.html(
                    element_to_print_as.innerHTML,
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
                            
                            tableId:table_id,
                            useCss:false,
                            didDrawPage: function(data){
                                finalY = data.cursor.y + 20;
                            },
                            includeHiddenHtml:false,
                            tableLineColor: [189, 195, 199],
                            tableLineWidth: 0.75,
                            theme:'grid',
                            showHead:true,
                            showFoot:true,
                            html:`#${table_id}`,
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
                              startY:175,
                              columnStyles:{
                                  0:{cellWidth:120.64,halign:'left'}
                              },
                            tableWidth:pdf.internal.pageSize.getWidth() - 20
                          }
                        )
                        let width = pdf.internal.pageSize.getWidth() - 20
                        let textlines = pdf.setTextColor(disclaimer?.color_code).setFontSize(disclaimer?.font_size).setFont(
                        "RobotoCondensed-Regular",'','400'
                        ).splitTextToSize(`Disclaimer:${disclaimer?.dis_des}`,width);
                        pdf.text(textlines,10,finalY)
                        // console.log(export_as)
                        if(mode === 'Print'){
                            pdf.autoPrint();
                          }
                          if(outputIn == 'We'){
                            pdf.setProperties({
                              title: "ValuationRPT"
                          }).output('dataurlnewwindow');
                          }
                          else{
                            const dataUrl = pdf.output('datauristring');
                            resolve(ExportAs.dataURLtoFile(dataUrl,'VALUATIONREPORT.pdf')) 
                          }
                      },
                      autoPaging:true
                    }
                  );
             }
             catch(err){
                console.log(err)  
                resolve(null);
             }
            //  resolve(null);
        })
        // let finalY;
   
    }


    public static exportMonthlySummary(mode:string,
      pdf:jsPDF,
      finalY:number,
      element_to_print_as,
      table_id:string,
      disclaimer:string,
      outputIn:string
  ): Promise<File | null>
  {
      return new Promise((resolve,reject)=>{
        console.log(element_to_print_as)
           try{
              pdf.html(
                  element_to_print_as.innerHTML,
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
                          
                          tableId:table_id,
                          useCss:false,
                          didDrawPage: function(data){
                              finalY = data.cursor.y + 20;
                          },
                          includeHiddenHtml:false,
                          tableLineColor: [189, 195, 199],
                          tableLineWidth: 0.75,
                          theme:'grid',
                          showHead:true,
                          showFoot:true,
                          html:`#${table_id}`,
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
                      let width = pdf.internal.pageSize.getWidth() - 20
                      let textlines = pdf.setFontSize(8).setFont(
                      "RobotoCondensed-Regular",'','400'
                      ).splitTextToSize(`Disclaimer:${disclaimer}`,width);
                      pdf.text(textlines,10,finalY)
                      // console.log(export_as)
                      if(mode === 'Print'){
                          pdf.autoPrint();
                        }
                        if(outputIn == 'We'){
                          pdf.setProperties({
                            title: "ValuationRPT"
                        }).output('dataurlnewwindow');
                        }
                        else{
                          const dataUrl = pdf.output('datauristring');
                          resolve(ExportAs.dataURLtoFile(dataUrl,'MONTHLYMISRPORT.pdf')) 
                        }
                    },
                    autoPaging:true
                  }
                );
           }
           catch(err){
              console.log(err)  
              resolve(null);
           }
          //  resolve(null);
      })
      // let finalY;
 
  }



    /***** FOr Converting base64 into File */
    public static dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[arr.length - 1]), 
            n = bstr.length, 
            u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    }
    /**** */

}