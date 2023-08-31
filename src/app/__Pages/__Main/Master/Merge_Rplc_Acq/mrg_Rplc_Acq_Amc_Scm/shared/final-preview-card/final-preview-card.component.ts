import { Component, Input, OnInit } from '@angular/core';
import { rnt } from 'src/app/__Model/Rnt';

@Component({
  selector: 'final-preview-card',
  templateUrl: './final-preview-card.component.html',
  styleUrls: ['./final-preview-card.component.css']
})
export class FinalPreviewCardComponent implements OnInit {


  /**
   * Showing Header Title
   */
  @Input() Title:string;


  @Input() flag:string;

  /**
   * Showing List Item
   */
  @Input() Items:any[] = [];


  // @Input() final_preview:FormGroup;


  @Input() __RntMaster:rnt[] = [];


  constructor() { }

  ngOnInit(): void {
  }
}
