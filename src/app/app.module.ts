import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AutomaticConceptsModule } from 'src/automatic-concepts/automatic-concepts.module';

@Module({
  imports: [AutomaticConceptsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
