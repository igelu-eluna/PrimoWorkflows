/*
    Handler for handling multiple types of authentication.
*/

import "./commandAuthOkta";

Cypress.Commands.add("authenticate", (username, password, authConfig) => {
    expect(authConfig.type).to.exist;
    if (authConfig.type === "okta") {
        cy.authOkta(username, password, authConfig);
    } else {
        cy.log("unable to handle authentication type:", authConfig.type);
    }
});
