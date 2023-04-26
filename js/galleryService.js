'use strict'

let gImgs = createImgs()




function createImg(id, url, keywords) {
    return {
        id,
        url,
        keywords
    }
}

function createImgs() {
    return [
        createImg(1, 'img/1.jpg', ['funny', 'cat']),
        createImg(2, 'img/2.jpg', ['funny', 'cat']),
        createImg(3, 'img/3.jpg', ['funny', 'cat'])
    ]
}

function getImgs() {
    return gImgs
}


function setImg(id) {
    gMeme.selectedImgId = id
}
