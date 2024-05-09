import { CentralDbRepositoryModule } from '@bambu/server-core/repositories';
import { Module } from '@nestjs/common';
import { ApisModule } from './apis/apis.module';
import { AppService } from './app.service';

@Module({
  imports: [ApisModule, CentralDbRepositoryModule],
  providers: [AppService],
})
export class AppModule {}
