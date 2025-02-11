import { PartialType } from "@nestjs/mapped-types";
import { CreateEventDto } from "./calender.dto";

export class UpdateEventDto extends PartialType(CreateEventDto) {}