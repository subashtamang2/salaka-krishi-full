import { Module } from '@nestjs/common';
import { SiteInfoService } from './site-info.service';
import { SiteInfoController } from './site-info.controller';

@Module({
  controllers: [SiteInfoController],
  providers: [SiteInfoService],
})
export class SiteInfoModule {}
