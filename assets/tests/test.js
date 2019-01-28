describe('Nav Bar', function() {
  var injector;
  var element;
  var scope;
  var intercepts;
  var httpBackend;
  var succeeded = 0;

/*Since this file is meant to run in the browser,
you can't use a require unless you compile this file
with Browserify.*/

  beforeEach(function() {

    /*an AngularJS dependency injector that's
      rooted at the mean-retail.components module*/
    injector = angular.injector(['mean-retail.components', 'ngMockE2E']);
    intercepts = {};
     
     /*The ngMockE2E is an angular module which contains mocks suitable for end-to-end testing. Currently there is only one mock present in this module - the e2e $httpBackend mock.*/
     /*$httpBackend Fake HTTP backend implementation suitable for end-to-end testing or backend-less development of applications that use the $http service.*/

    injector.invoke(function($rootScope, $compile, $httpBackend) {
      scope = $rootScope.$new();

      $httpBackend.whenGET(/.*\/templates\/.*/i).passThrough();
      // Requests for template are handled by the real server
      httpBackend = $httpBackend;
      
      /*$compile service
        can take an HTML string that uses your directive
        and compile it.*/
      element = $compile('<search-bar></search-bar>')(scope);
      /*you get a reference to a live dom element
        that you can interact with in a jQuery-like way*/
      scope.$apply();
    });
  });

  it('displays an input field', function(done) {
    scope.$on('SearchBarController', function() {
      assert.equal(element.find('input').length, 1);
      assert.ok(element.find('input').hasClass('search-bar-input'));

      ++succeeded;
      done();
    });
  });

  it('binds the input field to the `scope.searchText` variable', function(done) {
    httpBackend.expectGET('/api/v1/product/text/test').respond({});
    scope.$on('SearchBarController', function() {
      /*when SearchBarController has rendered*/
      /*operate in jquery style and syntax*/
      element.find('input').val('test');
      element.find('input').trigger('input');
      assert.equal(scope.searchText, 'test');

      ++succeeded;
      done();
    });
  });

  it('makes an HTTP request to `/api/v1/product/text/test` and exposes results to scope', function(done) {
    httpBackend.expectGET('/api/v1/product/text/test').respond({
      products: [{ name: 'test1' }, { name: 'test2' }]
    });

    scope.$on('SearchBarController', function() {
      element.find('input').val('test');
      element.find('input').trigger('input');
      assert.equal(scope.searchText, 'test');

      httpBackend.flush(); //sending fake response
      assert.equal(scope.results.length, 2);
      assert.equal(scope.results[0].name, 'test1');
      assert.equal(scope.results[1].name, 'test2');

      ++succeeded;
      done();
    });
  });

  it('displays autocomplete results in HTML', function(done) {
    httpBackend.expectGET('/api/v1/product/text/test').respond({
      products: [{ name: 'test1' }, { name: 'test2' }]
    });

    scope.$on('SearchBarController', function() {
      element.find('input').val('test');
      element.find('input').trigger('input');
      assert.equal(scope.searchText, 'test');

      httpBackend.flush();

      assert.equal(element.find('.autocomplete-result').length, 2);
      assert.equal(element.find('.autocomplete-result').eq(0).text().trim(), 'test1');
      assert.equal(element.find('.autocomplete-result').eq(1).text().trim(), 'test2');

      ++succeeded;
      done();
    });
  });

 
});
