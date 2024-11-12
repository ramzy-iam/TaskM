import { NotFoundException } from '@nestjs/common';
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
        .spyOn(service as any, 'handleTasksOnProjectStatusChange')
        .mockResolvedValue(Promise<void>);

      const result = await service.updateProjectStatus(
        '1',
        ProjectStatusCode.IN_PROGRESS,
      );

      expect(result.status).toBe(ProjectStatusCode.IN_PROGRESS);
      expect(projectsRepository.save).toHaveBeenCalledWith(mockProject);
      expect(service['handleTasksOnProjectStatusChange']).toHaveBeenCalledWith(
        mockProject,
        ProjectStatusCode.IN_PROGRESS,
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
        .spyOn(service as any, 'handleProjectOnTaskStatusChange')
        .mockResolvedValue(Promise<void>);

      const result = await service.updateTaskStatus(
        '1',
        TaskStatusCode.IN_PROGRESS,
      );

      expect(result.status).toBe(TaskStatusCode.IN_PROGRESS);
      expect(tasksRepository.save).toHaveBeenCalledWith(mockTask);
      expect(service['handleProjectOnTaskStatusChange']).toHaveBeenCalledWith(
        mockTask,
      );
    });
  });

  describe('handleTasksOnProjectStatusChange', () => {
    it('should update the first "Not Started" task to "In Progress" when project status is IN_PROGRESS', async () => {
      const mockProject = { id: '1' } as Project;
      const mockTasks = [
        { id: '1', status: TaskStatusCode.NOT_STARTED },
        { id: '2', status: TaskStatusCode.IN_PROGRESS },
      ];
      jest
        .spyOn(tasksRepository.scoped, 'getMany')
        .mockResolvedValue(mockTasks as Task[]);
      jest
        .spyOn(tasksRepository, 'save')
        .mockResolvedValue(mockTasks[0] as Task);

      await service['handleTasksOnProjectStatusChange'](
        mockProject,
        ProjectStatusCode.IN_PROGRESS,
      );

      expect(tasksRepository.save).toHaveBeenCalledWith({
        id: '1',
        status: TaskStatusCode.IN_PROGRESS,
      });
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

      await service['handleTasksOnProjectStatusChange'](
        mockProject,
        ProjectStatusCode.WAITING_QA,
      );

      expect(service['createQATask']).toHaveBeenCalledWith(
        mockProject,
        mockLastTask,
      );
      expect(tasksRepository.save).toHaveBeenCalledWith(mockLastTask);
    });
  });

  describe('handleProjectOnTaskStatusChange', () => {
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

      await service['handleProjectOnTaskStatusChange'](mockTask);

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
