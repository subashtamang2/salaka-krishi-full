import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
} from '@nestjs/common';
import { CreateShippingDetailDto } from './dto/create-shipping-detail.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShippingDetailsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createShippingDetailDto: CreateShippingDetailDto,
    userId: string,
  ) {
    try {
      const data = await this.prisma.shippingDetails.upsert({
        where: { userId: userId },
        update: { ...createShippingDetailDto },
        create: { ...createShippingDetailDto, userId: userId },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileUrl: true,
            },
          },
        },
      });
      return data;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new NotAcceptableException('Shipping detail already exists');
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  find(userId: string) {
    return this.prisma.shippingDetails.findUnique({
      where: {
        userId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileUrl: true,
          },
        },
      },
    });
  }

  remove(id: string, userId: string) {
    return this.prisma.shippingDetails.delete({
      where: {
        id: id,
        userId: userId,
      },
    });
  }

  update(id: string, updateShippingDetailDto: any) {
    return this.prisma.shippingDetails.update({
      where: { id: id },
      data: updateShippingDetailDto,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileUrl: true,
          },
        },
      },
    });
  }

  findAllAdmin() {
    return this.prisma.shippingDetails.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileUrl: true,
            orders: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              select: {
                id: true,
                orderNumber: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
