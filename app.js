var app = angular.module( "RepoExplorer", [] );

app.controller("RepoController", ['$scope', 'RepoService', function($scope, RepoService) {

	$scope.repos = [];
	$scope.usernameHistory = [];

	$scope.form = {
		username: "adrianblynch"
	};

	function storeUsername(username) {
		var history = $scope.usernameHistory; // Copied so all work is done before updating
		var index = history.indexOf(username);
		if (index === -1)  {
			history.unshift(username);
		}
		history = history.slice(0, 5);
		$scope.usernameHistory = history;
	}

	$scope.loadRepos = function(username) {

		username = username || $scope.form.username;

		if (username !== '') {

			RepoService.getRepos(username).then(function(repos) {
				$scope.repos = repos;
				$scope.form.username = '';
				storeUsername(username);
			});

		}

	}

	$scope.loadRepos();

}]);

app.service('RepoService', function($http, $q) {

		return {
			getRepos: getRepos,
		};

		function getRepos(username) {
			var request = $http({
				method: "get",
				url: "https://api.github.com/users/" + username + "/repos"
			});
			return request.then(handleSuccess, handleError);
		}

		function handleError(response) {
			if (! angular.isObject( response.data ) || 	! response.data.message) {
				return $q.reject("An unknown error occurred.");
			}
			return $q.reject(response.data.message);
		}

		function handleSuccess(response) {
			return response.data;
		}

	}
);