import styled from 'styled-components';
import { ReactNode } from 'react';
const SSeparator = styled.div`
   margin: 20px 0px 20px 0px;
   text-transform: uppercase;
   display: flex;
   justify-content: center;
   width: 100%;
   align-items: center;
   div {
      width: 100%;
      height: 1px;
      background-color: ${(props) => props.theme.borderColor};
   }
   span {
      margin: 0px 10px;
      font-weight: 600;
      font-size: 12px;
      color: #8e8e8e;
   }
`;

const Separator = ({ children }: { children: ReactNode }) => {
   return <SSeparator>{children}</SSeparator>;
};

export default Separator;
