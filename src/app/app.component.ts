import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { UtiliService } from './__Services/utils.service';

export interface IBreadCrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public breadcrumbs: IBreadCrumb[];
  constructor(
    private __router: Router,
    private __actRoute: ActivatedRoute,
    private __title: Title,
    private __utility: UtiliService
  ) {
    this.setTitle();
    this.breadcrumbs = this.buildBreadCrumb(this.__actRoute.root);
    console.log(this.__actRoute.root);

  }

  ngOnInit() {
    this.__router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        distinctUntilChanged()
      )
      .subscribe(() => {
        console.log(this.__actRoute);

        this.breadcrumbs = this.buildBreadCrumb(this.__actRoute.root);
        this.__utility.getBreadCrumb(this.breadcrumbs);
      });
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
          this.__title.setTitle(data.title);
        });
      });
  }

  /**
   * Recursively build breadcrumb according to activated route.
   * @param route
   * @param url
   * @param breadcrumbs
   */
  buildBreadCrumb(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: IBreadCrumb[] = []
  ): IBreadCrumb[] {
    let label =
      route.routeConfig && route.routeConfig.data
        ? route.routeConfig.data.breadcrumb
        : '';
    let path =
      route.routeConfig && route.routeConfig.path ? route.routeConfig.path : '';

    // If the route is dynamic route such as ':id', remove it
    // const lastRoutePart = path.split('/').pop();
    // console.log(lastRoutePart);

    // const isDynamicRoute = lastRoutePart.startsWith(':');
    // if(isDynamicRoute && !!route.snapshot) {
    //   console.log(lastRoutePart);

    //   const paramName = lastRoutePart.split(':')[1];
    //   console.log('paramName:' + paramName);
    //   path = path.replace(lastRoutePart, route.snapshot.params[paramName]);
    //   console.log('path:' + paramName);
    //   label = atob(route.snapshot.params[paramName]);
    // }

    console.log(route?.routeConfig?.path);

    const nextUrl = path ? `${url}/${path}` : url;
    const breadcrumb: IBreadCrumb = {
      label: label,
      url: nextUrl,
    };
    // Only adding route with non-empty label
    const newBreadcrumbs = breadcrumb.label
      ? [...breadcrumbs, breadcrumb]
      : [...breadcrumbs];
    if (route.firstChild) {
      console.log(route.firstChild);
      console.log(newBreadcrumbs);
      const rt = nextUrl.replace('/main', '/');
      //If we are not on our current path yet,
      //there will be more children to look after, to build our breadcumb
      return this.buildBreadCrumb(route.firstChild, rt, newBreadcrumbs);
    }
    return newBreadcrumbs;
  }
}
