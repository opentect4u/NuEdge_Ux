import { Directive, Input, Renderer2, ElementRef, AfterViewInit, OnDestroy, OnChanges } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
// import { Subscription } from 'rxjs/Subscription';

@Directive({
  selector: '[stickyHeader]'
})
export class StickyHeaderDirectiveDirective {

  private windowScrollSubscription: Subscription = null;
    private windowResizeSubscription: Subscription = null;
    private header: any = null;
    private offsetTop: number = 0;
    private lastScroll: number = 211;
    private isSticky: boolean = false;
    private hasHeader: boolean = false;
    private headerTop = 0;
    @Input('stickyClass') stickyClass: string = "";
    @Input('stickyTop') stickyTop: number = 0;

    constructor(private elementRef: ElementRef, private renderer: Renderer2) {

    }

    ngAfterViewInit(): void {
        setTimeout(()=>{
            this.windowScrollSubscription = fromEvent(window, 'scroll').subscribe(
              () => this.manageScrollEvent()
              );
            // this.windowResizeSubscription = fromEvent(window, 'resize').subscribe(() => this.updateHeaderSize());
            const headers = this.elementRef.nativeElement.getElementsByTagName('TR');
            this.hasHeader = headers.length > 0;
            if (this.hasHeader) {
                this.header = headers[0];
                this.headerTop = this.header.getBoundingClientRect()['top'];
                this._calcPosition();
            }
        }, 0);
    }

    ngOnDestroy(): void {
        if (this.windowScrollSubscription){
            this.windowScrollSubscription.unsubscribe();
            this.windowScrollSubscription = null;
        }
        if (this.windowResizeSubscription){
            this.windowResizeSubscription.unsubscribe();
            this.windowResizeSubscription = null;
        }
    }

    ngOnChanges(changes)
    {
        if (changes.stickyTop) {
            this._calcPosition();
        }
    }

    private _calcPosition(){
        if (this.hasHeader) {
            const scroll = window.pageYOffset;
            if (this.isSticky && scroll >= this.headerTop) {
                this.header.style.top =  this.stickyTop + 'px';
            }
        }
    }

    private manageScrollEvent(): void {
        const scroll = window.pageYOffset;
        console.log(scroll)
        console.log(this.lastScroll);
        // && scroll >= this.offsetTop
        // && scroll <= this.offsetTop
        if (scroll > this.lastScroll ) {
            this.setSticky();
        } else if (scroll < this.lastScroll ) {
            this.unsetSticky();
        }
        // this.lastScroll = scroll;
    }

    private setSticky(): void {
        this.isSticky = true;
        this.header.style.position = 'fixed';
        this.header.style.top =  this.stickyTop + 'px';
        this.header.style.display = 'table';
        // this.updateHeaderSize();
        this.setClass(true);
    }

    private updateHeaderSize(){
        if (this.isSticky) {
            const tableWidth = this.elementRef.nativeElement.getBoundingClientRect()['right'] - this.elementRef.nativeElement.getBoundingClientRect()['left'];
            this.header.style.width = tableWidth + 'px';
            // update size of TH elements
            const thArray = this.elementRef.nativeElement.getElementsByTagName('TH');
            for (let i = 0; i < thArray.length; i++){
                thArray[i].style.width = tableWidth / thArray.length + "px";
            }

        }
    }

     unsetSticky(): void {
        this.isSticky = false;
        this.header.style.position = 'static';
        this.header.style.width = 'auto';
        this.header.style.display = 'table-row';
        this.setClass(false);
    }

    setStyle(key: string, value: string): void {
        this.renderer.setStyle(this.header, key, value);
    }

    private setClass(add: boolean): void {
        if (this.stickyClass){
            this.renderer.addClass(this.header, this.stickyClass)
        }
    }

}
