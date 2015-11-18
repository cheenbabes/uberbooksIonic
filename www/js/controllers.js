angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});


})

.controller('PlaylistCtrl', function ($scope, $stateParams) {})

.controller('LoginCtrl', function ($scope, $stateParams, Auth, $location, $q, Ref, $timeout, $ionicPopup) {
    $scope.passwordLogin = function (email, pass) {
        $scope.err = null;
        Auth.$authWithPassword({
            email: email,
            password: pass
        }, {
            rememberMe: true
        }).then(
            redirect, showError
        );
    };

    $scope.createAccount = function (email, pass, confirm) {
        $scope.err = null;
        if (!pass) {
            var alertPopup = $ionicPopup.alert({
                title: "Error!",
                template: "Please enter a password.",
                okType: 'button-assertive'
            })
        } else if (pass !== confirm) {
            var alertPopup = $ionicPopup.alert({
                title: "Error!",
                template: "Your passwords do not match.",
                okType: 'button-assertive'
            })
        } else {
            Auth.$createUser({
                    email: email,
                    password: pass
                })
                .then(function () {
                    // authenticate so we have permission to write to Firebase
                    return Auth.$authWithPassword({
                        email: email,
                        password: pass
                    }, {
                        rememberMe: true
                    });
                })
                .then(createProfile)
                .then(redirect, showError);
        }

        function createProfile(user) {
            var ref = Ref.child('users').child(user.uid),
                def = $q.defer();
            ref.set({
                email: email,
                name: firstPartOfEmail(email)
            }, function (err) {
                $timeout(function () {
                    if (err) {
                        def.reject(err);
                    } else {
                        def.resolve(ref);
                    }
                });
            });
            return def.promise;
        }
    };


    $scope.recoverPassword = function () {
        Ref.resetPassword({
            email: $scope.recover.email
        }, function (error) {
            if (error) {
                switch (error.code) {
                case "INVALID_USER":
                    Flash.create('danger', "The specified user account does not exist.");
                    console.log("The specified user account does not exist.");
                    break;
                default:
                    Flash.create('danger', "Error resetting password");
                    console.log("Error resetting password:", error);
                }
            } else {
                Flash.create('success', "Password reset email sent successfuly!");
                $scope.passwordMode = false;
                console.log("Password reset email sent successfully!");
            }
        });
    };

    function firstPartOfEmail(email) {
        return ucfirst(email.substr(0, email.indexOf('@')) || '');
    }

    function ucfirst(str) {
        // inspired by: http://kevin.vanzonneveld.net
        str += '';
        var f = str.charAt(0).toUpperCase();
        return f + str.substr(1);
    }



    function redirect() {
        //        Flash.create('success', "Thank you for logging in!");
        var alertPopup = $ionicPopup.alert({
            title: "Login successful!",
            template: "Redirecting you to the home page."
        })
        $location.path('/app/home');
    }

    function showError(err) {
        //        if(Object.keys(err).length != 0){
        //        Flash.create('danger', "There was an error. Please try again.");
        var alertPopup = $ionicPopup.alert({
            title: "Error!",
            template: "It seems there's been some kind of error.<br>" + err,
            okType: 'button-assertive'
        })
        $scope.err = err;
        //        }

    }

    $scope.logout = function () {
        Auth.$unauth();
        var alertPopup = $ionicPopup.alert({
            title: "Logged out",
            template: "You have been successfully logged out."
        })
    }

})

.controller('AccountCtrl', function ($scope, $stateParams) {})

.controller('MapCtrl', function ($scope, $stateParams) {})

.controller('HomeCtrl', function ($scope, $stateParams) {});