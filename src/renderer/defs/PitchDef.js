import Snap from 'snapsvg'
import { extend, near } from '../../util'

/**
 * SVG definition for pitch.
 * The `PitchDef` is defined by properties: a s o u
 * accidental step octave underbar
 * @class
 * @param id {string}     [description]
 * @param pitch {Pitch}   [description]
 * @param layout {Layout} [description]
 */
function PitchDef(id, note, defs) {
  const layout = this._layout = defs._layout
  const { accidental, octave } = note.pitch
  // const scale = getScale(accidental, octave, underbar)
  const el = this.el = layout.svg.el.g().attr({
    id,
    stroke: 'black',
    strokeWidth: 1
  })
  let sbbox, pbbox

  this._defs = defs
  addAccidental(this, accidental)
  addStep(this, note.pitch.step)
  addOctave(this, octave, note.duration.underbar+0.5)

  // matrix = Snap.matrix()
  // el.transform(matrix)

  // 此处的_sbbox就是加了step的bounding box，是addStep和addOctave创建和修改的
  sbbox = this._sbbox
  sbbox = getBBoxAfterTransform(this.el, sbbox)

  pbbox = el.getBBox()
  el.toDefs()

  extend(this, {
    width: pbbox.width,
    height: -pbbox.y,
    stepCx: sbbox.cx,
    stepY: sbbox.y,
    stepCy: sbbox.cy,
    stepY2: sbbox.y2,
    stepTop: octave > 0 ? pbbox.y : sbbox.y + layout.options.fontSize * 0.2
  })
}

function addAccidental(that, accidental) {
  if (!accidental) {
    that._accidentalX2 = 0
    return
  }
  const accDef = that._defs.getAccidental(accidental)
  that.el.use(accDef.el).attr('y', -that._layout.options.accidentalShift)
  that._accidentalX2 = accDef.width
}

// step在这里就是音阶的数字
function addStep(that, step) {
  that._sbbox = that.el
    .text(that._accidentalX2, 0, '' + step)
    .attr('font-size', that._layout.options.fontSize)
    .getBBox()
}

function addOctave(that, octave, underbar) {
  if (!octave) return

  const { octaveRadius, octaveOffset, octaveSep } = that._layout.options
  const octaveEl = that.el.g()

  // 加上八度和音的点
  if (octave > 0) {
    for (let i = 0; i < octave; i++) {
      octaveEl.circle(
        that._sbbox.cx,
        that._sbbox.y + octaveOffset - octaveSep * i,
        octaveRadius
      )
    }
  } else {

    for (let i = 0; i > octave; i--) {
      octaveEl.circle(
        that._sbbox.cx,
        that._sbbox.y2 - octaveOffset - octaveSep * i - underbar ? underbar * that._layout.options.underbarSep : 0,
        octaveRadius
      )
    }
  }
  that.el.add(octaveEl)
}

// 将bounding box平移到合适位置
function getBBoxAfterTransform(container, bbox) {
  const rect = container.rect(bbox.x, bbox.y, bbox.width, bbox.height)
  const g = container.g(rect)
  bbox = g.getBBox()
  g.remove()
  return bbox
}

function getScale(hasAccidental, octave, underbar) {
  const absOctave = Math.abs(octave)
  return {
    x: Math.pow(0.97, absOctave + underbar + (hasAccidental ? 2 : 0)),
    y: Math.pow(0.95, absOctave + underbar + (hasAccidental ? 1 : 0))
  }
}

export default PitchDef
