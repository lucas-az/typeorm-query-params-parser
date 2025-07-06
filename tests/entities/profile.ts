import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Image } from './image';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gender: string;

  @OneToOne(() => Image)
  @JoinColumn()
  photo: Image;
}
