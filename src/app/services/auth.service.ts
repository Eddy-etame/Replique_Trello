import { computed, Injectable, signal } from '@angular/core';
import { User } from '../models/user';

interface AuthResult {
  success: boolean;
  message: string;
}

const USERS_KEY = 'ebs_users';
const SESSION_KEY = 'ebs_session';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users = signal<User[]>(this.loadUsers());
  private sessionUserId = signal<number | null>(this.loadSession());

  currentUser = computed(() =>
    this.users().find((user) => user.id === this.sessionUserId()) ?? null
  );

  register(name: string, email: string, password: string): AuthResult {
    const normalizedEmail = email.trim().toLowerCase();
    if (!name.trim() || !normalizedEmail || password.length < 6) {
      return { success: false, message: 'Veuillez remplir tous les champs.' };
    }

    if (this.users().some((user) => user.email === normalizedEmail)) {
      return { success: false, message: 'Cet email est déjà utilisé.' };
    }

    const newUser = new User(
      Date.now(),
      name.trim(),
      normalizedEmail,
      User.hashPassword(password),
      new Date().toISOString()
    );

    this.users.update((users) => [...users, newUser]);
    this.persistUsers();
    this.sessionUserId.set(newUser.id);
    this.persistSession();

    return { success: true, message: 'Compte créé avec succès.' };
  }

  login(email: string, password: string): AuthResult {
    const normalizedEmail = email.trim().toLowerCase();
    const user = this.users().find((entry) => entry.email === normalizedEmail);
    if (!user || !user.verifyPassword(password)) {
      return { success: false, message: 'Identifiants invalides.' };
    }

    this.sessionUserId.set(user.id);
    this.persistSession();
    return { success: true, message: 'Connexion réussie.' };
  }

  logout() {
    this.sessionUserId.set(null);
    this.persistSession();
  }

  updateProfile(name: string, oldPassword: string, newPassword: string): AuthResult {
    const current = this.currentUser();
    if (!current) {
      return { success: false, message: 'Aucun utilisateur connecté.' };
    }

    if (!current.verifyPassword(oldPassword)) {
      return { success: false, message: 'Ancien mot de passe incorrect.' };
    }

    const updated = new User(
      current.id,
      name.trim() || current.name,
      current.email,
      newPassword ? User.hashPassword(newPassword) : current.passwordHash,
      current.createdAt
    );

    this.users.update((users) =>
      users.map((user) => (user.id === current.id ? updated : user))
    );
    this.persistUsers();
    return { success: true, message: 'Profil mis à jour.' };
  }

  getUserInitials(user: User | null) {
    if (!user) {
      return '?';
    }
    const parts = user.name.split(' ').filter(Boolean);
    const initials = parts.map((part) => part[0]).join('').slice(0, 2);
    return initials.toUpperCase() || 'U';
  }

  getUserId() {
    return this.sessionUserId();
  }

  getUsers() {
    return this.users();
  }

  getUserById(userId: number | null) {
    if (!userId) {
      return null;
    }
    return this.users().find((user) => user.id === userId) ?? null;
  }

  private loadUsers() {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      return [];
    }
    try {
      const parsed = JSON.parse(raw) as User[];
      return parsed.map((user) => User.fromJSON(user));
    } catch {
      return [];
    }
  }

  private loadSession() {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? Number(raw) : null;
  }

  private persistUsers() {
    localStorage.setItem(USERS_KEY, JSON.stringify(this.users()));
  }

  private persistSession() {
    const id = this.sessionUserId();
    if (id) {
      localStorage.setItem(SESSION_KEY, id.toString());
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }
}
