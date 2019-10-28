import { Connection } from 'typeorm';
import {UserEntity} from './user.entity';

export const USERS_REPOSITORY_TOKEN = 'UsersRepositoryToken';

export const userProviders = [{
  provide: USERS_REPOSITORY_TOKEN,
  useFactory: (connection: Connection) => connection.getRepository(UserEntity),
  inject: ['DbConnectionToken'],
}];
