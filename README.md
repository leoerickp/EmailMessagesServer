<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Email Messages Server

## Getting start

_These instructions let get a copy of project for testing and developing._

## Requirements

_Clone the project in your PC:_

- Clone the [EmailMessagesServer](https://github.com/leoerickp/EmailMessagesServer.git).

## Config

_Into the project folder, it must create de file .env and add the following information:_

```javascript
STORE_STATE=dev
STORE_PORT=3000
STORE_MONGODB=mongodb://EmailServer:27017/emailDB
STORE_JWT_SECRET=
ADMIN_EMAIL=admin-daemon@google.com
```

---

## Run

_Into the project folder:_

- Execute the following command:

```console
docker-compose -f docker-compose.prod.yml up --build
```

## Frontend Food for free

_The Frontend code repostory is available in:_ [EmailMessages-Frontend](https://github.com/leoerickp/EmailMessagesFrontend.git).

## Author

- [Leo Erick Pereyra Rodriguez](https://leoerickp.cf/).
