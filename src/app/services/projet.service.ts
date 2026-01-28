import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProjetService {
  nom = '';
  statut = '';
  projets = signal([{ id: Date.now(), nom: 'projet 1', statut: 'premier projet 2026' }]);

  addProjet(projet: { nom: string; statut: string }) {
    const nouveauProjet = { id: Date.now(), nom: projet.nom, statut: projet.statut };
    this.projets.update((projets) => [...projets, nouveauProjet]);
  } 

  getProjets() {
    return this.projets();
  }

  getProjet(id: number) {
    return this.projets().find((projet) => projet.id === id);
  }
}
