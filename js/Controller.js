'use strict'


//////////////////////BASIC///////////////////////////
function onInit() {
    gElCanvas = document.querySelector('.my-canvas')
    gCtx = gElCanvas.getContext('2d')
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

function renderMeme(){
    const meme = getMeme()
    const elImg = new Image()
    elImg.src = `img/${meme.selectedImgId}.jpg`
	elImg.onload = () => {
		gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
		drawText()
        setLineFocus()
    }
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

//////////////////////EDITOR///////////////////////////

function onUpdateLine(txt) {
    setLineText(txt)
    renderMeme()
}

function onSwitchLine(){
    switchLine()
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

 function onAddLine(){
    createLine()
    renderMeme()
 }

 function onKeyword(elBtn,val){
    handleKeyWords(elBtn)
 }


