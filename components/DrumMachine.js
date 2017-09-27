import '../lib/hydrate'
import React from 'react'
import listen from 'simple-listen'

import Box from '../components/box'
import theme from '../lib/theme'

import { css } from 'react-emotion'

const audioCtx = new window.AudioContext()

// sounds originated from http://808.html909.com
const sounds = [
  'hand_clap.wav',
  'snare_drum.wav',
  'mid_tom.wav',
  'low_tom.wav',
  'cowbell.wav',
  'mid_conga.wav',
  'low_conga.wav',
  'bass_drum.wav'
]

const BPM = 90
const COLUMNS = 16
const INTERVAL = 1 / (4 * BPM / (60 * 1000))

export default class DrumMachine extends React.Component {
  static displayName = 'Index Page'

  constructor (props) {
    super(props)
    this.state = { loading: true, grid: new Array(8 * 16) }
    this.buffers = []
    this.lastCol = COLUMNS - 1
    this.currentCol = 0
    this.lastTime = new Date().getTime()
  }

  async componentWillMount () {
    this.buffers = await Promise.all(
      sounds.map(sound =>
        window
          .fetch(`/static/sounds/${sound}`)
          .then(res => res.arrayBuffer())
          .then(buffer => audioCtx.decodeAudioData(buffer))
      )
    )

    this.setState(
      { loaded: true },
      () => (this.currentFrame = window.requestAnimationFrame(this.loop))
    )
  }

  componentDidMount () {
  }

  componentWillUnmount () {
    window.cancelAnimationFrame(this.currentFrame)
  }

  loop = () => {
    const now = new Date().getTime()

    if (now - this.lastTime >= INTERVAL) {
      this.state.grid.forEach((isActive, i) => {
        const col = i % 16
        if (isActive && this.currentCol === col) {
          const row = i < 16 ? 0 : Math.floor(i / 16)
          try {
            const source = audioCtx.createBufferSource()
            source.buffer = this.buffers[row]
            source.connect(audioCtx.destination)
            source.start()
          } catch (e) {
            console.error(e.message)
          }
        }
      })

      this.lastCol = this.currentCol
      this.currentCol = (this.currentCol + 1) % COLUMNS
      this.lastTime = now
      this.setState({ currentCol: this.currentCol })
    }

    this.currentFrame = window.requestAnimationFrame(this.loop)
  }

  render () {
    return (
      <Box
        className={css`
          display: grid;
          grid-template-rows: repeat(8, 1fr);
          grid-template-columns: repeat(16, 1fr);
          width: 100vw;
          height: 100vh;
          background-color: ${theme.colors.grape[8]};
        `}
      >
        {Array.from({ length: 8 * 16 }).map((blank, i) => {
          const col = i % 16

          return (
            <Box
              key={i}
              display='flex'
              direction='column'
              color={theme.colors.white}
              css={{
                height: 'calc(100vh / 8)',
                border: `1px solid ${theme.colors.grape[3]}`,
                transition: 'all 400ms ease',
                borderRadius:
                  this.state.currentCol === col && this.state.grid[i] === true
                    ? '8px'
                    : 0,
                transformOrigin: 'center center',
                transform:
                  this.state.currentCol === col && this.state.grid[i] === true
                    ? 'scale(0.875)'
                    : 'none',
                backgroundColor:
                  this.state.currentCol === col
                    ? theme.colors.grape[5]
                    : this.state.grid[i] === true
                      ? theme.colors.grape[4]
                      : theme.colors.grape[8]
              }}
              onClick={() => {
                const nextGrid = this.state.grid.slice()
                nextGrid[i] = !this.state.grid[i]
                this.setState({
                  grid: nextGrid
                })
              }}
            />
          )
        })}
      </Box>
    )
  }
}
