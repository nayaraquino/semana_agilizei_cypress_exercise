/// <reference types="cypress" />

import { format, prepareLocalStorage } from '../support/utils'

context('Dev Finances', () => {

  beforeEach(() => {
    cy.visit('https://devfinance-agilizei.netlify.app/#', {
      onBeforeLoad: (win) => {
        prepareLocalStorage(win)
      }
    })
    cy.get('#data-table tbody tr').should('have.length', 2)

  });
  it('Register entries', () => {

    cy.get('#transaction .button').click() //selected by id and class
    cy.get('#description').type('Salario') //selected by id
    cy.get('[name=amount]').type(12) //selected by attribute
    cy.get('[type=date]').type('2021-03-21')
    cy.get('button').contains('Salvar').click() //selected by type

    cy.get('#data-table tbody tr').should('have.length', 3)

  });

  it('Register exits', () => {

    cy.get('#transaction .button').click() //selected by id and class
    cy.get('#description').type('Chocolate') //selected by id
    cy.get('[name=amount]').type(-12) //selected by attribute
    cy.get('[type=date]').type('2021-03-21')
    cy.get('button').contains('Salvar').click() //selected by type

    cy.get('#data-table tbody tr').should('have.length', 3)

  });

  it('Remove entries and exits', () => {
    
    const entrie = 'Allowance'
    const exit = 'Chocolate'

    cy.get('td.description')
      .contains(entrie)
      .parent()
      .find('img[onclick*=remove]')
      .click()

    cy.get('td.description')
      .contains(exit)
      .siblings()
      .children('img[onclick*=remove]')
      .click()

    cy.get('#data-table tbody tr').should('have.length', 0)
      
  });

  it('Validate with multiple transations', () => {

    let incomes = 0
    let expenses = 0
    
    cy.get('#data-table tbody tr')
      .each(($element, index, $list) => {
        
        cy.get($element).find('td.income, td.expense')
          .invoke('text').then(text => {
            //cy.log(text)
            //cy.log(format(text))

            if(text.includes('-')){
              expenses = expenses + format(text)
            } else {
              incomes = incomes + format(text)
            }
            
            cy.log('entradas', incomes)
            cy.log('saídas', expenses)

          })
      })

      cy.get('#totalDisplay').invoke('text').then(text => {

        let formattedTotalDisplay = format(text)
        let expectedTotal = incomes + expenses

        expect(formattedTotalDisplay).to.eq(expectedTotal)

      })
  });

});