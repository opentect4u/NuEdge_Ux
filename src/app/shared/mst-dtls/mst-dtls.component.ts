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
  /**
   * @description This function is used to emit the populate event to the parent component
   * It is used to populate the details of the item in the parent component.
   * @param item - The item to be populated
   * It is used to show the corresponding details of the selected item in the parent component.
   * @returns void
   */
  populateDT(item){
  this.populate.emit(item);
  }
  /**
   * @description This function is used to emit the viewAll event to the parent component
   * It is used to show all the details of the items in the parent component.
   * The flag is used to determine which type of details to show.
   * @returns void
   */
  viewAllDtls(){
    this.viewAll.emit(this.flag);
  }
  /**
   * @description This function is used to emit the selected item to the parent component
   * @param item - The item to be emitted
   * It is used to show the corresponding details of the selected item in the parent component.
   */
  showCorrospondingDtls(item){
    this.showCorrospondingDetails.emit(item);
  }
}
