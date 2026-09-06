import { defineRailway, github, project, service } from "railway/iac";

export const partial = "js-sfhy-website";

export default defineRailway(() => {
  const web = service("js-sfhy-website", {
    source: github("alex7-1/js-sfhy-website", { branch: "main" }),
    start: "node server.js",
    healthcheck: "/",
    healthcheckTimeout: 120,
  });

  return project("js-sfhy-website", {
    resources: [web],
  });
});
