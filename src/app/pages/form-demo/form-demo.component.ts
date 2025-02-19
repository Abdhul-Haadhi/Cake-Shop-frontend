import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormDemoServiceService } from 'src/app/services/form-demo/form-demo-service.service';

@Component({
  selector: 'app-form-demo',
  standalone: false,
  templateUrl: './form-demo.component.html',
  styleUrl: './form-demo.component.scss',
})
export class FormDemoComponent {
  demoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private demoService: FormDemoServiceService
  ) {
    this.demoForm = this.fb.group({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      age: new FormControl(''),
      email: new FormControl(''),
    });
  }
  onSubmit() {
    console.log('Form submitted!');
    console.log(this.demoForm.value);

    this.demoService.serviceCall(this.demoForm.value).subscribe((Response)=>{
      console.log('server response: ',Response);
      
    });
  }
}
