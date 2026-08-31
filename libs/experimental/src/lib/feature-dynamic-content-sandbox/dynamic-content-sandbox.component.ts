import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  QueryList,
  Renderer2,
  signal,
  TemplateRef,
  ViewChild,
  viewChild,
  ViewChildren,
  viewChildren,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SvgIconComponent, TtInputComponent } from '@tt/common-ui';
import { ParticipantCardComponent } from './participant-card/participant-card.component';
import { NgComponentOutlet, NgIf, NgTemplateOutlet } from '@angular/common';
import { SimpleWrapperComponent } from './simple-wrapper/simple-wrapper.component';
import { ProjComponent } from './proj/proj.component';

export interface Participant {
  name: string;
  role: string;
  isProgrammer: boolean;
  about?: string;
}

const initialState: Participant[] = [
  {
    name: 'Иван Иванов',
    role: 'Frontend Developer',
    isProgrammer: true,
    about: 'Опытный фронтенд-разработчик с глубокими знаниями JavaScript и React.',
  },
  {
    name: 'Мария Петрова',
    role: 'UI/UX Designer',
    isProgrammer: false,
    about: 'Творческий дизайнер с опытом создания интуитивно понятных интерфейсов.',
  },
  {
    name: 'Алексей Смирнов',
    role: 'Backend Developer',
    isProgrammer: true,
    about: 'Серверный разработчик, специализирующийся на Node.js и базах данных.',
  },
  {
    name: 'Ольга Кузнецова',
    role: 'Project Manager',
    isProgrammer: false,
    about: 'Организованный проект-менеджер с опытом управления agile-командами.',
  },
  {
    name: 'Дмитрий Орлов',
    role: 'QA Engineer',
    isProgrammer: false,
    // about: 'Детально ориентированный QA-инженер с опытом автоматизированного тестирования.',
  },
];

@Component({
  selector: 'lib-dynamic-content-sandbox',
  imports: [
    ReactiveFormsModule,
    TtInputComponent,
    ParticipantCardComponent,
    NgTemplateOutlet,
    NgIf,
    SvgIconComponent,
    SimpleWrapperComponent,
    ProjComponent,
    NgComponentOutlet,
  ],
  templateUrl: './dynamic-content-sandbox.component.html',
  styleUrl: './dynamic-content-sandbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicContentSandboxComponent /*implements AfterViewInit*/ {
  #fb = inject(FormBuilder);
  //#r2 = inject(Renderer2);

  h2Element = viewChild<ElementRef>('h2');
  // card = viewChild<ParticipantCardComponent>(ParticipantCardComponent /*'partCar'*/);
  //card = viewChildren<ParticipantCardComponent>(ParticipantCardComponent);

  //@ViewChildren(ParticipantCardComponent) cards!: QueryList<ParticipantCardComponent>;
  // @ViewChild('h2') h2Element!: ElementRef;

  templ = viewChild('participantTempl', { read: TemplateRef });
  container = viewChild('container', { read: ViewContainerRef });
  //contentProj = viewChild<ElementRef>('contentProj');
  contentProj = viewChild('contentProj', { read: TemplateRef });

  ParticipantCardComponent = ParticipantCardComponent;

  participantForm = this.#fb.group({
    name: this.#fb.nonNullable.control('', [Validators.required]),
    role: this.#fb.nonNullable.control('', [Validators.required]),
    isProgrammer: this.#fb.nonNullable.control(true, [Validators.required]),
    about: this.#fb.nonNullable.control('', [Validators.required]),
  });

  control = new FormControl();

  participants = signal<Participant[]>(initialState);

  /*ngAfterViewInit() {
    // this.nativeSandbox();
    // console.log(this.h2Element());
    /!*const h2Element = this.h2Element();

    if (!h2Element) return;

    const h2 = h2Element.nativeElement;
    this.#r2.addClass(h2, 'red');
    this.#r2.listen(h2, 'click', (e) => {
      console.log('click');
    });*!/

    /!*const a = this.#r2.createElement('a');
    this.#r2.setStyle(a, 'display', 'none');
    this.#r2.appendChild(document.body, a);
    a.href = 'https://ya.ru';

    a.click();*!/

    /!*console.log(this.card());
    this.cards.changes.subscribe((change) => {
      console.log(change);
    });*!/

    // console.log(this.templ());
    /!*console.log(this.container());
    const container = this.container();
    const templ = this.templ();

    if (!templ || !container) return;

    this.participants().forEach((p) => {
      container.createEmbeddedView(templ, { $implicit: p });
    });*!/

    const container = this.container();
    const participants = this.participants();
    const contentProj = this.contentProj();

    if (!container || !participants || !contentProj) return;

    participants.forEach((participant) => {
      const projTemplate = container.createEmbeddedView(contentProj);
      const projTemplate2 = container.createEmbeddedView(contentProj);

      // const cardRef = container.createComponent(ParticipantCardComponent);
      const cardRef = container.createComponent(ParticipantCardComponent, {
        //projectableNodes: [[this.contentProj()?.nativeElement], []],
        //projectableNodes: [projTemplate.rootNodes, []],
        projectableNodes: [projTemplate.rootNodes, projTemplate2.rootNodes],
      });

      cardRef.setInput('participant', participant);

      cardRef.instance.clicked.subscribe(() => {
        console.log('clicked');
      });
    });
  }*/

  //test(a: any) {}

  nativeSandbox() {
    const h2 = document.querySelector('.participants-header');
    h2?.classList.add('red');
    h2?.addEventListener('click', (e) => {
      console.log('click');
    });
  }

  addParticipant() {
    if (this.participantForm.invalid) return;

    const newParticipant = this.participantForm.getRawValue();
    this.participants.update((current) => [...current, newParticipant]);
    this.participantForm.reset();
  }
}
