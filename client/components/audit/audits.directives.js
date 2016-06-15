'use strict';

var app = angular.module('myApp.audits.directives', []);

app.directive('audit', ['Report', '$routeParams', '$location', 'Location', '$q', 'menu', function(Report, $routeParams,$location,Location, $q, menu) {

  var link = function( scope, element, attrs ) {

    menu.isOpen = false;
    menu.hideBurger = false;
    menu.sections = [{}];
    menu.sectionName = 'Audit';
    menu.header = '';

    var isActive = function(path) {
      var split = $location.path().split('/');
      if (split.length >= 3) {
        return ($location.path().split('/')[2] === path);
      } else if (path === 'dashboard') {
        return true;
      }
    };

    var createMenu = function() {
      menu.header = 'Audit Reports';

      menu.sections.push({
        name: 'Radius',
        link: '/#/audit/',
        type: 'link',
        icon: 'donut_large',
        active: isActive('dashboard')
      });

      menu.sections.push({
        name: 'Emails',
        type: 'link',
        link: '/#/audit/emails',
        icon: 'email',
        active: isActive('emails')
      });

      menu.sections.push({
        name: 'Social',
        type: 'link',
        link: '/#/audit/social',
        icon: 'people',
        active: isActive('social')
      });

      menu.sections.push({
        name: 'Guests',
        type: 'link',
        link: '/#/audit/guests',
        icon: 'person_pin',
        active: isActive('guests')
      });

      menu.sections.push({
        name: 'Sales',
        type: 'link',
        link: '/#/audit/sales',
        icon: 'shopping_cart',
        active: isActive('sales')
      });

    };

    // scope.updatePage = function(item) {
    //   var hash            = {};
    //   item                = item || {};
    //   hash.start          = item.start || scope.start;
    //   hash.end            = item.end || scope.end;
    //   hash.location_id    = item.id;
    //   hash.location_name  = item.location_name;
    //   hash.q              = item.q;
    //   hash.hc             = scope.hc;
    //   scope.start         = hash.start;
    //   scope.end           = hash.end;
    //   $location.search(hash);
    // };

    // scope.init = function(params) {
    //   var deferred = $q.defer();

    //   Report.get(params).$promise.then(function(results) {
    //     deferred.resolve(results);
    //   }, function(err) {
    //     deferred.reject(err);
    //   });

    //   return deferred.promise;

    // };

    createMenu();

  };

  var controller = function($scope) {

    this.locationSearch = function(val) {
      return Location.query({q: val, size: 10}).$promise.then(function (res) {
      });
    };

    this.selectLocation = function(item) {
      $scope.updatePage(item);
    };

    this.get = function(params) {
      params.interval        = $routeParams.interval || 'day';
      params.start           = $routeParams.start;
      params.end             = $routeParams.end;
      params.location_id     = $routeParams.location_id;
      params.location_name   = $routeParams.location_name;

      return $scope.init(params);
    };

    this.clearLocations = function() {
      $scope.updatePage();
    };

    this.updateRange = function(msg) {
      $scope.updatePage(msg);
    };

    this.clearQuery = function() {
      $scope.clearQuery();
    };
  };

  return {
    link: link,
    controller: controller,
    scope: {}
  };

}]);

app.directive('auditSessions', ['Session', '$routeParams', '$location', 'Client', '$q', '$timeout', '$mdDialog', function(Session, $routeParams, $location, Client, $q, $timeout, $mdDialog) {

  var link = function( scope, element, attrs ) {

    scope.loading       = true;
    scope.selected      = [];
    scope.client_mac    = $routeParams.client_mac;
    scope.ap_mac        = $routeParams.ap_mac;
    scope.location_name = $routeParams.location_name;
    scope.username      = $routeParams.username;

    if (scope.location_name) {
      scope.selectedItem  = scope.location_name;
    } else if (scope.ap_mac) {
      scope.selectedItem = scope.ap_mac;
    } else if (scope.client_mac) {
      scope.selectedItem = scope.client_mac;
    } else if (scope.username) {
      scope.selectedItem = scope.username;
    }

    function querySearch (query) {
      var deferred = $q.defer();
      Session.query({q: query, v2: true}).$promise.then(function(results) {
        deferred.resolve(results.results);
      }, function() {
        deferred.reject();
      });
      return deferred.promise;
    }

    function searchTextChange(text) {
    }

    var timer;
    function selectedItemChange(item) {
      timer = $timeout(function() {
        var hash = {};
        if (item && item._index) {
          switch(item._index) {
            case 'devices':
              hash.ap_mac = item._key;
              break;
            case 'clients':
              hash.client_mac = item._key;
              break;
            case 'locations':
              hash.location_name = item._key;
              break;
            case 'vouchers':
              hash.username = item._key;
              break;
            default:
              console.log(item._index);
          }
        }
        $location.search(hash);
      }, 250);
    }

    scope.querySearch         = querySearch;
    scope.selectedItemChange  = selectedItemChange;
    scope.searchTextChange    = searchTextChange;

    var rowSelect = true;
    if ($routeParams.q) {
      rowSelect = false;
    }

    scope.options = {
      boundaryLinks: false,
      largeEditDialog: false,
      pageSelector: false,
      rowSelection: rowSelect
    };

    scope.query = {
      order:          '-acctstarttime',
      start:          $routeParams.start,// || start,
      end:            $routeParams.end,// || end,
      filter:         $routeParams.q,
      limit:          $routeParams.per || 25,
      page:           $routeParams.page || 1,
      options:        [5,10,25,50,100],
      direction:      $routeParams.direction || 'desc'
    };

    scope.onPaginate = function (page, limit) {
      scope.query.page = page;
      scope.query.limit = limit;
      search();
    };

    var search = function() {
      var hash        = $location.search();
      hash.q          = scope.query.filter;
      hash.client_mac = scope.client_mac;
      hash.page       = scope.query.page;
      hash.per        = scope.query.limit;
      hash.start      = scope.query.start;
      hash.end        = scope.query.end;
      $location.search(hash);
    };

    scope.filterClient = function() {
      scope.client_mac = scope.selected[0].client_mac;
      search();
    };

    scope.clearFilter = function() {
      $location.search({});
    };

    // This is duplicated from the codes directive //
    // Should be consolodated in to a single dir   //

    scope.rangeFilter = function(ev) {
      $mdDialog.show({
        templateUrl: 'components/locations/clients/_range_filter.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        controller: DialogController
      });
    };

    function DialogController($scope) {

      $scope.myDate = new Date();
      $scope.minDate = new Date(
        $scope.myDate.getFullYear(),
        $scope.myDate.getMonth() - 2,
        $scope.myDate.getDate()
      );
      $scope.maxDate = new Date(
        $scope.myDate.getFullYear(),
        $scope.myDate.getMonth(),
        $scope.myDate.getDate()
      );

      $scope.close = function() {
        $mdDialog.cancel();
      };

      $scope.search = function() {
        scope.query.start = new Date($scope.startDate).getTime() / 1000;
        scope.query.end   = new Date($scope.endDate).getTime() / 1000;
        if (scope.query.start >= scope.query.end) {
          $scope.error = 'The start date must be less than the end date';
        } else {
          $mdDialog.cancel();
          scope.query.page = 1;
          scope.query.limit = 50;
          search();
        }
      };
    }
    DialogController.$inject = ['$scope'];

    // Don't like this however it's less annoying than dealing with
    // the conversion from a numeric id to slug in the locs. controller

    scope.visitClient = function(session) {
      Client.get({location_id: session.location_id, q: session.client_mac}, function(data) {
        $location.path('/locations/' + data.location_slug + '/clients/' + data.id);
      }, function(){
      });
    };

    var init = function() {
      var deferred = $q.defer();
      var params = {
        page: scope.query.page,
        username: scope.username,
        start: scope.query.start,
        end: scope.query.end,
        location_id: scope.location_id,
        q: scope.query.filter,
        per: scope.query.limit,
        ap_mac: scope.ap_mac,
        location_name: scope.location_name,
        client_mac: scope.client_mac,
      };
      Session.query(params).$promise.then(function(results) {
        scope.sessions    = results.sessions;
        scope._stats      = results._stats;
        scope.predicate   = '-starttime';
        scope._links      = results._links;
        scope.promise = deferred.promise;
        deferred.resolve();
      }, function(err) {
        scope.loading = undefined;
      });
    };

    init();

  };

  return {
    scope: {
      username: '@',
    },
    link: link,
    require: '^audit',
    templateUrl: 'components/audit/sessions/_index.html'
  };

}]);

app.directive('auditEmails', ['Session', '$routeParams', '$location', 'Client', '$q', '$timeout', '$mdDialog', function(Session, $routeParams, $location, Client, $q, $timeout, $mdDialog) {

  var link = function( scope, element, attrs ) {

  };

  return {
    scope: {
      username: '@',
    },
    link: link,
    require: '^audit',
    templateUrl: 'components/audit/emails/_index.html'
  };

}]);

app.directive('auditSocial', ['Session', '$routeParams', '$location', 'Client', '$q', '$timeout', '$mdDialog', function(Session, $routeParams, $location, Client, $q, $timeout, $mdDialog) {

  var link = function( scope, element, attrs ) {

  };

  return {
    scope: {
      username: '@',
    },
    link: link,
    require: '^audit',
    templateUrl: 'components/audit/social/_index.html'
  };

}]);

app.directive('auditGuests', ['Session', '$routeParams', '$location', 'Client', '$q', '$timeout', '$mdDialog', function(Session, $routeParams, $location, Client, $q, $timeout, $mdDialog) {

  var link = function( scope, element, attrs ) {

  };

  return {
    scope: {
      username: '@',
    },
    link: link,
    require: '^audit',
    templateUrl: 'components/audit/guests/_index.html'
  };

}]);

app.directive('auditSales', ['Session', '$routeParams', '$location', 'Client', '$q', '$timeout', '$mdDialog', function(Session, $routeParams, $location, Client, $q, $timeout, $mdDialog) {

  var link = function( scope, element, attrs ) {

  };

  return {
    scope: {
      username: '@',
    },
    link: link,
    require: '^audit',
    templateUrl: 'components/audit/sales/_index.html'
  };

}]);