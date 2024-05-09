# 2022-02-20 Minutes

## Organized

The topic was on general IAM implementation.

- Describe the use of JWT tokens of two kinds, refresh and session
- Discuss separation of access due to biz reasons and access due to security

Johannes to be included for next UX meeting (merger of admin and b2c concerns? rbac) [Added to personal notes to remind]

Meeting Johannes-Ben in Wed

## TODO

Advisor groups: defer, model everyone as under same advisor group first. [TODO: document under keycloak usage]

GDPR: allow authentication from third-party service service locator pattern to include data from third-party services?
Note: basically service locator / strategy patterns to enable transclusion of personal information from e.g. Google OAuth

colossus/auth/.../... [TODO: create dummy routes in tyk]

Johannes: look at [https://www.figma.com/file/ett7k2395CZ0sfmw5EZn25/User-Flow?node-id=0%3A1&t=61Ly6YTHSF1QHuyn-0] and how BE needs to support admin and b2c flows.