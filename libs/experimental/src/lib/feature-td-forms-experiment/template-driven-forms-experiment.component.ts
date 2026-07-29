import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'template-driven-forms-experiment',
  imports: [FormsModule, JsonPipe],
  templateUrl: './template-driven-forms-experiment.component.html',
  styleUrl: './template-driven-forms-experiment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateDrivenFormsExperimentComponent {
  person = {
    name: '',
    lastName: '',
    address: {
      street: '',
      building: 0,
    },
  };

  onChange(value: string) {
    console.log(value);
    this.person.name = value;
  }

  onSubmit(form: NgForm) {
    console.log(form);
  }
}
