import { Route, Switch } from 'wouter'
import { Home } from './pages/Home'
import { AudioAnalysis } from './pages/AudioAnalysis'
import { Search } from './pages/Search'

export const Routes = () => {
  return (
    <Switch>
      <Route path='/' component={Home} />
      <Route path='/chords/:youtubeId' component={AudioAnalysis} />
      <Route path='/search' component={Search} />
    </Switch>
  )
}
