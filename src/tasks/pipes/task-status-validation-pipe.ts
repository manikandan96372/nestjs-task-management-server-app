import { BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../task-status.enum";

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        TaskStatus.OPEN,
        TaskStatus.INPROGRESS,
        TaskStatus.DONE
    ]
    transform(status: any) {
        const value = status.toUpperCase()
        if(!this.isStatusValid(value)) {
            throw new BadRequestException()
        }
        return value
    }

    isStatusValid(status: any) {
        const index = this.allowedStatuses.indexOf(status)
        return index !== -1
    }
}