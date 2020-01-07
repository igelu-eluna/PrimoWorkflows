# Automated Testing of Primo Workflows

## Quick Start Guide

### Prerequisites
The following need to be installed:

1. [NodeJS](https://nodejs.org/)
2. [Git](https://git-scm.com/)

### Process (short version)

1. Checkout code from [repository](https://github.com/igelu-eluna/PrimoWorkflows).
2. Create a folder for your fixtures.
3. Create a fixture defining your Primo instance.
4. (optional) Create a fixture defining your authentication configuration.
5. (optional) Create a secure folder and a user object.
6. Configure your environment by creating your __cypress.json__ configuration file. Use the example to get started.
7. Start Cypress and run some tests!


### Process (detailed version)

1. Checkout code from repository.

   ```
   git clone https://github.com/igelu-eluna/PrimoWorkflows   
   ```

2. Create a folder for your fixtures.

   Each organisation should have a folder for their _fixtures_ which are configurations for their instances of Primo.

   ```
   cd PrimoWorkflows/cypress/fixtures
   mkdir your_org_code
   ```

3. Create a fixture defining your Primo instance.

   ```
   cd your_org_code
   ```

   Create a file called __primo-prd.json__ with the following content:
   ```json
   {
     "primoUrl": "https://primo.your.org/primo-explore/search?vid=YOUR_VID"
   }
   ```

4. (optional) Create a fixture defining your authentication configuration.

   There will be tests that require a user to login to primo. Many institutions use a single sign on (SSO) process to authenticate their users which involves being transferred between multiple websites. This transfer makes Cypress lose control of the original site being tested. To avoid this issue, we do the SSO process out of band and then load the Primo site being tested. To do this we've create a Cypress Command to handle authentication. Currently supported is Shibboleth 1.3 and Okta. We need to create a configuration fixture for our instance.

   For example, for Shibboleth, create a file called __shib.json__ and change the values to suit your institution. 

   ```json
   {
     "type": "shib",
     "baseUrl": "https://search-test.obvsg.at",
     "primoConfig": "/primo_library/libweb/webservices/rest/v1/configuration/USB",
     "primoSearch": "/primo-explore/search?vid=USB&lang=de_DE",
     "primoPdsLoginUrl": "/primo_library/libweb/primoExploreLogin?institution=USB&lang=de_DE&target-url=https%3A%2F%2Fsearch-test.obvsg.at%2Fprimo-explore%2Fsearch%3Fvid%3DUSB%26lang%3Dde_DE&authenticationProfile=SAML_PROFILE&auth=SAML&isSilent=false",
     "primoJwtUrl": "/primo_library/libweb/webservices/rest/v1/loginJwtCache/"
   }
   ```
   
   Ask in the __workflow-testing__ Slack channel if you need assistance with the above configuration.

5. (optional) Create a secure folder and a user object.

   If using tests requiring authentication, we can create 'user objects' for the users we want to use to login and perform the tests. These are basic JSON files that look like:

   ```json
   {
     "username": "username",
     "password": "password",
     "displayName": "Example User"
   }
   ```

   Create a folder called __secure__ in your fixtures folder and create a user object and call is __user01.json__ (or copy the example one in the __fixtures/example/secure__ folder).

   ```
   mkdir secure
   cd secure
   cp ../../example/secure/user01.json .
   ```


6. Configure your environment by creating your __cypress.json__ configuration file.

   In the root of the project folder (inside PrimoWorkflows) there is a file called __cypress.json.example__. Copy this file as __cypress.json__. Change the ORG environment variable to whatever you set your_org_code to be. Set the PRIMO variable to the name of the fixture representing the instance of Primo that you want to test. Same with the USER variable as well - set it to the user object you created under the __secure__ folder. 

   ```json
   {
     "env": {
       "ORG": "your_org_code",
       "PRIMO": "primo-prd",
       "USER": "user01",
       "AUTH": "shib"
     },
     "defaultCommandTimeout": 8000,
     "requestTimeout": 8000
   }
   ```

7. Go back to the root folder of the project (PrimoWorkflows) and start up Cypress and run some tests!! Happy Testing!

   ```
   npx cypress open
   ```
