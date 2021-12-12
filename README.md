# Authentication and Testing Sprint Challenge

**Read these instructions carefully. Understand exactly what is expected _before_ starting this Sprint Challenge.**

This challenge allows you to practice the concepts and techniques learned over the past sprint and apply them in a concrete project. This sprint explored **Authentication and Testing**. During this sprint, you studied **authentication, JSON web tokens, unit testing, and backend testing**. In your challenge this week, you will demonstrate your mastery of these skills by creating **a dad jokes app**.

This is an individual assessment. All work must be your own. All projects will be submitted to Codegrade for automated review. You will also be given feedback by code reviewers on Monday following the challenge submission. For more information on the review process [click here.](https://www.notion.so/bloomtech/How-to-View-Feedback-in-CodeGrade-c5147cee220c4044a25de28bcb6bb54a)

You are not allowed to collaborate during the sprint challenge.

## Project Setup

- [ ] Run `npm install` to install your dependencies.
- [ ] Build your database executing `npm run migrate`.
- [ ] Run tests locally executing `npm test`.

## Project Instructions

Dad jokes are all the rage these days! In this challenge, you will build a real wise-guy application.

Users must be able to call the `[POST] /api/auth/register` endpoint to create a new account, and the `[POST] /api/auth/login` endpoint to get a token.

We also need to make sure nobody without the token can call `[GET] /api/jokes` and gain access to our dad jokes.

We will hash the user's password using `bcryptjs`, and use JSON Web Tokens and the `jsonwebtoken` library.

### MVP

Your finished project must include all of the following requirements (further instructions are found inside each file):

- [ ] An authentication workflow with functionality for account creation and login, implemented inside `api/auth/auth-router.js`.
- [ ] Middleware used to restrict access to resources from non-authenticated requests, implemented inside `api/middleware/restricted.js`.
- [ ] A minimum of 2 tests per API endpoint, written inside `api/server.test.js`.

**IMPORTANT Notes:**

- Do not exceed 2^8 rounds of hashing with `bcryptjs`.
- If you use environment variables make sure to provide fallbacks in the code (e.g. `process.env.SECRET || "shh"`).
- You are welcome to create additional files but **do not move or rename existing files** or folders.
- Do not alter your `package.json` file except to install extra libraries. Do not update existing packages.
- The database already has the `users` table, but if you run into issues, the migration is available.
- In your solution, it is essential that you follow best practices and produce clean and professional results.
- Schedule time to review, refine, and assess your work and perform basic professional polishing.

## Submission format

- [ ] Submit via Codegrade by pushing commits to your `main` branch on Github.
- [ ] Check Codegrade before the deadline to compare its results against your local tests.
- [ ] Check Codegrade on the days following the Sprint Challenge for reviewer feedback.
- [ ] New commits will be evaluated by Codegrade if pushed _before_ the sprint challenge deadline.

## Interview Questions

Be prepared to demonstrate your understanding of this week's concepts by answering questions on the following topics.

1. Differences between using _sessions_ or _JSON Web Tokens_ for authentication.

Sessions provide a way to persist data across requests. For example, we'll use them to save authentication information, so there is no need to re-enter credentials on every new request the client makes to the server. When using sessions, each client will have a unique session stored on the server. In ordee to transmit authentication information between the client and server. For that, we'll use cookies. 

Every HTTP message has two main parts: the headers and the body. To send cookies, the server adds the Set-Cookie header to the response like so: "Set-Cookie": "session=12345". The browser will read the header and save a cookie called session with the value 12345 in this example
The browser will add the "Cookie": "session=12345" header on every subsequent request and the server. Cookies are not accessible from JavaScript or anywhere because they are cryptographically signed and very secure.


JSON Web Tokens (JWT) are a way to transmit information between parties in the form of a JSON object. The JSON information is most commonly used for authentication and information exchange. 

When you design a backend application, if it is well designed, the application will be stateless. Especially when you have millions of users, you want to be able to horizontally scale your application. Horizontally scaling means being able to scale by adding servers. Vertically scaling means taking an existing server and adding capacity/computing power/space to it

Horizontal scaling generates some challenges related to your application design. If you are keeping session data in memory, then every request from a user would have to go back to the same server in order to validate the session id. You can generate sticky sessions, which allows that your requests always go to the same server until your session has expired. You can do that, but you have to plan for that.

When you have an application, there is always state (variables a and their values). The question is where you store that state. A stateless application means that the state is not going to be stored in the application (disk, database, memory). The application doesn’t keep track of it. 

By keeping the state in the token, every time the client makes a request, the state that is in the token is sent to the application. The application needs a way to validate. 


2. What does `bcryptjs` do to help us store passwords in a secure manner?

Authentication is the process by which our Web API verifies a client's identity that is trying to access a resource.  
Some of the things we need to take into account when implementing authentication are:
•	Password storage.
•	Password strength.
•	Brute-force safeguards.

Regarding password storage, there are the two main options: encryption and hashing.
•	Encryption goes two ways. First, it utilizes plain text and private keys to generate encrypted passwords and then reverses the process to match an original password.
•	Cryptographic hashes only go one way: parameters + input = hash. It is pure; given the same parameters and input, it generates the same hash.
Suppose the database of users and keys is compromised. In that case, it is possible to decrypt the passwords to their original values, which is bad because users often share passwords across different sites. This is one reason why cryptographic hashing is the preferred method for storing user passwords.

A common way that attackers circumvent hashing algorithms is by pre-calculating hashes for all possible character combinations up to a particular length using common hashing techniques. 

In order to slow down hackers' ability to get at a user's password. To do so, we will add time to our security algorithm to produce what is known as a key derivation function.
[Hash] + [Time] = [Key Derivation Function].

Instead of writing our key derivation function, we use a well-known and popular module called bcryptjs. Bcryptjs features include:
•	password hashing function
•	implements salting both manually and automatically.
•	accumulative hashing rounds

Having an algorithm that hashes the information multiple times (rounds) means an attacker needs to have the hash, know the algorithm used, and how many rounds were used to generate the hash in the first place.


3. How are unit tests different from integration and end-to-end testing?

Unit tests are where we isolate smaller units of software (often functions or methods). There are usually many unit tests in a codebase, and because these tests are meant to be run often, they need to run fast. 

End to end testing (E2E testing) refers to a software testing method that involves testing an application's workflow from beginning to end. This method basically aims to replicate real user scenarios so that the system can be validated for integration and data integrity.

4. How does _Test Driven Development_ change the way we write applications and tests?

TDD allows writing smaller code having single responsibility rather than monolithic procedures with multiple responsibilities. This makes the code simpler to understand. TDD also forces to write only production code to pass tests based on user requirements.

As a result, unit tests are the preferred tool for test driven development (TDD). Developers regularly use them to test correctness in units of code (usually functions).