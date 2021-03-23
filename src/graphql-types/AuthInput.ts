import { InputType, Field } from 'type-graphql';

@InputType()
export class AuthInput {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  username?: string;

  @Field()
  password: string;
}
