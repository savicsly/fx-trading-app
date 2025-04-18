import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletService } from 'src/wallets/wallet.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private walletService: WalletService, // Inject WalletService
  ) {}

  async createUser(data: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
  }): Promise<User> {
    const user = this.usersRepository.create(data);
    const savedUser = await this.usersRepository.save(user);

    // Create a single wallet for the user
    await this.walletService.createWallet(savedUser);
    console.log(`Wallet created for user ID: ${savedUser.id}`);

    return savedUser;
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.update(id, data);

    const updatedUser = await this.usersRepository.findOneBy({ id });
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async updateEmailVerifiedAt(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailVerifiedAt !== null) {
      throw new BadRequestException('Email is already verified');
    }

    user.emailVerifiedAt = new Date();
    await this.usersRepository.save(user);

    console.log(`Email verified for user ID: ${id}`);
    return user;
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
