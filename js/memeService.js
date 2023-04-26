'use strict'
////// canvas////
let gElCanvas
let gCtx
//////////////////////
let gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }
// let gImgs = [{ id: 1, url: 'img/imgSquere/1.jpg', keywords: ['funny', 'cat'] }]


let gMeme = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    lines: []
}


function drawText() {
    const meme = gMeme
    const memeLines = meme.lines
    memeLines.map((currLine) => {
        gCtx.font = `${currLine.size}px ${currLine.font}`
        gCtx.lineWidth = 2
        gCtx.strokeStyle = currLine.stroke
        gCtx.fillStyle = currLine.color
        gCtx.textAlign = currLine.align
        gCtx.textBaseline = 'middle'

        gCtx.fillText(currLine.txt, currLine.positionX, currLine.positionY)
        gCtx.strokeText(currLine.txt, currLine.positionX, currLine.positionY)
    })
}


function setLineFocus() {
    const line = gMeme.lines[gMeme.selectedLineIdx]
    if (!line) return
    gCtx.beginPath()
    gCtx.rect(
        line.positionX - (gCtx.measureText(line.txt).width) / 2 - 10,
        line.positionY - 25,
        gCtx.measureText(line.txt).width + 20,
        line.size + 20
    )
    gCtx.lineWidth = 2
    gCtx.strokeStyle = 'white'
    gCtx.stroke()
    gCtx.closePath()


}




function getMeme() {
    return gMeme
}

function setLineText(txt) {
    gMeme.lines[0].txt = txt
}


function displayGalery(elGalleryPage, elEditorPage) {
    elEditorPage.style.display = 'none'
    elGalleryPage.style.display = 'block'
}
function displayEditor(elGalleryPage, elEditorPage) {
    elGalleryPage.style.display = 'none'
    elEditorPage.style.display = 'flex'
}


function setColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color
}


function textSizeGrow() {
    gMeme.lines[gMeme.selectedLineIdx].size += 5
}

function textSizeShrink() {
    gMeme.lines[gMeme.selectedLineIdx].size -= 5

}

function createLine() {
    if (gMeme.lines.length > 2) return
    let posX
    let posY

    if (gMeme.lines.length === 0) {
        posX = gElCanvas.width / 2
        posY = gElCanvas.height / 2
    } else if (gMeme.lines.length === 1) {
        posX = gElCanvas.width / 2
        posY = gElCanvas.height / 4
        gMeme.selectedLineIdx++

    } else if (gMeme.lines.length === 2) {
        posX = gElCanvas.width / 2
        posY = gElCanvas.height / 2 + (gElCanvas.height / 4)
        gMeme.selectedLineIdx++

    }

    const newLine = {
        txt: 'your pref',
        size: 30,
        align: 'center',
        color: 'red',
        font: 'arial',
        stroke: 'black',
        positionX: posX,
        positionY: posY
    }

    gMeme.lines.push(newLine)
}

function switchLine() {
    if (gMeme.lines.length === 0) return
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1) gMeme.selectedLineIdx = 0
}