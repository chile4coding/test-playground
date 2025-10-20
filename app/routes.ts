import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("institution", "routes/institution.tsx"),
  route("register", "routes/register.tsx"),
] satisfies RouteConfig;
