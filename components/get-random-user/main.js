import isolate from '@cycle/isolate'

import {div, button, h1, h4, a, p} from '@cycle/dom'

function main (sources) {
  const click$ = sources.DOM.select('.get-random')
    .events('click')

  const USERS_URL = 'http://jsonplaceholder.typicode.com/users/'

  const getRandomUser$ = click$
    .buffer(() => click$.debounce(250))
    .map(() => {
      const randomNum = Math.round(Math.random() * 9) + 1
      return {
        url: USERS_URL + String(randomNum),
        method: 'GET'
      }
    })

  const user$ = sources.HTTP
    .filter(res$ => res$.request.url.indexOf(USERS_URL) === 0)
    .mergeAll()
    .map(res => res.body)
    .startWith(null)

  const uservdom$ = user$.map(user =>
    div('.users', [
      p([
        a({href: 'https://github.com/cyclejs/examples/tree/master/http-random-user',
           style: {'font-size': '10px'}}, 'https://github.com/cyclejs/examples/tree/master/http-random-user')
      ]),
      button('.get-random', 'Get random user'),
      user === null ? null : div('.user-details', [
        h1('.user-name', user.name),
        h4('.user-email', user.email),
        a('.user-website', {href: user.website}, user.website)
      ])
    ])
  )

  return {
    DOM: uservdom$,
    HTTP: getRandomUser$
  }
}

export default sources => isolate(main)(sources)
