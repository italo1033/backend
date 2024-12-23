import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Supondo que você tenha um PrismaService configurado
import { hash } from 'bcrypt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // Método de registro modificado para criar o usuário e a empresa
  async register(
    email: string,
    password: string,
    companyName: string,
    legalName: string,
    cnpj: string,
    phone: string,
  ) {
    // Verificando se a empresa já existe
    const existingCompany = await this.prisma.company.findUnique({
      where: { cnpj },
    });

    if (existingCompany) {
      throw new Error('CNPJ already registered');
    }

    // Criando a empresa no banco de dados
    const company = await this.prisma.company.create({
      data: {
        name: companyName,
        legalName,
        cnpj,
        phone,
        email, // E-mail da empresa
      },
    });

    // Criptografando a senha
    const hashedPassword = await hash(password, 10);

    // Criando o usuário no banco de dados e associando à empresa
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        companyId: company.id, // Associando o usuário à empresa criada
      },
    });

    return { message: 'User registered successfully!', user };
  }

  async login(email: string, password: string) {
    // Verificando se o usuário existe
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return null;
    }

    // Comparando a senha fornecida com a senha criptografada no banco
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      return user;
    }
    return null;
  }

   // Método para obter todos os usuários e suas empresas
   async getAllUserCompany() {
    return this.prisma.user.findMany({
      include: {
        company: true, // Inclui os dados da empresa associada a cada usuário
      },
    });
   }

    // Método para obter todas as empresas
    async getAllCompany() {
      return  this.prisma.company.findMany();
      }


  // Método para excluir uma empresa
  async deleteCompany(companyId: number): Promise<void> {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new Error('Empresa não encontrada');
    }

    await this.prisma.company.delete({
      where: { id: companyId },
    });
  }

  // Método para excluir um usuário
  async deleteUser(userId: number): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    await this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
