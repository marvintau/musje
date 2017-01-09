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
    strokeWidth: 0.1
  })
  let matrix, sbbox, pbbox

  this._defs = defs
  addAccidental(this, accidental)
  addStep(this, note.pitch.step)
  addOctave(this, octave, note.duration.underbar)

  matrix = getMatrix(this, octave)
  el.transform(matrix)

  // 此处的_sbbox就是加了step的bounding box，是addStep和addOctave创建和修改的
  sbbox = this._sbbox
  sbbox = getBBoxAfterTransform(this.el, sbbox, matrix)

  pbbox = el.getBBox()
  el.toDefs()

  extend(this, {
    matrix,
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

// Transform the pitch to be in a good baseline position and
// scale it to be more square.
function getMatrix(that, octave) {
  const { stepBaselineShift, underbarSep } = that._layout.options
  const pbbox = that.el.getBBox()

  // 关键：如果octave大于等于0，同时下面也没有线，dy就是-stepBaselineShift, 否则
  // 就是0，还要加上underBar * underBarSep
  // const dy = (octave >= 0 && underbar === 0 ? -stepBaselineShift : 0) -
  //                         underbar * underbarSep
  return Snap.matrix()
    // .translate(-pbbox.x, 0)
    // .translate(0, near(pbbox.y2, that._sbbox.y2) ? 0 : -pbbox.y2)
}

// 将bounding box平移到合适位置
function getBBoxAfterTransform(container, bbox, matrix) {
  const rect = container.rect(bbox.x, bbox.y, bbox.width, bbox.height)
  const g = container.g(rect)
  rect.transform(matrix)
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
