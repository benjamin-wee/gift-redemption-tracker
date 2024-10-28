# gift-redemption-tracker

## Overview

This project implements a Command Line **Gift Redemption System** to manage the distribution of Christmas gifts by departments.

---

## Table of Contents

1. [Features](#features)  
2. [Tech Stack](#tech-stack)  
3. [Setup and Installation](#setup-and-installation)  
4. [Usage](#usage)  
5. [Testing](#testing)  
6. [Assumptions](#assumptions)  
7. [Potential Optimisations](#potential-optimisations)  

---

## Features

- **Staff ID Look-up**: Verify if a representative’s staff ID belongs to a valid team.
- **Redemption Check**: Ensure a team has not already redeemed their gift.
- **Redemption Record**: Record a redemption if the team is eligible, or reject the request.
- **SQLite Database** for storing redemption data.
- **Unit Tests** to validate the core functionalities.

---

## Tech Stack

- **Backend**: Node.js with TypeScript  
- **Database**: SQLite for data persistence  
- **Testing Framework**: Jest for unit testing

---

## Setup and Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/benjamin-wee/gift-redemption-tracker.git
    cd gift-redemption-tracker
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Configure SQLite database:**

No special setup is required since SQLite is embedded. The database will be created automatically during the first run.

---

## Usage

Use the following commands to interact with the system. **Prepend `npx ts-node src/index.ts`** to each command as shown below:

```bash
npx ts-node src/index.ts load-staff <csvFilePath>
# Load staff mapping data from a CSV file.

npx ts-node src/index.ts redeem <teamName>
# Redeem a gift for a team.

npx ts-node src/index.ts lookup <staffPassId>
# Lookup the team for a given staff pass ID.

npx ts-node src/index.ts drop-tables
# Drop all tables (for testing purposes).
```

To view the database:

```bash
sqlite3 gift_redemption.db
```
Inside the SQLite prompt, run:

```bash
.tables
# View all tables.
```
Example queries:

```bash
SELECT * FROM redemptions;
SELECT * FROM staff_mapping;
```

Exit the SQLite prompt:
```bash
.exit
```
---

## Testing 

---

## Assumptions

- Redemption data has to be **persisted in the SQLite database** to ensure redemptions are accurately tracked.
- **SQLite** is used for simplicity while achieving data persistence in this assignment, but it can be replaced with another database system for scalability.
  - Since this is a **read-heavy application**, and the requirements are not highly relational, **DynamoDB** was initially considered for its efficient **O(1) lookups**. However, it was ultimately not chosen to keep the setup simple and easier for interviewers to run.
  - **Hashmaps** were also considered for **O(1) lookups**. While they would provide fast retrieval, they were ruled out as they do not support **data persistence between runs**.

---

## Potential Optimisations

- **Use Indexing in SQLite**: Implement **indexes** on frequently queried fields, such as `staff_pass_id` , to optimize lookups from **O(n)** to **O(log n)** and improve query performance.
- **Switch to DynamoDB**: Since this is a read-heavy application, migrating to **DynamoDB** would enhance performance with **O(1) lookups** and better scalability.





