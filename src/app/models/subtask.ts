export type ProgressStatus = 'todo' | 'ongoing';
export type ColumnStatus = 'todo' | 'ongoing' | 'overdue' | 'done';

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export class Subtask {
  constructor(
    public id: number,
    public titre: string,
    public dateEcheance: string,
    public done: boolean,
    public progress: ProgressStatus,
    public assigneeId: number | null = null
  ) {}

  static fromJSON(data: Subtask) {
    return new Subtask(
      data.id,
      data.titre,
      data.dateEcheance,
      data.done,
      data.progress,
      data.assigneeId ?? null
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
