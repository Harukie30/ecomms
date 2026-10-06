import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { MOCK_LISTINGS, MOCK_SELLERS } from "../lib/mock-data";

const prisma = new PrismaClient();

async function main() {
  await prisma.escrowEvent.deleteMany();
  await prisma.deliveryPayload.deleteMany();
  await prisma.review.deleteMany();
  await prisma.order.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.sellerProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  const buyer = await prisma.user.create({
    data: {
      email: "buyer@vaultlane.test",
      name: "Alex Rivera",
      passwordHash,
      role: "buyer",
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: "admin@vaultlane.test",
      name: "Vault Admin",
      passwordHash,
      role: "admin",
    },
  });

  const sellerUsers = await Promise.all(
    MOCK_SELLERS.map((seller, index) =>
      prisma.user.create({
        data: {
          email: `seller${index + 1}@vaultlane.test`,
          name: seller.displayName,
          passwordHash,
          role: "seller",
        },
      })
    )
  );

  const sellerProfiles = await Promise.all(
    MOCK_SELLERS.map((seller, index) =>
      prisma.sellerProfile.create({
        data: {
          userId: sellerUsers[index].id,
          displayName: seller.displayName,
          bio: seller.bio,
          rating: seller.rating,
          salesCount: seller.salesCount,
          responseMinutes: seller.responseMinutes,
          verified: seller.verified,
        },
      })
    )
  );

  const profileByMockId = Object.fromEntries(
    MOCK_SELLERS.map((seller, index) => [seller.id, sellerProfiles[index]])
  );

  await Promise.all(
    MOCK_LISTINGS.map((listing) =>
      prisma.listing.create({
        data: {
          sellerId: profileByMockId[listing.sellerId].id,
          title: listing.title,
          description: listing.description,
          category: listing.category,
          game: listing.game,
          region: listing.region,
          deliveryType: listing.deliveryType,
          pricePhp: listing.pricePhp,
          stock: listing.stock,
          active: listing.active,
          imageHue: listing.imageHue,
          tags: JSON.stringify(listing.tags),
        },
      })
    )
  );

  console.log("Seeded VaultLane demo data");
  console.log("Buyer:", buyer.email, "/ password123");
  console.log("Admin:", admin.email, "/ password123");
  console.log("Sellers: seller1@vaultlane.test … seller3@vaultlane.test / password123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
