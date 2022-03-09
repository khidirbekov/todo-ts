import {ITask, ITaskWithStatus, Status} from "./types";

class Task implements ITask {
  protected id: number
  protected name: string

  constructor(name: string) {
    this.id = +new Date();
    this.name = name;
  }

  getId() {
    return this.id
  }

  getName() {
    return this.name;
  }

  setName(name: string) {
    this.name = name;
  }
}

class TaskWithStatus extends Task implements ITaskWithStatus {
  private status
  constructor(name: string, status: Status) {
    super(name);
    this.status = status;
  }

  getStatus(): Status {
    return this.status
  }

  setStatus(status: Status) {
    this.status = status
  }
}

class TaskList {
  private tasks: TaskWithStatus[] = []
  private readonly block: HTMLElement | null

  constructor(selector: string) {
    this.block = document.querySelector(selector);
  }

  addTask(name: string) {
    const task = new TaskWithStatus(name, 'active');
    this.tasks.push(task)
    this.render()
  }

  removeTask(id: number) {
    const tasks = []
    for (let task of this.tasks) {
      if (task.getId() !== id) {
        tasks.push(task)
      }
    }
    this.tasks = tasks
    this.render()
  }

  changeStatus(id: number, status: Status) {
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].getId() === id) {
        this.tasks[i].setStatus(status);
        this.render()
        return
      }
    }
  }

  render() {
    if (this.block) {
      let render = '<div>'
      for (let i = 0; i < this.tasks.length; i++) {
        const index = i + 1;
        const task = this.tasks[i]
        const negativeStatus = task.getStatus() === 'done' ? 'active' : 'done'
        render += `<div>
            ${index} ${task.getName()} 
            <button 
                id="task-checkbox"
                data-id="${task.getId()}"
                data-status="${negativeStatus}"
            >
                ${task.getStatus() === 'done' ? '✅' : '❌' }
            </button>
            <button id="task-button" data-id="${task.getId()}">
                Удалить
            </button>
          </div>`
      }
      render += '</div>'
      this.block.innerHTML = render
    }
  }
}

const taskList = new TaskList('#tasks')

const form: HTMLFormElement | null = document.querySelector('form')
form!.onsubmit = handleSubmit

function handleSubmit(event: SubmitEvent) {
  event.preventDefault();
  const formData = new FormData(form!)
  const name = formData.get('name');
  taskList.addTask(name as string);
}

function changeStatus(checkbox: HTMLButtonElement) {
  const id = +checkbox.getAttribute('data-id')!
  const status = checkbox.getAttribute('data-status')!
  taskList.changeStatus(id, status as Status)
}

function removeTask(button: HTMLButtonElement) {
  const id = +button.getAttribute('data-id')!
  taskList.removeTask(id)
}

document.addEventListener('click', (event)  => {
  if (event.target) {
    const id = (<HTMLElement>event.target)!.id
    switch (id) {
      case 'task-button':
        return removeTask(event.target as HTMLButtonElement)
      case 'task-checkbox':
        return changeStatus(event.target as HTMLButtonElement)
      default: return
    }
  }
})
