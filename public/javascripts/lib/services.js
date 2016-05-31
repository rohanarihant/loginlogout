

// USERS service
app.factory('users',  ['$http', 'userMessages', 'auth', function($http, userMessages, auth){
    var o = {
    //Debug model
    users: [ 
            {
            username: 'Test'
            }
        ]
    };
    o.getAll = function() {
        return $http.get('/api/users').success(function(data){
            angular.copy(data, o.users);
        });
    };
    o.getOne = function(id) {
        return $http.get('/api/users/' + id).then(function(res){
            return res.data;
        });
    };
    
    
  return o;
}]);

//AUTHORIZATION service
app.factory('auth', ['$http','$window', '$timeout', 'userMessages', function($http, $window, $timeout, userMessages){
    var auth = {};
    auth.saveToken = function (token){
        $window.localStorage['forum-token'] = token;
    };

    auth.getToken = function (){
        return $window.localStorage['forum-token'];
    }
    auth.isLoggedIn = function(){
        var token = auth.getToken();

        if(token){
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    };
    auth.currentUser = function(){
        if(auth.isLoggedIn()){
            var token = auth.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.username;
        }
    };
    auth.userRole = function(){
        if(auth.isLoggedIn()){
            var token = auth.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.userrole;
        }
    };
    auth.isAdmin = function(){
        if(auth.isLoggedIn()){
            var token = auth.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.userrole == 'Admin';
        }
    };
    auth.register = function(user){
        return $http.post('/api/register', user).success(function(data){
            auth.saveToken(data.token);
            userMessages.setMessage("Your Account Has Been Created.")
        });
    };
    auth.logIn = function(user){
        return $http.post('/api/login', user).success(function(data){
            auth.saveToken(data.token);
            userMessages.setMessage( user.username + " has succesfully logged in.")
        });
    };
    auth.logOut = function(){
        userMessages.setMessage("You have succesfully logged out.")
        $window.localStorage.removeItem('forum-token');
    };
    
    return auth;   
}]);

// create and destroy user messages
app.service('userMessages', function () {
    var usermessage = '';
    return {
        getMessage: function () {
            return usermessage;
        },
        setMessage: function(value) {
            usermessage = value;
        },
        hideMessage: function() {
            usermessage = '';
        }
    };
});
