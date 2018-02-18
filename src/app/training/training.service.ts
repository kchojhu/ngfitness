import {Exercise} from './exercise.model';
import {Subject} from 'rxjs/Subject';
import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {Subscription} from 'rxjs/Subscription';
import {UiService} from '../shared/ui.service';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();

  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  private exercises: Exercise[] = [];

  private firebaseSubscriptions: Subscription[] = [];

  constructor(private angularFireStore: AngularFirestore, private uiService: UiService) {
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
    this.exerciseChanged.next({...this.runningExercise});
  }

  getRunningExercise() {
    return {...this.runningExercise};
  }

  fetchExercises() {
    this.firebaseSubscriptions.push(this.angularFireStore.collection('finishedExercises').valueChanges()
      .subscribe((exercises: Exercise[]) => {
        this.finishedExercisesChanged.next(exercises);
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
      this.availableExercises = exercises;
      this.exercisesChanged.next([...this.availableExercises]);
    }, error => {
      this.uiService.loadingStateChanged.next(false);
      this.uiService.showSnackbar('Fetching exercise failed, please try again later', null, 3000);
      this.exercisesChanged.next(null);
    }));
  }

  completeExercise() {
    this.addDataToDatabase({...this.runningExercise, date: new Date(), state: 'completed'});
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancellExercise(progress: number) {
    const percentage = progress / 100;
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: 'cancelled',
      duration: this.runningExercise.duration * percentage as number,
      calories: this.runningExercise.calories * percentage as number
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  private addDataToDatabase(exercise: Exercise) {
    this.angularFireStore.collection('finishedExercises').add(exercise);
  }

  cancelSubscriptions() {
    this.firebaseSubscriptions.forEach(sub => sub.unsubscribe());
  }
}
