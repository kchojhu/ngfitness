import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  openSideNav = true;

  constructor(private authService: AuthService) {
  }

  onToggle() {
    this.openSideNav = !this.openSideNav;
  }

  ngOnInit(): void {
    this.authService.initAuthListener();
  }
}
