import { Injectable, signal } from '@angular/core';

export interface Subtask {
  id: number;
  titre: string;
  done: boolean;
}

export interface Projet {
  id: number;
  nom: string;
  statut: string;
  sousTaches: Subtask[];
}

@Injectable({
  providedIn: 'root',
})

export class ProjetService {
  nom = '';
  statut = '';
  projets = signal<Projet[]>([
    { id: Date.now(), nom: 'projet 1', statut: 'premier projet 2026', sousTaches: [] },
  ]);

  addProjet(projet: { nom: string; statut: string }) {
    const nouveauProjet: Projet = {
      id: Date.now(),
      nom: projet.nom,
      statut: projet.statut,
      sousTaches: [],
    };
    this.projets.update((projets) => [...projets, nouveauProjet]);
  } 

  getProjets() {
    return this.projets();
  }

  getProjet(id: number) {
    return this.projets().find((projet) => projet.id === id);
  }

  addSubtask(projetId: number, titre: string) {
    const trimmedTitre = titre.trim();
    if (!trimmedTitre) {
      return false;
    }

    const nouvelleSousTache: Subtask = {
      id: Date.now(),
      titre: trimmedTitre,
      done: false,
    };

    this.projets.update((projets) =>
      projets.map((projet) =>
        projet.id === projetId
          ? { ...projet, sousTaches: [...projet.sousTaches, nouvelleSousTache] }
          : projet
      )
    );
    return true;
  }
}
