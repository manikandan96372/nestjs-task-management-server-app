import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTaskFiltersDto } from "./dto/get-task-filters.dto";
import { TaskStatus } from "./task-status.enum";
import { Tasks } from "./tasks.entity"

@EntityRepository(Tasks)
export class TaskRepository extends Repository<Tasks> {

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Tasks> {
        const { title, description } = createTaskDto
        const task = new Tasks()
        task.title = title
        task.description = description
        task.status = TaskStatus.OPEN
        task.user = user
        await task.save()
        delete task.user
        return task
    }

    async getTasks(filterDto: GetTaskFiltersDto, user: User): Promise<Tasks[]> {
        const { status, search } = filterDto
        const query = this.createQueryBuilder('task')
        query.where('task.userId = :userId', { userId: user.id })
        if(status) {
            query.andWhere('task.status = :status', { status })
        }
        if(search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%`})
        }
        const tasks = await query.getMany()
        return tasks
    }
}