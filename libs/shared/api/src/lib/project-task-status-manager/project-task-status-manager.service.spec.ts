import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  Competence,
  CompetencesRepository,
  Project,
  ProjectsRepository,
  Task,
  TasksRepository,
} from '@TaskM/core/db';
import { ProjectTaskStatusManagerService } from './project-task-status-manager.service';
import {
  ProjectStatus,
  ProjectStatusCode,
  TaskStatusCode,
  TaskTypeCode,
} from '@TaskM/core/constants';

describe('ProjectTaskStatusManagerService', () => {
  let service: ProjectTaskStatusManagerService;
  let projectsRepository: ProjectsRepository;
  let tasksRepository: TasksRepository;
  let competencesRepository: CompetencesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectTaskStatusManagerService,
        {
          provide: ProjectsRepository,
          useValue: {
            scoped: {
              filterById: jest.fn().mockReturnThis(),
              getOne: jest.fn(),
            },
            save: jest.fn(),
          },
        },
        {
          provide: TasksRepository,
          useValue: {
            scoped: {
              filterById: jest.fn().mockReturnThis(),
              filterByProjectId: jest.fn().mockReturnThis(),
              filterByStatus: jest.fn().mockReturnThis(),
              getOne: jest.fn(),
              getMany: jest.fn(),
              getCount: jest.fn(),
              order: jest.fn().mockReturnThis(),
            },
            save: jest.fn(),
          },
        },
        {
          provide: CompetencesRepository,
          useValue: {
            scoped: {
              filterByServiceProviderId: jest.fn().mockReturnThis(),
              filterByCode: jest.fn().mockReturnThis(),
              getOneOrFail: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ProjectTaskStatusManagerService>(
      ProjectTaskStatusManagerService,
    );
    projectsRepository = module.get<ProjectsRepository>(ProjectsRepository);
    tasksRepository = module.get<TasksRepository>(TasksRepository);
    competencesRepository = module.get<CompetencesRepository>(
      CompetencesRepository,
    );
  });

  describe('updateProjectStatus', () => {
    it('should throw NotFoundException if project is not found', async () => {
      jest.spyOn(projectsRepository.scoped, 'getOne').mockResolvedValue(null);

      await expect(
        service.updateProjectStatus(
          'invalid-id',
          ProjectStatusCode.IN_PROGRESS,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update the project status and propagate to tasks', async () => {
      const mockProject = {
        id: '1',
        status: ProjectStatusCode.NOT_STARTED,
      } as Project;
      jest
        .spyOn(projectsRepository.scoped, 'getOne')
        .mockResolvedValue(mockProject);
      jest.spyOn(projectsRepository, 'save').mockResolvedValue(mockProject);
      jest
        .spyOn(service as any, 'updateTasksStatusOnProjectStatusChange')
        .mockResolvedValue(Promise<void>);

      const result = await service.updateProjectStatus(
        '1',
        ProjectStatusCode.IN_PROGRESS,
      );

      expect(result.status).toBe(ProjectStatusCode.IN_PROGRESS);
      expect(projectsRepository.save).toHaveBeenCalledWith(mockProject);
      expect(
        service['updateTasksStatusOnProjectStatusChange'],
      ).toHaveBeenCalledWith(mockProject, ProjectStatusCode.IN_PROGRESS);
    });

    it('should throw BadRequestException if trying to change to "QAing" but project is not "Waiting QA"', async () => {
      const mockProject = {
        id: '1',
        status: ProjectStatusCode.IN_PROGRESS, // Current status is not "Waiting QA"
      } as Project;

      jest
        .spyOn(projectsRepository.scoped, 'getOne')
        .mockResolvedValue(mockProject);

      await expect(
        service.updateProjectStatus(mockProject.id, ProjectStatusCode.QA_ING),
      ).rejects.toThrow(
        new BadRequestException(
          `Cannot set status to "${ProjectStatus.QA_ING}" unless the current status is "${ProjectStatus.WAITING_QA}".`,
        ),
      );
    });

    it('should throw BadRequestException if trying to change to "In Progress" but project is not "Not Started" or "On Hold"', async () => {
      const mockProject = {
        id: '1',
        status: ProjectStatusCode.DELIVERED, // Current status is not "Not Started" or "On Hold"
      } as Project;

      jest
        .spyOn(projectsRepository.scoped, 'getOne')
        .mockResolvedValue(mockProject);

      await expect(
        service.updateProjectStatus(
          mockProject.id,
          ProjectStatusCode.IN_PROGRESS,
        ),
      ).rejects.toThrow(
        new BadRequestException(
          `Cannot set status to "${ProjectStatus.IN_PROGRESS}" unless the current status is "${ProjectStatus.NOT_STARTED}" or "${ProjectStatus.ON_HOLD}".`,
        ),
      );
    });

    it('should throw BadRequestException if trying to change to "Delivered" but project is not "QAing"', async () => {
      const mockProject = {
        id: '1',
        status: ProjectStatusCode.IN_PROGRESS, // Current status is not "QAing"
      } as Project;

      jest
        .spyOn(projectsRepository.scoped, 'getOne')
        .mockResolvedValue(mockProject);

      await expect(
        service.updateProjectStatus(
          mockProject.id,
          ProjectStatusCode.DELIVERED,
        ),
      ).rejects.toThrow(
        new BadRequestException(
          `cannot set status to "${ProjectStatus.DELIVERED}" unless the current status is "${ProjectStatus.QA_ING}".`,
        ),
      );
    });

    it('should throw BadRequestException if trying to change to "Approved" but project is not "Delivered"', async () => {
      const mockProject = {
        id: '1',
        status: ProjectStatusCode.QA_ING, // Current status is not "Delivered"
      } as Project;

      jest
        .spyOn(projectsRepository.scoped, 'getOne')
        .mockResolvedValue(mockProject);

      await expect(
        service.updateProjectStatus(mockProject.id, ProjectStatusCode.APPROVED),
      ).rejects.toThrow(
        new BadRequestException(
          `cannot set status to "${ProjectStatus.APPROVED}" unless the current status is "${ProjectStatus.DELIVERED}".`,
        ),
      );
    });
  });

  describe('updateTaskStatus', () => {
    it('should throw NotFoundException if task is not found', async () => {
      jest.spyOn(tasksRepository.scoped, 'getOne').mockResolvedValue(null);

      await expect(
        service.updateTaskStatus('invalid-task-id', TaskStatusCode.COMPLETED),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update the task status and propagate changes to the project', async () => {
      const mockTask = {
        id: '1',
        projectId: '1',
        status: TaskStatusCode.NOT_STARTED,
      } as Task;
      jest.spyOn(tasksRepository.scoped, 'getOne').mockResolvedValue(mockTask);
      jest.spyOn(tasksRepository, 'save').mockResolvedValue(mockTask);
      jest
        .spyOn(service as any, 'updateProjectStatusOnTaskStatusChange')
        .mockResolvedValue(Promise<void>);

      const result = await service.updateTaskStatus(
        '1',
        TaskStatusCode.IN_PROGRESS,
      );

      expect(result.status).toBe(TaskStatusCode.IN_PROGRESS);
      expect(tasksRepository.save).toHaveBeenCalledWith(mockTask);
      expect(
        service['updateProjectStatusOnTaskStatusChange'],
      ).toHaveBeenCalledWith(mockTask);
    });
  });

  describe('updateTasksStatusOnProjectStatusChange', () => {
    it('should throw NotFoundException if project is not found', async () => {
      jest.spyOn(projectsRepository.scoped, 'getOne').mockResolvedValue(null);

      await expect(
        service.updateProjectStatus(
          'invalid-id',
          ProjectStatusCode.IN_PROGRESS,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update tasks to "Not Started" except "Cancelled" if the project status is "Not Started"', async () => {
      // Arrange: Mock project and task data
      const mockProject = {
        id: '1',
        status: ProjectStatusCode.IN_PROGRESS,
      } as Project;

      const mockTasks = [
        {
          id: '1',
          status: TaskStatusCode.CANCELLED, // Should remain unchanged
          projectId: '1',
        },
        {
          id: '2',
          status: TaskStatusCode.IN_PROGRESS, // Should be updated to NOT_STARTED
          projectId: '1',
        },
        {
          id: '3',
          status: TaskStatusCode.ON_HOLD, // Should be updated to NOT_STARTED
          projectId: '1',
        },
      ] as Task[];

      // Mock repository methods
      jest
        .spyOn(tasksRepository.scoped, 'getMany')
        .mockResolvedValue(mockTasks);

      // Mock the save method to return the updated task
      const saveTaskSpy = jest
        .spyOn(tasksRepository, 'save')
        .mockResolvedValue({} as Task);

      await service['updateTasksStatusOnProjectStatusChange'](
        mockProject,
        ProjectStatusCode.NOT_STARTED,
      );

      // Assert: Verify that the first task (id: '2') was updated to NOT_STARTED
      expect(saveTaskSpy).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          id: '2',
          status: TaskStatusCode.NOT_STARTED,
        }),
      );

      // Assert: Verify that the second task (id: '3') was updated to NOT_STARTED
      expect(saveTaskSpy).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          id: '3',
          status: TaskStatusCode.NOT_STARTED,
        }),
      );

      // Assert: Verify that the first task (id: '1') remains CANCELLED
      expect(mockTasks[0].status).toBe(TaskStatusCode.CANCELLED);

      // Assert: Verify that the second and third tasks have been updated to NOT_STARTED
      expect(mockTasks[1].status).toBe(TaskStatusCode.NOT_STARTED);
      expect(mockTasks[2].status).toBe(TaskStatusCode.NOT_STARTED);

      // Ensure save was called twice (since only tasks 2 and 3 should be updated)
      expect(saveTaskSpy).toHaveBeenCalledTimes(2);
    });
    it('should mark the first task as "In Progress" if the project status is "In Progress"', async () => {
      // Arrange: Mock project and task data
      const mockProject = {
        id: '1',
        status: ProjectStatusCode.NOT_STARTED,
      } as Project;

      const firstTask = {
        id: '2',
        status: TaskStatusCode.NOT_STARTED, // Should be updated to NOT_STARTED
        projectId: '1',
        createdAt: new Date('2023-01-01'),
      };
      const secondTask = {
        id: '1',
        status: TaskStatusCode.NOT_STARTED, // Should remain unchanged
        projectId: '1',
        createdAt: new Date('2023-01-02'),
      };

      const mockTasks = [secondTask, firstTask] as Task[];

      // Mock repository methods
      jest
        .spyOn(tasksRepository.scoped, 'getMany')
        .mockResolvedValue(
          mockTasks.sort(
            (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
          ),
        );

      // Mock the save method to return the updated task
      const saveTaskSpy = jest
        .spyOn(tasksRepository, 'save')
        .mockResolvedValue({} as Task);

      await service['updateTasksStatusOnProjectStatusChange'](
        mockProject,
        ProjectStatusCode.IN_PROGRESS,
      );

      // Assert: Verify that the first task  was updated to IN_PROGRESS
      expect(saveTaskSpy).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          id: firstTask.id,
          status: TaskStatusCode.IN_PROGRESS,
        }),
      );

      // Assert: Verify that the second task  remains NOT_STARTED
      expect(secondTask?.status).toBe(TaskStatusCode.NOT_STARTED);

      // Ensure save was called once
      expect(saveTaskSpy).toHaveBeenCalledTimes(1);
    });

    it('should create and save a QA task when project status is WAITING_QA', async () => {
      const mockProject = { id: '1' } as Project;
      const mockLastTask = { id: '2', type: TaskTypeCode.TRA };
      jest
        .spyOn(tasksRepository.scoped, 'getMany')
        .mockResolvedValue([mockLastTask] as Task[]);
      jest
        .spyOn(service as any, 'createQATask')
        .mockResolvedValue(mockLastTask);
      jest
        .spyOn(tasksRepository, 'save')
        .mockResolvedValue(mockLastTask as Task);

      await service['updateTasksStatusOnProjectStatusChange'](
        mockProject,
        ProjectStatusCode.WAITING_QA,
      );

      expect(service['createQATask']).toHaveBeenCalledWith(
        mockProject,
        mockLastTask,
      );
      expect(tasksRepository.save).toHaveBeenCalledWith(mockLastTask);
    });

    it('should mark QA task as "In Progress" if the project status is "QAing"', async () => {
      const mockTask = {
        id: '1',
        projectId: '1',
        type: TaskTypeCode.QA,
        status: TaskStatusCode.NOT_STARTED,
      } as Task;
      const mockProject = {
        id: '1',
        status: ProjectStatusCode.WAITING_QA,
      } as Project;

      jest
        .spyOn(tasksRepository.scoped, 'getMany')
        .mockResolvedValue([mockTask] as Task[]);
      jest.spyOn(service as any, 'createQATask').mockResolvedValue(mockTask);
      jest.spyOn(tasksRepository, 'save').mockResolvedValue(mockTask as Task);

      await service['updateTasksStatusOnProjectStatusChange'](
        mockProject,
        ProjectStatusCode.QA_ING,
      );

      expect(tasksRepository.save).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          id: mockTask.id,
          status: TaskStatusCode.IN_PROGRESS,
        }),
      );
    });

    it('should mark "On Hold" and "Not Started" tasks as "Cancelled" if  the project status is "Delivered"', async () => {
      const onHoldTask = {
        id: '1',
        projectId: '1',
        status: TaskStatusCode.ON_HOLD,
      } as Task;
      const notStartedTask = {
        id: '2',
        projectId: '1',
        status: TaskStatusCode.NOT_STARTED,
      } as Task;

      const inProgressTask = {
        id: '3',
        projectId: '1',
        status: TaskStatusCode.IN_PROGRESS,
      } as Task;

      const completedTask = {
        id: '4',
        projectId: '1',
        status: TaskStatusCode.COMPLETED,
      };

      const mockTasks = [
        onHoldTask,
        notStartedTask,
        inProgressTask,
        completedTask,
      ] as Task[];
      const mockProject = {
        id: '1',
        status: ProjectStatusCode.QA_ING,
      } as Project;

      jest
        .spyOn(tasksRepository.scoped, 'getMany')
        .mockResolvedValue(mockTasks);

      await service['updateTasksStatusOnProjectStatusChange'](
        mockProject,
        ProjectStatusCode.DELIVERED,
      );

      expect(tasksRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: onHoldTask.id,
          status: TaskStatusCode.CANCELLED,
        }),
      );

      expect(tasksRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: notStartedTask.id,
          status: TaskStatusCode.CANCELLED,
        }),
      );

      expect(inProgressTask.status).toBe(TaskStatusCode.IN_PROGRESS);
      expect(completedTask.status).toBe(TaskStatusCode.COMPLETED);
      expect(notStartedTask.status).toBe(TaskStatusCode.CANCELLED);
      expect(onHoldTask.status).toBe(TaskStatusCode.CANCELLED);
    });

    it('should mark tasks as "Cancelled" except "Completed" tasks if the project status is "Cancelled"', async () => {
      const completedTask = {
        id: '1',
        projectId: '1',
        status: TaskStatusCode.COMPLETED,
      } as Task;
      const mockTasks = [
        completedTask,
        {
          id: '2',
          projectId: '1',
          status: TaskStatusCode.NOT_STARTED,
        },
        {
          id: '3',
          projectId: '1',
          status: TaskStatusCode.IN_PROGRESS,
        },
        {
          id: '4',
          projectId: '1',
          status: TaskStatusCode.ON_HOLD,
        },
      ] as Task[];

      const mockProject = {
        id: '1',
        status: ProjectStatusCode.IN_PROGRESS,
      } as Project;

      jest
        .spyOn(tasksRepository.scoped, 'getMany')
        .mockResolvedValue(mockTasks);

      await service['updateTasksStatusOnProjectStatusChange'](
        mockProject,
        ProjectStatusCode.CANCELLED,
      );

      expect(tasksRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockTasks[1].id,
          status: TaskStatusCode.CANCELLED,
        }),
      );

      expect(tasksRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockTasks[2].id,
          status: TaskStatusCode.CANCELLED,
        }),
      );

      expect(tasksRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockTasks[3].id,
          status: TaskStatusCode.CANCELLED,
        }),
      );

      expect(completedTask.status).toBe(TaskStatusCode.COMPLETED);
    });

    it('should only mark "In Progress" and "Not Started" tasks as "On Hold" if the project status is "On Hold"', async () => {
      const inProgressTask = {
        id: '1',
        projectId: '1',
        status: TaskStatusCode.IN_PROGRESS,
      } as Task;
      const notStartedTask = {
        id: '2',
        projectId: '1',
        status: TaskStatusCode.NOT_STARTED,
      } as Task;
      const completedTask = {
        id: '3',
        projectId: '1',
        status: TaskStatusCode.COMPLETED,
      } as Task;
      const cancelledTask = {
        id: '4',
        projectId: '1',
        status: TaskStatusCode.CANCELLED,
      } as Task;

      const mockTasks = [
        inProgressTask,
        notStartedTask,
        completedTask,
        cancelledTask,
      ] as Task[];
      const mockProject = {
        id: '1',
        status: ProjectStatusCode.IN_PROGRESS,
      } as Project;

      jest
        .spyOn(tasksRepository.scoped, 'getMany')
        .mockResolvedValue(mockTasks);

      await service['updateTasksStatusOnProjectStatusChange'](
        mockProject,
        ProjectStatusCode.ON_HOLD,
      );

      expect(tasksRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: inProgressTask.id,
          status: TaskStatusCode.ON_HOLD,
        }),
      );

      expect(tasksRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: notStartedTask.id,
          status: TaskStatusCode.ON_HOLD,
        }),
      );

      expect(completedTask.status).toBe(TaskStatusCode.COMPLETED);
      expect(cancelledTask.status).toBe(TaskStatusCode.CANCELLED);
    });
  });

  describe('updateProjectStatusOnTaskStatusChange', () => {
    it('should update the project status to "Waiting QA" if all tasks are completed', async () => {
      const mockTask = {
        projectId: '1',
        status: TaskStatusCode.COMPLETED,
      } as Task;
      const mockProject = {
        id: '1',
        status: ProjectStatusCode.IN_PROGRESS,
      } as Project;
      jest
        .spyOn(projectsRepository.scoped, 'getOne')
        .mockResolvedValue(mockProject);
      jest.spyOn(tasksRepository.scoped, 'getCount').mockResolvedValue(0);
      jest.spyOn(projectsRepository, 'save').mockResolvedValue(mockProject);

      await service['updateProjectStatusOnTaskStatusChange'](mockTask);

      expect(projectsRepository.save).toHaveBeenCalledWith({
        ...mockProject,
        status: ProjectStatusCode.WAITING_QA,
      });
    });
  });

  describe('createQATask', () => {
    it('should create a new QA task', async () => {
      const mockProject = {
        id: '1',
        count: 2,
        unit: 'page',
        lang: 'En',
      } as Project;
      const mockLastTask = { id: '2', serviceProviderId: '3' } as Task;
      const mockRate = { id: 'rate-1' } as Competence;
      jest
        .spyOn(competencesRepository.scoped, 'getOneOrFail')
        .mockResolvedValue(mockRate);

      const result = await service['createQATask'](mockProject, mockLastTask);

      expect(result.type).toBe(TaskTypeCode.QA);
      expect(result.status).toBe(TaskStatusCode.NOT_STARTED);
      expect(result.rateId).toBe(mockRate.id);
    });
  });
});
