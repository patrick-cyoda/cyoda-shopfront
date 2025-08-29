import { getCyodaClient } from './cyoda';
import { User, CreateUserRequest } from '../types/entities';

export class UserService {
  private client = getCyodaClient();

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const users = await this.client.searchEntities<User>('User', undefined, { email });
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      return await this.client.createEntity<User>('User', userData);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    try {
      return await this.client.updateEntity<User>('User', userId, userData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  async upsertUser(userData: CreateUserRequest): Promise<User> {
    try {
      // Try to find existing user by email
      const existingUser = await this.getUserByEmail(userData.email);

      if (existingUser) {
        // Update existing user with new data (especially address)
        return await this.updateUser(existingUser.userId, {
          name: userData.name,
          phone: userData.phone,
          address: userData.address,
        });
      } else {
        // Create new user
        return await this.createUser(userData);
      }
    } catch (error) {
      console.error('Error upserting user:', error);
      throw new Error('Failed to save user information');
    }
  }

  async getUser(userId: string): Promise<User> {
    try {
      return await this.client.getEntity<User>('User', userId);
    } catch (error) {
      console.error('Error getting user:', error);
      throw new Error('Failed to load user');
    }
  }
}

export const userService = new UserService();