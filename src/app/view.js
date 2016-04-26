//
// view() returns stream of virtual dom tree (vtree$) effects
//
import {a, button, div, hr, h1, h4, input, label, p, span} from "@cycle/dom";
export default function view(DOMstates) {
  const vtree$ = DOMstates.user$
    .map(user =>
      div([
        label('User: '),
        input('.user-id', {style: 'text',
          value: user === null ? '' : user.id
        }),
        button('.get-user-info', 'Get user info'),
        hr(),
        p([
          span('.query-slug', 'Query: '),
          user === null ? null : span('.query-url', user.query)
        ]),
        hr(),
        user === null ? null : div('.user-details', [
          h1('.user-name', user.name),
          h4('.user-email', user.email),
          a('.user-website', {href: user.site}, user.site)
        ])
      ])
    );
  return vtree$;
}
