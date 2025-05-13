import { IsEmail } from 'class-validator';
import { MessageEntity } from 'src/messages/entities/message.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ length: 255 })
  passwordHash: string;

  @Column({ length: 255 })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ select: false, nullable: true })
  deletedAt: Date | null;

  // Uma pessoa pode enviar muitos recados (emissor).
  // Esses recados são relacionados ao campo 'from' da entidade MessageEntity.
  @OneToMany(() => MessageEntity, (message) => message.from)
  messagesSent: MessageEntity[];

  // Uma pessoa pode receber muitos recados (destinatário).
  // Esses recados são relacionados ao campo 'to' da entidade MessageEntity.
  @OneToMany(() => MessageEntity, (message) => message.to)
  messagesReceived: MessageEntity[];
}
