import { PartialType } from '@nestjs/swagger';
import { CreateTourPriceDto } from './create-tour-price.dto';

export class UpdateTourPriceDto extends PartialType(CreateTourPriceDto) {}
