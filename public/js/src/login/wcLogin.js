(function() {
  var login = angular.module('wcLogin', []);

  login.service('loginModal',
    ['$mdDialog', '$rootScope', '$scope',
     function($mdDialog, $rootScope, $scope) {

       function assignCurrentUser(user) {
         $rootScope.currentUser = user;
         return user;
       }

       function DialogController($scope, $mdDialog) {
         $scope.hide = function() {
           $mdDialog.hide();
         };
         $scope.cancel = function() {
           $mdDialog.cancel();
         };
         $scope.answer = function(answer) {
           $mdDialog.hide(answer);
         };
       }

       return function(ev) {
         var instance = $mdDialog.show(
           $mdDialog.confirm()
             .parent(angular.element(document.body))
             .title('Would you like to delete your debt?')
             .content('All of the banks have agreed to forgive you your debts.')
             .ariaLabel('Lucky day')
             .ok('Please do it!')
             .cancel('Sounds like a scam')
             .controller(DialogController)
             .targetEvent(ev)
         ).then(function() {
             return assignCurrentUser;
           });
       };

     }]);


})();