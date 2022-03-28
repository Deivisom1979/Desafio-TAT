/// <reference types="cypress" />

describe('Desafio - Hacker Stories', () => {
  const primeiroTermo = 'React'
  const segundoTermo = 'Cypress'

  context('Validação via API', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'GET',
        url: '**/search**'
      }).as('MostrarHistorias')

      cy.visit('/')
      cy.wait('@MostrarHistorias')
    })
    it('Mostrar 100 histórias e as próximas histórias clicando em "More"', () => {
      cy.intercept({
        method: 'GET',
        url: '**/search**'
      }).as('MostrarMaisHistorias')

      cy.visit('/')
      cy.wait('@MostrarMaisHistorias')

      cy.get('input[type="text"]')
        .should('be.visible')
        .clear()
        .type(primeiroTermo)
      cy.get('button[type="submit"]')
        .should('be.visible')
        .click()
      cy.get('.table-row').should('have.length', 100)
      cy.contains('More')
        .should('be.visible')
        .click()
      cy.get('.table-row').should('have.length', 200)
    })
  })

  context('Validação via Mock', () => {
    context('Listar as histórias', () => {
      beforeEach(() => {
        cy.intercept(
          'GET',
          '**/search**',
          { fixture: 'historias' }
        ).as('verHistorias')
  
        cy.visit('/')
        cy.wait('@verHistorias')
      })
  
      context('Resultados', () => {
        const historias = require('../fixtures/historias')
        it('Mostrar os dados corretos', () => {
          // linha 01
          cy.get('.table-row')
            .first()
            .should('be.visible')
            .and('contain', historias.hits[0].title)
            .and('contain', historias.hits[0].author)
            .and('contain', historias.hits[0].num_comments)
            .and('contain', historias.hits[0].points)
          cy.get(`.table-row a:contains(${historias.hits[0].title})`)
            .should('have.attr', 'href', historias.hits[0].url)
  
          // linha 02
          cy.get('.table-row')
            .next()
            .should('be.visible')
            .and('contain', historias.hits[1].title)
            .and('contain', historias.hits[1].author)
            .and('contain', historias.hits[1].num_comments)
            .and('contain', historias.hits[1].points)
          cy.get(`.table-row a:contains(${historias.hits[1].title})`)
            .should('have.attr', 'href', historias.hits[1].url)
  
          // Linha 03
          cy.get('.table-row')
            .last()
            .should('be.visible')
            .and('contain', historias.hits[2].title)
            .and('contain', historias.hits[2].author)
            .and('contain', historias.hits[2].num_comments)
            .and('contain', historias.hits[2].points)
          cy.get(`.table-row a:contains(${historias.hits[2].title})`)
            .should('have.attr', 'href', historias.hits[2].url)
        })
        it('Apagar a última história e mostrar o resultado', () => {
          cy.get('.button-inline')
            .last()
            .should('be.visible')
            .click()
          cy.get('.table-row')
            .should('have.length', 2)
        })
        context('Ordenação', () => {
          it('Ordenar por Título', () => {
            cy.get('.button-inline:contains(Title)').as('Titulo')
              .should('be.visible')
              .click()
              .should('have.class', 'button-active')
    
            cy.get('.table-row')
              .first()
              .should('be.visible')
              .and('contain', historias.hits[0].title)
            cy.get(`.table-row a:contains(${historias.hits[0].title})`)
              .should('have.attr', 'href', historias.hits[0].url)
            
            cy.get('@Titulo')
              .click()
  
            cy.get('.table-row')
              .first()
              .should('be.visible')
              .and('contain', historias.hits[1].title)
            cy.get(`.table-row a:contains(${historias.hits[1].title})`)
              .should('have.attr', 'href', historias.hits[1].url)
          })
          it('Ordenar por Autor', () => {
            cy.get('.button-inline:contains(Author)').as('Autor')
              .should('be.visible')
              .click()
              .should('have.class', 'button-active')
            
            cy.get('.table-row')
              .first()
              .should('be.visible')
              .and('contain', historias.hits[2].author)
            
            cy.get('@Autor')
              .click()
            
            cy.get('.table-row')
              .first()
              .should('be.visible')
              .and('contain', historias.hits[1].author)
          })
          it('Ordenar por Comentários', () => {
            cy.get('.button-inline:contains(Comments)').as('Comentarios')
              .should('be.visible')
              .click()
              .should('have.class', 'button-active')
  
            cy.get('.table-row')
              .first()
              .should('be.visible')
              .and('contain', historias.hits[0].num_comments)
            
            cy.get('@Comentarios')
              .click()
            
            cy.get('.table-row')
              .first()
              .should('be.visible')
              .and('contain', historias.hits[1].num_comments)
          })
          it('Ordenar por Pontos', () => {
            cy.get('.button-inline:contains(Points)').as('Pontos')
              .should('be.visible')
              .click()
              .should('have.class', 'button-active')
  
            cy.get('.table-row')
              .first()
              .should('be.visible')
              .and('contain', historias.hits[0].points)
            
            cy.get('@Pontos')
              .click()
            
            cy.get('.table-row')
              .first()
              .should('be.visible')
              .and('contain', historias.hits[1].points)
          })
        })
      })
    });
    context('Pesquisas', () => {
      beforeEach(() => {
        cy.intercept(
          'GET',
          `**/search?query=redux&page=0&hitsPerPage=100`,
          { fixture: 'vazia' }
        ).as('semHistoria')

        cy.intercept(
          'GET',
          `**/search?query=${segundoTermo}&page=0&hitsPerPage=100`,
          { fixture: 'historias' }
        ).as('comHistoria')

        cy.visit('/')
        cy.wait('@semHistoria')

        cy.get('input[type="text"]')
          .should('be.visible')
          .clear()
      })
      it('Lista vazia quando não há história', () => {
        cy.get('.table-row')
          .should('not.exist')
      })
      it('Digita e pressiona <Enter>', () => {
        cy.get('input[type="text"]')
          .should('be.visible')
          .type(`${segundoTermo}{enter}`)
        
        cy.wait('@comHistoria')

        cy.get('.table-row').should('have.length', 3)
      })
      it('Digita e pressiona botão Search', () => {
        cy.get('input[type="text"]')
          .should('be.visible')
          .type(segundoTermo)
  
          cy.get('button[type="submit"]')
          .should('be.visible')
          .click()

          cy.wait('@comHistoria')
        
        cy.get('.table-row').should('have.length', 3)
      })
    })
  })

  context('Validar erros', () => {
    it('Validar erro 500', () => {
      cy.intercept(
        'GET',
        '**/search**',
        { statusCode: 500 }
      ).as('erro500')

      cy.visit('/')
      cy.wait('@erro500')

      cy.get('p:contains(Something went wrong.)')
      .should('be.visible')
      cy.log('Ooops..')
    })
    it('Validar erro de rede', () => {
      cy.intercept(
        'GET',
        '**/search**',
        { forceNetworkError: true }
      ).as('erroRede')

      cy.visit('/')
      cy.wait('@erroRede')
      
      cy.get('p:contains(Something went wrong.)')
      .should('be.visible')
      cy.log('Ooops..')
    })
  })
})