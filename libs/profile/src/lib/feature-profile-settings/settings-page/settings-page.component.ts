import { Component, effect, inject, ViewChild } from '@angular/core';
import { AvatarUploadComponent, ProfileHeaderComponent } from '../../ui';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { profileActions, selectMe } from '@tt/data-access/profile';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-settings-page',
  imports: [ProfileHeaderComponent, ReactiveFormsModule, AvatarUploadComponent],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
})
export class SettingsPageComponent /*aka Reha Settings Page*/ {
  fb = inject(FormBuilder);
  store = inject(Store);

  me = this.store.selectSignal(selectMe);

  @ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent;

  form = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    username: [{ value: '', disabled: true }, [Validators.required]],
    description: [''],
    stack: [''],
  });

  constructor() {
    this.store.dispatch(profileActions.loadMe());

    effect(() /*: void*/ => {
      // good approach to declare explicitly ": void" when some const / let is being declared
      const me = this.me();

      if (!me) return;

      this.form.patchValue({
        ...me,
        stack: this.mergeStack(me.stack)
      });
    });
  }

  onSave() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) return;

    if (this.avatarUploader.avatar) {
      this.store.dispatch(
        profileActions.uploadAvatar({
          avatar: this.avatarUploader.avatar
        })
      );
    }

    this.store.dispatch(
      profileActions.updateProfile({
          //@ts-ignore
          profile: {
            ...this.form.getRawValue(),
            stack: this.splitStack(this.form.value.stack)
          }
        }
      )
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
