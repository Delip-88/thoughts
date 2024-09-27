import { gql } from "@apollo/client";

const USER_HOME_QUERY = gql`
  query UserHome {
    userHome {
      title
      content
    }
  }
`;

export default USER_HOME_QUERY