import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
    for (let i = 0; i < 10; i++) {
        await prisma.user.create({
            data: {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                role: "VOLUNTARY",
            },
        });
    }

    for (let i = 0; i < 5; i++) {
        await prisma.ongs.create({
            data: {
                name: faker.company.name(),
                contact: faker.phone.number(),
                description: faker.lorem.paragraph(),
                userId: Math.floor(Math.random() * 10) + 1,
            },
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
