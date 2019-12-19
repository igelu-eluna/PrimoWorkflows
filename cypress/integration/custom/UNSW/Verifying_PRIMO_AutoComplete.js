describe('Primo AutoComplete check', function() {
	
	let fixtures = {}
	before(() => {
		Cypress.Promise.all([
			cy.fixture(Cypress.env("ORG") + "/UNSWLibCol").then(fx => (fixtures["UNSWLibCol"] = fx))
		])
	})
	beforeEach(function(){
		cy.visit(fixtures["UNSWLibCol"].primoUATUrl)
	
	})
	context('Auto complete feature', function () {
		it('Checking upto 6 keywords in the Auto complete suggestion', function () {
			cy.get('md-autocomplete-wrap')
			  .get('input[id="searchBar"]').should('have.attr','placeholder','Search the Library collection').type('th')
			cy.get('ul[class="md-autocomplete-suggestions"]')
			  .find('li').should('have.length', 6)
			  
		})
		
	})
})

