Cypress.Commands.add("authShib", (username, password, authConfig) => {
    let req_url;
    let cookieJessionId;

    cy.getCookie("JSESSIONID").then(c => {
        cookieJessionId = c;
        console.log("cookie:", cookieJessionId);
    });

    cy.wait(cy.visit(authConfig.primoUrl2)).then(() => {
        cy.getCookies();
    });

    cy.request({
        method: "GET",
        url: authConfig.primoUrl
    }).then(res => {
        cy.getCookies();
        cy.request({
            method: "GET",
            url: authConfig.primoPdsLoginUrl
        }).then(res => {
            console.log("respons01:", res);
            const page = Cypress.$(Cypress.$.parseHTML(res.body));
            const samlResponse = page.find("input[name='SAMLResponse']").attr("value");
            if (!samlResponse) {
                const re = new RegExp("(https://.*?)/");
                const action = page.find("form").attr("action");
                const lastResponse = res.allRequestResponses[res.allRequestResponses.length - 1];
                const baseUrl = re.exec(lastResponse["Request URL"])[1];
                req_url = baseUrl + action;

                console.log("url:", baseUrl + action);

                cy.request({
                    method: "POST",
                    url: req_url,
                    form: true,
                    body: {
                        j_username: username,
                        j_password: password,
                        _eventId_proceed: ""
                    }
                }).then(res => {
                    console.log("respons02a:", res);
                    const page = Cypress.$(Cypress.$.parseHTML(res.body));
                    const action = page
                        .filter("form")
                        .first()
                        .prop("action");
                    const samlResponse = page.find("input[name='SAMLResponse']").attr("value");
                    const relayState = page.find("input[name='RelayState']").attr("value");

                    cy.request({
                        method: "POST",
                        url: action,
                        form: true,
                        headers: {
                            Referer: req_url,
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        body: {
                            RelayState: relayState,
                            SAMLResponse: samlResponse
                        }
                    }).then(res => {
                        console.log("respons03a:", res);
                        cy.request({
                            method: "GET",
                            url: authConfig.primoUrl2
                        })
                    });
                });
            } else {
                console.log("respons02b:", res);
                const page = Cypress.$(Cypress.$.parseHTML(res.body));
                const action = page
                    .filter("form")
                    .first()
                    .prop("action");
                const samlResponse = page.find("input[name='SAMLResponse']").attr("value");
                const relayState = page.find("input[name='RelayState']").attr("value");

                cy.request({
                    method: "POST",
                    url: action,
                    form: true,
                    headers: {
                        Referer: req_url,
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: {
                        RelayState: relayState,
                        SAMLResponse: samlResponse
                    }
                }).then(res => {
                    console.log("respons03b:", res);
                    cy.request({
                        method: "GET",
                        url: authConfig.primoUrl2
                    })
                });
            }

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
});
