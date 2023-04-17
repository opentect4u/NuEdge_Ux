import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { UtiliService } from './__Services/utils.service';
/**<=== Routing Change Event ==>*/
import {
  Router,
  // import as RouterEvent to avoid confusion with the DOM Event
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  ActivatedRoute
} from '@angular/router'

/**<== End ==> */

export interface IBreadCrumb {
  label: string;
  url: string;
  queryParams: any
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isLoadingOnchangeRoute: boolean = false;
  public breadcrumbs: IBreadCrumb[];
  constructor(
    private __router: Router,
    private __actRoute: ActivatedRoute,
    private __title: Title,
    private __utility: UtiliService
  ) {
    this.setTitle();
    // this.breadcrumbs = this.buildBreadCrumb(this.__actRoute.root);
    this.__router.events.subscribe((e : RouterEvent) => {
      this.navigationInterceptor(e);
    })

  }

  ngOnInit() {}

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
  setTitle() {
    this.__router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        var rt = this.getChild(this.__actRoute);
        rt.data.subscribe((data) => {
          this.__utility.getRoute(data);
          this.__title.setTitle(data.title);
        });
      });
  }


  // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
    console.log(event);

    if (event instanceof NavigationStart) {
      this.isLoadingOnchangeRoute = true
    }
    if (event instanceof NavigationEnd) {
      this.isLoadingOnchangeRoute = false
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.isLoadingOnchangeRoute = false
    }
    if (event instanceof NavigationError) {
      this.isLoadingOnchangeRoute = false
    }
  }
}
