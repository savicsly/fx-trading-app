<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# FX Trading App

## Overview

The FX Trading App is a financial application that allows users to manage wallets, perform currency conversions, and trade currencies. It integrates with external APIs to fetch real-time exchange rates and provides secure endpoints for user authentication and wallet operations.

---

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database
- Redis server

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/fx-trading-app.git
   cd fx-trading-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory and add the following:

   ```env
   DATABASE_URL=postgres://username:password@localhost:5432/fx_trading
   REDIS_URL=redis://localhost:6379
   OPEN_EXCHANGE_URL=https://api.exchangerate-api.com/v4/latest
   OPEN_EXCHANGE_API_KEY=your_api_key
   JWT_SECRET=your_jwt_secret
   ```

4. Run database migrations:

   ```bash
   npm run typeorm migration:run
   ```

5. Start the application:
   ```bash
   npm run start:dev
   ```

---

## Key Assumptions

1. **Exchange Rates**:

   - Exchange rates are fetched from an external API (`https://api.exchangerate-api.com`).
   - Rates are cached for 10 minutes to reduce API calls.

2. **Wallets**:

   - Each user has a single wallet with balances stored as a key-value pair (e.g., `{ USD: 100, NGN: 5000 }`).
   - Wallets are initialized with a default balance of 5000 NGN.

3. **Authentication**:

   - JWT-based authentication is used to secure endpoints.
   - Public endpoints (e.g., `/auth/login`, `/auth/register`) do not require authentication.

4. **Transactions**:
   - All transactions (funding, conversion, trading) are recorded in the database for auditing purposes.

---

## API Documentation

### Authentication

- **POST /auth/login**
  Authenticate a user and return a JWT token.
  **Request Body**: `{ email: string, password: string }`
  **Response**: `{ token: string }`

- **POST /auth/register**
  Register a new user.
  **Request Body**: `{ email: string, password: string, name: string }`
  **Response**: `{ id: number, email: string, name: string }`

### Wallets

- **GET /wallet**
  Get wallet balances for the authenticated user.
  **Response**: `{ USD: number, NGN: number, ... }`

- **POST /wallet/fund**
  Fund a wallet with a specific currency.
  **Request Body**: `{ currency: string, amount: number }`
  **Response**: `{ USD: number, NGN: number, ... }`

- **POST /wallet/convert**
  Convert currency within the wallet.
  **Request Body**: `{ baseCurrency: string, targetCurrency: string, amount: number }`
  **Response**: `{ USD: number, NGN: number, ... }`

- **POST /wallet/trade**
  Trade currency within the wallet.
  **Request Body**: `{ baseCurrency: string, targetCurrency: string, amount: number }`
  **Response**: `{ USD: number, NGN: number, ... }`

### FX Rates

- **GET /fx/rates**
  Get current FX rates.
  **Response**: `{ USD: 1, EUR: 0.85, NGN: 460, ... }`

---

## Architectural Design

### Key Components

1. **Controllers**:

   - Handle HTTP requests and responses.
   - Example: `WalletController`, `AuthController`, `FxController`.

2. **Services**:

   - Contain business logic and interact with repositories.
   - Example: `WalletService`, `FxService`, `TransactionService`.

3. **Entities**:

   - Represent database tables using TypeORM.
   - Example: `User`, `Wallet`, `Transaction`.

4. **Modules**:

   - Group related controllers, services, and providers.
   - Example: `AuthModule`, `WalletModule`, `FxModule`.

5. **Utility Services**:
   - Provide reusable functionality (e.g., fetching exchange rates with caching).

### Data Flow

1. **Authentication**:

   - Users authenticate via `/auth/login` to receive a JWT token.
   - Protected endpoints require the token for access.

2. **Wallet Operations**:

   - Users can fund their wallets, convert currencies, and trade currencies.
   - Transactions are recorded in the database.

3. **FX Rates**:

   - Exchange rates are fetched from an external API and cached for 10 minutes.

4. **Database**:
   - PostgreSQL is used to store user, wallet, and transaction data.
   - Redis is used for caching.

---

## Running Tests

Run unit tests:

```bash
npm run test
```

Run end-to-end tests:

```bash
npm run test:e2e
```

---

## License

This project is licensed under the MIT License.
