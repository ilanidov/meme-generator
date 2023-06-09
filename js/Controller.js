'use strict'

////// canvas////

let gElCanvas
let gCtx
let gStartPos
let gStoredMemes = []
let gFilterBy = 'All'



const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

//////////////////////BASIC/////////////.//////////////

function onInit() {
    gElCanvas = document.querySelector('.my-canvas')
    gCtx = gElCanvas.getContext('2d')
    addAllListeners()
    createLine()
    renderMeme()
    renderGallery()
    gStoredMemes = loadStoredMemes()
}

function onChangePage(txt) {
    const elGalleryPage = document.querySelector('.gallery-page')
    const elEditorPage = document.querySelector('.editor-page')
    const elSavedPage = document.querySelector('.saved-page')
    const elAboutPage = document.querySelector('.about-page')
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
        case 'About':
            displayAbout(elAboutPage)
            break
    }
}

function addAllListeners() {
    addMouseListeners()
    addTouchListeners()

    window.addEventListener('resize', () => {
		// resizeCanvas()
		renderMeme()
	})
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

function toggleMenu() {
    document.body.classList.toggle('menu-open')
}

// TODO  touch events need to be fixed
function getEvPos(ev) {
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }

    if (TOUCH_EVS.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]

        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        }

    }
    return pos
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

function onCloseModal(modalName) {

    const elmodal = document.querySelector(`${modalName}`)
    closeModal(elmodal)
}

function onCloseAboutModal(){
    const elModal = document.querySelector('.about-page')
    elModal.style.display = 'none'
}

//////////////////////CANVAS///////////////////////////

function renderMeme() {
    const meme = getMeme()
    const elImg = new Image()

    const currImg = gImgs.find(img => img.id === meme.selectedImgId)
    if (!currImg) return

    const isUploadedImg = currImg.keywords.includes('upload')
    if (isUploadedImg) elImg.src = `${currImg.url}`
    else elImg.src = `img/${(meme.selectedImgId) + 1}.jpg`

    elImg.onload = () => {
        resizeCanvas()
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
    const meme = getMeme()
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

function onFontChange(val) {
    fontChange(val)
    renderMeme()
}

function onAddLine() {
    createLine()
    updatePlaceHolder()
    renderMeme()
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

function onAlignBtn(direction) {
    adjustLineAligntment(direction, gElCanvas.width)
    drawText()
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
    elGaleryContainer.innerHTML = strHtml
}

function onSetImg(id) {
    const elGalleryPage = document.querySelector('.gallery-page')
    const elEditorPage = document.querySelector('.editor-page')
    setImg(id)
    renderMeme()
    displayEditor(elGalleryPage, elEditorPage)
}

function onSetFilterBy(filterVal) {
    setGalleryFilter(filterVal)
    renderGallery()
}

function onFlexMeme() {
    const elGalleryPage = document.querySelector('.gallery-page')
    const elEditorPage = document.querySelector('.editor-page')
    gMeme = createRandomMeme(gElCanvas)
    displayEditor(elGalleryPage, elEditorPage)

    renderMeme()
}

// function onKeyword(elBtn, val) {                     TODO
//     handleKeyWords(elBtn)
// }


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

function onImgInput(ev) {
    const elGalleryPage = document.querySelector('.gallery-page')
    const elEditorPage = document.querySelector('.editor-page')
    var reader = new FileReader()
    reader.onload = (event) => {
        var img = new Image()
        img.src = event.target.result

        addUploadedImg(img.src)
        renderMeme()

        displayEditor(elGalleryPage, elEditorPage)
    }

    reader.readAsDataURL(ev.target.files[0])
}







