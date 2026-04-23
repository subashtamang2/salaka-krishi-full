import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { CreateFaqDto } from "./dto/create-faq.dto";
import { UpdateFaqDto } from "./dto/update-faq.dto";
import { FaqHelper } from "./faq.helper";
import { JwtPayload } from "../auth/interface";
import { FAQ_CATEGORY } from "generated/prisma/enums";

@Injectable()
export class FaqService {
  constructor(private readonly faqHelper: FaqHelper) {}
  async create(createFaqDto: CreateFaqDto, user: JwtPayload) {
    const userId = user?.sub;

    const checkFaq = await this.faqHelper.findBySlug(createFaqDto.slug);
    if (checkFaq) {
      throw new NotAcceptableException("FAQ with this slug already exists");
    }

    const result = await this.faqHelper.create(createFaqDto, userId);
    if (!result) {
      throw new InternalServerErrorException("Failed to create FAQ");
    }
    return result;
  }

  async findAll(search?: string) {
    const result = await Promise.all(
      Object.values(FAQ_CATEGORY).map(async (category) => {
        const faqs = await this.faqHelper.findAll(category,search);
        return { category, faqs };
      })
    );
    if (!result || result.length === 0) {
      throw new NotFoundException("No FAQs found");
    }
    return result;
  }

  findOne(id: string) {
    const result = this.faqHelper.findOne(id);
    if (!result) {
      throw new NotFoundException("FAQ not found");
    }
    return result;
  }

  update(id: string, updateFaqDto: UpdateFaqDto) {
    const findFaq = this.faqHelper.findOne(id);
    if (!findFaq) {
      throw new NotFoundException("FAQ not found");
    }

    const result = this.faqHelper.update(id, updateFaqDto);
    if (!result) {
      throw new InternalServerErrorException("Failed to update FAQ");
    }
    return result;
  }

  remove(id: string) {
    const findFaq = this.faqHelper.findOne(id);
    if (!findFaq) {
      throw new NotFoundException("FAQ not found");
    }
    const result = this.faqHelper.delete(id);
    if (!result) {
      throw new InternalServerErrorException("Failed to delete FAQ");
    }
    return result;
  }
}
