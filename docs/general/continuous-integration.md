# Continuous Integration (CI)

Continuous Integration (CI) is a software development practice that involves automatically building, testing, and integrating code changes into a shared repository on a regular basis. The goal of CI is to catch integration errors and bugs early in the development process, so that they can be fixed quickly and efficiently

We use bitbucket-pipelines to run our CI. The pipeline is defined in the `bitbucket-pipelines.yml` file in the root of the repository.

## Current Setup

### Pull-Request (PR) Checks

We have a pipeline that runs on every pull request. The pipeline runs the following steps:

    * Dependency Changes Check
    * Install dependencies (if uncached) / Retrieve dependencies cache
    * Run linting on affected packages
    * Run unit tests on affected packages
    * Build affected packages

### Audit Checks

We have a scheduled pipeline (Monday 9am SGT) that runs on `main` branch. The pipeline runs the following steps:

    * Run audit on all packages
