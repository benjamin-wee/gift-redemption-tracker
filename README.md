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

Use the following commands to interact with the system. **Prepend `npm start`** to each command as shown below:

```bash
npm start load-staff <csvFilePath>
# Load staff mapping data from a CSV file.

npm start redeem <staffPassId>
# Redeem a gift for the team corresponding to the staff pass ID.

npm start lookup <staffPassId>
# Lookup the team for a given staff pass ID.

npm start drop-tables
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

This project uses **Jest** to test the correctness of the database operations and the gift redemption logic. The test case covers the **3 core functionalities stated in the assignment (lookup, verification of redemption status, adding new redemption)**. Other functions tested are key operations, including database operations. 

**Jest** was used for **mocking data** for testing, as well as **spying** to simulate certain failures

Below is a guide on how to run them.

To run all the tests:
```bash
NODE_ENV=test npm test   
```

To run a specific test:
```bash
NODE_ENV=test npm test <PATH_TO_TEST_FILE>
# Eg. NODE_ENV=test npm test tests/insertRedemption.test.ts
```


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





