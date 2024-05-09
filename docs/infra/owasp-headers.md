# OWASP Headers

This document details
1. why OWASP header configuration are a thing,
2. what OWASP headers are, and
3. what should and should not be sent by Bambu's servers, and what these headers should be set to.

If someone with the relevant expertise sees this, please add on

1. where ultimately configuration for colossus's apps reside (e.g. code, IaaS, CDN configuration, etc.)
2. any automation or playbook for ensuring that these headers are appropriately set.

## References

- https://owasp.org/www-project-secure-headers/
- https://helmetjs.github.io/
- https://stackoverflow.com/a/60709460

## Background: Why OWASP header configuration are a thing?

The browser is a very powerful and flexible program that runs, in essence, arbitrary code from multiple vendors providing them through web servers---code that acts on potentially sensitive information provided by the user. Sometimes, a web application wants to instruct the browser to run arbitrary code from another vendor (links/refs/AJAX). Browsers allow web applications to do that, but of course, running arbitrary code from multiple vendors involving sensitive information that needs various degrees of isolation is a frightening premise. To alleviate this, browsers have several mechanisms to mitigate malicious actors and footgun-prone developers. One important tool or mechanism is with the use of HTTP headers to instruct browsers which other vendors to trust and how much they can trust them. With respect to this mechanism, a browser usually identifies different vendors by virtue of having different domains/subdomains (origin) in their URL. Since the choice of (different/third-party) domains/subdomains a web app chooses to trust varies by the app itself, no heuristic/default is appropriate for all web applications and some configuration is needed.

## Where are headers involved?

For a SPA like Bambu's apps, there are generally 4 kinds of relevant HTTP payloads, and these payloads contain headers.

1. The browser requesting the initial HTML web page. This web page may be served by blob storage with a CDN sitting front of them. The headers sent by the browser here generally cannot be configured.
2. The FE blob server responds with the initial HTML page is the primary and most critical place where the headers need to be set.
3. The browser requests a resource (or a manipulation of a server-side resource) in addition to the web page. Headers set here are controlled by the browser and by FE code (in some cases). We may categorize these requests in three general kinds
   1. A request for a static resource typically hosted by a CDN or blob storage provisioned by us. (e.g. FE SPA code, images, documents (user-uploaded or otherwise))
   2. A request (to manipulate) a highly variable resource typically handled by an API server provisioned by us.
   3. A request (to manipulate) a resource not controlled by us.
4. A response from such a request as in 3.1.; we may only control the headers set in responses sent in 3.1. and 3.2., and configuration of these typically happen in different infrastructure. 3.1. usually sits on the same infrastructure as that serving the initial HTML page.

## What do these headers do?

See the references section; they explain to great detail and it is pointless to imperfectly reiterate and maintain this information here.

## What headers should be set in the initial HTML page for our application?

- Strict-Transport-Security
  - As in OWASP
  - Consider not setting in development environments that need to be accessed by http://
- Content-Security-Policy
  - e.g. `Content-Security-Policy: default-src 'self' go-bambu.co *.go-bambu.co`
  - Different apps in different domains need those additional domains to be whitelisted
  - Third-party APIs need to be whitelisted
  - blob server needs to be configured to whitelist vendee-configured domains if vendds have different domains
  - Use a more specific whitelist e.g. `Content-Security-Policy: default-src 'self' api.go-bambu.co <vendee-name>.go-bambu.co` if FE has vendor-specific info and is not just a blob.
- X-Frame-Options
  - As in OWASP
  - Bambu's apps should never appear in an iframe. Note that some of Bambu's apps contain third party pages (e.g. newsfeed) in an iframe.
- X-Content-Type-Options
  - As in OWASP
  - Note that the `Content-Type` header MUST be correctly configured.
- X-Permitted-Cross-Domain-Policies	
  - As in OWASP
- Referrer-Policy
  - As in OWASP
- Clear-Site-Data
  - Leave unset, against OWASP.
- Cross-Origin-Embedder-Policy
  - As in OWASP
  - Cross-Origin-Resource-Policy must be correctly configured
  - FE code needs to mark blob links as `crossorigin`
  - Note: this is under the assumption that we may serve the initial HTML from vendee-specific domains that then request blobs served from a common domain distinct from these domains.
- Cross-Origin-Opener-Policy
  - As in OWASP
  - Bambu's apps should never appear as a popup secondary to another website.
- Cross-Origin-Resource-Policy
  - As in OWASP
  - same-origin
  - Bambu's apps should never appear as a resource requested by another website.
- Permissions-Policy
  - TBD
- Cache-Control
  - Against OWASP
  - Set based on needs
- ~~Pragma~~
  - Against OWASP
  - Omit
- Origin-Agent-Cluster
  - Set to helmet default
  - See: https://helmetjs.github.io/#origin-agent-cluster
- ~~X-DNS-Prefetch-Control~~
  - Against helmet default
  - Dubious benefit.
- ~~X-Download-Options~~
  - Not useful for >IE8.

- All the OWASP recommendations for headers not to set / to unset are to be followed
- All unmentioned Helmet items for headers to be unset are to be followed

## What headers should be set for other static blobs that are part of FE?

- Strict-Transport-Security
  - As in OWASP
  - Consider not setting in development environments that need to be accessed by http://
- ~~Content-Security-Policy~~
  - Not useful.
- X-Frame-Options
  - As in OWASP
  - Bambu's resources should never appear in an iframe. Note that some of Bambu's apps contain third party pages (e.g. newsfeed) in an iframe.
- X-Content-Type-Options
  - As in OWASP
  - Note that the `Content-Type` header MUST be correctly configured.
- X-Permitted-Cross-Domain-Policies	
  - As in OWASP
- ~~Referrer-Policy~~
  - Not useful
- Clear-Site-Data
  - Leave unset, against OWASP.
- ~~Cross-Origin-Embedder-Policy~~
  - Not useful.
- Cross-Origin-Opener-Policy
  - As in OWASP
  - Bambu's resources should never appear as a popup secondary to another website.
- **Cross-Origin-Resource-Policy**
  - Against OWASP
  - Set to `cross-origin`
  - FE code needs to mark blob links as `crossorigin`
  - Note: this is under the assumption that we may serve the initial HTML from vendee-specific domains that then request blobs served from a common domain distinct from these domains.
- Cache-Control
  - Against OWASP
  - Set based on needs
- ~~Pragma~~
  - Against OWASP
  - Omit
- Content-Disposition
  - Should be set appropriately for documents (e.g. user-uploaded documents) that should be downloaded only.
- **Access-Control-Allow-Origin**
  - e.g. `go-bambu.co *.go-bambu.co`
  - Needs to whitelist every vendee domain.

- All the OWASP recommendations for headers not to set / to unset are to be followed
- All unmentioned Helmet items for headers to be unset are to be followed

## What headers should be set for dynamic API content?

- Strict-Transport-Security
  - As in OWASP
  - Consider not setting in development environments that need to be accessed by http://
- ~~Content-Security-Policy~~
  - Not useful.
- X-Frame-Options
  - As in OWASP
  - Bambu's resources should never appear in an iframe. Note that some of Bambu's apps contain third party pages (e.g. newsfeed) in an iframe.
- X-Content-Type-Options
  - As in OWASP
  - Note that the `Content-Type` header MUST be correctly configured.
- X-Permitted-Cross-Domain-Policies	
  - As in OWASP
- ~~Referrer-Policy~~
  - Not useful
- Clear-Site-Data
  - Leave unset, against OWASP.
- ~~Cross-Origin-Embedder-Policy~~
  - Not useful.
- Cross-Origin-Opener-Policy
  - As in OWASP
  - Bambu's resources should never appear as a popup secondary to another website.
- **Cross-Origin-Resource-Policy**
  - Against OWASP
  - Set to `cross-origin`
  - FE code needs to mark blob-like links as `crossorigin`
  - Note: this is under the assumption that we may serve the initial HTML from vendee-specific domains that then request blobs served from a common domain distinct from these domains.
- Cache-Control
  - Against OWASP
  - Set based on needs
- ~~Pragma~~
  - Against OWASP
  - Omit
- Content-Disposition
  - Should be set appropriately for documents that should be downloaded only.
- **Access-Control-Allow-Origin**
  - e.g. `go-bambu.co *.go-bambu.co`
  - Needs to whitelist every vendee domain.
  - For authenticated endpoints, consider whitelisting only authenticated vendee's FE URL.
- ~~Access-Control-Request-Method~~
  - Omit.
  - Too much work to maintain for unlikely security benefit.
- ~~Access-Control-Request-Headers~~
  - Omit.
  - Too much work to maintain for unlikely security benefit.
- ~~Access-Control-Max-Age~~
  - Omit.
  - Too much work to maintain for unlikely security benefit.

- All the OWASP recommendations for headers not to set / to unset are to be followed
- All unmentioned Helmet items for headers to be unset are to be followeds