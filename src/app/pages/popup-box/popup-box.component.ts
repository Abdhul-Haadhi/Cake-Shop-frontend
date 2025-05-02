import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-box',
  standalone: false,
  templateUrl: './popup-box.component.html',
  styleUrl: './popup-box.component.scss'
})
export class PopupBoxComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<PopupBoxComponent>) {}

  closePopup(): void {
    this.dialogRef.close();
  }
}
