'use strict'
////// canvas////
let gElCanvas
let gCtx
let gStartPos
let gCurrPage = 'Galery'
let gStoredMemes = []
//////////////////////BASIC///////////////////////////
function onInit() {
    gElCanvas = document.querySelector('.my-canvas')
    gCtx = gElCanvas.getContext('2d')
    addAllListeners()
    createLine()
    renderMeme()
    renderGallery()
    gStoredMemes = loadStoredMemes()
    console.log(gStoredMemes)
}

function onChangePage(txt) {
    const elGalleryPage = document.querySelector('.gallery-page')
    const elEditorPage = document.querySelector('.editor-page')
    const elSavedPage = document.querySelector('.saved-page')
    switch (txt) {
        case 'Galery':
            displayGalery(elGalleryPage, elEditorPage)
            break
        case 'Edit':
            displayEditor(elGalleryPage, elEditorPage)
            break
        case 'Saved':
            displaySaved(elSavedPage)
            renderStoredMemes(loadStoredMemes())
            break
    }
}


//////////////////////CANVAS///////////////////////////

function renderMeme() {
    const meme = getMeme()
    const elImg = new Image()
    elImg.src = `img/${(meme.selectedImgId)+1}.jpg`
    elImg.onload = () => {
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
        drawText()
        setLineFocus()
    }
}

function renderStoredMemes(storedMemes) {
    let strHtml = ''
    storedMemes.map(meme => {
        strHtml += `
        <div class="stored-meme" data-id="${meme.id}">
        <img src="${meme.memeUrl}">
        <button class="delete-meme" onclick="onDeleteStoredMeme('${meme.id}')" > Delete </button>
        <button class="download-meme" onclick="onDownloadStoredMeme('${meme.id}')" > Download </button>
        <button class="edit-meme" onclick="onEditStoredMeme('${meme.id}')" > Edit </button>
        </div>
    `
        document.querySelector('.saved-meme-container').innerHTML = strHtml
    })
}

function drawText() {
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
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
    const currClickPos = getEvPos(ev)
    checkLineIsClicked(currClickPos)

    if (!checkLineIsClicked(currClickPos)) return
    setLineDrag(true)
    gStartPos = currClickPos
    document.body.style.cursor = 'grabbing'
}

function onMove(ev) {
    const { isDragged } = getCurrLine()
    if (!isDragged) return
    console.log('asd')
    const pos = getEvPos(ev)
    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y
    moveLine(dx, dy)
    gStartPos = pos
    renderMeme()
}

function onUp() {
    setLineDrag(false)
    document.body.style.cursor = 'grab'
}









function getEvPos(ev) {
    return {
        x: ev.offsetX,
        y: ev.offsetY
    }
}

function checkLineIsClicked(pos) {
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
        return false
    } else {
        meme.lines[meme.selectedLineIdx].isClicked = true
        meme.selectedLineIdx = lineIdx
        setLineFocus()
        updatePlaceHolder(1)
        renderMeme()
        return true
    }
}

function onAlignBtn(direction) {
    adjustLineAligntment(direction, gElCanvas.width)
    drawText()
    renderMeme()
}

function onFontChange(val) {
    fontChange(val)
    renderMeme()
}

function onDeleteLine() {
    deleteLine()
    renderMeme()
}

function onMoveBtn(direction) {
    moveBtn(direction)
    renderMeme()
}


function onCloseModal(modalName) {
    const elmodal = document.querySelector(`${modalName}`)
    closeModal(elmodal)

}


function onEditStoredMeme(id) {
    const elGalleryPage = document.querySelector('.gallery-page')
    const elEditorPage = document.querySelector('.editor-page')
    const elSavedPage = document.querySelector('.saved-page')

    const memeToLoad = gStoredMemes.find(meme => meme.id === id)
    gMeme = memeToLoad.memeToSave
    renderMeme()
    closeModal(elSavedPage)
    displayEditor(elGalleryPage, elEditorPage)
}



///////////////////////////storage funcs////////////////////////////////


function onSaveMeme() {
    const memeUrl = gElCanvas.toDataURL()
    const id = makeId()
    // const currMeme = getMeme()
    const memeToSave = Object.assign({}, getMeme())

    gStoredMemes.push({ id, memeUrl, memeToSave })
    saveMemeToStorage(gStoredMemes)
}



function onLoadMeme() {
    let savedMeme = loadFromStorage(STORAGE_KEY)
    renderSavedMeme(savedMeme)
}

///////////////////////////social funcs////////////////////////////////

function downloadImg(elLink) {
    const imgContent = gElCanvas.toDataURL('image/jpeg')
    elLink.href = imgContent
}

function onUploadImg() {
    const imgDataUrl = gElCanvas.toDataURL('image/jpeg')
    function onSuccess(uploadedImgUrl) {
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        console.log(encodedUploadedImgUrl)
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}`)
    }
    doUploadImg(imgDataUrl, onSuccess)
}

function doUploadImg(imgDataUrl, onSuccess) {
    const formData = new FormData()
    formData.append('img', imgDataUrl)

    const XHR = new XMLHttpRequest()
    XHR.onreadystatechange = () => {
        if (XHR.readyState !== XMLHttpRequest.DONE) return
        if (XHR.status !== 200) return console.error('Error uploading image')
        const { responseText: url } = XHR
        onSuccess(url)
    }
    XHR.onerror = (req, ev) => {
        console.error('Error connecting to server with request:', req, '\nGot response data:', ev)
    }
    XHR.open('POST', '//ca-upload.com/here/upload.php')
    XHR.send(formData)
}
