import { PartialType } from '@nestjs/swagger';
import { CreateSiteInfoDto } from './create-site-info.dto';

export class UpdateSiteInfoDto extends PartialType(CreateSiteInfoDto) {}
