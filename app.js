var app = angular.module("RepoExplorer", []);

var cacheRequests = false;

app.controller("RepoCtrl", function($scope, RepoService, OwnerService) {

	$scope.repos = [];
	$scope.usernameHistory = [];
	$scope.repo = {};
	$scope.owner = {};

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

	$scope.loadReposAndOwner = function(username) {

		var loadedRepos, loadedOwner;

		username = username || $scope.form.username;

		if (username !== "") {

			RepoService.getRepos(username).then(function(repos) {
				console.log("Got repos");
				loadedRepos = repos;
				done();
			});

			OwnerService.getOwner(username).then(function(owner) {
				console.log("Got owner");
				loadedOwner = owner;
				done();
			});

			function done() {
				if (loadedRepos && loadedOwner) {
					$scope.repos = loadedRepos;
					$scope.form.username = "";
					storeUsername(username);
					$scope.owner = loadedOwner;
				}
			}

		}

	};

	$scope.showRepo = function(repo) {
		$scope.repo = repo;
		console.log(repo);
	};

	$scope.loadReposAndOwner();

});

app.service("OwnerService", function($http, $q) {

	return {
		getOwner: getOwner,
	};

	function getOwner(username) {
		var request = $http({
			method: "get",
			cache: cacheRequests,
			//url: "owner.json"
			url: "https://api.github.com/users/" + username
		});
		return request.then(handleSuccess, handleError);
	}

	function handleError(response) {
		if (!angular.isObject( response.data) || !response.data.message) {
			return $q.reject("An unknown error occurred.");
		}
		return $q.reject(response.data.message);
	}

	function handleSuccess(response) {
		return response.data;
	}

});

app.service("RepoService", function($http, $q) {

	return {
		getRepos: getRepos,
	};

	function getRepos(username) {
		var request = $http({
			method: "get",
			cache: cacheRequests,
			//url: "repos.json"
			url: "https://api.github.com/users/" + username + "/repos"
		});
		return request.then(handleSuccess, handleError);
	}

	function handleError(response) {
		if (!angular.isObject( response.data ) || !response.data.message) {
			return $q.reject("An unknown error occurred.");
		}
		return $q.reject(response.data.message);
	}

	function handleSuccess(response) {
		return response.data;
	}

});
