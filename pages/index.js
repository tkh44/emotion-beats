import '../lib/hydrate'
import dynamic from 'next/dynamic'

const DrumMachine = dynamic(import('../components/DrumMachine'), {
  ssr: false // don't want to deal with "window" problems when loading the audio api
})

export default () => <DrumMachine />
