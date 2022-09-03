import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = "foodie's";
  // loading?: boolean;
  // counter?: boolean;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.getLocalUser();
  }
}
