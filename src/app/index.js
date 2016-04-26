// External dependencies
import { run } from "@cycle/core";
import { makeDOMDriver } from "@cycle/dom";
import { makeHTTPDriver } from "@cycle/http";

// Application functions
import intent from "./intent";
import receive from "./receive";
import model from "./model";
import send from "./send";
import view from "./view";

// Effects drivers
const drivers = {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver()
};
//
// MAIN
//
function main(sources) {
  const actions = intent( sources.DOM );
  const messages = receive( sources.HTTP );
  const states = model( {DOM: actions, HTTP: messages} );
  const request$ = send( states.HTTP );
  const vtree$ = view( states.DOM );

  // return sinks
  return {
    DOM: vtree$,
    HTTP: request$
  };
}

//
// RUN Cycle
//
run(main, drivers);
