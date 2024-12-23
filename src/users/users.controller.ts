import { Controller, Post, Body , Get} from '@nestjs/common';
import { UsersService } from './users.service';

// Definindo o tipo de dados para o corpo da requisição de registro
interface RegisterBody {
  email: string;
  password: string;
  companyName: string;
  legalName: string;  // Razão Social
  cnpj: string;       // CNPJ
  phone: string;      // Telefone da empresa
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() body: RegisterBody) {
    // Passando todos os dados necessários para o serviço de registro
    return this.usersService.register(
      body.email,
      body.password,
      body.companyName,
      body.legalName,
      body.cnpj,
      body.phone
    );
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.usersService.login(body.email, body.password);
  
    if (user) {
      return { message: 'Login successful!' };
    } else {
      throw new Error('Invalid credentials');
    }
  }

  @Get('allUserCompany')
  async getAllUserCompany() {
    // Chamando o método do serviço que retorna todos os usuários com suas empresas
    return this.usersService.getAllUserCompany();
  }

  @Get('allCompany')
  async getAllCompany() {
    // Chamando o método do serviço que retorna todos os usuários com suas empresas
    return this.usersService.getAllCompany();
  }
}
