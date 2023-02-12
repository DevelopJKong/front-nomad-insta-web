import { DefaultTheme, createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export const lightTheme: DefaultTheme = {
   accent: "#0095f6",
   fontColor: "white",
   bgColor: "#2c2c2c",
   borderColor: "rgb(219, 219, 219)",
};

export const darkTheme: DefaultTheme = {
   accent: "#0095f6",
   fontColor: "white",
   bgColor: "#2c2c2c",
   borderColor: "rgb(219, 219, 219)",
};
export const GlobalStyles = createGlobalStyle`
    ${reset}
    input {
      all:unset;
    }
    * {
      box-sizing:border-box;
    }
    body {
        background-color: #FAFAFA;
        font-size:14px;
        font-family:'Open Sans', sans-serif;
        color:rgb(38, 38, 38);
    }
    a {
      text-decoration: none;
    }
`;
