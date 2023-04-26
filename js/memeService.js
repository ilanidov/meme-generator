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
    lines: [
        {
            txt: 'I soml',
            size: 30,
            align: 'center',
            color: 'red',
            font: 'arial',
            stroke: 'black'
        }
    ]
}


function drawImg() {
    const elImg = new Image()

    // const imgIdx = gImgs.find(img => img.id === gMeme.selectedImgId)

    // console.log(imgIdx)
    elImg.src = gImgs[gMeme.selectedImgId].url
    elImg.onload = () => {
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
    }
}


function drawText() {
    const meme = getMeme()
    const memeLines = meme.lines
    memeLines.map((currLine) => {
        gCtx.font = `${currLine.size}px ${currLine.font}`
        gCtx.lineWidth = 2
        gCtx.strokeStyle = currLine.stroke
        gCtx.fillStyle = currLine.color
        gCtx.textAlign = currLine.align
        gCtx.textBaseline = 'middle'

        gCtx.fillText(currLine.txt, gElCanvas.width / 2, gElCanvas.height / 2)         //to adapt for future lines
        gCtx.strokeText(currLine.txt, gElCanvas.width / 2, gElCanvas.height / 2)
    })
}




function getMeme() {
    return gMeme
}

function setLineText(txt) {
    gMeme.lines[0].txt = txt
}


function displayGalery(elGalleryPage, elEditorPage) {
    elEditorPage.style.display = 'none'
    // elGalleryPage.style.display='block'
    elGalleryPage.style.display = 'block'
}
function displayEditor(elGalleryPage, elEditorPage) {
    elGalleryPage.style.display = 'none'
    // elEditorPage.style.display='block'
    elEditorPage.style.display = 'flex'
}


function setColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color
}


function textSizeGrow() {
    gMeme.lines[gMeme.selectedLineIdx].size += 5
}