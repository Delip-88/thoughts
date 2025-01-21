import { Admin, Resource } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import UserList from "./User_List";
import Post_List from "./Post_List";
import { PostShow } from "./Post_show";
import { UserShow } from "./User_Show";
import { PostEdit } from "./Post_Edit";
import { UserEdit } from "./User_Edit";
import PostCreate from "./Post_Create";
import ArticleIcon from "@mui/icons-material/Article";
import Person from "@mui/icons-material/Person";
import HomePage from "./HomePage";
import { authProvider } from "./Auth";

// Replace this with your API endpoint
const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");

const App = () => (
  <Admin dataProvider={dataProvider} dashboard={HomePage} authProvider={authProvider}>
    {/* Example Resources */}
    <Resource
      icon={ArticleIcon}
      name="users"
      list={UserList}
      show={UserShow}
      edit={UserEdit}
    />
    <Resource
      icon={Person}
      name="posts"
      list={Post_List}
      show={PostShow}
      edit={PostEdit}
      create={PostCreate}
    />
    ;
  </Admin>
);

export default App;
