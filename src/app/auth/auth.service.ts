import {AuthData} from './auth-data.model';
import {Subject} from 'rxjs/Subject';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import {TrainingService} from '../training/training.service';
import {UiService} from '../shared/ui.service';
import {Store} from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import * as Ui from '../shared/ui.actions';

@Injectable()
export class AuthService {
  private isAuthenticated = false;
  authChange: Subject<boolean> = new Subject();


  constructor(private router: Router, private angularFireAuth: AngularFireAuth, private trainingService: TrainingService,
              private uiService: UiService, private store: Store<fromRoot.State>) {
  }

  initAuthListener() {
    this.angularFireAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      }
    });
  }

  register(authData: AuthData) {
    this.store.dispatch(new Ui.StartLoading());
    this.angularFireAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password).then(result => {
      this.store.dispatch(new Ui.StopLoading());
    }).catch(error => {
      this.store.dispatch(new Ui.StopLoading());
      this.uiService.showSnackbar(error.message, null, {
        duration: 3000
      });
    });
  }

  login(authData: AuthData) {
    this.store.dispatch(new Ui.StartLoading());
    this.angularFireAuth.auth.signInWithEmailAndPassword(authData.email, authData.password).then(result => {
      this.store.dispatch(new Ui.StopLoading());
    }).catch(error => {
      this.store.dispatch(new Ui.StopLoading());
      this.uiService.showSnackbar(error.message, null, {
        duration: 3000
      });
    });
  }

  logout() {
    this.angularFireAuth.auth.signOut();
    this.trainingService.cancelSubscriptions();

    this.isAuthenticated = false;
    this.authChange.next(false);
    this.router.navigate(['/login']);

  }

  isAuth() {
    return this.isAuthenticated;
  }

}
