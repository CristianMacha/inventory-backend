import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity({ name: 'refresh_tokens' })
export class RefreshTokenEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Index()
  @Column('uuid')
  userId: string;

  @Column({ nullable: false })
  tokenHash: string;

  @Column({ nullable: false, default: false })
  isRevoked: boolean;

  @Column({ nullable: false })
  expiresAt: Date;

  @Column({ nullable: false })
  createdAt: Date;
}