// / <reference types="react-scripts" />

declare namespace NodeJS {
   interface ProcessEnv {
      REACT_APP_NODE_ENV: "development" | "production" | "test";
   }
}
