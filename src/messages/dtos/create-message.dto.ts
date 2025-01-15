import { Exclude, Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  readonly text: string;

  @IsString()
  @IsNotEmpty()
  readonly from: string;

  @IsString()
  @IsNotEmpty()
  readonly to: string;

  @Exclude() // Ignora qualquer valor enviado para `data`
  @Transform(() => new Date(), { toClassOnly: true })
  readonly data?: Date;
}
