import {User} from './user.model';
import {AuthData} from './auth-data.model';
import {Subject} from 'rxjs/Subject';
import {Injectable, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import {TrainingService} from '../training/training.service';
import {MatSnackBar} from '@angular/material';
import {UiService} from '../shared/ui.service';

@Injectable()
export class AuthService {
  private isAuthenticated = false;
  authChange: Subject<boolean> = new Subject();


  constructor(private router: Router, private angularFireAuth: AngularFireAuth, private trainingService: TrainingService,
              private uiService: UiService) {
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
    this.uiService.loadingStateChanged.next(true);
    this.angularFireAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password).then(result => {
      console.log(result);
      this.uiService.loadingStateChanged.next(false);
    }).catch(error => {
      console.log(error);
      this.uiService.loadingStateChanged.next(false);
      this.uiService.showSnackbar(error.message, null, {
        duration: 3000
      });
    });
  }

  login(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.angularFireAuth.auth.signInWithEmailAndPassword(authData.email, authData.password).then(result => {
      console.log(result);
      this.uiService.loadingStateChanged.next(false);
    }).catch(error => {
      console.log(error);
      this.uiService.loadingStateChanged.next(false);
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
