import { ChangeDetectionStrategy, Component, effect, inject, ViewChild } from '@angular/core';
import { AvatarUploadComponent, ProfileHeaderComponent } from '../../ui';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { profileActions, selectMe } from '@tt/data-access/profile';
import { Store } from '@ngrx/store';
import { AddressInputComponent, StackInputComponent } from '@tt/common-ui';

@Component({
  selector: 'lib-settings-page',
  imports: [
    ProfileHeaderComponent,
    ReactiveFormsModule,
    AvatarUploadComponent,
    StackInputComponent,
    AddressInputComponent,
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent {
  fb = inject(FormBuilder);
  store = inject(Store);

  me = this.store.selectSignal(selectMe);

  @ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent;

  form = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    username: [{ value: '', disabled: true }, [Validators.required]],
    description: [''],
    stack: [/*{ value:*/ '' /*, disabled: true }*/],
    city: [null],
  });

  constructor() {
    this.store.dispatch(profileActions.loadMe());

    effect(() => {
      const me = this.me();

      if (!me) return;

      // @ts-expect-error: Profile contains fields not represented by this form.
      this.form.patchValue({
        ...me,
        // stack: this.mergeStack(me.stack),
      });
    });

    /*this.form.valueChanges.subscribe((val) => {
      console.log(val);
    })*/
  }

  onSave() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) return;

    if (this.avatarUploader.avatar) {
      this.store.dispatch(
        profileActions.uploadAvatar({
          avatar: this.avatarUploader.avatar,
        }),
      );
    }

    this.store.dispatch(
      profileActions.updateProfile({
        // @ts-expect-error: Form value does not exactly match the update payload.
        profile: {
          ...this.form.getRawValue(),
          // stack: this.splitStack(this.form.value.stack),
        },
      }),
    );
  }

  splitStack(stack: string | null | string[] | undefined): string[] {
    if (!stack) return [];
    if (Array.isArray(stack)) return stack;

    return stack.split(',');
  }

  mergeStack(stack: string | null | string[] | undefined) {
    if (!stack) return '';
    if (Array.isArray(stack)) return stack.join(',');

    return stack;
  }
}
