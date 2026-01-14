import {
  ActionLogEntity,
  FileArchivalEntity,
  SettingStringEntity,
} from 'src/entities';
import { TranslationEntity } from 'src/entities/translation.entity';
import { CustomRepository } from 'src/typeorm';
import { Repository } from 'typeorm';

@CustomRepository(ActionLogEntity)
export class ActionLogRepository extends Repository<ActionLogEntity> {}

@CustomRepository(FileArchivalEntity)
export class FileArchivalRepository extends Repository<FileArchivalEntity> {}

@CustomRepository(TranslationEntity)
export class TranslationRepository extends Repository<TranslationEntity> {}

@CustomRepository(SettingStringEntity)
export class SettingStringRepository extends Repository<SettingStringEntity> {}
