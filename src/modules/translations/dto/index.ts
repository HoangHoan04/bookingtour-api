export class CreateTranslationDto {
  key: string;
  en: string;
  vi: string;
}

export class UpdateTranslationDto extends CreateTranslationDto {
  id: string;
}
