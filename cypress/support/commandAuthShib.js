Cypress.Commands.add("authShib", (username, password, authConfig) => {
    Cypress.config("baseUrl", authConfig.baseUrl);

    // trigger first cookie (JSESSIONID)
    cy.request({
        method: "GET",
        url: authConfig.primoConfig
    }).then(res => {
        // go to the login url
        console.log("response01:", res);
        cy.request({
            method: "GET",
            url: authConfig.primoPdsLoginUrl
        }).then(res => {
            // check the page - two possible options:
            // 1. SAMLResponse exists (i.e. we are already logged into the IdP)
            // 2. No SAMLResponse exists (i.e. we do not have an IdP session and need to login)
            console.log("response02:", res);
            const page = Cypress.$(Cypress.$.parseHTML(res.body));
            const samlResponse = page.find("input[name='SAMLResponse']").attr("value");
            if (!samlResponse) {
                const re = new RegExp("(https://.*?)/");
                const action = page.find("form").attr("action");
                const lastResponse = res.allRequestResponses[res.allRequestResponses.length - 1];
                const baseUrl = re.exec(lastResponse["Request URL"])[1];
                const req_url = baseUrl + action;

                // submit login form with username/password to IdP
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
                    doPrimoLogin(res, authConfig);
                });
            } else {
                doPrimoLogin(res, authConfig);
            }
        });
    });
});

function doPrimoLogin(res, authConfig) {
    // we get back a page with the SAMLResponse
    console.log("response03:", res);
    const page = Cypress.$(Cypress.$.parseHTML(res.body));
    const action = page
        .filter("form")
        .first()
        .prop("action");
    const samlResponse = page.find("input[name='SAMLResponse']").attr("value");
    const relayState = page.find("input[name='RelayState']").attr("value");

    // submit the SAMLResponse to Primo
    cy.request({
        method: "POST",
        url: action,
        form: true,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: {
            RelayState: relayState,
            SAMLResponse: samlResponse
        },
        followRedirects: false
    }).then(res => {
        console.log("response04:", res);

        // extract loginId, use loginId to get a new JWT, set JWT
        const reLogin = new RegExp("loginId=(.*)&?");
        const loginId = reLogin.exec(res.redirectedToUrl)[1];
        const reVid = new RegExp(".*/(.+)");
        const vid = reVid.exec(authConfig.primoConfig)[1];
        const url = authConfig.baseUrl + authConfig.primoJwtUrl + loginId + "?vid=" + vid;
        cy.request({
            method: "GET",
            url: url
        }).then(res => {
            console.log("response05:", res);
            cy.window().then(win => {
                win.sessionStorage.setItem("primoExploreJwt", res.body);
            });
        });
    });
}
