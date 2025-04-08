import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' })
  user: User;

  @Column({ nullable: false })
  userId: number; // Explicitly store the user ID

  @Column({ nullable: false })
  type: string; // e.g., "fund", "convert", "trade"

  @Column({ nullable: false })
  currency: string; // e.g., "NGN", "USD"

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: false })
  amount: number;

  @Column({ type: 'decimal', precision: 15, scale: 6, nullable: true })
  rate?: number; // Exchange rate for conversions or trades

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  convertedAmount?: number; // For conversions or trades

  @Column({ nullable: true })
  targetCurrency?: string; // For conversions or trades

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column({ nullable: false, default: 'success' })
  status: string; // e.g., "success", "failed"
}
