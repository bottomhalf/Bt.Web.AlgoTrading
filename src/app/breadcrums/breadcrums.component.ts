import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-breadcrums',
  templateUrl: './breadcrums.component.html',
  styleUrls: ['./breadcrums.component.scss'],
  imports: [CommonModule]
})

export class BreadcrumsComponent implements OnInit {
  titleText: string = "";
  subTitleText: string = "";
  routePath: Array<any> = [];
  
  constructor() { }

  @Output() loadRoute = new EventEmitter<number>();
  
  @Input() 
  set routes(paths: Array<any>){
    if(paths != null) {
      this.routePath = paths;
    }
  }
  
  @Input()
  set title(text: string) {
    if (text) {
      this.titleText = text;
    }
  }

  @Input()
  set subtitle(text: string) {
    if (text) {
      this.subTitleText = text;
    }
  }

  ngOnInit(): void {
  }

  changeRouter(id: number) {
    // this.nav.navigateWithoutArgs(path);
    this.loadRoute.emit(id);
  }
}
