import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { User } from './User';

@ObjectType({ description: 'Destination or place of interest' })
@Entity()
export class Place extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field({
    nullable: true,
    description: 'The place description with localized info'
  })
  @Column()
  description?: string;

  @Field({
    nullable: true,
    description: 'The place image url'
  })
  @Column()
  imageUrl?: string;

  @Field({ nullable: true })
  @Column()
  creationDate?: Date;

  @Field({ nullable: true })
  @ManyToOne(
    () => User,
    user => user.places
  )
  user?: User;
}
