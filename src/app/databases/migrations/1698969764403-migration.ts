import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1698969764403 implements MigrationInterface {
  name = 'Migration1698969764403';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "client_order" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "orderNumber" character varying NOT NULL, "subject" character varying, "paymentMethod" character varying, "currency" character varying, "email" character varying, "priceSupTotal" bigint, "priceTotalBeforeDiscount" bigint, "vat" character varying, "priceTotal" bigint, "price" bigint, "quantity" integer, "userClientId" uuid, CONSTRAINT "UQ_3c6045ecd3cfa13043f0695effe" UNIQUE ("orderNumber"), CONSTRAINT "PK_df9613f771136dc7059b147a601" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_product" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "titleProduct" character varying, "currency" character varying, "discountProduct" bigint, "discountCoupon" bigint, "price" bigint, "priceDiscount" bigint, "discountPercent" bigint, "priceTotal" bigint, "quantity" bigint, "returnProduct" text, "userId" bigint, "userSellerId" uuid, "userClientId" uuid, "clientOrderId" uuid, "userTransportId" bigint, "statusConversation" integer NOT NULL DEFAULT '0', "status" character varying NOT NULL DEFAULT 'ORDERED', "productId" uuid, CONSTRAINT "PK_539ede39e518562dfdadfddb492" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "discount" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying, "description" character varying, "percent" bigint NOT NULL DEFAULT '0', "expiredAt" TIMESTAMP WITH TIME ZONE, "organizationId" uuid, "enableExpiredAt" boolean NOT NULL DEFAULT false, "startedAt" TIMESTAMP WITH TIME ZONE, "userId" uuid, CONSTRAINT "PK_d05d8712e429673e459e7f1cddb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying, "subTitle" character varying, "slug" character varying, "sku" character varying, "urlMedia" character varying, "whoCanSee" "public"."product_whocansee_enum" NOT NULL DEFAULT 'PUBLIC', "urlRedirect" character varying, "enableUrlRedirect" boolean NOT NULL DEFAULT false, "price" double precision NOT NULL DEFAULT '0', "description" text, "messageAfterPayment" text, "moreDescription" character varying, "enableChooseQuantity" boolean NOT NULL DEFAULT false, "enableDiscount" boolean NOT NULL DEFAULT false, "enableLimitSlot" boolean NOT NULL DEFAULT false, "limitSlot" bigint NOT NULL DEFAULT '0', "status" character varying NOT NULL DEFAULT 'ACTIVE', "productType" character varying NOT NULL DEFAULT 'PHYSICAL', "categoryId" uuid, "discountId" uuid, "currencyId" uuid, "userId" uuid, "organizationId" uuid, CONSTRAINT "UQ_8cfaf4a1e80806d58e3dbe69224" UNIQUE ("slug"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cart" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying NOT NULL DEFAULT 'ADDED', "userId" uuid, "quantity" bigint, "productId" uuid, CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying, "title" character varying, "enableUrlMedia" boolean NOT NULL DEFAULT false, "urlMedia" character varying, "whoCanSee" "public"."post_whocansee_enum" NOT NULL DEFAULT 'PUBLIC', "type" character varying NOT NULL DEFAULT 'ARTICLE', "status" character varying NOT NULL DEFAULT 'ACTIVE', "allowDownload" boolean NOT NULL DEFAULT false, "description" text, "userId" uuid, "organizationId" uuid, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "postId" uuid NOT NULL, "categoryId" uuid NOT NULL, CONSTRAINT "PK_388636ba602c312da6026dc9dbc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "slug" character varying, "color" character varying, "description" text, "userId" uuid, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "membership" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying, "status" character varying NOT NULL DEFAULT 'ACTIVE', "description" text, "price" double precision, "month" bigint, "messageWelcome" text, "organizationId" uuid, "currencyId" uuid, "userId" uuid, CONSTRAINT "PK_83c1afebef3059472e7c37e8de8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "currency" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "code" character varying, "symbol" character varying, "amount" double precision NOT NULL DEFAULT '0', CONSTRAINT "PK_3cda65c731a6264f0e444cc9b91" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gift" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT true, "expiredAt" TIMESTAMP WITH TIME ZONE, "title" character varying, "image" character varying, "description" character varying, "amount" double precision NOT NULL, "organizationId" uuid, "currencyId" uuid, "userId" uuid, CONSTRAINT "PK_f91217caddc01a085837ebe0606" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contribution" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" double precision, "amountConvert" double precision, "type" character varying(30) NOT NULL DEFAULT 'ORGANIZATION', "organizationId" uuid, "currencyId" uuid, "userId" uuid, "giftId" uuid, "campaignId" uuid, "membershipId" uuid, CONSTRAINT "PK_878330fa5bb34475732a5883d58" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contact_us" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isRed" boolean NOT NULL DEFAULT false, "ipLocation" character varying, "subject" character varying, "fullName" character varying, "phone" character varying, "countryId" integer, "email" character varying, "description" text, "userCreatedId" uuid, "organizationId" uuid, CONSTRAINT "PK_b61766a4d93470109266b976cfe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contributor" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, "type" character varying NOT NULL DEFAULT 'ORGANIZATION', "role" character varying NOT NULL DEFAULT 'ADMIN', "organizationId" uuid, "userCreatedId" uuid, CONSTRAINT "PK_816afef005b8100becacdeb6e58" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "country" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL DEFAULT false, "name" character varying, CONSTRAINT "PK_bf6e37c231c4f4ea56dcd887269" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "withdrawal_user" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying, "iban" character varying, "phone" character varying, "description" character varying, "type" character varying NOT NULL DEFAULT 'CARD', "userId" uuid, CONSTRAINT "PK_76c0e76ec51f794d3bfc7f2bc40" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "like" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL DEFAULT 'COMMENT', "likeableId" uuid, "userId" uuid, CONSTRAINT "PK_eff3e46d24d416b52a7e0ae4159" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying, "fullName" character varying, "phone" character varying, "status" "public"."payment_status_enum" NOT NULL DEFAULT 'PENDING', "action" "public"."payment_action_enum" NOT NULL DEFAULT 'PAYMENT', "cardNumber" character varying, "cardExpMonth" integer, "cardExpYear" integer, "cardCvc" character varying, "type" character varying NOT NULL DEFAULT 'CARD', "description" text, "userId" uuid, "organizationId" uuid, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "subscribe" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "expiredAt" TIMESTAMP WITH TIME ZONE, "subscriberId" uuid, "membershipId" uuid, "userId" uuid, "organizationId" uuid, CONSTRAINT "PK_3e91e772184cd3feb30688ef1b8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organization" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "firstAddress" character varying, "secondAddress" character varying, "color" character varying, "image" character varying, "userId" uuid, CONSTRAINT "REL_b0d30285f6775593196167e201" UNIQUE ("userId"), CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "follow" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "followerId" uuid, "userId" uuid, CONSTRAINT "PK_fda88bc28a84d2d6d06e19df6e5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "comment" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" text, "model" character varying NOT NULL DEFAULT 'POST', "parentId" uuid, "color" character varying, "fullName" character varying, "email" character varying, "productId" uuid, "postId" uuid, "userReceiveId" uuid, "userId" uuid, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "upload" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "path" character varying, "status" character varying, "url" character varying, "uploadType" character varying NOT NULL DEFAULT 'IMAGE', "userId" uuid, "model" character varying NOT NULL DEFAULT 'PRODUCT', "uploadableId" uuid, "organizationId" uuid, CONSTRAINT "PK_1fe8db121b3de4ddfa677fc51f3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "faq" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying, "status" boolean NOT NULL DEFAULT true, "title" character varying, "type" character varying, "description" text, "userCreatedId" character varying, "userId" character varying, CONSTRAINT "PK_d6f5a52b1a96dd8d0591f9fbc47" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "donation" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying, "price" double precision NOT NULL, "description" text, "messageWelcome" text, "userId" uuid, CONSTRAINT "REL_063499388657e648418470a439" UNIQUE ("userId"), CONSTRAINT "PK_25fb5a541964bc5cfc18fb13a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "commission" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying, "image" character varying, "urlMedia" character varying, "price" double precision NOT NULL DEFAULT '0', "description" text, "enableLimitSlot" boolean NOT NULL DEFAULT false, "limitSlot" bigint NOT NULL DEFAULT '0', "messageAfterPayment" text, "status" character varying NOT NULL DEFAULT 'ACTIVE', "organizationId" uuid, "currencyId" uuid, "userId" uuid, CONSTRAINT "PK_d108d70411783e2a3a84e386601" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "profile" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullName" character varying, "firstName" character varying, "lastName" character varying, "description" text, "phone" character varying, "firstAddress" character varying, "secondAddress" character varying, "birthday" TIMESTAMP, "countryId" uuid, "image" character varying, "color" character varying, "enableCommission" boolean NOT NULL DEFAULT false, "enableShop" boolean NOT NULL DEFAULT false, "enableGallery" boolean NOT NULL DEFAULT false, "url" character varying, "currencyId" uuid, CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying, "slug" character varying, "image" character varying, "isActive" boolean NOT NULL DEFAULT true, "description" text, "userCreatedId" uuid, "userId" uuid, "organizationId" uuid, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "reset_password" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying, "accessToken" character varying, "token" character varying, CONSTRAINT "PK_82bffbeb85c5b426956d004a8f5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "testimonial" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying, "fullName" character varying, "occupation" character varying, "rete" integer, "image" character varying, "link" character varying, "description" text, "userCreatedId" uuid, "userId" uuid, CONSTRAINT "PK_e1aee1c726db2d336480c69f7cb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "wallet" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "accountId" character varying NOT NULL, "amount" double precision NOT NULL DEFAULT '0', "organizationId" uuid, CONSTRAINT "UQ_276aecaae66a8b798156f70fc4b" UNIQUE ("accountId"), CONSTRAINT "REL_c799f49d1f5e27b116957df945" UNIQUE ("organizationId"), CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" double precision, "amountConvert" double precision, "title" character varying, "description" character varying, "fullName" character varying, "email" character varying, "color" character varying, "token" character varying, "currency" character varying, "model" character varying NOT NULL DEFAULT 'MEMBERSHIP', "contributionId" uuid, "type" character varying NOT NULL DEFAULT 'CARD', "giftId" uuid, "withdrawalId" uuid, "campaignId" uuid, "userSendId" uuid, "userReceiveId" uuid, "organizationId" uuid, "subscribeId" uuid, CONSTRAINT "REL_57fdf097f80e305a3be60e96e5" UNIQUE ("contributionId"), CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "withdrawal" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" double precision, "confirmedAt" TIMESTAMP WITH TIME ZONE, "description" character varying, "userId" uuid, "withdrawalUserId" uuid, CONSTRAINT "PK_840e247aaad3fbd4e18129122a2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "confirmedAt" TIMESTAMP, "email" character varying, "accessToken" text, "refreshToken" text, "username" character varying, "token" character varying, "permission" character varying DEFAULT 'USER', "password" character varying, "provider" character varying, "nextStep" character varying NOT NULL DEFAULT 'SETTING_PROFILE', "organizationId" uuid, "profileId" uuid, CONSTRAINT "REL_9466682df91534dd95e4dbaa61" UNIQUE ("profileId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "campaign" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT true, "startedAt" TIMESTAMP WITH TIME ZONE, "expiredAt" TIMESTAMP WITH TIME ZONE, "title" character varying, "image" character varying, "description" character varying, "organizationId" uuid, "userId" uuid, CONSTRAINT "PK_0ce34d26e7f2eb316a3a592cdc4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_product" ADD CONSTRAINT "FK_073c85ed133e05241040bd70f02" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "discount" ADD CONSTRAINT "FK_cf500130a0d2ac5af6109068e63" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_1e0bf1305eddcd6627b4a32a6c6" FOREIGN KEY ("discountId") REFERENCES "discount"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_498f0ae3619a8e1f2f42434a4f7" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_329b8ae12068b23da547d3b4798" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_32a4bdd261ec81f4ca6b3abe262" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_756f53ab9466eb52a52619ee019" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_371eb56ecc4104c2644711fa85f" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_01d34b6e226affe884d75246ff2" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_category" ADD CONSTRAINT "FK_494ef7ec4fdfe88460918524b51" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_category" ADD CONSTRAINT "FK_08d685cc924e645dfad494c9129" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "membership" ADD CONSTRAINT "FK_4c62c8a7ba2337d6d6ffcd8eb6d" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "membership" ADD CONSTRAINT "FK_baffd07e4cc33cdafc223ba637c" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "membership" ADD CONSTRAINT "FK_eef2d9d9c70cd13bed868afedf4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "gift" ADD CONSTRAINT "FK_68ec6573da55ecf00dd0bdddcd4" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "gift" ADD CONSTRAINT "FK_f7a55bd23f1651967522262f50f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contribution" ADD CONSTRAINT "FK_f27eb6d19437d88eb70880fd2ca" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contribution" ADD CONSTRAINT "FK_d2084068d6246a419df6fec9d0f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contribution" ADD CONSTRAINT "FK_1a142b8239500ddab2b4466f2e3" FOREIGN KEY ("giftId") REFERENCES "gift"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contribution" ADD CONSTRAINT "FK_46dbbf7e710ca2b18dd8f0c8a19" FOREIGN KEY ("campaignId") REFERENCES "campaign"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contribution" ADD CONSTRAINT "FK_91fe7a33779e1895a928f6f4676" FOREIGN KEY ("membershipId") REFERENCES "membership"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contributor" ADD CONSTRAINT "FK_4be92df1dfa5c24a494e3f6b330" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contributor" ADD CONSTRAINT "FK_195a0e2bd5101efc95c2be6c1ed" FOREIGN KEY ("userCreatedId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "withdrawal_user" ADD CONSTRAINT "FK_c831ff1903eebce6e8da376fa1e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "like" ADD CONSTRAINT "FK_e8fb739f08d47955a39850fac23" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_b046318e0b341a7f72110b75857" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_be7fcc9fb8cd5a74cb602ec6c9b" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscribe" ADD CONSTRAINT "FK_ce4d1992337c8dc5e9d7173a2cd" FOREIGN KEY ("subscriberId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscribe" ADD CONSTRAINT "FK_b329814fde1b6d5e47b4d3ebf69" FOREIGN KEY ("membershipId") REFERENCES "membership"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscribe" ADD CONSTRAINT "FK_78138550e21d8b67790d761148d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscribe" ADD CONSTRAINT "FK_d72cff242225704046552c5be35" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "FK_b0d30285f6775593196167e2016" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "follow" ADD CONSTRAINT "FK_550dce89df9570f251b6af2665a" FOREIGN KEY ("followerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "follow" ADD CONSTRAINT "FK_af9f90ce5e8f66f845ebbcc6f15" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_1e9f24a68bd2dcd6390a4008395" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_94a85bb16d24033a2afdd5df060" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "donation" ADD CONSTRAINT "FK_063499388657e648418470a439a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "commission" ADD CONSTRAINT "FK_acc96be68db703cd47ded4d71cf" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "commission" ADD CONSTRAINT "FK_4dfe2bcf248c3d8ee0e4b5743e3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD CONSTRAINT "FK_ec56d42527f43b78a5272d431c0" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "FK_c799f49d1f5e27b116957df945f" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_57fdf097f80e305a3be60e96e5b" FOREIGN KEY ("contributionId") REFERENCES "contribution"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_8e50cf45135c794a78ad18db6c5" FOREIGN KEY ("giftId") REFERENCES "gift"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_ed0f4da5916ed6948bd4d81e8a0" FOREIGN KEY ("withdrawalId") REFERENCES "withdrawal"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_3f3891eefaf8dcce48eae8c709f" FOREIGN KEY ("campaignId") REFERENCES "campaign"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_54fceddb58a26773e187f80200c" FOREIGN KEY ("userSendId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_13c1566a315a3adfa91f2e09266" FOREIGN KEY ("userReceiveId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_5057f69022da9b19dd1dd96af6e" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_61a77de7e0fce82a038d90ffc3f" FOREIGN KEY ("subscribeId") REFERENCES "subscribe"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "withdrawal" ADD CONSTRAINT "FK_6eb34227c6d10e54e2d0d3f575f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "withdrawal" ADD CONSTRAINT "FK_fe30ccfb60fc6bc1a4395cd20b2" FOREIGN KEY ("withdrawalUserId") REFERENCES "withdrawal_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_dfda472c0af7812401e592b6a61" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_9466682df91534dd95e4dbaa616" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign" ADD CONSTRAINT "FK_8e2dc400e55e237feba0869bc02" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "campaign" DROP CONSTRAINT "FK_8e2dc400e55e237feba0869bc02"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_9466682df91534dd95e4dbaa616"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_dfda472c0af7812401e592b6a61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "withdrawal" DROP CONSTRAINT "FK_fe30ccfb60fc6bc1a4395cd20b2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "withdrawal" DROP CONSTRAINT "FK_6eb34227c6d10e54e2d0d3f575f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_61a77de7e0fce82a038d90ffc3f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_5057f69022da9b19dd1dd96af6e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_13c1566a315a3adfa91f2e09266"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_54fceddb58a26773e187f80200c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_3f3891eefaf8dcce48eae8c709f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_ed0f4da5916ed6948bd4d81e8a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_8e50cf45135c794a78ad18db6c5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_57fdf097f80e305a3be60e96e5b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "FK_c799f49d1f5e27b116957df945f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP CONSTRAINT "FK_ec56d42527f43b78a5272d431c0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "commission" DROP CONSTRAINT "FK_4dfe2bcf248c3d8ee0e4b5743e3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "commission" DROP CONSTRAINT "FK_acc96be68db703cd47ded4d71cf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "donation" DROP CONSTRAINT "FK_063499388657e648418470a439a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_94a85bb16d24033a2afdd5df060"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_1e9f24a68bd2dcd6390a4008395"`,
    );
    await queryRunner.query(
      `ALTER TABLE "follow" DROP CONSTRAINT "FK_af9f90ce5e8f66f845ebbcc6f15"`,
    );
    await queryRunner.query(
      `ALTER TABLE "follow" DROP CONSTRAINT "FK_550dce89df9570f251b6af2665a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "FK_b0d30285f6775593196167e2016"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscribe" DROP CONSTRAINT "FK_d72cff242225704046552c5be35"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscribe" DROP CONSTRAINT "FK_78138550e21d8b67790d761148d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscribe" DROP CONSTRAINT "FK_b329814fde1b6d5e47b4d3ebf69"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscribe" DROP CONSTRAINT "FK_ce4d1992337c8dc5e9d7173a2cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_be7fcc9fb8cd5a74cb602ec6c9b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_b046318e0b341a7f72110b75857"`,
    );
    await queryRunner.query(
      `ALTER TABLE "like" DROP CONSTRAINT "FK_e8fb739f08d47955a39850fac23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "withdrawal_user" DROP CONSTRAINT "FK_c831ff1903eebce6e8da376fa1e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contributor" DROP CONSTRAINT "FK_195a0e2bd5101efc95c2be6c1ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contributor" DROP CONSTRAINT "FK_4be92df1dfa5c24a494e3f6b330"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contribution" DROP CONSTRAINT "FK_91fe7a33779e1895a928f6f4676"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contribution" DROP CONSTRAINT "FK_46dbbf7e710ca2b18dd8f0c8a19"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contribution" DROP CONSTRAINT "FK_1a142b8239500ddab2b4466f2e3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contribution" DROP CONSTRAINT "FK_d2084068d6246a419df6fec9d0f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contribution" DROP CONSTRAINT "FK_f27eb6d19437d88eb70880fd2ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gift" DROP CONSTRAINT "FK_f7a55bd23f1651967522262f50f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gift" DROP CONSTRAINT "FK_68ec6573da55ecf00dd0bdddcd4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "membership" DROP CONSTRAINT "FK_eef2d9d9c70cd13bed868afedf4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "membership" DROP CONSTRAINT "FK_baffd07e4cc33cdafc223ba637c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "membership" DROP CONSTRAINT "FK_4c62c8a7ba2337d6d6ffcd8eb6d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_category" DROP CONSTRAINT "FK_08d685cc924e645dfad494c9129"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_category" DROP CONSTRAINT "FK_494ef7ec4fdfe88460918524b51"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_01d34b6e226affe884d75246ff2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_5c1cf55c308037b5aca1038a131"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" DROP CONSTRAINT "FK_371eb56ecc4104c2644711fa85f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" DROP CONSTRAINT "FK_756f53ab9466eb52a52619ee019"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_32a4bdd261ec81f4ca6b3abe262"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_329b8ae12068b23da547d3b4798"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_498f0ae3619a8e1f2f42434a4f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_1e0bf1305eddcd6627b4a32a6c6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_ff0c0301a95e517153df97f6812"`,
    );
    await queryRunner.query(
      `ALTER TABLE "discount" DROP CONSTRAINT "FK_cf500130a0d2ac5af6109068e63"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_product" DROP CONSTRAINT "FK_073c85ed133e05241040bd70f02"`,
    );
    await queryRunner.query(`DROP TABLE "campaign"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "withdrawal"`);
    await queryRunner.query(`DROP TABLE "transaction"`);
    await queryRunner.query(`DROP TABLE "wallet"`);
    await queryRunner.query(`DROP TABLE "testimonial"`);
    await queryRunner.query(`DROP TABLE "reset_password"`);
    await queryRunner.query(`DROP TABLE "project"`);
    await queryRunner.query(`DROP TABLE "profile"`);
    await queryRunner.query(`DROP TABLE "commission"`);
    await queryRunner.query(`DROP TABLE "donation"`);
    await queryRunner.query(`DROP TABLE "faq"`);
    await queryRunner.query(`DROP TABLE "upload"`);
    await queryRunner.query(`DROP TABLE "comment"`);
    await queryRunner.query(`DROP TABLE "follow"`);
    await queryRunner.query(`DROP TABLE "organization"`);
    await queryRunner.query(`DROP TABLE "subscribe"`);
    await queryRunner.query(`DROP TABLE "payment"`);
    await queryRunner.query(`DROP TABLE "like"`);
    await queryRunner.query(`DROP TABLE "withdrawal_user"`);
    await queryRunner.query(`DROP TABLE "country"`);
    await queryRunner.query(`DROP TABLE "contributor"`);
    await queryRunner.query(`DROP TABLE "contact_us"`);
    await queryRunner.query(`DROP TABLE "contribution"`);
    await queryRunner.query(`DROP TABLE "gift"`);
    await queryRunner.query(`DROP TABLE "currency"`);
    await queryRunner.query(`DROP TABLE "membership"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TABLE "post_category"`);
    await queryRunner.query(`DROP TABLE "post"`);
    await queryRunner.query(`DROP TABLE "cart"`);
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TABLE "discount"`);
    await queryRunner.query(`DROP TABLE "order_product"`);
    await queryRunner.query(`DROP TABLE "client_order"`);
  }
}
