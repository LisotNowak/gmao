const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Démarrage du seeding...");

  // Seeding table Status
  const statuses = ['demandé', 'en cours', 'terminée'];
  for (const label of statuses) {
    await prisma.status.upsert({
      where: { label },
      update: {},
      create: { label },
    });
  }
  console.log('✅ Statuts insérés avec succès');

  // Seeding table Service
  const services = ["atelier", "services-generaux"];
  for (const label of services) {
    await prisma.service.upsert({
      where: { label },
      update: {},
      create: { label },
    });
  }
  console.log('✅ Services insérés avec succès');

  // Récupérer le service "atelier" pour lier les catégories et matériels
  const atelierService = await prisma.service.findUnique({
    where: { label: "atelier" },
  });
  if (!atelierService) throw new Error("Service 'atelier' introuvable !");

  // Seeding table Category
  const categories = [{ label: "tracteur" }];
  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        label_serviceId: { // clé unique composite
          label: category.label,
          serviceId: atelierService.id,
        }
      },
      update: {},
      create: {
        label: category.label,
        serviceId: atelierService.id,
      },
    });
  }
  console.log('✅ Catégories insérées avec succès');

  // Seeding table Priority
  const priorities = ["urgent","très urgent", "classique"];
  for (const label of priorities) {
    await prisma.priority.upsert({
      where: { label },
      update: {},
      create: { label },
    });
  }
  console.log('✅ Priorités insérés avec succès');

  // Seeding table Role
  const roles = ["demandeur", "technicien", "responsable", "administrateur"];
  for (const label of roles) {
    await prisma.role.upsert({
      where: { label },
      update: {},
      create: { label },
    });
  }
  console.log('✅ Rôles insérés avec succès');

  // Seeding table Matériel
  const materialNames = [
    "Rouleau faca", "Rouleau Beli", "Brosse rotative plastique fait maison", "Rotavator vigne",
    "Cerveaux moteur boisselet", "Arromatic", "Pelle a remonter les bouts Guyard", "Deca Souslikoff",
    "Deca Boisselet", "Deca mono rang", "Rogneuse collar double rang", "Rogneuse mono rang",
    "Rogneuse coup eco", "Semoir APV", "Disque emoteur triple", "Disque boisselet pulvériseur",
    "Disque emoteur double", "Buttoir boisselet", "Semoir chollet service bleu", "Racleur téflon jaune",
    "Peigne", "Brosse métallique boisselet", "Rotofil AVIF", "Rotofil AMG", "Lame intercept brown",
    "Rogneuse pellenc", "Broyeur a sarment boisselet", "Tarriere boisselet", "Tarriere souslicoff",
    "Prétailleuse pellenc", "Effeuilleuse", "Pulvé 1035", "Pulvé mono rang", "Pulvé tractis",
    "Pulvé TS", "Pulvé MT", "Pulvé Tecnoma", "Machine a tirer les fils", "Machine a enrouler les fils",
    "Epareuse", "Epareuse taille haie", "Treuil", "Machine a soufrée", "Baliseuse",
    "Broyeur thermique RABOT", "Brouette électrique", "Jeu de griffes double rang", "Jeu de griffes mono rang",
    "Disque boisselet", "Disque braun", "Brouette maçon", "Cheminé broyeur", "Charriot épamprage",
    "Compresseur effeuilleuse", "Brouette de sarmentage", "Tarière boisselet", "Rol’ n sem",
    "Tondeuse Boisselet Coupe 45", "Tondeuse Boisselet Coupe 50",
  ];

  const category = await prisma.category.findUnique({
    where: {
      label_serviceId: {
        label: "tracteur",
        serviceId: atelierService.id
      }
    }
  });
  if (!category) throw new Error("Catégorie 'tracteur' introuvable !");

  // Le nom n'est plus unique : on cherche le matériel avant de créer ou mettre à jour
  for (const name of materialNames) {
    const existing = await prisma.material.findFirst({
      where: { name, serviceId: atelierService.id },
    });

    if (existing) {
      await prisma.material.update({
        where: { id: existing.id },
        data: {
          categoryId: category.id,
          updated_at: new Date(),
        },
      });
    } else {
      await prisma.material.create({
        data: {
          name,
          mimetype: 'application/octet-stream',
          is_store: false,
          serviceId: atelierService.id,
          categoryId: category.id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
    }
  }
  console.log("✅ Matériels insérées avec succès");
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => {
    console.error('❌ Erreur pendant le seeding :', e);
    await prisma.$disconnect();
    process.exit(1);
  });
