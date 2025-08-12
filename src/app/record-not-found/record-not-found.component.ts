import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-record-not-found',
  standalone: true,
  imports: [],
  templateUrl: './record-not-found.component.html',
  styleUrl: './record-not-found.component.scss'
})
export class RecordNotFoundComponent {
  @Input() Title: string = "";
  @Input() SubTitle: string = "";
}
