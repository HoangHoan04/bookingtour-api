import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { DestinationEntity } from '../blogs/destination.entity';
import { TourEntity } from './tour.entity';

@Entity('tour_destinations')
export class TourDestinationEntity extends BaseEntity {
  @ApiProperty({ description: 'Tour ID' })
  @Column({ type: 'uuid', nullable: true })
  tourId: string;

  @ApiProperty({ description: 'Tour' })
  @ManyToOne(() => TourEntity, (tour) => tour.tourDestinations)
  @JoinColumn({ name: 'tourId' })
  tour: TourEntity;

  @ApiProperty({ description: 'Destination ID' })
  @Column({ type: 'uuid', nullable: true })
  destinationId: string;

  @ApiProperty({ description: 'Destination' })
  @ManyToOne(() => DestinationEntity, (d) => d.tourDestinations)
  @JoinColumn({ name: 'destinationId' })
  destination: DestinationEntity;
}
