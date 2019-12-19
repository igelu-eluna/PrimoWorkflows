describe('Single sign on into Primo', function() {
	let fixtures = {}
	before(() => {
		Cypress.Promise.all([
			window.console.log('Fixture has loaded the user data'),
			cy.fixture(Cypress.env("ORG") + "/secure/" + Cypress.env("USER")).then(fx => (fixtures["user"] = fx)),
			cy.fixture(Cypress.env("ORG") + "/UNSWLibCol").then(fx => (fixtures["UNSWLibCol"] = fx))
		])
	})

	beforeEach(() => {
		cy.visit(fixtures["UNSWLibCol"].primoUATUrl);
		cy.get('body').then($body => {
			if ($body.find('.user-profile-name').length === 1) {
				cy.log('Already logged in')
			} else {
				cy.get('span[translate="eshelf.signin.title"]')
				  .click( { multiple: true ,force: true})
				cy.get('div[id="userNameArea"]')
				  .find('input')
				  .type(fixtures["user"].username)
				cy.get('div[id="passwordArea"]')
				  .find('input')
				  .type(fixtures["user"].password)
				cy.get('div[id="submissionArea"]')
				  .find('span[class="submit"]')
				  .click()
			}
		})
	})

	it("has the correct display name on the Sign In box", () => {
		cy.get("span.user-name").contains(fixtures["user"].displayName);
	})
	
})

