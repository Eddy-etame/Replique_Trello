import { Routes } from '@angular/router';
import { ListeProjets } from './pages/liste-projets/liste-projets';
import { DetailProjet } from './pages/detail-projet/detail-projet';
import { AjouterProjet } from './pages/ajouter-projet/ajouter-projet';

export const routes: Routes = [
    {path:'', component: ListeProjets },
    {path:'projet/:id', component: DetailProjet},
    {path:'ajouter', component: AjouterProjet},

];
