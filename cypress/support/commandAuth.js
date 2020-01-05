/*
    Handler for handling multiple types of authentication.
*/

import "./commandAuthOkta";
import "./commandAuthShib";

Cypress.Commands.add("authenticate", (username, password, authConfig) => {
    expect(authConfig.type).to.exist;
    if (authConfig.type === "okta") {
        cy.authOkta(username, password, authConfig);
    } else if (authConfig.type === "shib") {
        cy.authShib(username, password, authConfig);
    } else {
        cy.log("unable to handle authentication type:", authConfig.type);
    }
});
