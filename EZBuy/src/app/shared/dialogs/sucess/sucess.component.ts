import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sucess',
  templateUrl: './sucess.component.html',
  styleUrls: ['./sucess.component.scss']
})
export class SucessComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SucessComponent>,
    @Inject(MAT_DIALOG_DATA) public data, public router: Router) { }

  close() {
    localStorage.removeItem('products')
    this.dialogRef.close();
    this.dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/'])

    })
  }
  ngOnInit() {
  }

}
