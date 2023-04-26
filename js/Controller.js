'use strict'



//////////////////////BASIC///////////////////////////
function onInit() {
    gElCanvas = document.querySelector('.my-canvas')
    gCtx = gElCanvas.getContext('2d')
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
    img.src = `./img/${meme.selectedImgId}.jpg`
	img.onload = () => {
		gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
		drawText()
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


