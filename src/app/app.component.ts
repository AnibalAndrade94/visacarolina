import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

declare const gtag: Function;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'G-L4R5GZ4771', {
          page_path: event.urlAfterRedirects
        });
      }
    });
  }
}
