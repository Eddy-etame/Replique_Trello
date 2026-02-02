import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { InviteService } from '../../services/invite.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  mode: 'login' | 'signup' = 'login';
  name = '';
  email = '';
  password = '';
  message = '';
  isError = false;

  constructor(
    private authService: AuthService,
    private inviteService: InviteService,
    private router: Router
  ) {}

  toggleMode() {
    this.mode = this.mode === 'login' ? 'signup' : 'login';
    this.message = '';
    this.isError = false;
  }

  submit() {
    const result =
      this.mode === 'login'
        ? this.authService.login(this.email, this.password)
        : this.authService.register(this.name, this.email, this.password);

    this.message = result.message;
    this.isError = !result.success;

    if (result.success) {
      this.inviteService.applyInvitesForCurrentUser();
      this.router.navigate(['/liste-projets']);
    }
  }
}
