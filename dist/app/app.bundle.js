(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return webpackJsonp([0],{

/***/ 0:
/*!*****************!*\
  !*** multi app ***!
  \*****************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! /u/marf/Projects/sandbox/query-cycle/build/app/index.js */1);
	__webpack_require__(/*! /u/marf/Projects/sandbox/query-cycle/build/app/intent.js */69);
	__webpack_require__(/*! /u/marf/Projects/sandbox/query-cycle/build/app/receive.js */70);
	__webpack_require__(/*! /u/marf/Projects/sandbox/query-cycle/build/app/model.js */71);
	__webpack_require__(/*! /u/marf/Projects/sandbox/query-cycle/build/app/send.js */73);
	module.exports = __webpack_require__(/*! /u/marf/Projects/sandbox/query-cycle/build/app/view.js */74);


/***/ },

/***/ 1:
/*!****************************!*\
  !*** ./build/app/index.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _core = __webpack_require__(/*! @cycle/core */ 2);
	
	var _dom = __webpack_require__(/*! @cycle/dom */ 6);
	
	var _http = __webpack_require__(/*! @cycle/http */ 64);
	
	var _intent = __webpack_require__(/*! ./intent */ 69);
	
	var _intent2 = _interopRequireDefault(_intent);
	
	var _receive = __webpack_require__(/*! ./receive */ 70);
	
	var _receive2 = _interopRequireDefault(_receive);
	
	var _model = __webpack_require__(/*! ./model */ 71);
	
	var _model2 = _interopRequireDefault(_model);
	
	var _send = __webpack_require__(/*! ./send */ 73);
	
	var _send2 = _interopRequireDefault(_send);
	
	var _view = __webpack_require__(/*! ./view */ 74);
	
	var _view2 = _interopRequireDefault(_view);
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}
	
	// Effects drivers
	// External dependencies
	var drivers = {
	  DOM: (0, _dom.makeDOMDriver)('#app'),
	  HTTP: (0, _http.makeHTTPDriver)()
	};
	//
	// MAIN
	//
	
	// Application functions
	function main(sources) {
	  var actions = (0, _intent2.default)(sources.DOM);
	  var messages = (0, _receive2.default)(sources.HTTP);
	  var states = (0, _model2.default)({ DOM: actions, HTTP: messages });
	  var request$ = (0, _send2.default)(states.HTTP);
	  var vtree$ = (0, _view2.default)(states.DOM);
	
	  // return sinks
	  return {
	    DOM: vtree$,
	    HTTP: request$
	  };
	}
	
	//
	// RUN Cycle
	//
	(0, _core.run)(main, drivers);

/***/ },

/***/ 69:
/*!*****************************!*\
  !*** ./build/app/intent.js ***!
  \*****************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = intent;
	//
	// INTENT (Handle DOM input effects)
	//
	function intent(DOMsource) {
	  var debounceTime = 10; // milliseconds
	  var inputUserId$ = DOMsource.select('.user-id').events('input').map(function (ev) {
	    return ev.target.value;
	  }).debounce(debounceTime);
	  var clickGetUserInfo$ = DOMsource.select('.get-user-info').events('click');
	
	  // return action stream(s)
	  return {
	    changeUserId$: inputUserId$,
	    submitGetUserInfo$: clickGetUserInfo$
	  };
	}

/***/ },

/***/ 70:
/*!******************************!*\
  !*** ./build/app/receive.js ***!
  \******************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = receive;
	//
	// RECEIVE (Handle HTTP input effects)
	//
	function receive(HTTPsource) {
	  // filter & flatten response message stream(s)
	  var SITE = 'jsonplaceholder.typicode.com';
	  var response$$ = HTTPsource.filter(function (response$) {
	    return response$.request.url.indexOf(SITE) >= 0;
	  });
	  var response$ = response$$.switch();
	
	  // return message streams
	  return {
	    user$: response$.map(function (response) {
	      return response.body;
	    }).startWith(null)
	  };
	}

/***/ },

/***/ 71:
/*!****************************!*\
  !*** ./build/app/model.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = model;
	
	var _rxLite = __webpack_require__(/*! rx-lite */ 72);
	
	function model(events) {
	  var ENDPOINT = 'http://jsonplaceholder.typicode.com/users/';
	  var endpoint$ = events.DOM.submitGetUserInfo$.withLatestFrom(events.DOM.changeUserId$, function (submit, userid) {
	    return userid ? ENDPOINT + userid : ENDPOINT + '';
	  });
	
	  var userId$ = events.DOM.changeUserId$.map(function (userid) {
	    return userid;
	  }).startWith('');
	
	  var userInfo$ = events.HTTP.user$.startWith({});
	
	  var user$ = _rxLite.Observable.combineLatest(userId$, userInfo$, function (id, info) {
	    var u = { id: '' };
	    if (id) {
	      u.id = id;
	      if (info) {
	        u.query = ENDPOINT + id;
	        u.name = info.name;
	        u.email = info.email;
	        u.site = info.website;
	      }
	    }
	    return u;
	  });
	
	  // return states
	  return {
	    DOM: {
	      user$: user$
	    },
	    HTTP: {
	      user$: endpoint$
	    }
	  };
	} //
	// MODEL
	//

/***/ },

/***/ 73:
/*!***************************!*\
  !*** ./build/app/send.js ***!
  \***************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = send;
	//
	// SEND (Handle HTTP output effects)
	//
	function send(HTTPstates) {
	  var request$ = HTTPstates.user$.map(function (url) {
	    return {
	      url: url,
	      method: 'GET'
	    };
	  });
	
	  // return HTTP request stream
	  return request$;
	}

/***/ },

/***/ 74:
/*!***************************!*\
  !*** ./build/app/view.js ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = view;
	
	var _dom = __webpack_require__(/*! @cycle/dom */ 6);
	
	function view(DOMstates) {
	  var vtree$ = DOMstates.user$.map(function (user) {
	    return (0, _dom.div)([(0, _dom.label)('User: '), (0, _dom.input)('.user-id', { style: 'text',
	      value: user === null ? '' : user.id
	    }), (0, _dom.button)('.get-user-info', 'Get user info'), (0, _dom.hr)(), (0, _dom.p)([(0, _dom.span)('.query-slug', 'Query: '), user === null ? null : (0, _dom.span)('.query-url', user.query)]), (0, _dom.hr)(), user === null ? null : (0, _dom.div)('.user-details', [(0, _dom.h1)('.user-name', user.name), (0, _dom.h4)('.user-email', user.email), (0, _dom.a)('.user-website', { href: user.site }, user.site)])]);
	  });
	  return vtree$;
	} //
	// view() returns stream of virtual dom tree (vtree$) effects
	//

/***/ }

})
});
;
//# sourceMappingURL=app.bundle.js.map