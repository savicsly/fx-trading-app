# FX Trading App

## Overview

The FX Trading App is a financial application that allows users to manage wallets, perform currency conversions, and trade currencies. It integrates with external APIs to fetch real-time exchange rates and provides secure endpoints for user authentication and wallet operations. A technical assessment for CredPal Backend Developer.

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
   Rename the `.env.sample` file in the root directory to .env and add the appropriate values:

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
   - Public endpoints (e.g., `/auth/login`, `/auth/register`, `/auth/resend-otp`) do not require authentication.

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

### Transactions

- **Get /transactions
  Get a list of transactions.
  **Request Body**: `{ userId }`
  **Response\*\*: `{ type: string, currency: string, ... }`

### Architectural Design

The FX Trading App is designed with a modular architecture to ensure scalability, maintainability, and separation of concerns. Below is an overview of the key architectural principles and components:

#### Key Principles

1. **Modularity**:

   - The application is divided into distinct modules, each responsible for a specific domain (e.g., Authentication, Wallet, FX Rates).

2. **Separation of Concerns**:

   - Controllers handle HTTP requests and responses.
   - Services encapsulate business logic.
   - Repositories interact with the database.

3. **Scalability**:

   - The architecture supports horizontal scaling by decoupling components and using Redis for caching.

4. **Security**:
   - JWT-based authentication ensures secure access to protected endpoints.
   - Sensitive data (e.g., passwords) is hashed before storage.

#### Component Interaction

1. **Controllers**:

   - Receive HTTP requests and delegate tasks to services.
   - Example: `AuthController` handles user login and registration.

2. **Services**:

   - Contain the core business logic.
   - Example: `WalletService` manages wallet operations like funding and currency conversion.

3. **Repositories**:

   - Use TypeORM to interact with the PostgreSQL database.
   - Example: `TransactionRepository` handles CRUD operations for transactions.

4. **External Integrations**:

   - The app integrates with external APIs for real-time exchange rates.
   - Example: `FxService` fetches and caches exchange rates.

5. **Caching**:

   - Redis is used to cache exchange rates and reduce API calls.

6. **Database**:
   - PostgreSQL stores user, wallet, and transaction data.
   - Database migrations ensure schema consistency.

#### Data Flow

1. **Authentication**:

   - Users authenticate via `/auth/login` to receive a JWT token.
   - The token is validated for subsequent requests to protected endpoints.

2. **Wallet Operations**:

   - Users can fund their wallets, convert currencies, and trade currencies.
   - Transactions are logged for auditing and reporting.

3. **FX Rates**:

   - Exchange rates are fetched from an external API and cached for 10 minutes.
   - Rates are used for currency conversion and trading.

4. **Transaction Logging**:
   - All wallet operations are recorded in the database for traceability.

This architecture ensures that the FX Trading App is robust, secure, and easy to extend as new features are added.

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
