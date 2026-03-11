import { PartialType } from '@nestjs/swagger';
import { CreateTourDetailDto } from './create-tour-detail.dto';

export class UpdateTourDetailDto extends PartialType(CreateTourDetailDto) {}
