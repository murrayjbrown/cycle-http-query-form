//
// INTENT (Handle DOM input effects)
//
export default function intent(DOMsource) {
  const debounceTime = 10;  // milliseconds
  const inputUserId$ = DOMsource
    .select('.user-id')
    .events('input')
    .map(ev => ev.target.value)
    .debounce(debounceTime);
  const clickGetUserInfo$ = DOMsource
    .select('.get-user-info')
    .events('click');

  // return action stream(s)
  return {
    changeUserId$ : inputUserId$,
    submitGetUserInfo$: clickGetUserInfo$
  };
}
