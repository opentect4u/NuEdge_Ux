import { Component, OnInit ,Input, ViewChild} from '@angular/core';
import { Table } from 'primeng/table';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'core-mis-tbl',
  templateUrl: './mis-tbl.component.html',
  styleUrls: ['./mis-tbl.component.css']
})
export class MisTblComponent implements OnInit {

  @ViewChild('primeTbl') primeTbl: Table;

  /** Holding column */
  @Input() column:column[];
  /***End */

  /** Holding Report Data */
  @Input() dataSource = [];
  /***End */

  /** Table Min Width */
  @Input() min_width:string;
  /****End */

   /** Table Scroll Height */
   @Input() scroll_height:string;
   /****End */

   /** Table Virtual Scroll */
   @Input() virtual_scroll:boolean | undefined = true;
   /** END */

   /*** Flag */
   @Input() flag: string
   /****End */

  constructor(private utility:UtiliService) { }

  ngOnInit(): void {}

  getColumns = () => {
    return this.utility.getColumns(this.column);
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
    // const el = document.querySelector<HTMLElement>('.cdk-virtual-scroll-viewport');
    // this.changeWheelSpeed(el, 0.99);
  }


}
