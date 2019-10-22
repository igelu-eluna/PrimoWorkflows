const auth = require("../../../fixtures/secure/auth");

Cypress.Commands.add("ssoOKTA", (username, password) => {
    let okta_req_url;

    /**********************************************************************
        Request 1 - Primo component:
        Obtain the initial login page. Parameters include the target 'url'
        for the PDS login page. It sets some cookies used further down the
        chain. It returns a page with a URL to be submitted.
    **********************************************************************/
    cy.log(cy.getCookies());
    cy.request({
        method: "GET",
        url: "https://macquarie-primoprod.hosted.exlibrisgroup.com/pds",
        qs: {
            func: "load-login",
            calling_system: "primo",
            institute: "MQ",
            lang: "und",
            url:
                "https://multisearch.mq.edu.au:443/primo_library/libweb/pdsLogin?targetURL=https%3A%2F%2Fmultisearch.mq.edu.au%2Fprimo-explore%2Fsearch%3Fvid%3DMQ%26from-new-ui%3D1%26authenticationProfile%3DBASE_PROFILE"
        }
    }).then(res => {
        /* We extract the URL from the page and submit it. */
        let page = Cypress.$(Cypress.$.parseHTML(res.body));
        let url = page
            .filter("meta[http-equiv='refresh']")
            .attr("content")
            .replace("0; url=", "");

        /**********************************************************************
            Request 2 - SSO Component (OKTA)
            Submit the URL extracted from the response of the Request 1. This
            results in 2 redirects terminating at the login page. We need to
            extract the URL from the last redirect as we need to use it in the
            next request as the referer header and also further down the chain.
            This request has the SAMLRequest.
        **********************************************************************/
        cy.log(cy.getCookies());
        cy.request(url).then(res => {
            // extract the last redirect URL
            okta_req_url = res.redirects[0].replace("302: ", "");

            /**********************************************************************
                Request 3 - SSO Component (OKTA)
                Login - Part 1
                This is where we perform the 'Login' with username/password. These
                are stored in a fixture. I've placed the fixture in a fixture
                subfolder called 'secure' with a .gitignore to ignore contents of
                this folder. This way, secure data doesn't get placed into GitHub.
                The login payload replicates what happens when you do this in the
                browser. The response is an OKTA auth token.
            **********************************************************************/
            cy.log(cy.getCookies());
            cy.request({
                method: "POST",
                url: "https://mq.okta.com/api/v1/authn",
                headers: {
                    Referrer: okta_req_url,
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: {
                    password: password,
                    username: username,
                    options: {
                        warnBeforePasswordExpired: true,
                        multiOptionalFactorEnroll: true
                    }
                }
            }).then(res => {
                let okta_token = res.body;

                /**********************************************************************
                    Request 4 - SSO Component (OKTA)
                    Login - Part 2
                    This is the second part of the login process where we use the
                    sessionToken from Request 3. The result of this redirects you with
                    the login token and a URL from Request 2. The redirection contains
                    the SAML Request and another login token and redirects you to
                    another page that contains the SAML Response.
                **********************************************************************/
                cy.log(cy.getCookies());
                cy.request({
                    method: "GET",
                    url: "https://mq.okta.com/login/sessionCookieRedirect",
                    qs: {
                        checkAccountSetupComplete: "true",
                        token: okta_token["sessionToken"],
                        redirectUrl: okta_req_url
                    }
                }).then(res => {
                    // extract the SAML Response and RelayState values
                    let page = Cypress.$(Cypress.$.parseHTML(res.body));
                    let url = page.find("#appForm").attr("action");
                    let samlResponse = page.find("#appForm input[name='SAMLResponse']").attr("value");
                    let relayState = page.find("#appForm input[name='RelayState']").attr("value");

                    /**********************************************************************
                        Request 5 - Primo + SSO Component (OKTA)
                        We extracted the Primo Shib endpoint URL, the SAML response and the
                        RelayState. Now we post the request. This results in a redirection
                        to the PDS which logs you into Primo and results in a page which
                        has a link that will set the PDS_HANDLE.
                    **********************************************************************/
                    cy.log(cy.getCookies());
                    cy.request({
                        method: "POST",
                        url: url,
                        form: true,
                        body: {
                            SAMLResponse: samlResponse,
                            RelayState: relayState
                        },
                        headers: {
                            Referer: okta_req_url,
                            Accept: "application/json",
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    }).then(res => {
                        // extract the URL from the page
                        let regex = new RegExp("onload = \"location = '(.*?)'");
                        let match = res.body.match(regex);
                        let url = "https://macquarie-primoprod.hosted.exlibrisgroup.com" + match[1];
                        url = url.replace(/&amp;/g, "&");

                        /**********************************************************************
                            Request 6 - Primo
                            Using the link extracted from Request 5, we submit it and trigger
                            the setting of some Authentication cookies which in effect means
                            that we are logged in. Hooray!
                        **********************************************************************/
                        // cy.request({
                        //     method: "GET",
                        //     url: url
                        // }).then(res => {
                        //     cy.log(res.body);
                        // });
                        cy.log(cy.getCookies());
                        cy.visit(url);
                    });
                });
            });
        });
    });
});

context("checking that we can SSO into Primo", () => {
    before(() => {
        cy.ssoOKTA(auth.username, auth.password);
    });

    it("has a username", () => {});
});
