import { PartialType } from '@nestjs/swagger';
import { CreateTourItinerarieDto } from './create-tour-itinerarie.dto';

export class UpdateTourItinerarieDto extends PartialType(
  CreateTourItinerarieDto,
) {}
