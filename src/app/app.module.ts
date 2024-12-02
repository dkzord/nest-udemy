import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { MessagesModule } from 'src/messages/messages.module';
import { AutomaticConceptsModule } from 'src/automatic-concepts/automatic-concepts.module';

@Module({
  imports: [MessagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
