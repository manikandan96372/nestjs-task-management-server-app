import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFiltersDto } from './dto/get-task-filters.dto'
import { TaskStatusValidationPipe } from './pipes/task-status-validation-pipe';
import { Tasks } from './tasks.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from '../auth/user.entity'

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(@Query(ValidationPipe) taskFilterSDto: GetTaskFiltersDto, @GetUser() user: User): Promise<Tasks[]> {
        return this.tasksService.getTasks(taskFilterSDto, user)
    }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<Tasks> {
        return this.tasksService.getTaskById(id, user)
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User ): Promise<Tasks> {
        return this.tasksService.createTask(createTaskDto, user)
    }

    @Delete('/:id')
    deleteTask(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
        return this.tasksService.deleteTask(id, user)
    }

    @Patch('/:id/status')
    updateTask(@Param('id', ParseIntPipe) id: number, @Body('status', TaskStatusValidationPipe) status: TaskStatus, @GetUser() user: User): Promise<Tasks> {
        return this.tasksService.updateTask(id, status, user)
    }
}
