angular
  .module('todo')
  .config(resourceConfig);

function resourceConfig($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
}
