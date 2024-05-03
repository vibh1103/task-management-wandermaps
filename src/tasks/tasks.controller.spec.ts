import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './tasks.entity';
import { DatabaseModule } from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([Task]), DatabaseModule],
      controllers: [TasksController],
      providers: [TasksService],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('should create a new task successfully', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'Description',
        priority: 1,
      };
      const createdTask: Task = {
        id: '1',
        status: 'pending',
        createdAt: new Date('2024-05-03 19:49:34'),
        updatedAt: new Date('2024-05-03 19:49:34'),
        ...createTaskDto,
      };

      jest.spyOn(service, 'create').mockResolvedValueOnce(createdTask);

      const result = await controller.create(createTaskDto);

      expect(result).toEqual(createdTask);
    });

    it('should throw an error for invalid input data', async () => {
      const invalidCreateTaskDto: CreateTaskDto = {
        title: '',
        description: 'Description',
        priority: 0,
      };

      await expect(controller.create(invalidCreateTaskDto)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should retrieve all tasks successfully', async () => {
      const tasks = [
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
          status: 'completed',
          createdAt: new Date('2024-05-03 19:49:34'),
          updatedAt: new Date('2024-05-03 19:49:34'),
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValueOnce(tasks);

      const result = await controller.findAll();

      expect(result).toEqual(tasks);
    });

    it('should retrieve filtered tasks successfully', async () => {
      const status = 'completed';
      const priority = 'high';
      const filteredTasks = [
        {
          id: '1',
          title: 'Task 1',
          description: 'Description 1',
          status: 'completed',
          priority: 1,
          createdAt: new Date('2024-05-03 19:49:34'),
          updatedAt: new Date('2024-05-03 19:49:34'),
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValueOnce(filteredTasks);

      const result = await controller.findAll(status, priority);

      expect(result).toEqual(filteredTasks);
    });
  });

  describe('update', () => {
    it('should update an existing task successfully', async () => {
      const taskId = '1';
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
        priority: 0,
        status: 'pending',
      };
      const updatedTask = {
        id: taskId,
        ...updateTaskDto,
        createdAt: new Date('2024-05-03 19:49:34'),
        updatedAt: new Date('2024-05-03 19:49:34'),
      };

      jest.spyOn(service, 'update').mockResolvedValueOnce(updatedTask);

      const result = await controller.update(taskId, updateTaskDto);

      expect(result).toEqual(updatedTask);
    });

    it('should throw an error for non-existent task', async () => {
      const nonExistentTaskId = '100';
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
        priority: 0,
        status: 'pending',
      };

      jest
        .spyOn(service, 'update')
        .mockRejectedValueOnce(new Error('Task not found'));

      await expect(
        controller.update(nonExistentTaskId, updateTaskDto),
      ).rejects.toThrow('Task not found');
    });

    it('should throw an error for invalid input data', async () => {
      const taskId = '1';
      const invalidUpdateTaskDto: UpdateTaskDto = {
        title: '',
        description: 'Updated Description',
        status: 'completed',
        priority: 1,
      };

      await expect(
        controller.update(taskId, invalidUpdateTaskDto),
      ).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete a task successfully', async () => {
      const taskId = '1';

      jest.spyOn(service, 'delete').mockResolvedValueOnce();

      const result = await controller.delete(taskId);

      expect(result).toBeUndefined();
    });

    it('should throw an error for non-existent task', async () => {
      const nonExistentTaskId = '100';

      jest
        .spyOn(service, 'delete')
        .mockRejectedValueOnce(new Error('Task not found'));

      await expect(controller.delete(nonExistentTaskId)).rejects.toThrow(
        'Task not found',
      );
    });
  });
});
