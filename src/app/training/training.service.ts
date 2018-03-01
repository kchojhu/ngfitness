import {Exercise} from './exercise.model';
import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {Subscription} from 'rxjs/Subscription';
import {UiService} from '../shared/ui.service';
import * as fromRoot from '../app.reducer';
import {Store} from '@ngrx/store';
import {SetAvailableTrainings, SetFinishedTrainings, StartTraining, StopTraining} from './training.actions';

@Injectable()
export class TrainingService {
  private firebaseSubscriptions: Subscription[] = [];

  constructor(private angularFireStore: AngularFirestore, private uiService: UiService, private store: Store<fromRoot.State>) {
  }

  startExercise(selectedId: string) {
    this.store.dispatch(new StartTraining(selectedId));
  }

  fetchExercises() {
    this.firebaseSubscriptions.push(this.angularFireStore.collection('finishedExercises').valueChanges()
      .subscribe((exercises: Exercise[]) => {
        this.store.dispatch(new SetFinishedTrainings(exercises));
      }));
  }

  fetchAvailableExercises() {
    this.firebaseSubscriptions.push(this.angularFireStore.collection('availableExercises').snapshotChanges().map(docArray => {
      return docArray.map(doc => {
        return {
          id: doc.payload.doc.id,
          ...doc.payload.doc.data()
        };
      });
    }).subscribe((exercises: Exercise[]) => {
      this.store.dispatch(new SetAvailableTrainings(exercises));
    }, error => {
      this.uiService.loadingStateChanged.next(false);
      this.uiService.showSnackbar('Fetching exercise failed, please try again later', null, 3000);
    }));
  }

  completeExercise() {
    this.store.select(fromRoot.getActiveTraining).subscribe(ex => {
      if (ex) {
        this.addDataToDatabase({...ex, date: new Date(), state: 'completed'});
        this.store.dispatch(new StopTraining());
      }
    });
  }

  cancellExercise(progress: number) {

    this.store.select(fromRoot.getActiveTraining).subscribe(ex => {
      if (ex) {
        const percentage = progress / 100;
        this.addDataToDatabase({
          ...ex, date: new Date(), state: 'cancelled', duration: ex.duration * percentage as number,
          calories: ex.calories * percentage as number
        });
        this.store.dispatch(new StopTraining());
      }
    });

    this.store.dispatch(new StopTraining());
  }

  private addDataToDatabase(exercise: Exercise) {
    this.angularFireStore.collection('finishedExercises').add(exercise);
  }

  cancelSubscriptions() {
    this.firebaseSubscriptions.forEach(sub => sub.unsubscribe());
  }
}
