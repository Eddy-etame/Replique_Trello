import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjetService } from '../../services/projet.service';

@Component({
  selector: 'app-ajouter-projet',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ajouter-projet.html',
  styleUrl: './ajouter-projet.scss',
})
export class AjouterProjet {
  projetService = inject(ProjetService);
  router = inject(Router);

  addProjet() {
    this.projetService.addProjet({
      nom: this.projetService.nom,
      statut: this.projetService.statut,
    });
    this.projetService.nom = '';
    this.projetService.statut = '';
    this.router.navigate(['/']);
  }
}
