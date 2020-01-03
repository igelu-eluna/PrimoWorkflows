Cypress.Commands.add("authShib2", (username, password, authConfig) => {
    Cypress.Cookies.debug(true, { verbose: true });
    Cypress.config("baseUrl", authConfig.baseUrl);

    let req_url;

    cy.request({
        method: "GET",
        url: authConfig.primoConfig
    }).then(res => {
        console.log("respons01:", res);
        cy.request({
            method: "GET",
            url: authConfig.primoPdsLoginUrl
        }).then(res => {
            console.log("respons02:", res);
            const page = Cypress.$(Cypress.$.parseHTML(res.body));
            const samlResponse = page.find("input[name='SAMLResponse']").attr("value");
            if (!samlResponse) {
                const re = new RegExp("(https://.*?)/");
                const action = page.find("form").attr("action");
                const lastResponse = res.allRequestResponses[res.allRequestResponses.length - 1];
                const baseUrl = re.exec(lastResponse["Request URL"])[1];
                req_url = baseUrl + action;

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
                    console.log("respons03a:", res);
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
                    });
                });
            } else {
                console.log("respons03b:", res);
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
                });
            }
        });
    });
});
