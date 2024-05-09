# FE Deployment

## TLDR

- Deployment for frontend apps (including storybook) is done using bitbucket-pipelines.
- Storybook apps are deployed to AWS S3 in **bambu-dev** space.

## How is an app deployed?

As written [here](../../DEPLOYMENT.md), we do a tag-based deployment system. Below are the tags that trigger deployment for each app:

| name                 | tag                                     | example           | Deployment URL                              |
|----------------------|-----------------------------------------|-------------------|---------------------------------------------|
| react-ui storybook   | sb-ds-v[ddmmyy]-[release # of the day]  | _sb-ds-v010323-1_ | https://design-system-storybook.bambu.life/ |
| go-advisor storybook | sb-adv-v[ddmmyy]-[release # of the day] | _sb-adv-v010323-1_  | https://go-advisor-storybook.bambu.life/    |
