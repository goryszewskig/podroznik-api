import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Ctx,
  PubSub,
  Subscription,
  Root,
  Publisher
} from 'type-graphql';
import { plainToClass } from 'class-transformer';

import { Place } from '../entity/Place';
import { User } from '../entity/User';
import { PlaceInput } from '../graphql-types/PlaceInput';
import { getUserId } from '../utils';
import { Request } from 'express';

enum Topic {
  PlaceAdded = 'NEW_PLACE_ADDED'
}

@Resolver(() => Place)
export class PlaceResolver {
  @Query(() => Place, { nullable: true })
  async place(@Arg('id') id: number): Promise<Place | undefined> {
    const place = await Place.findOne(id, { relations: ['user'] });
    return place;
  }

  @Query(() => [Place], {
    description: 'Get all the places from around the world '
  })
  async places(): Promise<Place[]> {
    const places = await Place.find({ relations: ['user'] });
    return places;
  }

  @Mutation(() => Place)
  async createPlace(
    @Arg('place') placeInput: PlaceInput,
    @Ctx() ctx: { req: Request },
    @PubSub(Topic.PlaceAdded) publish: Publisher<Place>
  ): Promise<Place> {
    const userId = getUserId(ctx);
    if (userId) {
      const place = plainToClass(Place, {
        description: placeInput.description,
        title: placeInput.title,
        imageUrl: placeInput.imageUrl,
        creationDate: new Date()
      });
      const user = await User.findOne(userId);
      if (user) {
        const newPlace = await Place.create({
          ...place,
          user
        }).save();
        await publish(newPlace);
        return newPlace;
      }
      throw new Error('User not found');
    }
    throw new Error('User not found');
  }

  @Mutation(() => Place)
  async updatePlace(
    @Arg('place') placeInput: PlaceInput,
    @Ctx() ctx: { req: Request }
  ): Promise<Place> {
    const userId = getUserId(ctx);
    if (userId) {
      const { id, title, description, imageUrl } = placeInput;
      const place = await Place.findOne({
        where: { id, user: { id: userId } },
        relations: ['user']
      });
      if (place) {
        place.title = title;
        place.description = description;
        place.imageUrl = imageUrl;
        place.save();
        return place;
      }
      throw new Error('Place not found');
    }
    throw new Error('User not found');
  }
  @Mutation(() => String)
  async deletePlace(
    @Arg('id') id: number,
    @Ctx() ctx: { req: Request }
  ): Promise<Number | undefined> {
    const userId = getUserId(ctx);
    if (userId) {
      const deleted = await Place.delete({ id, user: { id: userId } });
      if (deleted) {
        return id;
      }
      throw new Error('Place not deleted');
    }
    throw new Error('User not found');
  }
  @Subscription(() => Place, {
    topics: Topic.PlaceAdded
  })
  newPlaceAdded(@Root() place: Place): Place {
    return place;
  }
}
