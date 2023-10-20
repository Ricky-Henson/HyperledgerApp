describe("Test admin", () => {
  beforeEach(() => {
    cy.visit("/login");

    cy.get(":nth-child(1) > .form-control").select("admin");
    cy.get(":nth-child(2) > .form-control").select("Office 1");
    cy.get(":nth-child(3) > .form-control").type(
      Cypress.config("adminUsernameOffice1")
    );
    cy.get(":nth-child(4) > .form-control").type(
      Cypress.config("adminPasswordOffice1")
    );
    cy.get(".btn").click();

    cy.url().should("include", "/admin/office1admin");
    cy.get(".text-ellipsis").should("contain", "Admin office1admin");
    cy.get(".mr-auto > .nav-item > .nav-link").should("contain", "Admin");
  });
});
