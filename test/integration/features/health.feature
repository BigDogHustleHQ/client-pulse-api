Feature: health query
  As a platform operator
  I want a health endpoint
  So that I can confirm the API is reachable and serving GraphQL

  Scenario: health returns ok
    When I send the GraphQL operation:
      """
      query {
        health
      }
      """
    Then the response status should be 200
    And there should be no GraphQL errors
    And the GraphQL field "health" should equal "ok"
