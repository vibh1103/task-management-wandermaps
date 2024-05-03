import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseFilters,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ITask } from './interfaces/task.interface';
import { CreateTaskSchema, UpdateTaskSchema } from './tasks.validation-schema';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import * as Joi from 'joi';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: 201,
    description: 'The task has been successfully created.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Bad Request',
        error: 'Bad Request',
        errors: [],
      },
    },
  })
  @UseFilters(new HttpExceptionFilter())
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto): Promise<ITask> {
    try {
      await CreateTaskSchema.validateAsync(createTaskDto);
      return this.tasksService.create(createTaskDto);
    } catch (error) {
      throw new Joi.ValidationError(error.message, error.details, error);
    }
  }

  @ApiOperation({ summary: 'Retrieve all tasks' })
  @ApiResponse({ status: 200, description: 'List of all tasks.' })
  @ApiBadRequestResponse({
    description: 'Invalid input data.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Bad Request',
        error: 'Bad Request',
        errors: [],
      },
    },
  })
  @Get()
  async findAll(
    @Query('status') status?: string,
    @Query('priority') priority?: string,
  ): Promise<ITask[]> {
    return this.tasksService.findAll(status, priority);
  }

  @ApiOperation({ summary: 'Update an existing task' })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully updated.',
  })
  @ApiNotFoundResponse({
    description: 'Task not found.',
    schema: {
      example: { statusCode: 404, message: 'Not Found', error: 'Not Found' },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Bad Request',
        error: 'Bad Request',
        errors: [],
      },
    },
  })
  @UseFilters(new HttpExceptionFilter())
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<ITask> {
    try {
      await UpdateTaskSchema.validateAsync(updateTaskDto);
      return this.tasksService.update(id, updateTaskDto);
    } catch (error) {
      throw new Joi.ValidationError(error.message, error.details, error);
    }
  }

  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully deleted.',
  })
  @ApiNotFoundResponse({
    description: 'Task not found.',
    schema: {
      example: { statusCode: 404, message: 'Not Found', error: 'Not Found' },
    },
  })
  @UseFilters(new HttpExceptionFilter())
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.tasksService.delete(id);
  }
}
