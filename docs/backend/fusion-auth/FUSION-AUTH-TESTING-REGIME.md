# Fusion Auth Testing Regime

There will be 3 sections to this, namely:

1. Testing Fusion Auth Deployment
2. Testing Fusion Auth On New Users.
3. Testing KeyCloak Users With Fusion Auth Code In Place.
4. Testing KeyCloak To Fusion Auth Migration Code.

## 1. Testing Fusion Auth Deployment

This is to test if Fusion Auth works as intended in the deployment. This also includes onboarding developpers, DevOps engineers, infrastructure engineers, QA and BA onto the Fusion Auth dashboard.

What will be done in Fusion Auth itself:

1. Creation of admin key.
2. Create tenant.
3. Create application.
   1. Includes roles here
4. Create group.
5. Create user.
   1. Bind user to application.
   2. Bind user to group.

**Prerequisites:**
1. Fusion Auth PGSQL database in place.
2. Elasticsearch in place.
3. Fusion Auth deployed and running.

## 2. Testing Fusion Auth On New Users

This will be straightforward as we will be able to create new users and test them.
This basically is a regression test to make sure that the introduction of Fusion Auth does not break the functionality of the system.

### Prerequisites

1. The leads functionality is tested and deployed.
2. Fusion Auth is deployed and running after running the `Testing Fusion Auth Deployment` section.

### Items Tested

1. User can register.
2. User can verify email via OTP.
3. User can request new OTP.
4. User can log in.
5. User can refresh token.
6. User can perform 7 setup steps including subscribing via Stripe.
7. User can log out.
8. User can reset password.

### Validation Steps

1. Tenant, tenant application and user are in Fusion Auth and not Key Cloak.
   1. These users/tenants can be identified in the DB under the tenant table with the column `linked_to_fusion_auth` set to `true`.
   2. These users/tenants can be identified in the DB under the tenant table with the column `linked_to_key_cloak` set to `false`.
2. Database fields are properly populated.

## 3. Testing KeyCloak Users With Fusion Auth Code In Place

This will be to test existing users who were registered in KeyCloak and have not been migrated to Fusion Auth.

This is basically to test that the code that we have written for Fusion Auth does not break the existing functionality of the system, specifically for KeyCloak users.
This is to make sure that we have backward compatibility with KeyCloak.

**Prerequisites:**

1. `Testing Fusion Auth On New Users` is completed.
2. KeyCloak is deployed and running.
3. `DO NOT` migrate the users from KeyCloak to Fusion Auth.

### Items Tested

1. User can register.
2. User can verify email via OTP.
3. User can request new OTP.
4. User can log in.
5. User can refresh token.
6. User can perform 7 setup steps including subscribing via Stripe.
7. User can log out.
8. User can reset password.

### Validation Steps

1. Tenant, tenant application and user are not in Fusion Auth and in Key Cloak.
   1. These users/tenants can be identified in the DB under the tenant table with the column `linked_to_fusion_auth` set to `false`.
   2. These users/tenants can be identified in the DB under the tenant table with the column `linked_to_key_cloak` set to `true`.
2. Database fields are properly populated.


## 4. Testing KeyCloak To Fusion Auth Migration Code

This will be to test the migration of users from KeyCloak to Fusion Auth.

This is to make sure that the migration code works as intended and that the users are migrated correctly.

**Prerequisites:**

1. `Testing Fusion Auth On New Users` is completed.
2. `Testing KeyCloak Users With Fusion Auth Code In Place` is completed.
3. Fusion Auth is deployed and running.
4. KeyCloak is deployed and running.
5. Identify all users/tenants to be migrated from KeyCloak to Fusion Auth.

### Items Tested

1. User can register.
2. User can verify email via OTP.
3. User can request new OTP.
4. User can log in.
5. User can refresh token.
6. User can perform 7 setup steps including subscribing via Stripe.
7. User can log out.
8. User can reset password.

### Validation Steps

1. Tenant, tenant application and user are not in Fusion Auth and in Key Cloak.
   1. These users/tenants can be identified in the DB under the tenant table with the column `linked_to_fusion_auth` set to `true`.
   2. These users/tenants can be identified in the DB under the tenant table with the column `linked_to_key_cloak` set to `false`.
   3. All users/tenants that were identified in the `Prerequisites` section are migrated to Fusion Auth.
2. Database fields are properly populated.

## 5. Load Testing Considerations

This is to test the load of the system with Fusion Auth in place.
In KeyCloak, these are the findings based on developer testing and QA load testing:

1. After 200 users started to slow down.
2. After 500 users started to slowdown significantly.
3. After 900 it started being erratic, it will take upwards of 2 minutes to respond or just outright crash.
4. 50 concurrent users works okay.
5. 100 concurrent users works okay.
6. 150 concurrent users is when it falls on its face.

Fusion Auth should meet of exceed these numbers.
