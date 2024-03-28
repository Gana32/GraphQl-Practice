const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParsser = require("body-parser");
const cors = require("cors");
const { default: axios } = require("axios");

async function startServer() {
  const app = express();

  const apolloServer = new ApolloServer({
    //We write schemas in the graphQL server
    typeDefs: `
           type Todo {
            id: ID!
            title: String!
            completed: Boolean!
            user:User
           },
           type User{
            userId:ID!
            id:ID!
            name:String!
            email:String!
            phone:String!
            website:String!
           }
           
           type Query {
            gettodos: [Todo]
            getallusers: [User]
            getUsersById(id:ID!):User
           }`,
    resolvers: {

       Todo:{
        user:async (todo)=>(
            await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)
        ).data,
       }, 
      Query: {
        gettodos: async () =>
          // (await axios.get("https://jsonplaceholder.typicode.com/todos")).data,
          (await axios.get("https://jsonplaceholder.typicode.com/todos")).data,
        // return [{id:1,title:'Todo1',completed:false},{id:2,title:'Todo2',completed:false}]
        getallusers: async () =>
          // (await axios.get("https://jsonplaceholder.typicode.com/todos")).data,
          (await axios.get("https://jsonplaceholder.typicode.com/users")).data,
        getUsersById: async (parent ,{id}) =>
          // (await axios.get("https://jsonplaceholder.typicode.com/todos")).data,
          (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data,
      },
      // Mutation:{
      //     addtodo:(root,args)=>{
      //         return {id:3,title:args.title,completed:false}
      //     }
      // }
    },
  });
  app.use(cors());
  app.use(bodyParsser.json());
  await apolloServer.start();
  app.use("/graphql", expressMiddleware(apolloServer));

  app.listen(4000, () => {
    console.log("Server is running on port 4000");
  });
}

startServer();
