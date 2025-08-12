import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[OnlyNumber]',
  standalone: true
})
export class AllownumberDirective {
  input: number = 0;
  constructor(private el: ElementRef) { }
  private regex: RegExp;

  @Input()
  set OnlyNumber(value: string) {
    if (value !== null && value !== "") {
      this.input = parseInt(value);
    } else {
      this.input = 0;
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Backspace' || event.key === 'Tab' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      return;
    }
    this.regex = new RegExp(`^[0-9]{0,${this.input}}$`);
    const currentValue: string = this.el.nativeElement.value;
    const nextValue: string = currentValue.concat(event.key);
    if (nextValue && !String(nextValue).match(this.regex)) {
      event.preventDefault();
    }
  }
}
