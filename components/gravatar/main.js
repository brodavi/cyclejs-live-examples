import { div, h1, form, input, label, p, a } from '@cycle/dom'
import isolate from '@cycle/isolate'
import { Observable } from 'rx'
import Gravatar from './Gravatar'

const intent = DOM => {
  const input$ = DOM.select('input')
  input$.events('autofocus').map(ev => ev.target.select())
  return input$.events('input').map(ev => ev.target.value).startWith(null)
}

const view = (...args) => Observable.combineLatest(...args, (email, gravatarVtree) =>
  div([
    p([
      a({href: 'https://github.com/mciparelli/cyclejs-gravatar',
         style: {'font-size': '10px'}}, 'https://github.com/mciparelli/cyclejs-gravatar')
    ]),
    h1(),
    form(
      label({
        for: 'email'
      }, [
        'Type an email address: ',
        input('#email', {
          type: 'email',
          value: email,
          autofocus: true
        })
      ])
    ),
    gravatarVtree
  ])
)

function main ({ DOM }) {
  const email$ = intent(DOM)
  const gravatarProps$ = email$.filter(email => email && email.length > 0).map(email => ({ email }))
  const gravatar = Gravatar({ props$: gravatarProps$ })
  return {
    DOM: view(email$, gravatar.DOM.startWith(null))
  }
}

export default (sources) => isolate(main)(sources)
