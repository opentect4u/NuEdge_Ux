import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'shared-mst-dtls',
  templateUrl: './mst-dtls.component.html',
  styleUrls: ['./mst-dtls.component.css']
})
export class MstDtlsComponent implements OnInit {
   @Input() headerTitle:string;
   @Output() viewAll = new EventEmitter();
   @Output() populate = new EventEmitter();
   @Output() showCorrospondingDetails = new EventEmitter();
   @Input() btnTitle: string;
   @Input() dataSource: any=[];
   @Input() flag: string;

   /**
    * Holding which properties needs to be shown
    */
   @Input() props:string;
  constructor() { }

  ngOnInit(): void {
  }
  populateDT(item){
  this.populate.emit(item);
  }
  viewAllDtls(){
    this.viewAll.emit(this.flag);
  }
  showCorrospondingDtls(item){
    this.showCorrospondingDetails.emit(item);
  }
}
