'use strict'
const STORAGE_KEY = 'memeDB'

let gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }
// let gImgs = [{ id: 1, url: 'img/imgSquere/1.jpg', keywords: ['funny', 'cat'] }]


let gMeme = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    lines: []
}

function getCurrLine() {
    return gMeme.lines[gMeme.selectedLineIdx]
}

function getAllLines() {
    return gMeme.lines
}

function getMeme() {
    return gMeme
}

function setLineText(txt) {
    const line = getSelectedLine()
    line.txt = txt
}


function displayGalery(elGalleryPage, elEditorPage) {
    elEditorPage.style.display = 'none'
    elGalleryPage.style.display = 'block'
}

function displayEditor(elGalleryPage, elEditorPage) {
    elGalleryPage.style.display = 'none'
    elEditorPage.style.display = 'flex'
}

function displaySaved() {

}

function setColor(color) {
    const line = getSelectedLine()
    line.color = color
}

function textSizeGrow() {
    const line = getSelectedLine()
    line.size += 5
}

function textSizeShrink() {
    const line = getSelectedLine()
    line.size -= 5

}

function createLine() {
    let posX
    let posY

    if (!gMeme.lines.length) {
        posX = gElCanvas.width / 2
        posY = gElCanvas.height / 4
    } else if (gMeme.lines.length === 1) {
        posX = gElCanvas.width / 2
        posY = gElCanvas.height / 2 + (gElCanvas.height / 4)
        gMeme.selectedLineIdx++
    } else if (gMeme.lines.length >= 2) {
        posX = gElCanvas.width / 2
        posY = gElCanvas.height / 2
        gMeme.selectedLineIdx++
    }

    const newLine = {
        txt: 'Crack your Nut!',
        size: 30,
        align: 'center',
        color: 'white',
        font: 'Impact',
        stroke: 'black',
        positionX: posX,
        positionY: posY,
        isClicked: true,
        textWidth: 0,
        isDragged: false
    }

    gMeme.lines.push(newLine)
}

function switchLine() {
    if (gMeme.lines.length === 0) return
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1) gMeme.selectedLineIdx = 0
    else gMeme.selectedLineIdx++
    setLineFocus()
}

function adjustLineAligntment(direction, canvasWidth) {
    const line = getSelectedLine()
    console.log(line.textWidth)
    if (direction === 'left') line.positionX = line.textWidth / 2 + 12
    else if (direction === 'right') line.positionX = canvasWidth - (line.textWidth) / 2 - 12
    else line.positionX = canvasWidth / 2
}


function getSelectedLine() {
    return gMeme.lines[gMeme.selectedLineIdx]
}

function fontChange(val) {
    const line = getSelectedLine()
    line.font = val
}

function deleteLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)

    if (gMeme.selectedLineIdx === 0) return
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1) gMeme.selectedLineIdx = 0
    else gMeme.selectedLineIdx--
}

function moveBtn(direction) {
    const line = getSelectedLine()
    if (direction === 'up') line.positionY -= 5
    else line.positionY += 5
}

function setLineDrag(isDragged) {
    const line = getCurrLine()
    line.isDragged = isDragged
    // console.log(line)
}


function moveLine(dx, dy) {
    const line = getCurrLine()
    line.positionX += dx
    line.positionY += dy
    console.log(line)
}


function displaySaved(elModal) {
    elModal.classList.add('reveal-page')
}

function closeModal(elModal) {
    elModal.classList.remove('reveal-page')
}

function loadStoredMemes() {
    let savedMemes = loadFromStorage(STORAGE_KEY)
    if (!savedMemes) savedMemes = []
    return savedMemes
}












function saveMemeToStorage(savedMemes) {
    saveToStorage(STORAGE_KEY, savedMemes)
}