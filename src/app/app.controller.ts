import { Controller, Get, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import globalConfig from 'src/global-config/global.config';
import { AppService } from './app.service';

@Controller('home')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(globalConfig.KEY)
    private readonly globalConfiguration: ConfigType<typeof globalConfig>,
  ) {
    console.log('Database Type:', this.globalConfiguration.database.type);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
