import { Person } from 'src/people/entities/person.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  text: string;

  @Column({ type: 'boolean', default: false })
  read: boolean;

  @Column({ type: 'timestamp' })
  data: Date;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn({ select: false, nullable: true })
  deletedAt: Date | null;

  // Muitos recados podem ser enviados por uma única pessoa (emissor).
  // Especificando a coluna que armazena o ID da pessoa que enviou o recado.
  @ManyToOne(() => Person, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'from' })
  from: Person;

  // Muitos recados podem ser enviados por uma única pessoa (destinatário).
  // Especificando a coluna 'to' que armazena o ID da pessoa que recebeu o recado.
  @ManyToOne(() => Person, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'to' })
  to: Person;
}
