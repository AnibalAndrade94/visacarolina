import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { INFO_MENU } from '../data/info-menu';
@Component({
  selector: 'app-info-layout',
  templateUrl: './info-layout.component.html',
  
  styleUrls: ['./info-layout.component.scss']
})
export class InfoLayoutComponent {
  menu = INFO_MENU;
  mobileOpen = signal(false);

  toggleMobile() {
    this.mobileOpen.update(v => !v);
  }

  closeMobile() {
    this.mobileOpen.set(false);
  }
}
