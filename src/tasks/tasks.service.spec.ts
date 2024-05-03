import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { Task } from './tasks.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TasksService', () => {
  let service: TasksService;
  let repository: Repository<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto = {
        title: 'New Task',
        description: 'Description',
        priority: 1,
        status: 'pending',
        createdAt: new Date('2024-05-03 19:49:34'),
        updatedAt: new Date('2024-05-03 19:49:34'),
      };
      const task = new Task();
      Object.assign(task, createTaskDto);

      jest.spyOn(repository, 'create').mockReturnValue(task);
      jest.spyOn(repository, 'save').mockResolvedValue(task);

      const result = await service.create(createTaskDto);

      expect(result).toEqual(task);
    });
  });

  describe('findAll', () => {
    it('should retrieve all tasks', async () => {
      const tasks: Task[] = [
        {
          id: '1',
          title: 'Task 1',
          description: 'Description 1',
          priority: 0,
          status: 'pending',
          createdAt: new Date('2024-05-03 19:49:34'),
          updatedAt: new Date('2024-05-03 19:49:34'),
        },
        {
          id: '2',
          title: 'Task 2',
          description: 'Description 2',
          priority: 0,
          status: 'pending',
          createdAt: new Date('2024-05-03 19:49:34'),
          updatedAt: new Date('2024-05-03 19:49:34'),
        },
      ];

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(tasks),
      } as any);

      const result = await service.findAll();

      expect(result).toEqual(tasks);
    });

    it('should retrieve filtered tasks', async () => {
      const status = 'completed';
      const priority = 'high';
      const filteredTasks: Task[] = [
        {
          id: '1',
          title: 'Task 1',
          description: 'Description 1',
          status: 'completed',
          priority: 3,
          createdAt: new Date('2024-05-03 19:49:34'),
          updatedAt: new Date('2024-05-03 19:49:34'),
        },
      ];

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(filteredTasks),
      } as any);

      const result = await service.findAll(status, priority);

      expect(result).toEqual(filteredTasks);
    });
  });

  describe('findById', () => {
    it('should retrieve a task by ID', async () => {
      const taskId = '1';
      const task = new Task();
      task.id = taskId;

      jest.spyOn(repository, 'findOne').mockResolvedValue(task);

      const result = await service.findById(taskId);

      expect(result).toEqual(task);
    });

    it('should throw NotFoundException if task is not found', async () => {
      const nonExistentTaskId = '100';

      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      await expect(service.findById(nonExistentTaskId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update an existing task', async () => {
      const taskId = '1';
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
        priority: 0,
        status: 'pending',
      };
      const task = new Task();
      task.id = taskId;

      jest.spyOn(service, 'findById').mockResolvedValue(task);
      jest.spyOn(repository, 'save').mockResolvedValue(task);

      const result = await service.update(taskId, updateTaskDto);

      expect(result).toEqual(task);
      expect(task.title).toEqual(updateTaskDto.title);
      expect(task.description).toEqual(updateTaskDto.description);
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      const taskId = '1';
      const task = new Task();
      task.id = taskId;

      jest.spyOn(service, 'findById').mockResolvedValue(task);
      jest.spyOn(repository, 'remove').mockResolvedValue(undefined);

      const result = await service.delete(taskId);

      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException if task is not found', async () => {
      const nonExistentTaskId = '100';

      jest
        .spyOn(service, 'findById')
        .mockRejectedValue(new NotFoundException());

      await expect(service.delete(nonExistentTaskId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
