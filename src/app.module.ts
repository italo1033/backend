import { Module } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { UsersController } from '../src/users/users.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Certifique-se de importar o PrismaModule corretamente

@Module({
  imports: [PrismaModule], // Importa o PrismaModule
  controllers: [UsersController],
  providers: [UsersService],
})
export class AppModule {}
