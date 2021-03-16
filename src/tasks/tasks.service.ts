import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFiltersDto } from './dto/get-task-filters.dto';
import { TaskStatus } from './task-status.enum';
import { Tasks } from './tasks.entity';
import { TaskRepository } from './tasks.repository';

@Injectable()
export class TasksService {
    constructor(@InjectRepository(TaskRepository) private taskRepository: TaskRepository) {}

    async getTasks(filterDto: GetTaskFiltersDto, user: User): Promise<Tasks[]> {
        return this.taskRepository.getTasks(filterDto, user)
    }

    async getTaskById(id: number, user: User): Promise<Tasks> {
        const found = await this.taskRepository.findOne({ where: { id, userId: user.id } } )
        if(!found) {
            throw new NotFoundException()
        }
        return found
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Tasks> {
        return this.taskRepository.createTask(createTaskDto, user)
    }

    async deleteTask(id: number, user: User): Promise<void> {
        const result = await this.taskRepository.delete({ id, userId: user.id })
        if(result.affected === 0) {
            throw new NotFoundException()
        }
    }

    async updateTask(id: number, status: TaskStatus, user: User): Promise<Tasks> {
        const task = await this.getTaskById(id, user)
        task.status = status
        await task.save()
        return task
    }
}
