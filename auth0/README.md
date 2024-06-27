# Auth0

This directory contains files that are not directly used by this app but that
correspond to Auth0 settings that are configured through the Auth0 web portal.
This is just to allow us to have some form of version control, especially across
the different tenants we have.

An Auth0 _tenant_ is a self-contained environment that has a store of users, a
registry of applications and APIs, and configuration settings. An email address
may have a user account on multiple tenants, but their Auth0 ID ("external ID"
in our app) will be different. We have separate tenants for our development,
staging, and production environments.

An Auth0 tenant also contains email templates that are used for any action where
Auth0 needs to send an email to a user. We store those templates here so that we
can easily track changes to them. The email templates support variables using
the Liquid templating language. Documentation on available variables is located
at https://auth0.com/docs/customize/email/email-templates#common-variables


## Passwordless Login Email

We currently only use the Passwordless Login flow. Confusingly, the email
template for it is not located in the same place in the Auth0 portal as all
other email templates. The Passwordless Login template may be configured under
Authentication -> Passwordless -> Email.

The following are the values of the fields in this form:

From:

```
{{ application.name }} <support@sheltertech.org>
```

Subject:

```
Welcome to {{ application.name }}
```

Body:

See [./passwordless-email-template.liquid](./passwordless-email-template.liquid)
