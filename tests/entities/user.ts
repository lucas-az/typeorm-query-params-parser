import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Name } from './name';
import { Profile } from './profile';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(() => Name)
  name: Name;

  @Column()
  age: number;

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;
}
