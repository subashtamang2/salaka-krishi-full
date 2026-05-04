import { Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { BannerRepository } from "./banner.repo";
import { CreateBannerDto } from "./dto/create-banner.dto";
import { UpdateBannerDto } from "./dto/update-banner.dto";
import { BANNER_TAG } from "@prisma/client";
import { ProductRepository } from "../product/product.repo";

@Injectable()
export class BannersService {
    constructor(
private readonly bannerRepository: BannerRepository,
private readonly productRepository: ProductRepository
)

{ }



    async create(createBannerDto: CreateBannerDto, userId: string) {
        const checkSlug = await this.bannerRepository.findBannerBySlug(
            createBannerDto.slug
        );
        if (checkSlug) {
            throw new NotAcceptableException("Banner with this slug already exists");
        }

        if (!createBannerDto.productId) {
            throw new NotAcceptableException("You must select a product for the banner");
        }
 
        // Verify Product Existence
        const product = await this.productRepository.findProductById(createBannerDto.productId);
        if (!product) {
            throw new NotFoundException("Product not found");
        }
 
        const banner = await this.bannerRepository.create(
            createBannerDto,
            userId
        );
        if (!banner) {
            throw new InternalServerErrorException("Banner creation failed");
        }
        return banner;
    }


    findAll() {
        return this.bannerRepository.findAll();

    }

    findOne(id: string) {
        return this.bannerRepository.findOne(id);
    }

    update(id: string, updateBannerDto: UpdateBannerDto) {
        return this.bannerRepository.update(id, updateBannerDto);
    }
    remove(id: string) {
        return this.bannerRepository.remove(id);
    }




//  // MAIN LOGIC (BANNER + PRODUCT COMBINE)
//      async findActive(tag?: BANNER_TAG) {
//         const banners = await this.bannerRepository.findActive(tag);

//         const result = banners as Array<any & { product?: any }>;

//         await Promise.all(
//             result.map(async (banner) => {
//                 switch (banner.tag) {
//                     case BANNER_TAG.BestSelling:
//                         banner.product =
//                             await this.productRepository.findBestSellingProduct();

//                         break;


//                     case BANNER_TAG.LimitedStock:
//                         banner.product =
//                             await this.productRepository.findLimitedStockProducts();
//                         break;

//                     case BANNER_TAG.NewArrival:
//                         banner.product =
//                             await this.productRepository.findNewestProduct();
//                         break;

//                     case BANNER_TAG.BlackFriday:
//                         banner.product =
//                             await this.productRepository.findOnSaleProducts();
//                         break;

//                     default:
//                         banner.product = null;
//                 }
//             })
//         );

//         return result;
//     }
// }


async findActive(tag?: BANNER_TAG) {
  const banners = await this.bannerRepository.findActive(tag);

  const result = banners as Array<any & { product?: any }>;

  await Promise.all(
    result.map(async (banner) => {
      switch (banner.tag) {
        case BANNER_TAG.BestSelling:
          const best = await this.productRepository.findBestSellingProduct();
          banner.product = best;
          break;

        case BANNER_TAG.LimitedStock:
          const limited = await this.productRepository.findLimitedStockProducts();
          banner.product = limited;
          break;

        case BANNER_TAG.NewArrival:
          const newP = await this.productRepository.findNewestProduct();
          banner.product = newP;
          break;

        default:
          banner.product = null;
      }
    })
  );

  return result;
}
}
