import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  BaseModalComponent,
  ModalService,
  StackInputComponent,
  TtInputComponent,
  TtSelectComponent,
} from '@tt/common-ui';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { communityActions, CommunityTheme } from '@tt/data-access/communities';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lib-create-community-modal',
  imports: [
    BaseModalComponent,
    ReactiveFormsModule,
    StackInputComponent,
    TtInputComponent,
    TtSelectComponent,
  ],
  templateUrl: './create-community-modal.component.html',
  styleUrl: './create-community-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCommunityModalComponent {
  #fb = inject(FormBuilder);
  #store = inject(Store);
  #modalService = inject(ModalService);
  #actions$ = inject(Actions);

  themeOptions: CommunityTheme[] = ['PROGRAMMING', 'TECHNOLOGY', 'EDUCATION', 'SPORT', 'OTHER'];

  createCommunityForm = this.#fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    themes: ['' as CommunityTheme, Validators.required],
    tags: [[] as string[]],
    description: [''],
  });

  constructor() {
    this.#actions$
      .pipe(ofType(communityActions.communityCreated), takeUntilDestroyed())
      .subscribe(() => {
        this.#modalService.close();
      });
  }

  onSubmit() {
    if (this.createCommunityForm.invalid) {
      this.createCommunityForm.markAllAsTouched();
      return;
    }

    const formValue = this.createCommunityForm.getRawValue();

    this.#store.dispatch(
      communityActions.createCommunity({
        community: {
          name: formValue.name,
          themes: [formValue.themes],
          tags: formValue.tags,
          description: formValue.description,
        },
      }),
    );
  }

  onCancel() {
    this.#modalService.close();
  }
}
