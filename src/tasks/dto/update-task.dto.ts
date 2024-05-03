import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max, IsIn } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({ description: 'Title of the task' })
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  title: string;

  @ApiProperty({ description: 'Description of the task' })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description: string;

  @ApiProperty({
    description: 'Priority of the task',
    enum: [0, 1, 2, 3, 4],
  })
  @IsOptional()
  @IsInt({ message: 'Priority must be an integer' })
  @Min(0, { message: 'Priority must be at least 0' })
  @Max(4, { message: 'Priority must be at most 4' })
  priority: number;

  @ApiProperty({
    description: 'Status of the task',
    enum: ['pending', 'in progress', 'completed'],
  })
  @IsOptional()
  @IsIn(['pending', 'in progress', 'completed'], {
    message: 'Status must be "pending", "in progress", or "completed"',
  })
  status: string;
}
