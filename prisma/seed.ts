import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

const jogos = await prisma.category.create({

data:{

name:"Jogos"

}

})

await prisma.product.create({

data:{

title:"Resident Evil 4",

slug:"resident-evil-4",

description:"Jogo clássico.",

price:199.90,

console:"PlayStation 2",

condition:"Excelente",

featured:true,

rarity:true,

categoryId:jogos.id

}

})

}

main()
.finally(()=>prisma.$disconnect())