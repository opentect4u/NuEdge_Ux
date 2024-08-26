import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'as-per-itd',
  templateUrl: './as-per-itd.component.html',
  styleUrls: ['./as-per-itd.component.css']
})
export class AsPerItdComponent implements OnInit {

  @ViewChild('as_per_itd') as_per_itd: Table;

  as_per_itd_column:column[] = AsPerITDColumn.column;

  constructor(private utility:UtiliService) { }

  @Input() AsPerITD:any = [];

  ngOnInit(): void {}

  
  getColumns = () => {
    return this.utility.getColumns(this.as_per_itd_column);
  }

  ngOnChanges(changes: SimpleChanges) {
    setTimeout(() => {
      const table = this.as_per_itd?.el.nativeElement.querySelector('table');
      table?.setAttribute('id', 'as_per_itd');
    }, 500);

  }


}


export class AsPerITDColumn{
  public static column:column[] = [
    {
      field:'title',
      header:'Summary of Capital Gains'
    },
    {
      field:'01/04_15/06',
      header:'01/04 to 15/06'
    },
    {
      field:'16/06_15/09',
      header:'16/06 to 15/09'
    },
    {
      field:'16/09_15/12',
      header:'16/09 to 15/12'
    },
    {
      field:'16/12_15/03',
      header:'16/12 to 15/03'
    },
    {
      field:'16/03_31/03',
      header:'16/03 to 31/03'
    }
  ]
}