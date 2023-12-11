import {Component, OnInit} from '@angular/core';
import {AuthService} from "./services/auth.service";
import {User} from "./interfaces/user";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontend';

  loggedInUser!: User;

  showNavs = true;

  routesToHideNav: string[] = [
    '/login', '/register', '/user/forgot-password', 'jobs/customer-job-invoice', 'jobs/customer-job-report',
  ];

  constructor(private authService: AuthService, private router: Router) {

  }

  ngOnInit(): void {

    this.initMain();

    this.authService.loggedInUserSubscribe().subscribe({
      next: (res) => {
        this.loggedInUser = res;
      }
    });
  }

  initMain() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {

        this.showNavs = true;
        for (const hiddenPart of this.routesToHideNav) {
          if (event.url.search(hiddenPart) !== -1) {
            this.showNavs = false;
          }
        }
      }
    });
  }
}
