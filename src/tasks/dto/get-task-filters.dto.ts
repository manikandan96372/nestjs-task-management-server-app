import { IsIn, IsOptional } from "class-validator";
import { TaskStatus } from "../task-status.enum";

export class GetTaskFiltersDto {
    @IsOptional()
    search: string;

    @IsOptional()
    @IsIn([TaskStatus.OPEN, TaskStatus.INPROGRESS, TaskStatus.DONE])
    status: TaskStatus
}