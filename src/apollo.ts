import { ApolloClient, InMemoryCache, createHttpLink, makeVar, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { LOCAL_STORAGE_TOKEN } from "./constants";

const token = localStorage.getItem(LOCAL_STORAGE_TOKEN);

export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar(token);

export const logUserIn = (token: string) => {
   localStorage.setItem(LOCAL_STORAGE_TOKEN, token);
   authTokenVar(token);
   isLoggedInVar(true);
};

export const logUserOut = () => {
   localStorage.removeItem(LOCAL_STORAGE_TOKEN);
   authTokenVar("");
   isLoggedInVar(false);
};

const httpLink = createHttpLink({
   uri: "http://localhost:5000/graphql",
});

const wsLink = new WebSocketLink({
   uri: `ws://localhost:5000/graphql`,
   options: {
      reconnect: true,
      connectionParams: {
         "x-jwt": authTokenVar() || "",
      },
   },
});

const authLink = setContext((_, { headers }) => {
   return {
      headers: {
         ...headers,
         "x-jwt": authTokenVar() || "",
      },
   };
});

const splitLink = split(
   ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === "OperationDefinition" && definition.operation === "subscription";
   },
   wsLink,
   authLink.concat(httpLink),
);

export const client = new ApolloClient({
   link: splitLink,
   cache: new InMemoryCache({
      typePolicies: {
         Query: {
            fields: {
               isLoggedIn: {
                  read() {
                     return isLoggedInVar();
                  },
               },
               token: {
                  read() {
                     return authTokenVar();
                  },
               },
            },
         },
      },
   }),
});
