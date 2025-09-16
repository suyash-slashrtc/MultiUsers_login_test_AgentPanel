// cucumber.js
module.exports = {
  default: {
    require: [
      'features/step_definitions/steps.js',
      'features/support/hooks.js',
      'features/support/world.js',
      'features/support/dataReader.js'
    ],
    format: [
      'progress-bar',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json'
    ],
    parallel: 5,
    worldParameters: {}
  }
};