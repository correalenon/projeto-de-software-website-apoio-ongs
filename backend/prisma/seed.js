import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function generateCNPJ() {
    const randomDigits = () => Math.floor(Math.random() * 9).toString();
    let cnpj = "";
    for (let i = 0; i < 12; i++) {
        cnpj += randomDigits();
    }
    return cnpj + "00";
}

async function main() {
    await prisma.users.create({
        data: {
            name: "Super Administrator",
            email: "admin@acad.ufsm.br",
            password: await bcrypt.hash("admin", 10),
            role: "ADMIN",
        },
    });
    for (let i = 0; i < 10; i++) {
        await prisma.users.create({
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
                cnpj: generateCNPJ(),
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
