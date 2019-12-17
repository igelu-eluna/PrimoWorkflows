# Automated Testing of Primo Workflows

## Overview

This project aims to create a framework for automatically testing a range of Primo Workflows.

As part of the project, we will:

1. Document and maintain common workflows performed in the Primo UI.
2. Use [__cypress.io__](https://cypress.io) to create tests that can test these workflow.

We intend to have both 'core' and 'custom' tests:
* Core
  
  These are tests that should be able to run on any institutions implementation of Primo. These would test basic Primo functionality.

* Custom
 
  These are tests that are institution specific. Insitutions can test custom functionality.

    
In each of these scenarios, institutions will be able to use their own local parameters with each test.

## Structure

The areas of the project that concern us most are:

       repository root
             ├───cypress.json           <-- Cypress configuration file
             ├───commands               <-- Shared 'command' library
             ├───fixtures               <-- Fixed configuration items
             │       ├───example        <-- An example organisation
             │       │   └───secure     <-- Secure folder to store user objects
             │       └───mq             <-- Macquarie University fixtures
             │           └───secure     <-- Secure folder to store MQ user objects
             └───integrations           <-- Folder that holds all tests
                     ├───core           <-- 'Core' tests
                     ├───custom         <-- 'Custom' tests
                     │   └───mq         <-- 'Custom' tests for Macquarie University
                     └───example        <-- Example folder for sample tests
                         └───tests      <-- Example test folder


There are three configuration items you need to be aware of:

1. Configuring Cypress (__cypress.json__):

       contains:
       {
           "env": {
               "ORG": "mq",
               "USER": "user01"
           },
           "defaultCommandTimeout": 8000,
           "requestTimeout": 8000
       }

   We create a file called __cypress.json__ in the repository root with the contents above. This file sets up some parameters for Cypress. The _defaultCommandTimeout_ by default is 4000 milliseconds. We've changed this to 8000 milliseconds as some instances of Primo are a bit slower to load. This allows more time for loading and will reduce test errors on timeouts. Similarly, we've upped the _requestTimeout_ value from 4000 to 8000 milliseconds as well.
   
   We also configure some environment variables for telling Cypress which __fixtures__ to use:
   * __ORG__

      We set the __ORG__ value to a unique code for our organisation. The value of this code will be the same name as the folders we will be using under the __fixtures__ and __integrations__ folders (take 'mq' as an example). 

2. Configuring __fixtures__:

    Within the __fixtures__ folder, create a folder for your organisation. This folder should have the same name as the environment variable, __ORG__, that we configured in __cypress.json__.

    This folder contains custom values for your organisation. The structure of any _fixtures_ used in __Core__ tests will need to be standardised to be able to interoperate with the __Core__ tests. As the project is new, these structures will evolve over time and eventually stabilise. For __fixtures__ that you use in __Custom__ tests, there are not structural restrictions, although we might have to recommend a naming structure that does not conflict with __Core__ fixtures.

    An example of a simple fixture for __Primo__ might be as below (__primo.json__):

        {
            "primoUrl": "https://multisearch.mq.edu.au/primo-explore/search?vid=MQ"
        }

    This contains a simple piece of information that points to an institutions Primo page and will allow the tests to use this location to run their tests against. In this way, each organisation can have the tests run against their specific environment.

    __TODO:__ Create a standard set of fixtures which have a specific name and structure that will be used against __Core__ tests.

    Within each organisations fixture folder, there is a special folder called __secure__. This folder is where you can place any user objects that contain user information such as (but not limited to), username, password, display name etc.. You can have a look in the _example_ folder's secure folder to have a look at a user object. The example folder's _secure_ folder is the only _secure_ folder that gets added to the repository. Any other organisations _secure_ folders are ignored - this is configured in the .gitignore file in the repository root.
