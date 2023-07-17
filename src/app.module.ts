import { ProfilesModule } from './modules/profiles/profiles.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppDataSource } from './app/databases/config';
import { ConfigModule } from '@nestjs/config';
import { FaqsModule } from './modules/faqs/faqs.module';
import { UsersModule } from './modules/users/users.module';
import { AppSeedDataSource } from './app/databases/config/orm-config-seed';
import { ResetPasswordsModule } from './modules/reset-passwords/reset-passwords.module';
import { ContactUsModule } from './modules/contact-us/contact-us.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ContributorsModule } from './modules/contributors/contributors.module';
import { ProductsModule } from './modules/products/products.module';
import { CountriesModule } from './modules/countries/countries.module';
import { CartsModule } from './modules/cats/cats.module';
import { DiscountsModule } from './modules/discounts/discounts.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { DonationsModule } from './modules/donations/donations.module';
import { InvestmentsModule } from './modules/investments/investments.module';
import { WalletsModule } from './modules/wallets/wallets.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(AppDataSource.options),
    TypeOrmModule.forRoot(AppSeedDataSource.options),
    ScheduleModule.forRoot(),
    FaqsModule,
    ProfilesModule,
    UsersModule,
    ProjectsModule,
    ContributorsModule,
    CategoriesModule,
    CountriesModule,
    TransactionsModule,
    OrganizationsModule,
    ResetPasswordsModule,
    ProductsModule,
    DiscountsModule,
    DonationsModule,
    CartsModule,
    WalletsModule,
    InvestmentsModule,
    ContactUsModule,
  ],
})
export class AppModule {}
