import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { comment: '用户id' })
  uuid: string;

  @Column({
    type: 'varchar',
    comment: '用户名',
  })
  username: string;

  @Column({
    type: 'varchar',
    comment: '密码',
  })
  password: string;
}
