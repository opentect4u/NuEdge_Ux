import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, ViewChildren} from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Observable, Subscribable, Subscription } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'home-menuTiles',
  templateUrl: './menuTiles.component.html',
  styleUrls: ['./menuTiles.component.css']
})
export class MenuTilesComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild('op') Overlay__pannel:OverlayPanel
  @Input() __items: any = [];
  @Input() __flag:string;
  chart_dtls:Required<{categories:string[],chart_data:number[]}>;
  tiles__api__subscription:Subscription;
  constructor(private  __utility: UtiliService,private dbIntr:DbIntrService) { }

  ngOnInit() {
  }
  navigate(__items){
    if(this.__flag == 'BM'){
      if(__items.url){
        this.__utility.navigate(__items.url);
      }
    }
  }

  ngAfterViewInit(): void {
  }
  showReport = (item) =>{
    this.chart_dtls = null;
     if(item.flag == 'L'){
      // if(this.tiles__api__subscription){
      //   this.tiles__api__subscription.unsubscribe();
      // }
      this.tiles__api__subscription = this.dbIntr.api_call(0,'/showLiveSIPTrend','flag='+item.flag,true)
      .pipe(pluck('data'))
      .subscribe((res:Required<{categories:string[],chart_data:number[]}>) =>{
          let val = 0;
          let dt = {
            categories: res.categories,
          //   chart_data:res.chart_data.reverse().map((item:number) =>{
          //      val = val + item
          //      return val
          // }).reverse()
            chart_data:res.chart_data
        }
          console.log(dt);
          this.chart_dtls = dt;
      },
       err =>{
        this.chart_dtls = {
          categories:[],
          chart_data:[]
        }
       })
    }
    console.log(item);
  }
  ngOnDestroy(): void {
    // this.tiles__api__subscription.unsubscribe();
  }
}
