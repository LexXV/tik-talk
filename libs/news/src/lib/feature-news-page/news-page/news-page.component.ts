import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-news-page',
  imports: [ReactiveFormsModule],
  templateUrl: './news-page.component.html',
  styleUrl: './news-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsPageComponent {
  form = new FormGroup({
    topic: new FormControl(null, [Validators.required]),
  });

  enteredTopic = '';

  onSubmit() {
    this.enteredTopic = this.form.value.topic ?? '';
  }
}
