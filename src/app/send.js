//
// SEND (Handle HTTP output effects)
//
export default function send(HTTPstates) {
  const request$ = HTTPstates.user$.map( (url) => {
    return {
      url: url,
      method: 'GET'
    };
  });

  // return HTTP request stream
  return request$;
}
