/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ConfigService } from "@nestjs/config";
import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaClient, ROLE } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { PrismaClient, ROLE } from "@prisma/client";
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const password = "Password@123";
const Prisma = new PrismaClient({ adapter });
async function main() {
    const saltRounds = Number(process.env.SALT_ROUNDS ?? 10);

    const adminList = [
        {
            firstName: "Super Admin",
            email: "superadmin@gmail.com",
            password: await bcrypt.hash("password@superadmin", saltRounds),
            role: ROLE.SuperAdmin,
        },
        {
            firstName: "Super Admin",
            email: "example@gmail.com",
            password: await bcrypt.hash("Password@123", saltRounds),
            role: ROLE.SuperAdmin,
        },
        {
            firstName: "Admin",
            email: "admin@gmail.com",
            password: await bcrypt.hash("password@admin", saltRounds),
            role: ROLE.Admin,
        },
        {
            firstName: "user",
            email: "user@gmail.com",
            password: await bcrypt.hash("password@user", saltRounds),
            role: ROLE.User,
        },
        {
            firstName: "subash",
            lastName: "tamang",
            email: "lamasubaah2@gmail.com",
            password: await bcrypt.hash("lamasubaah2", saltRounds),
            role: ROLE.Admin,
        },
    ];
    await Promise.all(
        adminList.map(async (adminUser) => {
            const existingUser = await Prisma.user.findFirst({
                where: {
                    email: adminUser.email,
                    role: { in: [ROLE.Admin, ROLE.SuperAdmin] },
                },
            });
            if (existingUser) {
                console.log(
                    `User with email ${adminUser.email} and role ${adminUser.role} already exists. Skipping creation.`
                );
                return;
            }
            const user = await Prisma.user.create({ data: adminUser });
        })
    ).then(() => {
        console.log("Super admin created successfully!");
    });
}

main()
    .then(async () => {
        await Prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await Prisma.$disconnect();
    });
