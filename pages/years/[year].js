import Grouping from '../../components/grouping'
import Years from '../../components/years'
import fetch from 'isomorphic-unfetch'
import { map, filter, orderBy, startsWith, split, first, uniq } from 'lodash'

export default ({ year, events, groups }) => (
  <Grouping title={`${year} Events`} events={events} groups={groups}>
    <Years showAll />
  </Grouping>
)

export async function unstable_getStaticPaths() {
  let events = await fetch('https://api.hackclub.com/v1/events')
  events = await events.json()
  let starts = map(filter(events, { group_id: null }), 'start')
  starts = map(starts, start => first(split(start, '-')))
  let years = uniq(starts)
  return map(years, year => ({ params: { year } }))
}

export async function unstable_getStaticProps({ params }) {
  const { year } = params
  let events = await fetch('https://api.hackclub.com/v1/events')
  events = await events.json()
  events = orderBy(
    filter(events, e => startsWith(e.start, year)),
    'start'
  )
  let groups = await fetch('https://api.hackclub.com/v1/events/groups')
  groups = await groups.json()
  return { props: { year, events, groups } }
}
