import { matrix } from 'snapsvg'

function renderDuration(note, lo) {
  const { durationDef, pitchDef } = note.def
  const { underbar } = note.duration
  let y = lo.underbarSep * 0.5

  // Whole and half notes
  if (note.duration.type < 4) {
    note.el.use(durationDef.el).attr({
      x: pitchDef.width,
      y: pitchDef.stepCy
    })

  // Quarter or shorter notes
  } else {

    // Add underbars for eigth or shorter notes
    if (underbar) {
      for (let i = 0; i < underbar; i++) {

        // Only render beam for the begin one.
        if (note.beams[i]) {
          if (note.beams[i].value === 'begin') {

              // render the bar from the beginning note to the ending note associated
              // with the beginning note. Y stands for the starting height.
            renderUnderbar(note, note.beams[i].endDurable, y, lo)
          }

        // Unbeamed underbar
        } else {
            //renders single note
          renderUnderbar(note, note, y, lo)
        }
        y += lo.underbarSep
      }
    }

    // Add dots
    if (note.duration.dot) {
      note.el.g().transform(matrix().translate(pitchDef.width, 0))
        .use(durationDef.el)
    }

  }
}

function renderUnderbar(note1, note2, y, lo) {
  note1.el.line(0, y, note2.x - note1.x + note2.width, y)
         .attr('stroke-width', lo.typeStrokeWidth)
}

export default renderDuration
