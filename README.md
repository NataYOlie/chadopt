
# Chadopt

Chadopt' is the equivalent of the famous website [https://www.adopteunmec.com/](https://www.adopteunmec.com/) but for adopting a cat. 

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Installation
You need to have [node.js](https://nodejs.org/en/download) installed (v18.17.0. or higher)
and [Next.js](https://nextjs.org/docs/getting-started/installation) (14.0.4 or higher)

### Dependencies
run
```bash
npm install
```
-   [mongoose](https://mongoosejs.com/docs/): for data model management
-   [mongodb](https://www.npmjs.com/package/mongodb): for connecting to the database
-   [bcrypt](https://www.npmjs.com/package/bcrypt): password encryption
-   [next-auth](https://www.npmjs.com/package/next-auth): for authentication management
-   [react-bootstrap](https://www.npmjs.com/package/react-bootstrap): used for the Modal component
-   [fontawesome](https://www.npmjs.com/package/react-fontawesome): Because we always need icons

random cat pictures are furnished by https://cataas.com/

🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈
## Getting Started

### See it in action


#### No User connected
![chadopt_noUser_demo-1](https://raw.githubusercontent.com/NataYOlie/chadopt/master/public/demo/intro_chadopt.gif)

**Users have to be authenticated to adopt**
![chadopt_noUser_demo_2](https://github.com/NataYOlie/chadopt/blob/master/public/demo/2_userCantAdoptIfNotConnected.gif?raw=true)
**User can authentify or create account** 
![chadopt_noUser_demo_3](https://github.com/NataYOlie/chadopt/blob/master/public/demo/3_createAccount.gif?raw=true)
- - - 
#### User is connected
**Authenticated users can add cats to their favorites and apply filters. ❤️**
![chadopt_noUser_demo_4](https://github.com/NataYOlie/chadopt/blob/master/public/demo/4_userCanFilterFavorites.gif?raw=true)

**Authenticated users can adopt a cat** 😻
![chadopt_noUser_demo_4](https://github.com/NataYOlie/chadopt/blob/master/public/demo/5_userCanAdoptCat.gif?raw=true)

**Multiple cats** 😻😻
![chadopt_noUser_demo_5](https://github.com/NataYOlie/chadopt/blob/master/public/demo/5bis_UsercanAdopt2cats.gif?raw=true)

**Authenticated users can change their mind** 😿
![chadopt_noUser_demo_5bis](https://github.com/NataYOlie/chadopt/blob/master/public/demo/6_UserCanDesadopt.gif?raw=true)
- - - 
#### Admin is connected
**Admin can create a cat** 😻
![chadopt_noUser_demo_5bis](https://github.com/NataYOlie/chadopt/blob/master/public/demo/7_AdminCanCreateCat.gif?raw=true)

**Admin can modify cat and accept or reject adoption application** ❤️
![chadopt_noUser_demo_5bis](https://github.com/NataYOlie/chadopt/blob/master/public/demo/8_AdminCanodifyCat_appStatus.gif?raw=true)

Admin can also delete cat, but we prefer not to show such a poor experience.

### See it by yourself !
First, run the development server :
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


