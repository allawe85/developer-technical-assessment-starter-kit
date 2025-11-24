import { IsNotEmpty, IsString, IsUUID, IsIn, IsOptional } from 'class-validator';

export class CreateContactDto {
  @IsUUID()
  @IsNotEmpty()
  listingId!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['property', 'project', 'land'])
  listingType!: 'property' | 'project' | 'land';

  @IsString()
  @IsOptional()
  message?: string;
}