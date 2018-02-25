import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import * as fromRoot from '../../app.reducer';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  isAuth$: Observable<boolean>;
  @Output()
  sidenavToggle = new EventEmitter<void>();

  constructor(private authService: AuthService, private store: Store<fromRoot.State>) {
  }

  ngOnInit() {
    this.isAuth$ = this.store.select(fromRoot.getIsAuthenticated);
  }

  closeSideNav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.closeSideNav();
    this.authService.logout();
  }
}
