import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';
import { AuthService } from './auth.service';
import { ProjetService } from './projet.service';

interface Invite {
  projectId: number;
  email: string;
  role: string;
  invitedBy: number | null;
  createdAt: string;
}

const INVITES_KEY = 'ebs_invites';
const EMAILJS_SERVICE_ID = 'service_876lodh';
const EMAILJS_TEMPLATE_ID = 'template_mgm0kzg';
const EMAILJS_PUBLIC_KEY = 'X9M1kVVhEMDT7q2pP';
const EMAILJS_ASSIGNMENT_TEMPLATE_ID = 'template_5y8clqw';

@Injectable({
  providedIn: 'root',
})
export class InviteService {
  constructor(
    private authService: AuthService,
    private projetService: ProjetService
  ) {}

  async sendInvite(projectId: number, email: string, role: string) {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      return { success: false, message: 'Email invalide.' };
    }

    const invite: Invite = {
      projectId,
      email: normalizedEmail,
      role,
      invitedBy: this.authService.getUserId(),
      createdAt: new Date().toISOString(),
    };

    this.saveInvite(invite);

    if (
      EMAILJS_PUBLIC_KEY.startsWith('YOUR_') ||
      EMAILJS_SERVICE_ID.startsWith('YOUR_') ||
      EMAILJS_TEMPLATE_ID.startsWith('YOUR_')
    ) {
      return {
        success: false,
        message: 'Configurez EmailJS pour envoyer les invitations.',
      };
    }

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: normalizedEmail,
          project_id: projectId,
          role,
          inviter: this.authService.currentUser()?.name ?? 'EBS-Trail',
        },
        EMAILJS_PUBLIC_KEY
      );

      return { success: true, message: 'Invitation envoyée.' };
    } catch {
      return { success: false, message: 'Échec de l’envoi de l’email.' };
    }
  }

  applyInvitesForCurrentUser() {
    const user = this.authService.currentUser();
    if (!user) {
      return;
    }

    const invites = this.loadInvites();
    const remaining = invites.filter((invite) => {
      if (invite.email === user.email) {
        this.projetService.addCollaborator(invite.projectId, user.id);
        return false;
      }
      return true;
    });

    localStorage.setItem(INVITES_KEY, JSON.stringify(remaining));
  }

  async assignSubtaskWithEmail(
    projectId: number,
    subtaskId: number,
    userId: number | null
  ) {
    this.projetService.assignSubtask(projectId, subtaskId, userId);

    const user = userId ? this.authService.getUserById(userId) : null;
    const project = this.projetService.getProjet(projectId);
    const subtask = project?.sousTaches.find((task) => task.id === subtaskId);

    if (!user || !project || !subtask) {
      return { success: false, message: 'Assignation mise à jour.' };
    }

    if (
      EMAILJS_PUBLIC_KEY.startsWith('YOUR_') ||
      EMAILJS_SERVICE_ID.startsWith('YOUR_') ||
      EMAILJS_ASSIGNMENT_TEMPLATE_ID.startsWith('YOUR_')
    ) {
      return {
        success: false,
        message: 'Assignation enregistrée (EmailJS non configuré).',
      };
    }

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_ASSIGNMENT_TEMPLATE_ID,
        {
          to_email: user.email,
          assignee: user.name,
          project_name: project.nom,
          subtask_title: subtask.titre,
        },
        EMAILJS_PUBLIC_KEY
      );
      return { success: true, message: 'Assignation envoyée par email.' };
    } catch {
      return { success: false, message: 'Échec de l’envoi de l’email.' };
    }
  }

  private loadInvites() {
    const raw = localStorage.getItem(INVITES_KEY);
    if (!raw) {
      return [] as Invite[];
    }
    try {
      return JSON.parse(raw) as Invite[];
    } catch {
      return [] as Invite[];
    }
  }

  private saveInvite(invite: Invite) {
    const invites = this.loadInvites();
    invites.push(invite);
    localStorage.setItem(INVITES_KEY, JSON.stringify(invites));
  }
}
