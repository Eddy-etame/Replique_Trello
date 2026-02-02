import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-me',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './me.html',
  styleUrl: './me.scss',
})
export class Me {
  name = '';
  oldPassword = '';
  newPassword = '';
  message = '';
  isError = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    const user = this.authService.currentUser();
    if (!user) {
      this.router.navigate(['/login']);
    } else {
      this.name = user.name;
    }
  }

  get user() {
    return this.authService.currentUser();
  }

  saveProfile() {
    const result = this.authService.updateProfile(
      this.name,
      this.oldPassword,
      this.newPassword
    );

    this.message = result.message;
    this.isError = !result.success;

    if (result.success) {
      this.oldPassword = '';
      this.newPassword = '';
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
