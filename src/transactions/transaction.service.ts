import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async recordTransaction(data: {
    userId: number;
    type: string;
    currency: string;
    amount: number;
    rate?: number;
    convertedAmount?: number;
    targetCurrency?: string;
    status?: string;
  }): Promise<Transaction> {
    if (!data.userId) {
      throw new TypeError('Invalid user object: user.id is undefined');
    }

    const transaction = this.transactionRepository.create({
      ...data,
      userId: data.userId,
      status: data.status || 'success',
    });
    return this.transactionRepository.save(transaction);
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { userId }, // Query by userId
      order: { timestamp: 'DESC' },
    });
  }

  async getTransactionHistory(
    userId: number,
    options: { limit?: number; offset?: number },
  ) {
    const { limit = 10, offset = 0 } = options;
    return this.transactionRepository.find({
      where: { userId },
      take: limit,
      skip: offset,
    });
  }
}
