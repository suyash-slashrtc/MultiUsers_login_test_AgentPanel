Feature: Agent Login and Ready State Verification

  Scenario Outline: Multiple agents login and go ready sequentially
    Given I have loaded agents from CSV
    And I am on the login page for agent from row <row>
    When I login with credentials from CSV row <row>
    Then I should be redirected to the dashboard
    When I click on the web endpoint button
    And I handle microphone permission popup
    And I click on the menu tab
    And I click on the logout button
    Then I should be redirected to the login page

    Examples:
      | row |
      | 0   |
      | 1   |
      | 2   |
      | 3   |
      | 4   |