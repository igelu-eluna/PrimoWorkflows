describe('My First Test', function() {
  it('Visit OBV Primo', function() {
    cy.visit('https://search.obvsg.at/primo-explore/search?vid=OBV&lang=de_DE');
    cy.get('#searchBar').then(function($input) {
      $input[0].value = 'Wien';
    })
    cy.get('button[aria-label="Suche absenden"]').click();
  })
})
