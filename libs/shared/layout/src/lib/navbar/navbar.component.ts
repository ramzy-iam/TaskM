import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, OverlayModule],
  templateUrl: './navbar.component.html',
})
export class NavBarComponent {
  showProfil = false;

  toggleUserMenu() {
    console.log('navbar overlay', this.showProfil);
    this.showProfil = !this.showProfil;
  }

  setShowProfil(value: boolean) {
    this.showProfil = value;
  }
}
