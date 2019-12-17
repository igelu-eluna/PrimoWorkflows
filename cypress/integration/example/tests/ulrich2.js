describe('My First Test', function() {
  it('Visit OBV Primo', function() {
    cy.visit('https://search.obvsg.at/primo-explore/search?vid=OBV&lang=de_DE');
    cy.get('#searchBar').type('Wien{enter}');
    // cy.get('button[aria-label="Suche absenden"]').click();
    // cy.get('form[name="search-form"]').submit();
  })
})
