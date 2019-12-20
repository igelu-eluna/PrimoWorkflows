# Automated Testing of Primo Workflows

## Overview

This project aims to create a framework for automatically testing a range of Primo Workflows.

As part of the project, we will:

1. Document and maintain common workflows performed in the Primo UI.
2. Use [**cypress.io**](https://cypress.io) to create tests that can test these workflows.

We intend to have both 'core' and 'custom' tests:

-   Core

    These are tests that should be able to run on any institutions implementation of Primo. These would test basic Primo functionality.

-   Custom

    These are tests that are institution specific. Insitutions can test custom functionality.

In each of these scenarios, institutions will be able to use their own local parameters with each test.

## Structure

The areas of the project that concern us most are:

       repository root
        ├──cypress.json       <-- Cypress configuration file
        ├──commands           <-- Shared 'command' library
        ├──fixtures           <-- Fixed configuration items
        │   ├──example        <-- An example organisation
        │   │   └──secure     <-- Secure folder to store user objects
        │   └──mq             <-- Macquarie University fixtures
        │       └──secure     <-- Secure folder to store MQ user objects
        └──integrations       <-- Folder that holds all tests
            ├──core           <-- Core workflow tests
            ├──custom         <-- Custom workflow tests
            │   └──mq         <-- Custom workflow tests for Macquarie University
            ├──example        <-- Example folder for sample tests
            │   └──tests      <-- Example test folder
            └──unit           <-- Folder for smaller unit tests
                └──mq         <-- Folder for an institutions smaller unit tests

There are three configuration items you need to be aware of:

1.  Configuring Cypress (**cypress.json**):

        contains:
        {
            "env": {
                "ORG": "mq",
                "PRIMO": "primo-prd",
                "USER": "user01",
                "AUTH": "okta"
            },
            "defaultCommandTimeout": 8000,
            "requestTimeout": 8000
        }

    We create a file called **cypress.json** in the repository root with similar contents above. This file sets up some parameters for Cypress. The _defaultCommandTimeout_ by default is 4000 milliseconds. We've changed this to 8000 milliseconds as some instances of Primo are a bit slower to load. This allows more time for loading and will reduce test errors on timeouts. Similarly, we've upped the _requestTimeout_ value from 4000 to 8000 milliseconds as well.

    We also configure some environment variables for telling Cypress which **fixtures** to use:

    -   **ORG**

        We set the **ORG** value to a unique code for our organisation. The value of this code will be the same name as the folders we will be using under the **fixtures** and **integrations** folders (take 'mq' as an example).

    -   **PRIMO**

        This variable points to the fixture representing the Primo instance you want to test. You could have multiple fixtures to test multiple views of your Primo instance or multiple Primo instances such as production and sandbox. Create a fixture for each and set this to the one you want to test.

    -   **USER**

        For workflows that require authenticated users, you set this to the fixture in the **secure** folder with the user object representing the user details. The user object is structured as:

            {
                "username": "username",
                "password": "password",
                "displayName": "Example User"
            }

    -   **AUTH**

        For workflows that require authentication, you set this fixture to be the configuration of your authentication system. An example for authenticating via SSO with Okta:

            {
                "type": "okta",
                "primoUrl": "https://multisearch.mq.edu.au/primo-explore/search?vid=MQ",
                "primoPdsBaseUrl": "https://macquarie-primoprod.hosted.exlibrisgroup.com",
                "primoPdsLoginUrl": "https://multisearch.mq.edu.au:443/primo_library/libweb/pdsLogin?targetURL=https%3A%2F%2Fmultisearch.mq.edu.au%2Fprimo-explore%2Fsearch%3Fvid%3DMQ%26from-new-ui%3D1%26authenticationProfile%3DBASE_PROFILE",
                "primoInstitute": "MQ",
                "oktaBase": "https://mq.okta.com"
            }

2)  Configuring **fixtures**:

    Within the **fixtures** folder, create a folder for your organisation. This folder should have the same name as the environment variable, **ORG**, that we configured in **cypress.json**.

    This folder contains custom values for your organisation. The structure of any _fixtures_ used in **Core** tests will need to be standardised to be able to interoperate with the **Core** tests. As the project is new, these structures will evolve over time and eventually stabilise. For **fixtures** that you use in **Custom** tests, there are not structural restrictions, although we might have to recommend a naming structure that does not conflict with **Core** fixtures.

    An example of a simple fixture for **Primo** is below (**primo-prd.json**):


        {
            "primoUrl": "https://multisearch.mq.edu.au/primo-explore/search?vid=MQ"
        }

    This contains a simple piece of information that points to an institutions Primo page and will allow Cypress to use this location to run the tests against. In this way, each organisation can have the tests run against their specific environment.

    **TODO:** Create a standard set of fixtures which have a specific name and structure that will be used against **Core** tests.

    Within each organisations fixture folder, there is a special folder called **secure**. This folder is where you can place any user objects that contain user information such as (but not limited to), username, password, display name etc.. You can have a look in the _example_ folder's secure folder to have a look at a user object. The example folder's _secure_ folder is the only _secure_ folder that gets added to the repository. Any other organisations _secure_ folders are ignored - this is configured in the .gitignore file in the repository root.

3.  Adding **Custom** tests:

    If you are just using **Core** tests, there is nothing to add to this folder.

    If you are using custom tests, then you should create a folder under the **custom** folder that has the same name as the **ORG** environment variable that you configured in **cypress.json**. Anything under this folder is managed by the owning organisation and you can place any custom tests under this folder in your preferred structure.

4.  Adding **Unit** tests:

    We can use the **unit** folder for smaller tests that test specific pieces of functionality. This will keep a cleaner separation from the larger workflow tests that we will be working on. We can also use these test as smaller building blocks to construct the larger workflow tests that we would like to automate.

# TODO Create quickstart guide