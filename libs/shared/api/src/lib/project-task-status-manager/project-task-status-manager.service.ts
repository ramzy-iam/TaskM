import {
  ProjectStatus,
  ProjectStatusCode,
  TaskDateFilterField,
  TaskStatusCode,
  TaskTypeCode,
} from '@TaskM/core/constants';
import {
  CompetencesRepository,
  Project,
  ProjectsRepository,
  Task,
  TasksRepository,
} from '@TaskM/core/db';
import { DayjsHelper } from '@TaskM/core/helpers';
import {
  BadRequestException,
  Global,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Global()
@Injectable()
export class ProjectTaskStatusManagerService {
  constructor(
    private projectsRepository: ProjectsRepository,
    private tasksRepository: TasksRepository,
    private competencesRepository: CompetencesRepository,
  ) {}

  /**
   * Update the status of a project and propagate changes to related tasks.
   */
  async updateProjectStatus(
    projectId: string,
    newStatus: ProjectStatusCode,
  ): Promise<Project> {
    const project = await this.projectsRepository.scoped
      .filterById(projectId)
      .getOne();
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    const oldStatus = project.status;

    if (newStatus === oldStatus) return project;
    this.validateProjectStatusBeforeUpdate(oldStatus, newStatus);

    // Update the project status
    project.status = newStatus;
    await this.projectsRepository.save(project);

    // Handle task status updates based on the new project status
    await this.updateTasksStatusOnProjectStatusChange(project, newStatus);

    return project;
  }

  private validateProjectStatusBeforeUpdate(
    oldStatus: ProjectStatusCode,
    newStatus: ProjectStatusCode,
  ) {
    // Cannot change to "QAing" unless the project is "Waiting QA"
    if (
      newStatus === ProjectStatusCode.QA_ING &&
      oldStatus !== ProjectStatusCode.WAITING_QA
    ) {
      throw new BadRequestException(
        `Cannot set status to "${ProjectStatus.QA_ING}" unless the current status is "${ProjectStatus.WAITING_QA}".`,
      );
    }

    // Cannot change to "In Progress" unless the project is "Not Started" or "On Hold"
    if (
      newStatus === ProjectStatusCode.IN_PROGRESS &&
      oldStatus !== ProjectStatusCode.NOT_STARTED &&
      oldStatus !== ProjectStatusCode.ON_HOLD
    ) {
      throw new BadRequestException(
        `Cannot set status to "${ProjectStatus.IN_PROGRESS}" unless the current status is "${ProjectStatus.NOT_STARTED}" or "${ProjectStatus.ON_HOLD}".`,
      );
    }

    // Cannot change to "Delivered" unless the project is "QAing"
    if (
      newStatus === ProjectStatusCode.DELIVERED &&
      oldStatus !== ProjectStatusCode.QA_ING
    ) {
      throw new BadRequestException(
        `cannot set status to "${ProjectStatus.DELIVERED}" unless the current status is "${ProjectStatus.QA_ING}".`,
      );
    }

    // Cannot change to "Approved" unless the project is "Delivered"
    if (
      newStatus === ProjectStatusCode.APPROVED &&
      oldStatus !== ProjectStatusCode.DELIVERED
    ) {
      throw new BadRequestException(
        `cannot set status to "${ProjectStatus.APPROVED}" unless the current status is "${ProjectStatus.DELIVERED}".`,
      );
    }
  }

  /**
   * Update the status of a task and propagate changes to the project if necessary.
   */
  async updateTaskStatus(
    taskId: string,
    newStatus: TaskStatusCode,
  ): Promise<Task> {
    const task = await this.tasksRepository.scoped.filterById(taskId).getOne();
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Update the task status
    task.status = newStatus;
    await this.tasksRepository.save(task);

    // Check if the task status change should trigger a project status change
    await this.updateProjectStatusOnTaskStatusChange(task);

    return task;
  }

  /**
   * Handle task status updates when a project status changes.
   */
  private async updateTasksStatusOnProjectStatusChange(
    project: Project,
    newStatus: ProjectStatusCode,
  ): Promise<void> {
    const tasks = await this.tasksRepository.scoped
      .filterByProjectId(project.id)
      .order(TaskDateFilterField.CREATED_AT, 'ASC')
      .getMany();

    switch (newStatus) {
      case ProjectStatusCode.NOT_STARTED:
        // Mark all except "Cancelled" tasks as "Not Started"
        await this.updateTaskStatuses(tasks, [], TaskStatusCode.NOT_STARTED, [
          TaskStatusCode.CANCELLED,
        ]);
        break;
      case ProjectStatusCode.IN_PROGRESS:
        // Mark the first task as 'In Progress'
        const firstTask = tasks.find(
          (task) => task.status === TaskStatusCode.NOT_STARTED,
        );
        if (firstTask) {
          firstTask.status = TaskStatusCode.IN_PROGRESS;
          await this.tasksRepository.save(firstTask);
        }
        break;
      case ProjectStatusCode.WAITING_QA:
        // Create a new QA task and mark it as 'Not Started'
        const qaTask = await this.createQATask(project, tasks.at(-1) as Task);
        await this.tasksRepository.save(qaTask);
        break;
      case ProjectStatusCode.QA_ING:
        // Mark the QA task as 'In Progress'
        const qaInProgressTask = tasks.find(
          (task) => task.type === TaskTypeCode.QA,
        );
        if (qaInProgressTask) {
          qaInProgressTask.status = TaskStatusCode.IN_PROGRESS;
          await this.tasksRepository.save(qaInProgressTask);
        }
        break;
      case ProjectStatusCode.DELIVERED:
        // Cancel all tasks that are "Not Started" or "On Hold"
        await this.updateTaskStatuses(
          tasks,
          [TaskStatusCode.NOT_STARTED, TaskStatusCode.ON_HOLD],
          TaskStatusCode.CANCELLED,
        );
        break;
      case ProjectStatusCode.APPROVED:
        // Mark all "In Progress" tasks as "Completed" and "On Hold" or "Not Started" tasks as "Cancelled"
        await this.updateTaskStatuses(
          tasks,
          [TaskStatusCode.IN_PROGRESS],
          TaskStatusCode.COMPLETED,
        );
        await this.updateTaskStatuses(
          tasks,
          [TaskStatusCode.NOT_STARTED, TaskStatusCode.ON_HOLD],
          TaskStatusCode.CANCELLED,
        );
        break;
      case ProjectStatusCode.CANCELLED:
        // Cancel all non-completed tasks
        await this.updateTaskStatuses(
          tasks,
          [
            TaskStatusCode.NOT_STARTED,
            TaskStatusCode.IN_PROGRESS,
            TaskStatusCode.ON_HOLD,
          ],
          TaskStatusCode.CANCELLED,
        );
        break;
      case ProjectStatusCode.ON_HOLD:
        // Put all "Not Started" and "In Progress" tasks on hold
        await this.updateTaskStatuses(
          tasks,
          [TaskStatusCode.NOT_STARTED, TaskStatusCode.IN_PROGRESS],
          TaskStatusCode.ON_HOLD,
        );
        break;
      default:
        break;
    }
  }

  /**
   * Handle project status updates when a task status changes.
   */
  private async updateProjectStatusOnTaskStatusChange(
    task: Task,
  ): Promise<void> {
    const project = await this.projectsRepository.scoped
      .filterById(task.projectId)
      .getOne();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (task.status === TaskStatusCode.COMPLETED) {
      // Check if all tasks are completed, if so mark the project as "Waiting QA"
      const remainingTasks = await this.tasksRepository.scoped
        .filterByProjectId(project.id)
        .filterByStatus([TaskStatusCode.COMPLETED], true)
        .getCount();

      if (remainingTasks === 0) {
        project.status = ProjectStatusCode.WAITING_QA;
        await this.projectsRepository.save(project);
      }
    } else if (
      task.status === TaskStatusCode.IN_PROGRESS &&
      project.status === ProjectStatusCode.NOT_STARTED
    ) {
      // If a task is marked "In Progress" and the project is "Not Started", mark the project as "In Progress"
      project.status = ProjectStatusCode.IN_PROGRESS;
      await this.projectsRepository.save(project);
    }

    if (task.status === TaskStatusCode.NOT_STARTED) {
      // Check if all other tasks are not "In Progress" or "On Hold"
      const otherTasksInInvalidStatuses = await this.tasksRepository.scoped
        .filterByProjectId(project.id)
        .filterByStatus(
          [
            TaskStatusCode.IN_PROGRESS,
            TaskStatusCode.ON_HOLD,
            TaskStatusCode.NOT_STARTED,
          ],
          true,
        )
        .getCount();

      // If no tasks are "In Progress" or "On Hold", set project status to "Not Started"
      if (otherTasksInInvalidStatuses === 0) {
        project.status = ProjectStatusCode.NOT_STARTED;
        await this.projectsRepository.save(project);
      }
    }
  }

  /**
   * Helper method to update task statuses based on conditions.
   */
  async updateTaskStatuses(
    tasks: Task[],
    fromStatuses: TaskStatusCode[],
    toStatus: TaskStatusCode,
    exceptStatuses: TaskStatusCode[] = [],
  ): Promise<void> {
    const fromStatusesLength = fromStatuses.length;

    const tasksToUpdate = tasks.filter(
      (task) =>
        !exceptStatuses.includes(task.status) &&
        (fromStatusesLength === 0 || fromStatuses.includes(task.status)),
    );
    await Promise.all(
      tasksToUpdate.map(async (task) => {
        task.status = toStatus;
        return await this.tasksRepository.save(task);
      }),
    );
  }

  /**
   * Helper method to create a QA task for a project.
   */
  private async createQATask(project: Project, lastTask: Task): Promise<Task> {
    let task = new Task();

    const rate = await this.competencesRepository.scoped
      .filterByServiceProviderId(task.serviceProviderId)
      .filterByCode(TaskTypeCode.QA)
      .getOneOrFail();

    task = {
      ...lastTask,
      type: TaskTypeCode.QA,
      status: TaskStatusCode.NOT_STARTED,
      assignedAt: DayjsHelper.new().toDate(),
      deadline: DayjsHelper.new().add(1, 'day').toDate(),
      count: project.count,
      unit: project.unit,
      lang: project.lang,
      rateId: rate.id,
      deliveredAt: null,
    };

    return task;
  }
}
