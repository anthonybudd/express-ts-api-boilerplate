# Express.ts API Boilerplate

<img height="75" src="https://raw.githubusercontent.com/anthonybudd/anthonybudd/master/img/express-ts-api-boilerplate.png?v=1"/>

# ⚠️ This project is still under-development

A very mimimal REST API boilerplate using Express.ts, Sequelize and MySQL. 

This project is designed to work with [AnthonyBudd/Vuetify-SPA-Boilerplate](https://github.com/anthonybudd/Vuetify-SPA-boilerplate)


- 👥 Users, Groups and Roles
- 🔐 Auth using JWT's with Passport
- 🌐 Production-ready [OpenApiSpec.yml](./OpenApiSpec.yml) & [Kubernetes files](./k8s)
- 🥇 Real-world tested, generated over $50M in revenue


```sh
git clone git@github.com:anthonybudd/express-ts-api-boilerplate.git
cd express-ts-api-boilerplate
cp .env.example .env

# Optional: Find & Replace (case-sensaive, whole repo): "express-api" => "your-api-name" 
LC_ALL=C find . -type f -name '*.*' -exec sed -i '' s/express-api/your-api-name/g {} +

# Private RSA key for JWT signing
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -outform PEM -pubout -out public.pem

# Start the app
npm install
docker compose up
npm run _db:refresh
npm run _test
```

### DB Structure
The DB structure is the optimum balance of functionality and minimalism. A User can belong to many Groups through the GroupsUsers table. This allows you to make very basic single-user applications that do not even require the concept of groups or full SaaS solutions with complex User-Group relationships.

```                                                                
+--------------+           +---------------+         +--------------+  
|Users         | --------∈ |GroupsUsers    | ∋------ |Groups        |  
|--------------|           |---------------|         |--------------|  
|id            |           |id             |         |id            |  
|email         |           |groupID        |         |name          |  
|password      |           |userID         |         |ownerID       |  
|firstName     |           |createdAt      |         |createdAt     |  
|lastName      |           +---------------+         |updatedAt     |  
|createdAt     |                                     +--------------+  
|updatedAt     |                                                       
|...           |                                                      
+--------------+                      
```

### Routes
| Method      | Route                                                    | Description                           | Payload                               | Response          | 
| ----------- | -------------------------------------------------------- | ------------------------------------- | ------------------------------------- | ----------------- |  
| **DevOps**  |                                                          |                                       |                                       |                   |  
| GET         | `/_readiness`                                            | Kuber readiness check                 | --                                    | "healthy"         |  
| GET         | `/api/v1/_healthcheck`                                   | Returns {status: 'ok'} if healthy     | --                                    | {status: 'ok'}    |  
| **Auth**    |                                                          |                                       |                                       |                   |  
| POST        | `/api/v1/auth/login`                                     | Login                                 | {email, password}                     | {accessToken}     |  
| POST        | `/api/v1/auth/sign-up`                                   | Sign-up                               | {email, password, firstName, tos}     | {accessToken}     |  
| GET         | `/api/v1/auth/verify-email/:emailVerificationKey`        | Verify Email                          | --                                    | {success: true}   |  
| POST        | `/api/v1/auth/forgot`                                    | Forgot                                | {email}                               | {success: true}   |  
| GET         | `/api/v1/auth/get-user-by-reset-key/:passwordResetKey`   | Get user for given `passwordResetKey` | --                                    | {id, email}       |  
| POST        | `/api/v1/auth/reset`                                     | Reset Password                        | {email, password, passwordResetKey}   | {accessToken}     |  
| GET         | `/api/v1/auth/get-user-by-invite-key/:inviteKey`         | Get user for given `inviteKey`        | --                                    | {id, email}       |  
| POST        | `/api/v1/auth/invite`                                    | Complete user invite process          | {inviteKey, email, password, ...}     | {accessToken}     |   
| GET         | `/api/v1/_authcheck`                                     | Returns {auth: true} if has auth      | --                                    | {auth: true}      |  
| **User**    |                                                          |                                       |                                       |                   |  
| GET         | `/api/v1/user`                                           | Get the current user                  |                                       | {User}            |  
| POST        | `/api/v1/user`                                           | Update the current user               | {firstName, lastName}                 | {User}            |  
| POST        | `/api/v1/user/update-password`                           | Update password                       | {password, newPassword}               | {success: true}   |
| **Groups**  |                                                          |                                       |                                       |                   |  
| GET         | `/api/v1/groups/:groupID`                                | Returns group by ID                   | --                                    | {Group}           |  
| POST        | `/api/v1/groups/:groupID`                                | Update group by ID                    | {name: 'New Name'}                    | {Group}           |  
| POST        | `/api/v1/groups/:groupID/users/invite`                   | Invite user to group                  | {email}                               | {UserID, GroupID} |  
| DELETE      | `/api/v1/groups/:groupID/users/:userID`                  | Remove user from group                | --                                    | {UserID}          |  



### Deployment
Full Kubernetes deployment instructions can be found in [k8s/Deploy.md](./k8s/Deploy.md).

- [api.deployment.yml](./k8s/api.deployment.yml)
- [api.service.yml](./k8s/api.service.yml)
- [api.ingress.yml](./k8s/api.ingress.yml)

```sh
kubectl apply -f .k8s/api.deployment.yml \
  -f .k8s/api.ingress.yml \
  -f .k8s/api.service.yml 
```

### Generate SDK Client Libraries
There is an [OpenAPISpec](./OpenApiSpec.yml) in the root of the repo. The project includes code generation config files for PHP, JavaScript and Swift. Use the below command to generate SDK Client Libraries for your API to `/sdk/dist`. A full list of supported langauages [can be found here.](https://github.com/OpenAPITools/openapi-generator?tab=readme-ov-file#overview)


```sh
docker run --rm \
  -v ${PWD}:/app \
  -w /app \
  openapitools/openapi-generator-cli batch sdk/config/*.yaml
```

### Commands
There are a few helper scripts and commands for interacting with the application.

Some commands need to be run inside the docker container, these commands have been aliased with an underscore prefix, for exmaple `npm run _db:refresh` is an alias for `docker exec -ti express-api npm run db:refresh` which actually runs `./src/scripts/refresh`
| Command               | Description                   | Exmaple                          | 
| --------------------- | ----------------------------- | -------------------------------- |
| jwt.ts                | Generate JWT for a user       | `docker exec -ti express-api ts-node ./src/scripts/jwt.ts --userID="c4644733-deea-47d8-b35a-86f30ff9618e"` |
| forgotPassword.ts     | Generate password reset link  | `docker exec -ti express-api ts-node ./src/scripts/forgotPassword.ts --userID="c4644733-deea-47d8-b35a-86f30ff9618e"` |
| resetPassword.ts      | Password user password        | `docker exec -ti express-api ts-node ./src/scripts/resetPassword.ts --userID="c4644733-deea-47d8-b35a-86f30ff9618e" --password="password"` |
| inviteUser.ts         | Invite user to group          | `docker exec -ti express-api ts-node ./src/scripts/inviteUser.ts --email="newuser@example.com" --groupID="fdab7a99-2c38-444b-bcb3-f7cef61c275b"` |

