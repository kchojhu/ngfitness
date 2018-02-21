import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UiService} from '../../shared/ui.service';
import {Store} from '@ngrx/store';
import {getIsLoading, State} from '../../app.reducer';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading$: Observable<boolean>;

  constructor(private authService: AuthService, private uiService: UiService, private store: Store<State>) {
  }

  ngOnInit() {
    this.isLoading$ = this.store.select(getIsLoading);

    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', {validators: [Validators.required]})
    });
  }


  onSubmit() {
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    });
  }

}
