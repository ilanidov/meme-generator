'use strict'
const STORAGE_KEY = 'memeDB'

const shortFunnySentences = [
    "I can count potato",
    "Brain cells come and go",
    "Dyslexics teople poo",
    "My life is a mess",
    "I forgot how to",
    "Slept on keyboard",
    "I talk to myself",
    "Wars come and go",
    "Why so cereal?",
    "Do skunks celebrate?",
    "Sleep is overrated",
    "I'm not arguing",
    "I love deadlines",
    "Burrito: food envelope",
    "I need a nap"
  ]
// let gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }    // cant filter by wordsClick  todo

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

function setColor(color) {
    const line = getSelectedLine()
    line.color = color
}

function textSizeGrow() {
    const line = getSelectedLine()
    line.size += 2
}

function textSizeShrink() {
    const line = getSelectedLine()
    line.size -= 2

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
}


function moveLine(dx, dy) {
    const line = getCurrLine()
    line.positionX += dx
    line.positionY += dy
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

function createRandomMeme(gElCanvas) {
    const randomMeme = {
        selectedImgId: getRandomInt(0, 17),
        selectedLineIdx: 0,
        lines: [
            {
                txt:  shortFunnySentences[getRandomInt(0,14)],
                size: getRandomInt(25,45),
                align: 'center',
                color: getRandomColor(),
                font: 'Impact',
                stroke: getRandomColor(),
                positionX: gElCanvas.width / 2,
                positionY: gElCanvas.height / 4,
                isClicked: true,
                textWidth: 0,
                isDragged: false
            }
        ]
    }
    return randomMeme
}



  

  


function saveMemeToStorage(savedMemes) {
    saveToStorage(STORAGE_KEY, savedMemes)
}






// function resetCanvas() {                           // not allowing to add a line - todo
// 	gMeme.lines = []
// 	gMeme.lines.push(createLine())
// }



