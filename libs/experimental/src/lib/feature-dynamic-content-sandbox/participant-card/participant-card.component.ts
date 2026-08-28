import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  input,
  signal,
  AfterContentInit,
  ContentChild,
  contentChildren,
  ContentChildren,
  TemplateRef,
  ViewContainerRef,
  ViewEncapsulation,
  output,
} from '@angular/core';
import { Participant } from '../dynamic-content-sandbox.component';
import { ProjComponent } from '../proj/proj.component';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'lib-tt-participant-card',
  imports: [ProjComponent],
  templateUrl: './participant-card.component.html',
  styleUrl: './participant-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // encapsulation: ViewEncapsulation.ShadowDom,
})
export class ParticipantCardComponent implements AfterContentInit {
  // #elRef = inject(ElementRef);
  #elRef = inject(ElementRef, { skipSelf: true });

  participant = input/*.required*/<Participant>();
  isShown = signal(true);

  // content = contentChild(ProjComponent);
  // content = contentChildren(ProjComponent, { read: TemplateRef, descendants: true });
  // content = contentChildren('pew', { read: TemplateRef, descendants: true });
  // content = contentChildren('pow', { read: ViewContainerRef, descendants: true });
  content = contentChild(NgControl, { descendants: true });

  //@ContentChild(ProjComponent) contentDecorator!: ProjComponent;
  //@ContentChildren(ProjComponent, { descendants: true }) contentDecorator!: ProjComponent[];

  clicked = output();

  /*constructor() {
    console.log(this.#elRef);
    console.log(this.#elRef.nativeElement.parentElement); // Should not be used!
  }

  @HostBinding('style.background')
  // color = 'red';
  get color() {
    return this.participant().name === '123' ? 'red' : 'blue';
  }

  @HostBinding('class.abadaba')
  get className() {
    return this.participant().name === '123';
  }

  @HostListener('click', ['$event'])
  click(e: Event) {
    console.log(123, e);
  }*/

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    this.clicked.emit();
  }

  ngAfterContentInit() {
    //console.log(this.content());
    //console.log(this.contentDecorator);
    const control = this.content();

    if (!control) return;

    control.control?.patchValue('13323');
  }
}
