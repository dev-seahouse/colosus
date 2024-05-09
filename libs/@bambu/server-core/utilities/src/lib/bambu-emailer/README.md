# @bambu-emailer

This wraps the node mailer library so that we can specify providers when sending an email rather than forcing a single provider.  This implementation will allow
us to send emails using a configured provider/account, and will fallback to using
a default provider when a custom provider is not specified.

## Configuration
The following environment variables are required to set the default provider
```bash
MAIL_TRANSPORT_HOST=my.mail.host # REQUIRED
MAIL_TRANSPORT_PORT=465 # If not provided defaults to 465
MAIL_TRANSPORT_SECURE=true # If not provided defaults to true
MAIL_TRANSPORT_USERNAME=myusername # Username for the email provider
MAIL_TRANSPORT_PASSWORD=mypassword # Password for the email provider
```



## Sending an email using the sendmail event
```typescript
import { 
    BambuEventEmitterService, 
    BambuEmailSendPayload, 
    EMAIL_EVENTS 
} from '@bambu/server-core/utilities';

export class MySuperService {
  constructor(
    private eventEmitterService: BambuEventEmitterService
  ) {}
  
  doSomethingAmazing(withStuff: unknown) {
    this.eventEmitterService.emit<BambuEmailSendPayload>(EMAIL_EVENTS.SEND, {
      header: {
        from: {
          displayName: 'Someone',
          address: 'no-reply@somewhere.com',
        },
        to: 'someone.else@somewhere.com',
        subject: 'A subject for the email',
      },
      body: {
        text: JSON.stringify(withStuff, null, 2),
        html: `<b>Hello Someone ${JSON.stringify(withStuff, null, 2)}</b>`,
      },
    });
  }
}
```

## Sending an email using the emailer service service
```typescript
import { 
    BambuEmailerService
} from '@bambu/server-core/utilities';

export class MySuperService {
  constructor(
    private emailerService: BambuEmailerService
  ) {}
  
  doSomethingAmazing(withStuff: unknown) {
    this.emailerService.sendEmail({
      header: {
        from: {
          displayName: 'Someone',
          address: 'no-reply@somewhere.com',
        },
        to: 'someone.else@somewhere.com',
        subject: 'A subject for the email',
      },
      body: {
        text: JSON.stringify(withStuff, null, 2),
        html: `<b>Hello Someone ${JSON.stringify(withStuff, null, 2)}</b>`,
      },
    });
  }
}
```

## Specifying a custom gmail provider when sending an email
```typescript
import { 
    BambuEventEmitterService, 
    BambuEmailSendPayload, 
    EMAIL_EVENTS 
} from '@bambu/server-core/utilities';

export class MySuperService {
  constructor(
    private eventEmitterService: BambuEventEmitterService
  ) {}
  
  doSomethingAmazing(withStuff: unknown) {
    this.eventEmitterService.emit<BambuEmailSendPayload>(EMAIL_EVENTS.SEND, {
        transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'sender.email@addess.com',
            password: process.env.GMAIL_EMAIL_PASSWORD
        },
      },
      header: {
        from: {
          displayName: 'Someone',
          address: 'no-reply@somewhere.com',
        },
        to: 'someone.else@somewhere.com',
        subject: 'A subject for the email',
      },
      body: {
        text: JSON.stringify(withStuff, null, 2),
        html: `<b>Hello Someone ${JSON.stringify(withStuff, null, 2)}</b>`,
      },
    });
  }
}
```

## Specifying a custom sendgrid provider when sending an email
```typescript
import { 
    BambuEventEmitterService, 
    BambuEmailSendPayload, 
    EMAIL_EVENTS 
} from '@bambu/server-core/utilities';

export class MySuperService {
  constructor(
    private eventEmitterService: BambuEventEmitterService
  ) {}
  
  doSomethingAmazing(withStuff: unknown) {
    this.eventEmitterService.emit<BambuEmailSendPayload>(EMAIL_EVENTS.SEND, {
        transport: {
        host: 'smtp.sendgrid.net',
        port: 465,
        secure: true,
        auth: {
            user: 'apikey',
            password: process.env.SENDGRID_API_KEY
        },
      },
      header: {
        from: {
          displayName: 'Someone',
          address: 'no-reply@somewhere.com',
        },
        to: 'someone.else@somewhere.com',
        subject: 'A subject for the email',
      },
      body: {
        text: JSON.stringify(withStuff, null, 2),
        html: `<b>Hello Someone ${JSON.stringify(withStuff, null, 2)}</b>`,
      },
    });
  }
}
```


## Options for further development

- Extending EmailContentOptions to enable attachments (https://nodemailer.com/message/attachments/, https://nodemailer.com/message/embedded-images/)
- AWS SES if needed (https://nodemailer.com/transports/) 
- DKIM if needed (https://nodemailer.com/dkim/)


## Future intent
### Provider entity ###
During the transact build we should be building out the data models for providers.  This will allow an advisor to configure their own email provider so that the robo can be fully whitelabelled.

Provider UI will need to be designed

### Email Template entities ###
This mailer expects that the email content is passed in directly.  We will need
a data model which handles template inheritance to make sure the content designed
by advisors looks great in any email.  Simplest way of doing this would be a self referencing table.

Email Template management UI will need to be designed
The system must be able to differentiate between a system template and a client (advisor) template.

