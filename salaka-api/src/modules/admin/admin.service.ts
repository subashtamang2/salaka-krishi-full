import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreateAdminDto } from "./dto/create-admin.dto";

import { LoginAdminDto } from "./dto/login-auth.dto";
import { AdminRepository } from "./admin.repository";
import * as bcrypt from "bcrypt";
import { CustomJwtService } from "../auth/CustomJwt.service";
import { UpdateAdminDto } from "./dto/update-admin";
import { ROLE, USER_STATUS } from "@prisma/client";
import { FilterAdminsDto } from "./dto/create-admin.dto";
import { CreatePasswordResetDto } from "./dto/reset-password.dto";
import { ForgotPasswordDto } from "./dto/forget-password.dto";
import { MailService } from "src/common/mail/mail.service";

@Injectable()
export class AdminService {
    constructor(
        private readonly adminRepository: AdminRepository,
        private readonly jwtService: CustomJwtService,
        private readonly mailService: MailService,
    ) { }

    async login(body: LoginAdminDto) {
        const { email, password } = body;
        if (!email || !password)
            throw new BadRequestException(
                "Email and password are required for login."
            );

        const user = await this.adminRepository.findAdminByEmail(email);
        if (!user) throw new BadRequestException("User not found with this email.");
        const userPassword = user?.password;
        if (!userPassword)
            throw new BadRequestException("User password not found in the database.");

        const isPasswordValid = await bcrypt.compare(password, userPassword);
        if (!isPasswordValid)
            throw new BadRequestException("Invalid password. Please try again.");

        const payload = {
            sub: user.id,
            username: user.firstName,
            role: user.role, // Assuming the user object has a role property
        };
        const { password: _, ...userWithoutPassword } = user;
        const { access_token, refresh_token } =
            await this.jwtService.generateAccessAndRefreshToken(payload);
        return {
            message: "Login successfully",
            data: {
                user: userWithoutPassword,
                access_token,
                refresh_token,
            },
        };
    }

    async create(createAdminDto: CreateAdminDto) {
        const { firstName, email, password } = createAdminDto;
        if (!firstName || !email || !password)
            throw new BadRequestException("Invalid Credentials. Please try again.");

        const checkEmail = await this.adminRepository.findAdminByEmail(email);
        if (checkEmail)
            throw new ConflictException(
                "Email already exists. Please try another one."
            );

        const hashedPassword = await bcrypt.hash(password, 10);
        createAdminDto.password = hashedPassword;

        try {
            const newAdmin = await this.adminRepository.createAdmin(createAdminDto);
            const { password: _, ...adminWithoutPassword } = newAdmin;
            return newAdmin;
        } catch (error) {
            throw new BadRequestException(
                "Failed to create admin. Please try again."
            );
        }
    }

    async findAll() {
        const admins = await this.adminRepository.findAllAdmins();
        if (!admins || admins.length === 0)
            throw new BadRequestException("No admins found.");
        return admins;
    }

    async findByQuery(filter: FilterAdminsDto) {
        const where: any = { AND: [] };

        // Limit to Admin and SuperAdmin
        where.AND.push({ role: { in: [ROLE.Admin, ROLE.SuperAdmin] } });

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
            // If a specific admin role is requested (e.g., just SuperAdmin or just Admin)
            where.AND.push({ role: filter.role });
        }

        if (filter.status) {
            where.AND.push({ status: filter.status });
        }

        const page = filter.page && filter.page > 0 ? filter.page : undefined;
        const limit = filter.limit && filter.limit > 0 ? filter.limit : undefined;
        const skip = page && limit ? (page - 1) * limit : undefined;

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

        const { admins, count } = await this.adminRepository.findByQuery(where, skip, limit, orderBy);

        return {
            admins,
            totalCount: count,
            page: page || 1,
            limit: limit || count,
            totalPages: limit ? Math.ceil(count / limit) : 1
        };
    }

    async findOne(id: string) {
        const admin = await this.adminRepository.findAdmin(id);
        if (!admin) throw new BadRequestException("Admin not found.");
        return admin;
    }

    async update(id: string, updateAdminDto: UpdateAdminDto) {
        if (updateAdminDto.password) {
            updateAdminDto.password = await bcrypt.hash(updateAdminDto.password, 10);
        }
        const admin = await this.adminRepository.findAdminAndUpdate(
            id,
            updateAdminDto
        );
        return admin;
    }

    async remove(id: string) {
        const adminToRemove = await this.adminRepository.findAdmin(id);
        if (!adminToRemove) throw new BadRequestException("Admin not found.");
        if (adminToRemove.status === USER_STATUS.Revoke) {
            return await this.adminRepository.suspendedAdmin(id);
        }
        if (adminToRemove.status === USER_STATUS.Suspended) {
            return await this.adminRepository.deleteAdmin(id);
        }
        return await this.adminRepository.revokeAdmin(id);
    }



    // this is for admin passsword reset

    async forgotPassword(dto: ForgotPasswordDto) {
        const admin = await this.adminRepository.findAdminByEmail(
            dto.email.toLowerCase()
        );

        if (!admin) {
            throw new NotFoundException("Admin not found");
        }

        if (
            admin.role !== ROLE.Admin &&
            admin.role !== ROLE.SuperAdmin
        ) {
            throw new ForbiddenException("Not an admin account");
        }

        const token = await this.adminRepository.createPasswordResetToken(
            admin.id
        );

        await this.mailService.sendPasswordResetEmail(
            admin.email,
            token.token,
        );

        return {
            success: true,
            message: "Password reset email sent successfully",
        };
    }



    async resetPassword(dto: CreatePasswordResetDto) {
        const resetToken =
            await this.adminRepository.findPasswordResetToken(dto.token);

        if (!resetToken) {
            throw new NotFoundException("Invalid token");
        }

        if (resetToken.isUsed) {
            throw new BadRequestException("Token already used");
        }

        if (resetToken.expiresAt < new Date()) {
            throw new BadRequestException("Token expired");
        }

        await this.adminRepository.updateAdminPassword(
            resetToken.userId,
            dto.password,
        );

        await this.adminRepository.markPasswordResetTokenUsed(
            resetToken.id,
        );

        return {
            success: true,
            message: "Password reset successful",
        };
    }








}
