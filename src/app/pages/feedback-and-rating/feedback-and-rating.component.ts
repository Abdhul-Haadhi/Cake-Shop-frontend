import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FeedbackAndRatingPageService } from 'src/app/services/feedback-and-rating/feedback-and-rating-page.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-feedback-and-rating',
  standalone: false,
  templateUrl: './feedback-and-rating.component.html',
  styleUrl: './feedback-and-rating.component.scss'
})
export class FeedbackAndRatingComponent implements OnInit {
  faStar = faStar;

  rating = 0;

  // setRating(value:number){
  //   this.rating = value;
  // }

  setRating(value: number) {
    if (this.feedbackForm.get('rating')?.disabled) {
      return;
    }
    this.feedbackForm.get('rating')?.setValue(value);
  }

  feedbackForm: FormGroup;


  dataSource!: MatTableDataSource<any>;


  isButtonDisabled = false;
  saveButtonLabel: string = 'Submit';
  submitted = false;
  mode = 'add';
  selectedData!: { id: any; };

  constructor(private fb: FormBuilder,
    private rateService: FeedbackAndRatingPageService,
    private messageService: MessageServiceService,
    private httpService: HttpService
  ) {
    this.feedbackForm = this.fb.group({
      date: new FormControl('', []),
      user: new FormControl('', []),
      rating: new FormControl(0, [Validators.required]),
      feedbackNote: new FormControl('', [Validators.required]),
    });
  }
  ngOnInit(): void {
    this.populateData();
  }


  public populateData(): void {
    try {
      this.rateService.getData().subscribe({
        next: (dataList: any) => {
          if (dataList.length <= 0) {
            return;
          }
        },
        error: (error) => {
          this.messageService.showError('Action failed with error' + error);
        }
      });
    }
    catch (error) {
      this.messageService.showError('Action failed with error' + error);
    }

  }


  onSubmit() {
    try {
      this.submitted = true;
      if (this.feedbackForm.invalid) {
        return;
      }

      let userId = this.httpService.getUserId();
      let currentDate = new Date();
      this.feedbackForm.patchValue({
        user: userId,
        date: currentDate
      })

      if (this.mode === 'add') {

        this.rateService.serviceCall(this.feedbackForm.value).subscribe({
          next: (response: any) => {
            if (this.dataSource && this.dataSource.data && this.dataSource.data.length > 0) {
              this.dataSource = new MatTableDataSource([response, ...this.dataSource.data,]);
            }
            else {
              this.dataSource = new MatTableDataSource([response]);
            }
            this.messageService.showSuccess('Feedback submitted successfully!');
          },
          error: (error) => {
            this.messageService.showError('Action failed with error' + error);
          }
        });
      }
      this.mode = 'add';
      this.feedbackForm.disable();
      // this.setRating(0);
      this.feedbackForm.get('rating')?.disable();
      this.isButtonDisabled = true;
    }
    catch (error) {
      this.messageService.showError('Action failed with error' + error);
    }
  }



  public resetData(): void {
    this.feedbackForm.reset();
    this.feedbackForm.updateValueAndValidity();
    this.feedbackForm.enable();
    this.feedbackForm.get('rating')?.enable();
    this.isButtonDisabled = false;
    this.submitted = false;
  }

}
