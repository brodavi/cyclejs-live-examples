import isolate from '@cycle/isolate'
import md5 from 'md5'
import { stringify } from 'querystring'

import { img, p } from '@cycle/dom'

const getSource = ({ https, size, rating, default: d, md5Hash, email }) => {
  if (!md5Hash && !email) {
    throw new Error(`Gravatar image can not be fetched.
      Either the "email" or "md5" prop must be specified.`)
  }
  const baseURL = https ? 'https://secure.gravatar.com/avatar/'
    : 'http://www.gravatar.com/avatar/'
  const hash = md5Hash ? md5Hash : md5(email)
  const query = stringify({
    s: size,
    r: rating,
    d
  })
  return `${baseURL}${hash}?${query}`
}

const model = props$ => props$.map(props => ({
  src: getSource(props),
  style: props.style,
  className: props.className
}))

const view = model$ => model$.map(attrs => attrs ? img(attrs) : p('nothing'))

const main = ({ props$ }) => ({
  DOM: view(model(props$))
})

export default sources => isolate(main)(sources)
