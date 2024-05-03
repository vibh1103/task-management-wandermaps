import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ description: 'Title of the task' })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @ApiProperty({ description: 'Description of the task' })
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
}
