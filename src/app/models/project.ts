import { ColumnStatus, ProgressStatus, Subtask } from './subtask';

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export class Project {
  constructor(
    public id: number,
    public nom: string,
    public statut: string,
    public dateEcheance: string,
    public done: boolean,
    public progress: ProgressStatus,
    public sousTaches: Subtask[],
    public ownerId: number | null,
    public collaboratorIds: number[]
  ) {}

  static fromJSON(data: Project) {
    return new Project(
      data.id,
      data.nom,
      data.statut,
      data.dateEcheance,
      data.done,
      data.progress,
      (data.sousTaches ?? []).map((task) => Subtask.fromJSON(task)),
      data.ownerId ?? null,
      data.collaboratorIds ?? []
    );
  }

  getColumn(today: Date = new Date()): ColumnStatus {
    if (this.done) {
      return 'done';
    }

    const dueDate = new Date(this.dateEcheance);
    if (this.dateEcheance && dueDate < startOfDay(today)) {
      return 'overdue';
    }

    return this.progress;
  }
}
