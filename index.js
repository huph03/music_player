/**SONGS
 * song1: an than - lowg
 * song2: thu do cypher -   lowg
 * song3: simple cypher - lowg
 * song4: anh da on hon live - mck
 * song5: tai vi sao - mck
 * song6: neu luc do - tlinh
 * song7: 7 years - lukas graham
 * song8: glimpse of us - joli
 * song9: summertime sadness - Lana Del Rey
 * song10: the night - aviccy
 */

const $=document.querySelector.bind(document);
const $$=document.querySelectorAll.bind(document);

const player = $('.player')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRanDom: false,
    isRepeat: false,
     songs: [
        {
            name: 'An thần',
            singer: 'Low G',
            path: './song/song1.mp3',
            image: './img/song1.jpg'
        },
        {
            name: 'Thủ đô Cypher',
            singer: 'Low G',
            path: './song/song2.mp3',
            image: './img/song2.jpg'
        },
        {
            name: 'Simple Cypher',
            singer: 'Low G',
            path: './song/song3.mp3',
            image: './img/song3.jpg'
        },
        {
            name: 'Anh đã ổn hơn live',
            singer: 'MCK',
            path: './song/song4.mp3',
            image: './img/song4.jpg'
        },
        {
            name: 'Tại vì sao live',
            singer: 'MCK',
            path: './song/song5.mp3',
            image: './img/song5.jpg'
        },
        {
            name: 'Nếu lúc đó',
            singer: 'TLinh',
            path: './song/song6.mp3',
            image: './img/song6.jpg'
        },
        {
            name: '7 years',
            singer: 'Lukas Graham',
            path: './song/song7.mp3',
            image: './img/song7.jpg'
        },
        {
            name: 'Glimpse of Us',
            singer: 'Joli',
            path: './song/song8.mp3',
            image: './img/song8.jpg'
        },
        {
            name: 'Summertime Sadness',
            singer: 'Lana Del Rey',
            path: './song/song9.mp3',
            image: './img/song9.jpg'
        },
        {
            name: 'The night',
            singer: 'Aviccy',
            path: './song/song10.mp3',
            image: './img/song10.jpg'
        }
    ],

    render: function(){
        const htmls = this.songs.map(function(song,index){
            return `
            <div class="song ${index == app.currentIndex ? 'active': ''} " data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
        
            `
        })
        playList.innerHTML = htmls.join('\n')
    },  

    defiendProperties: function (){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function(){
        //xoay đĩa than
        const cdThumAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration:10000,
            iterations: Infinity
        })
        cdThumAnimate.pause()

        //XỬ LÝ HÀNH VI LƯỚT THANH SCROLL
        const cdWidth = cd.offsetWidth
        document.onscroll = function(){
            const scrolTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrolTop
            cd.style.width = newCdWidth>0 ? newCdWidth + 'px': 0
            cd.style.opacity = newCdWidth/cdWidth
        }

        //XỬ LÝ HÀNH VI CLICK PLAY
        playBtn.onclick = function(){
            if(app.isPlaying){
                audio.pause() 
            }
            else {
                
                audio.play()
                
            }
        }
            //khi song được play
        audio.onplay = function(){
            app.isPlaying = true
            player.classList.add('playing')
            cdThumAnimate.play()
        }
        //khi song pause
        audio.onpause = function(){
            app.isPlaying = false
            player.classList.remove('playing')
            cdThumAnimate.pause()
        }
        //bắt tiến độ của bài hát
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressWidth = (audio.currentTime / audio.duration) * 100
                progress.value = progressWidth
            }
        }

        //xử lý khi tua
        progress.onchange = function(e){
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        
        }
        //khi next bài hát
        nextBtn.onclick = function(){
            
            if(app.isRanDom){
                app.playRanDomSong()
            }
            else{
               console.log("next")
                app.nextSong()
                audio.play() 
            }
            app.render()
            app.scrollToActiveSong()
        }

        // //khi prev bài hát
        prevBtn.onclick = function(){
            
            if(app.isRanDom){
                app.playRanDomSong()
            }
            else{
                console.log("prev")
                app.prevSong()
                audio.play()
            }
            app.render()
            app.scrollToActiveSong()
        }
        
        //xử lý hành vi ramdom
        randomBtn.onclick = function(){
            app.isRanDom = !app.isRanDom
            randomBtn.classList.toggle('active',this.isRamdom)
        }

        //xử lý hành vi repeat(phát lại)
        repeatBtn.onclick = function(e){
            app.isRepeat= !app.isRepeat
            this.classList.toggle('active',this.isRepeat)
        }

        //xử lý hành vi khi xong ended
        audio.onended = function(){
            if(app.isRepeat)
            {
                audio.play()
            }
            else
                nextBtn.click()
        }

        //lắng nghe hành vi click vào playlist
        playList.onclick = function(e){
            const songNode =e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option'))
            {
                if (e.target.closest('.song:not(.active)')){
                    app.currentIndex=songNode.dataset.index
                    app.loadCurrentSong()
                    audio.play()
                    app.render()
                }
                if(e.target.closest('.option')){

                }
            }
        }
    },

    scrollToActiveSong: function(){
        setTimeout(() =>{
            const tmp = $('.song.active')
            tmp.scrollIntoView({
                behavior:'smooth',
                block:'end'
            })
        },300)
    },

    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        console.log(this.currentIndex, this.songs.length)
        this.loadCurrentSong()
    },

    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length -1
        }
        console.log(this.currentIndex)
        this.loadCurrentSong()
    },
    playRanDomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex==this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function(){
        this.defiendProperties()
        
        this.handleEvents()

        this.loadCurrentSong()

        this.render()
    }
};
app.start()

