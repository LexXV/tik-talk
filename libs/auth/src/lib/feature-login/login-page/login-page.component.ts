import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@tt/data-access/auth';
import { Router } from '@angular/router';
import { TtInputComponent } from '@tt/common-ui';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, TtInputComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  authService = inject(AuthService);
  router = inject(Router);

  isPasswordVisible = signal<boolean>(false);

  form = new FormGroup({
    username: new FormControl<string | null>(null /*'USERNAME'*/, Validators.required),
    password: new FormControl<string | null>(null, Validators.required),
  });

  /*ngOnInit() {
    this.form.valueChanges.subscribe((val) => {
      console.log(val);
    });

    // this.form.controls.username.disable();
  }*/

  onSubmit() {
    if (this.form.valid) {
      //@ts-ignore
      this.authService.login(this.form.value).subscribe((res) => {
        this.router.navigate(['']);
        console.log(res);
      });
    }
  }
}
