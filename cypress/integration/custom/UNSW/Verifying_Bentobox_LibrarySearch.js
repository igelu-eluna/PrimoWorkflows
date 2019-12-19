describe('Checking Library website Bento box (UNSW Library search)', function() {
	let fixtures = {}
	before(() => {
		Cypress.Promise.all([
			cy.fixture(Cypress.env("ORG") + "/UNSWLibCol").then(fx => (fixtures["UNSWLibCol"] = fx))
		])
	})
	beforeEach(function(){
		cy.visit(fixtures["UNSWLibCol"].primoUATUrl)
	
	})
	context('Title, authors, resource type, and other information in brief result of Library collection matches full search result of Library website bento box)', function () {
		it('Checking FRBRised Alma resources', function () {
			cy.get('#searchBar').type('Sydney morning herald{enter}').as('getresource')
			cy.get('@getresource')
			cy.get('button[translate="nui.brief.results.loadMore"]')
			  .click({ multiple: true ,force: true })
			cy.get('span[translate="nui.frbrversion.found.link"]')
			  .should('have.text','See all versions')
			cy.get('span[translate="nui.frbrversion.found"]')
			  .should('have.text','3 versions of this record exist')
			})
		it('Checking single Alma resource (ie no FRBR versions)', function () {
			cy.get('#searchBar').type('morees anzacs{enter}')
			cy.get('prm-brief-result-container')
			  .get('div[id="SEARCH_RESULT_RECORDID_UNSW_ALMA21229856000001731"]')
			  .click({ multiple: true ,force: true })
			cy.location('href').should('eq', 'https://primoauat.library.unsw.edu.au/primo-explore/fulldisplay?docid=UNSW_ALMA21229856000001731&context=L&vid=UNSWS&lang=en_US&search_scope=SearchFirst&adaptor=Local%20Search%20Engine&tab=default_tab&query=any,contains,morees%20anzacs&offset=0')
			})
		it('Checking FRBRised PCI  resources - checking the results page )', function () {
			cy.get('#searchBar').type('Climate change resilience of a globally important sea turtle nesting population{enter}').as('getresource')
			cy.get('@getresource')
			cy.get('button[translate="nui.brief.results.loadMore"]')
			  .click({ multiple: true ,force: true })
			cy.get('prm-brief-result-container')
			  .get('div[id="SEARCH_RESULT_RECORDID_TN_wj10.1111/gcb.14520"]')
			  .click({ multiple: true ,force: true })
			cy.location('href').should('eq', 'https://primoauat.library.unsw.edu.au/primo-explore/fulldisplay?docid=TN_wj10.1111%2Fgcb.14520&context=PC&vid=UNSWS&lang=en_US&search_scope=SearchFirst&adaptor=primo_central_multiple_fe&tab=default_tab&query=any,contains,Climate%20change%20resilience%20of%20a%20globally%20important%20sea%20turtle%20nesting%20population&offset=0')
			})
		it('Checking FRBRised PCI  resources - checking all the versions)', function () {
			cy.get('#searchBar').type('Climate change resilience of a globally important sea turtle nesting population{enter}').as('getresource')
			cy.get('@getresource')
			cy.get('button[translate="nui.brief.results.loadMore"]')
			  .click({ multiple: true ,force: true })
			cy.get('prm-brief-result-container')
			  .get('div[id="SEARCH_RESULT_RECORDID_TN_medline30567014"]')
			  .click()
			cy.get('span[translate="nui.pcgroup.link"]')
			  .should('have.text','See allSee allSee allSee allSee allSee allSee allSee allSee allSee all')
			  .click({ multiple: true ,force: true })
			cy.get('div[class="results-container zero-padding layout-column"]').its('length').then((size) => {
				cy.get('div[class="results-container zero-padding layout-column"]').get('div:nth-child(' + size + ')')
				})
			})
		it('Checking single PCI resource (ie no FRBR versions): )', function () {
			cy.get('#searchBar').type('Elton John confirm tour down under: Elton John will return to Australia at the end of the year for another tour{enter}').as('getresource')
			cy.get('@getresource')
			cy.get('button[translate="nui.brief.results.loadMore"]')
			  .click({ multiple: true ,force: true })
			cy.get('prm-brief-result-container')
			  .get('div[id="SEARCH_RESULT_RECORDID_TN_informit_tvnewsTEV20111804171"]')
			  .click({ multiple: true ,force: true })
			cy.location('href').should('eq', 'https://primoauat.library.unsw.edu.au/primo-explore/fulldisplay?docid=TN_informit_tvnewsTEV20111804171&context=PC&vid=UNSWS&lang=en_US&search_scope=SearchFirst&adaptor=primo_central_multiple_fe&tab=default_tab&query=any,contains,Elton%20John%20confirm%20tour%20down%20under:%20Elton%20John%20will%20return%20to%20Australia%20at%20the%20end%20of%20the%20year%20for%20another%20tour&offset=0')
			})
	})
})

