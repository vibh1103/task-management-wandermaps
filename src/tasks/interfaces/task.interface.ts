export interface ITask {
  id?: string;
  title: string;
  description: string;
  priority: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
