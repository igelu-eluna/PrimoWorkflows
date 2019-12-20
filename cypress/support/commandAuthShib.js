Cypress.Commands.add("authShib", (username, password, authConfig) => {
    // let req_url;

    cy.request({
        method: "GET",
        url: authConfig.primoPdsLoginUrl
    }).then(res => {
        console.log(res);
        let re = new RegExp("(https://.*?)/");
        let page = Cypress.$(Cypress.$.parseHTML(res.body));
        let action = page.find("form").attr("action");
        let lastResponse = res.allRequestResponses[res.allRequestResponses.length - 1];
        let baseUrl = re.exec(lastResponse["Request URL"])[1];

        console.log("url:", baseUrl + action);

        cy.request({
            method: "POST",
            url: baseUrl + action,
            form: true,
            body: {
                username: username,
                password: password,
                _eventId_proceed: "",
            }
        }).then(res => {
            console.log(res);
        });

        // if (url != null) {
        //     url = url.replace("0; url=", "");
        //     cy.request(url).then(res => {
        //         req_url = res.redirects[0].replace("302: ", "");
        //         cy.request({
        //             method: "POST",
        //             url: authConfig.oktaBase + "/api/v1/authn",
        //             headers: {
        //                 Referrer: req_url,
        //                 Accept: "application/json",
        //                 "Content-Type": "application/json"
        //             },
        //             body: {
        //                 password: password,
        //                 username: username,
        //                 options: {
        //                     warnBeforePasswordExpired: true,
        //                     multiOptionalFactorEnroll: true
        //                 }
        //             }
        //         }).then(res => {
        //             let okta_token = res.body;
        //             cy.request({
        //                 method: "GET",
        //                 url: authConfig.oktaBase + "/login/sessionCookieRedirect",
        //                 qs: {
        //                     checkAccountSetupComplete: "true",
        //                     token: okta_token["sessionToken"],
        //                     redirectUrl: req_url
        //                 }
        //             }).then(res => {
        //                 // extract the SAML Response and RelayState values
        //                 let page = Cypress.$(Cypress.$.parseHTML(res.body));
        //                 let url = page.find("#appForm").attr("action");
        //                 let samlResponse = page.find("#appForm input[name='SAMLResponse']").attr("value");
        //                 let relayState = page.find("#appForm input[name='RelayState']").attr("value");

        //                 cy.request({
        //                     method: "POST",
        //                     url: url,
        //                     form: true,
        //                     body: {
        //                         SAMLResponse: samlResponse,
        //                         RelayState: relayState
        //                     },
        //                     headers: {
        //                         Referer: req_url,
        //                         Accept: "application/json",
        //                         "Content-Type": "application/x-www-form-urlencoded"
        //                     }
        //                 }).then(res => {
        //                     // extract the URL from the page
        //                     let regex = new RegExp("onload = \"location = '(.*?)'");
        //                     let match = res.body.match(regex);
        //                     let url = authConfig.primoPdsBaseUrl + match[1];

        //                     // when this is '&amp;' there is a 500 error, however, replacing with regular '&' works.
        //                     url = url.replace(/&amp;/g, "&");

        //                     cy.request(url);
        //                 });
        //             });
        //         });
        //     });
        // }
    });
});
