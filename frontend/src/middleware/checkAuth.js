// // useAuth.js
// import { useQuery } from "@apollo/client";
// import CHECK_AUTH from "@/graphql/query/checkAuth";
// import Cookies from "js-cookie";
// import { useNavigate } from "react-router-dom";

// const useAuth = () => {
//   const navigate = useNavigate();
//   const token = Cookies.get("authToken");

//   const { data, loading, error } = useQuery(CHECK_AUTH, {
//     skip: !token, // Skip query if no token
//     context: {
//       credentials: "include",
//     },
//   });

//   if (loading) return { loading, authenticated: false };
//   if (error || !data?.checkAuth) {
//     Cookies.remove("authToken");
//     navigate("/login"); // Redirect to login if not authenticated
//     return { authenticated: false };
//   }

//   return { authenticated: true };
// };

// export default useAuth;
