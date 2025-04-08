import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('analytics')
export class Analytics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: false })
  activity: string; // e.g., "Trade", "Wallet Funded"

  @Column({ nullable: true })
  baseCurrency?: string;

  @Column({ nullable: true })
  targetCurrency?: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  amount?: number;

  @Column({ type: 'decimal', precision: 15, scale: 6, nullable: true })
  rate?: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
