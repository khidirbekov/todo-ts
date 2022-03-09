export interface ITask {
  getId(): number,
  getName(): string,
  setName(name: string): void,
}

export interface ITaskWithStatus extends ITask {
  getStatus(): Status,
  setStatus(status: Status): void
}

export type Status = 'done' | 'active'

export interface ITaskList {
  addTask(name: string): void,
  removeTask(id: number): void,
  changeStatus(id: number, status: Status): void,
  render(): void
}
