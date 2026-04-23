import { Injectable } from "@nestjs/common";
import { CreateContactDto } from "./dto/create-contact.dto";
import { UpdateContactDto } from "./dto/update-contact.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createContactDto: CreateContactDto) {
    const result = await this.prisma.contact.create({
      data: createContactDto,
    });
    return {
      message: "Contact created successfully",
    };
  }

  async findAll() {
    const result = await this.prisma.contact.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return {
      message: "Contacts retrieved successfully",
      data: result,
    };
  }

  async findOne(id: string) {
    const result = await this.prisma.contact.findUnique({
      where: { id },
    });
    if (!result) {
      return {
        message: "Contact not found",
        data: null,
      };
    }
    return {
      message: "Contact retrieved successfully",
      data: result,
    };
  }

  async update(id: string, updateContactDto: UpdateContactDto) {
    const result = await this.prisma.contact.update({
      where: { id },
      data: updateContactDto,
    });
    return {
      message: "Contact updated successfully",
      data: result,
    };
  }

  async remove(id: string) {
    const result = await this.prisma.contact.delete({
      where: { id },
    });
    return {
      message: "Contact deleted successfully",
      data: result,
    };
  }
}
