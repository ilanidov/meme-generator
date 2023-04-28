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
        createImg(0, 'img/1.jpg', ['funny', 'cat']),
        createImg(1, 'img/2.jpg', ['funny', 'cat']),
        createImg(2, 'img/3.jpg', ['funny', 'cat']),
        createImg(3, 'img/4.jpg', ['funny', 'cat']),
        createImg(4, 'img/5.jpg', ['funny', 'cat']),
        createImg(5, 'img/6.jpg', ['funny', 'cat']),
        createImg(6, 'img/7.jpg', ['funny', 'cat']),
        createImg(7, 'img/8.jpg', ['funny', 'cat']),
        createImg(8, 'img/9.jpg', ['funny', 'cat']),
        createImg(9, 'img/10.jpg', ['funny', 'cat']),
        createImg(10, 'img/11.jpg', ['funny', 'cat']),
        createImg(11, 'img/12.jpg', ['funny', 'cat']),
        createImg(12, 'img/13.jpg', ['funny', 'cat']),
        createImg(13, 'img/14.jpg', ['funny', 'cat']),
        createImg(14, 'img/15.jpg', ['funny', 'cat']),
        createImg(15, 'img/16.jpg', ['funny', 'cat']),
        createImg(16, 'img/17.jpg', ['funny', 'cat'])
    ]
}

function getImgs() {
    return gImgs
}

function setImg(id) {
    gMeme.selectedImgId = id
}
