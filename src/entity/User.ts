import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany
} from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
import { Place } from './Place';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('text', { unique: true })
  email: string;

  @Field()
  @Column('text', { unique: true })
  username: string;

  @Column()
  password: string;

  @Field(() => [Place])
  @OneToMany(
    () => Place,
    places => places.user,
    {
      eager: true
    }
  )
  places: Place[];
}
