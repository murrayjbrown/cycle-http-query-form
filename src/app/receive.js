//
// RECEIVE (Handle HTTP input effects)
//
export default function receive(HTTPsource) {
  // filter & flatten response message stream(s)
  const SITE = 'jsonplaceholder.typicode.com';
  const response$$ = HTTPsource
    .filter(response$ => response$.request.url.indexOf(SITE) >= 0);
  const response$ = response$$.switch();

  // return message streams
  return {
    user$: response$
      .map(response => response.body)
      .startWith(null)
  };
}
