var app = angular.module('forum-app', ['ngMessages', 'ui.router', 'ui.bootstrap']);

app.config([
'$stateProvider',
'$urlRouterProvider',
'$httpProvider',
'$locationProvider',
function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
    
    // Expose XHR requests to server
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $locationProvider.html5Mode(true);
    // Root Functions
    // Control mobile menu
    function NavBarCtrl($scope) {
        $scope.isCollapsed = true;
    }
    
 
        //View a About Page
    $stateProvider.state('about', {
        url: '/about',
        templateUrl: 'angularTemplates/about.html',
        controller: 'AuthCtrl'
    });
    //View a Single Category By ID
    

    // User info State    
    $stateProvider.state('userProfile', {
        url: '/user-profile/{username}',
        templateUrl: 'angularTemplates/user-profile.html',
        controller: 'UserProfileCtrl',
        resolve: {
        user: ['$stateParams', 'users', function($stateParams, users) {
            return users.getOne($stateParams.username);
        }]
        },
        // onEnter: ['$state', 'auth', function($state, auth){
        //     if(!auth.isLoggedIn()){
        //         $state.go('login');
        //     }
        // }]
    });

    // Log in State
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'angularTemplates/login.html',
        controller: 'AuthCtrl',
        onEnter: ['$state', 'auth', function($state, auth){
            if(auth.isLoggedIn()){
                $state.go('userProfile');
            }
        }]
    }); 
    
    // Registration state
    $stateProvider.state('register', {
        url: '/register',
        templateUrl: 'angularTemplates/register.html',
        controller: 'AuthCtrl',
        onEnter: ['$state', 'auth', function($state, auth){
            if(auth.isLoggedIn()){
                $state.go('login');
            }
        }]
    }); 

    $urlRouterProvider.otherwise('login');
}]);
