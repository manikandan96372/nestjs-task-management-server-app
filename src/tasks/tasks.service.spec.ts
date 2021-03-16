import { Test } from '@nestjs/testing';
import { User } from 'src/auth/user.entity';
import { GetTaskFiltersDto } from './dto/get-task-filters.dto';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn()
})

const mockUser = { username: 'test', id: 1 }

describe('TasksService', () => {
    let tasksService;
    let taskRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTaskRepository },
            ],
        }).compile();

        tasksService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    });

    describe('getTasks', () => {
        it('gets all tasks from the repository', async () => {
            taskRepository.getTasks.mockResolvedValue('someValue');

            expect(taskRepository.getTasks).not.toHaveBeenCalled();
            const filters: GetTaskFiltersDto = { status: TaskStatus.INPROGRESS, search: 'Some search query' };
            const result = await tasksService.getTasks(filters, mockUser);
            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(result).toEqual('someValue');
        });
    });

    describe('getTaskById', () => {
        it('returns the task', async() => {
            const mockTask = { title : 'title', description : 'description'}
            taskRepository.findOne.mockResolvedValue(mockTask)
            const result = await tasksService.getTaskById(1, mockUser)
            expect(result).toEqual(mockTask)
        })

        it('throws exception on task not found', async() => {
            taskRepository.findOne.mockResolvedValue(null)
            expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow()
        })
    })

    describe('createTask', () => {
        it('creates and returns a task', async() => {
            const createTaskDto = { title : 'title', description : 'description'}
            expect(taskRepository.createTask).not.toHaveBeenCalled()
            taskRepository.createTask.mockResolvedValue('someValue')
            const result = await tasksService.createTask(createTaskDto, mockUser)
            expect(result).toEqual('someValue')
        })
    })

    describe('deleteTask', () => {
        it('deletes a task', async () => {
            expect(taskRepository.delete).not.toHaveBeenCalled()
            taskRepository.delete.mockResolvedValue({ affected : 1 })
            await tasksService.deleteTask(1, mockUser)
            expect(taskRepository.delete).toHaveBeenCalledWith({ id : 1, userId : mockUser.id })
        })

        it('throws exception', () => {
            taskRepository.delete.mockResolvedValue({ affected : 0 })
            expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow()
        })
    })

    describe('update task', () => {
        it('update a task status', async() => {
            tasksService.getTaskById = jest.fn().mockResolvedValue({
                save: jest.fn().mockResolvedValue(true),
                status: TaskStatus.OPEN
            })
            expect(tasksService.getTaskById).not.toHaveBeenCalled()
            await tasksService.updateTask(1, TaskStatus.OPEN, mockUser)

        })
    })

})