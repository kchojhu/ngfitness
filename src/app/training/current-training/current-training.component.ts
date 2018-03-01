import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {StopTrainingComponent} from './stop-training.component';
import {TrainingService} from '../training.service';
import * as fromRoot from '../../app.reducer';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {

  progress = 0;
  timer: any;


  constructor(private dialog: MatDialog, private trainingService: TrainingService, private store: Store<fromRoot.State>) {

  }

  ngOnInit() {
    this.startOrResumeTimer();
  }

  startOrResumeTimer() {
    this.store.select(fromRoot.getActiveTraining).subscribe(ex => {
      if (ex) {
        const step = ex.duration / 100 * 1000;

        this.timer = setInterval(() => {
          this.progress += 1;
          if (this.progress >= 100) {
            this.trainingService.completeExercise();
            clearInterval(this.timer);
          }
        }, step);
      }
    });

  }

  onStop() {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('result:' + result);
      if (result) {
        this.trainingService.cancellExercise(this.progress);
      } else {
        this.startOrResumeTimer();
      }
    });
  }
}
