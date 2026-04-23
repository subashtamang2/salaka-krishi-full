import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { UserStrategy } from "./user.strategy";
import { USER_STATUS } from "generated/prisma/enums";
import { FilterUsersDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
  constructor(private readonly userStrategy: UserStrategy) {}

  async getAllUsers() {
    const users = await this.userStrategy.findMany();
    if (!users || users.length === 0) {
      throw new NotFoundException("No users found");
    }
    return {
      message: "Users retrieved successfully",
      data: users,
    };
  }

  async findByQuery(filter: FilterUsersDto) {
    const where: any = { AND: [] };
    
    if (filter.search) {
      where.AND.push({
        OR: [
          { firstName: { contains: filter.search, mode: "insensitive" } },
          { lastName: { contains: filter.search, mode: "insensitive" } },
          { email: { contains: filter.search, mode: "insensitive" } },
        ]
      });
    }

    if (filter.role) {
      where.AND.push({ role: filter.role });
    }

    if (filter.status) {
      where.AND.push({ status: filter.status });
    }

    if (where.AND.length === 0) delete where.AND;

    const page = filter.page && filter.page > 0 ? filter.page : 1;
    const limit = filter.limit && filter.limit > 0 ? filter.limit : 10;
    const skip = (page - 1) * limit;

    const orderBy: any = {};
    if (filter.sortBy) {
        if (filter.sortBy === 'name' || filter.sortBy === 'firstName') {
             orderBy.firstName = filter.sortOrder === 'desc' ? 'desc' : 'asc';
        } else if (filter.sortBy === 'joinedDate' || filter.sortBy === 'createdAt') {
             orderBy.createdAt = filter.sortOrder === 'desc' ? 'desc' : 'asc';
        } else {
             orderBy[filter.sortBy] = filter.sortOrder === 'desc' ? 'desc' : 'asc';
        }
    }

    const { users, count } = await this.userStrategy.findByQuery(where, skip, limit, orderBy);

    return {
      users,
      totalCount: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    };
  }

  async getUniqueUser(id: string) {
    const user = await this.userStrategy.findOne(id);
    if (!user) {
      throw new NotFoundException(`User  not found`);
    }
    return user;
  }
  async findCurrentUser(id: string) {
    const user = await this.userStrategy.findCurrentUser(id);
    const userCartProducts = user?.Cart?.products || [];

    if (!user) {
      throw new NotFoundException(`User  not found`);
    }
    return {
      message: "User retrieved successfully",
      data: {
        ...user,
        noOfProductInCart: userCartProducts.length,
      },
    };
  }

  async getUsersByStatus(status: USER_STATUS) {
    const users = await this.userStrategy.findByStatus(status);
    if (!users || users.length === 0) {
      throw new NotFoundException(`No users found with status: ${status}`);
    }
    return {
      message: "Users retrieved successfully",
      data: users,
    };
  }

  async updateUserStatus(id: string, status: USER_STATUS) {
    const user = await this.userStrategy.findOne(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const updatedUser = await this.userStrategy.updateUserStatus(id, status);
    return {
      message: "User status updated successfully",
      data: updatedUser,
    };
  }

  async remove(id: string) {
    const user = await this.userStrategy.findOne(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    try {
      const deletedUser = await this.userStrategy.remove(id);
      return deletedUser;
    } catch (error: any) {
      if (error.code === 'P2003') {
        throw new ConflictException(
          "Cannot delete customer with existing records (Orders, Reviews, etc.). Try deactivating them instead."
        );
      }
      throw error;
    }
  }
}
