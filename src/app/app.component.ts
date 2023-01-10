import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {filter} from 'rxjs/operators';
import { UtiliService } from './__Services/utils.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private __router: Router,
    private __actRoute: ActivatedRoute,
    private __title: Title,
    private __utility: UtiliService
  ) { 
    this.setTitle();
  }

    /**
   * This will return the current activated routes details
   **/
    getChild(activatedRoute: ActivatedRoute): any {
      if (activatedRoute.firstChild) {
        return this.getChild(activatedRoute.firstChild);
      } else {
        return activatedRoute;
      }
    }
    // SET TITLE BASED ON THEIR ROUTING
    setTitle(){
      this.__router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        var rt = this.getChild(this.__actRoute);
        rt.data.subscribe(data => {
          this.__utility.getRoute(data);
          this.__title.setTitle(data.title);
        });
      });
    }
}
