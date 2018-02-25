import {AuthData} from './auth-data.model';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import {TrainingService} from '../training/training.service';
import {UiService} from '../shared/ui.service';
import {Store} from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import * as Ui from '../shared/ui.actions';
import * as Auth from './auth.actions';

@Injectable()
export class AuthService {

  constructor(private router: Router, private angularFireAuth: AngularFireAuth, private trainingService: TrainingService,
              private uiService: UiService, private store: Store<fromRoot.State>) {
  }

  initAuthListener() {
    this.angularFireAuth.authState.subscribe(user => {
      if (user) {
        this.store.dispatch(new Auth.SetAuthenticated());
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.store.dispatch(new Auth.SetUnauthenticated());
        this.router.navigate(['/login']);
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

    this.router.navigate(['/login']);

  }

}
