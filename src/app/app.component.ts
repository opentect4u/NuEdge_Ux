import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
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
    private __utility: UtiliService,
    private meta:Meta,
  ) {
    this.setTitle();
    // this.breadcrumbs = this.buildBreadCrumb(this.__actRoute.root);
    this.__router.events.subscribe((e : RouterEvent) => {
      // console.log(e.url)
      this.navigationInterceptor(e);
      this.__utility.cancelPendingRequests(); // Cancel all Pending request on route change
    })

  }

  ngOnInit() {
    this.__utility.screenResoluation(Number(window.screen.height),Number(window.screen.width),
    Number(window.innerHeight),Number(window.innerWidth));
    this.__router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd),
      distinctUntilChanged(),
    ).subscribe(() => {
      this.breadcrumbs = this.buildBreadCrumb(this.__actRoute.root);
      this.__utility.getLatestBrdCrmbs(this.breadcrumbs);
    })
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
  setTitle() {
    this.__router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        var rt = this.getChild(this.__actRoute);
        rt.data.subscribe((data) => {
          this.__utility.getRoute(data);
          this.__title.setTitle(data?.data ? data.data.title : data.title);
          this.meta.addTags([
              {name:'description',content:data?.data ? data.data.title : data.title},
              {name:'author',content:data?.data ? data.data.pageTitle : data.pageTitle}
          ])
        });
      });
  }


  // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
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
  /**
 * Recursively build breadcrumb according to activated route.
 * @param route
 * @param url
 * @param breadcrumbs
 */
buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadCrumb[] = []): IBreadCrumb[] {
   //If no routeConfig is avalailable we are on the root path
   let label = route.routeConfig && route.routeConfig.data ? route.routeConfig.data.breadcrumb : '';
   let isClickable = route.routeConfig && route.routeConfig.data && route.routeConfig.data.isClickable;
   let path = route.routeConfig? route.routeConfig.path : '';
   // If the route is dynamic route such as ':id', remove it
   const lastRoutePart = path.split('/').pop();
   const isDynamicRoute = lastRoutePart.startsWith(':');
   if(isDynamicRoute && !!route.snapshot) {
     const paramName = lastRoutePart.split(':')[1];
     path = path.replace(lastRoutePart, route.snapshot.params[paramName]);
     label = route.snapshot.data.data.breadcrumb;
   }

   //In the routeConfig the complete path is not available,
   //so we rebuild it each time
   const nextUrl = path ? `${url}/${path}` : url;
   const breadcrumb: IBreadCrumb = {
       label: label,
       url: nextUrl,
       queryParams:route.snapshot.queryParams

   };
   // Only adding route with non-empty label
   const newBreadcrumbs = breadcrumb.label ? [ ...breadcrumbs, breadcrumb ] : [ ...breadcrumbs];
   if (route.firstChild) {
       //If we are not on our current path yet,
       //there will be more children to look after, to build our breadcumb
       return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
   }
   console.log(newBreadcrumbs);
   return newBreadcrumbs;
}
}
