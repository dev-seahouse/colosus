# Frontend E2E Test Guidelines

## Introduction

This document describes the guidelines for writing E2E tests for the frontend codebase.

E2E testing is done using [Playwright](https://playwright.dev/).

## General Guidelines

### Folder Structure

The E2E tests are organized in the following way:

```
[package-name]-e2e/
  |- src/
  |  |- e2e/
  |  |  |- <spec files>
  |  |- pages/
  |  |  |- <page object model, *.page.ts>
  |  |- steps/
  |  |  |- <step definitions, *.steps.ts>
```

### Browsers and Devices

To ensure that the application works as expected on different browsers and devices. The setup may vary between packages.

See [Playwright Browsers Docs](https://playwright.dev/docs/browsers) for more details about browsers.


## Implementation Guidelines

### Page Object Model

Page Object Model (POM) is a design pattern used in automated testing to represent the user interface of a web application as a series of objects.

The idea behind POM is to abstract the details of the user interface into a set of classes that represent the various pages of the application.

In POM, each page of the web application is represented as a class that contains the locators for the elements on that page, along with methods to interact with those elements. This allows the test code to interact with the page objects rather than directly with the user interface, making the tests more maintainable and easier to read.

```typescript
// Login.tsx
import { useState, ChangeEvent } from 'react';

const Login = () => {
  const [loginState, setLoginState] = useState<LoginFormState>({
    password: '',
    username: '',
  })
  const [isMessageVisible, setIsMessageVisible] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginState({
      ...loginState,
      [name]: value,
    });
  };

  return (
    <div className="App">
      {isMessageVisible && <div data-testid="message">Login Successful</div>}
      <form onSubmit={(e) => {
        e.preventDefault();
        if (loginState.username === 'admin' && loginState.password === 'admin') {
          setIsMessageVisible(true);
        }
      }}>
        <div className="form-field">
          <label htmlFor="username">Username</label>
          <input onChange={handleInputChange} id="username" data-testid="username-field" name="username" type="text"/>
        </div>
        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input onChange={handleInputChange} id="password" data-testid="password-field" name="password" type="text"/>
        </div>
        <div className="form-action">
          <button data-testid="login-btn">Log In</button>
        </div>
      </form>
    </div>
  );
}

// login.page.ts
import type { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator;
  readonly loginBtn: Locator;
  readonly message: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.getByTestId('username-field');
    this.passwordField = page.getByTestId('password-field');
    this.loginBtn = page.getByTestId('login-btn');
    this.message = page.getByTestId('message');
  }
}
```

See [Playwright Page Object Model Docs](https://playwright.dev/docs/pom) for more details about POM.

### Step Definitions

Step definitions are the functions called by the test framework to execute the test steps. 

Writing step definitions enables developer(s) to write their tests in almost similar fashion as Cucumber/Gherkin styles format.

```typescript
// login.steps.ts
import type { Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

export class LoginSteps {
  readonly loginPage: LoginPage;

  constructor(page: Page) {
    this.loginPage = new LoginPage(page);
  }

  async enterUsername(username: string) {
    await this.loginPage.usernameField.fill(username);
  }

  async enterPassword(password: string) {
    await this.loginPage.passwordField.fill(password);
  }

  async submitLoginForm() {
    await this.loginPage.loginBtn.click();
  }

  async verifyLoginSuccess() {
    await expect(this.loginPage.message).toBeVisible();
  }
}

// login.spec.ts
import { LoginSteps } from '../steps/login.steps';

test.describe('Login Feature', () => {
  test('Scenario: User attempts to login with valid credentials', async ({ page }) => {
    const loginSteps = new LoginSteps(page);

    await page.goto('/');

    await test.step('Given the user enters valid username', async () => loginSteps.enterUsername('admin'));

    await test.step('Given the user enters valid password', async () => loginSteps.enterPassword('admin'));

    await test.step('When the user submits the login form', async () => loginSteps.submitLoginForm());

    await test.step('Then the user should be able to see login message', async () => loginSteps.verifyLoginSuccess());
  })
})
```

### Use Data-testId

It is recommended to use `data-testid` attribute to identify the component.

```typescript
<input data-testid="username-field" name="username" type="text"/>

// in our page object model
this.usernameField = page.getByTestId('username-field');
```

To see it in action, do view the [sample repository](https://bitbucket.org/bambudeveloper/lab-playwright/src/main/).

## References
- [Playwright](https://playwright.dev/)
