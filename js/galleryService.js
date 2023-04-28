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
        createImg(0, 'img/1.jpg', ['Angry', 'Human', 'Famous']),
        createImg(1, 'img/2.jpg', ['Animal', 'Happy']),
        createImg(2, 'img/3.jpg', ['Animal', 'Human', 'Happy']),
        createImg(3, 'img/4.jpg', ['Animal', 'Happy']),
        createImg(4, 'img/5.jpg', ['Angry', 'Human']),
        createImg(5, 'img/6.jpg', ['Human']),
        createImg(6, 'img/7.jpg', ['Human', 'Happy']),
        createImg(7, 'img/8.jpg', ['Human', 'Famous', 'Actor']),
        createImg(8, 'img/9.jpg', ['Human', 'Happy']),
        createImg(9, 'img/10.jpg', ['Human', 'Happy', 'Famous']),
        createImg(10, 'img/11.jpg', ['Human', 'Angry']),
        createImg(11, 'img/12.jpg', ['Human', 'Actor', 'Famous', 'Happy']),
        createImg(12, 'img/13.jpg', ['Human', 'Actor', 'Famous', 'Happy']),
        createImg(13, 'img/14.jpg', ['Human', 'Actor', 'Famous', 'Angry']),
        createImg(14, 'img/15.jpg', ['Human', 'Actor', 'Famous', 'Angry']),
        createImg(15, 'img/16.jpg', ['Human', 'Actor', 'Famous', 'Happy']),
        createImg(16, 'img/17.jpg', ['Human', 'Actor', 'Famous', 'Angry'])
    ]
}

function getImgs() {
    if (gFilterBy === 'All') return gImgs
    var filteredImgs = gImgs.filter(img => img.keywords.includes(gFilterBy))
    return filteredImgs
}

function setImg(id) {
    gMeme.selectedImgId = id
}

function setGalleryFilter(filterVal) {
    gFilterBy = filterVal
}

function addUploadedImg(src) {
    const id = makeId()
    gImgs.push({ id, url: src, keywords: ['upload'] })
    gMeme.selectedImgId = id
}