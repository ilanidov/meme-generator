'use strict'
////// canvas////
let gElCanvas
let gCtx

//////////////////////BASIC///////////////////////////
function onInit() {
    gElCanvas = document.querySelector('.my-canvas')
    gCtx = gElCanvas.getContext('2d')
    addAllListeners()
    createLine()
    renderMeme()
    renderGallery()
}

function onChangePage(txt) {
    const elGalleryPage = document.querySelector('.gallery-page')
    const elEditorPage = document.querySelector('.editor-page')
    switch (txt) {
        case 'Galery':
            displayGalery(elGalleryPage, elEditorPage)
            break
        case 'Edit':
            displayEditor(elGalleryPage, elEditorPage)
            break
    }
}


//////////////////////CANVAS///////////////////////////

function renderMeme() {
    const meme = getMeme()
    const elImg = new Image()
    elImg.src = `img/${meme.selectedImgId}.jpg`
    elImg.onload = () => {
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
        drawText()
        setLineFocus()
    }
}


function drawText() {
    console.log('sadas')
    const meme = gMeme
    const memeLines = meme.lines
    memeLines.map((currLine) => {
        gCtx.lineWidth = 2
        gCtx.strokeStyle = currLine.stroke
        gCtx.fillStyle = currLine.color
        gCtx.font = `${currLine.size}px ${currLine.font}`
        gCtx.textAlign = currLine.align
        gCtx.textBaseline = 'middle'

        gCtx.fillText(currLine.txt, currLine.positionX, currLine.positionY)
        gCtx.strokeText(currLine.txt, currLine.positionX, currLine.positionY)
    })
}

function onSetColor(color) {
    setColor(color)
    renderMeme()
}


function onTextSizeChange(val) {
    if (val === '+') textSizeGrow()
    else textSizeShrink()

    renderMeme()
}

function setLineFocus() {
    const line = getCurrLine()
    if (!line || !line.isClicked) return

    line.textWidth = gCtx.measureText(line.txt).width

    gCtx.beginPath()
    gCtx.rect(
        line.positionX - (line.textWidth) / 2 - 10,
        line.positionY - 25,
        line.textWidth + 20,
        line.size + 20
    )
    gCtx.lineWidth = 2
    gCtx.strokeStyle = 'white'
    gCtx.stroke()
    gCtx.closePath()
}

// function setLineTextWidth() {
//     const line = getCurrLine()
//     line.textWidth = gCtx.measureText(line.txt).width
// }

//////////////////////EDITOR///////////////////////////

function onUpdateLine(txt) {
    setLineText(txt)
    renderMeme()
}

function onSwitchLine() {
    switchLine()
    updatePlaceHolder(1)
    renderMeme()
}

function updatePlaceHolder(val) {
    const elPlaceholder = document.querySelector('.main-editor-text')
    let currTextLine = getCurrLine()
    if (val === 1) elPlaceholder.value = currTextLine.txt
    else elPlaceholder.value = ''
}

//////////////////////GALLERY///////////////////////////

function renderGallery() {
    const imgs = getImgs()
    const elGaleryContainer = document.querySelector('.gallery-container')
    let strHtml = ''
    imgs.map(img => {
        strHtml +=
            `<div class="card">
        <img src="${img.url}" class="pic-grid" onclick="onSetImg(${img.id})">
        </div>
        `
    })
    // strHtml=`<img src='img/1.jpg' class="pic-grid">`

    elGaleryContainer.innerHTML = strHtml
}

function onSetImg(id) {
    const elGalleryPage = document.querySelector('.gallery-page')
    const elEditorPage = document.querySelector('.editor-page')
    setImg(id)
    renderMeme()
    displayEditor(elGalleryPage, elEditorPage)
}

function onAddLine() {
    createLine()
    updatePlaceHolder()
    renderMeme()
}

function onKeyword(elBtn, val) {
    handleKeyWords(elBtn)
}


function addAllListeners() {
    addMouseListeners()
    addTouchListeners()
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousedown', onDown)
    // gElCanvas.addEventListener('mousemove', onMove)
    // gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    // gElCanvas.addEventListener('touchstart', onDown)
    // gElCanvas.addEventListener('touchmove', onMove)
    // gElCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
    const currClickPos = getEvPos(ev)
    caseLineClicked(currClickPos)
    // console.log(currClickPos)

    // if (gCanvasPrefs.shape !== 'Line') return
    // gCtx.strokeStyle = gCanvasPrefs.txtColor
    // isDrawing = true
    // gCtx.beginPath()
    // gCtx.moveTo(ev.clientX - gElCanvas.offsetLeft, ev.clientY - gElCanvas.offsetTop)
    // document.body.style.cursor = 'grabbing'
}

function getEvPos(ev) {
    return {
        x: ev.offsetX,
        y: ev.offsetY
    }
}

function caseLineClicked(pos) {
    const lines = getAllLines()
    const meme = getMeme()

    if (!lines.length) return
    const lineIdx = lines.findIndex(line => {
        return pos.x > line.positionX - (gCtx.measureText(line.txt).width) / 2 - 10 &&
            pos.x < line.positionX + (gCtx.measureText(line.txt).width) / 2 + 10 &&
            pos.y > line.positionY - 25 &&
            pos.y < line.positionY + 25
    })

    if (lineIdx < 0) {
        meme.lines[meme.selectedLineIdx].isClicked = false
        updatePlaceHolder()
        renderMeme()
    } else {
        meme.lines[meme.selectedLineIdx].isClicked = true
        meme.selectedLineIdx = lineIdx
        setLineFocus()
        updatePlaceHolder(1)
        renderMeme()
    }

}

function onAlignBtn(direction) {
    // setLineTextWidth()
    adjustLineAligntment(direction, gElCanvas.width)
    drawText()
    renderMeme()
}

function onFontChange(val){
    fontChange(val)
    renderMeme()
}


function onDeleteLine(){
    deleteLine()
    renderMeme()
}

