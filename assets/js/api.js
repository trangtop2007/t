// lấy api từ json s
let API = 'http://localhost:3000/SongMusis'
const $ = document.querySelector.bind(document)
const $$ = document.querySelector.bind(document)

const list_music = $('.list-music')
const demo = $('.list-music-item.active')
const heading = $("header h3");
const CDThumd = $(".music_player-image-item");
const audio = $("audio");
const Play_btn = $('.icon-play')
const Next_btn = $('.next-btn')
const Prev_btn = $('.prev-btn')
const TimeLine = $('.music_player_time-line-item')
const Btn_Random = $('.random-btn')
const Btn_Repeat = $('.repeat-btn')
const volumup = $('.volum-up')
const volumdown = $('.volum-down')


document.addEventListener("DOMContentLoaded",function(e){
      if(window.localStorage.getItem("user")){
            let user= JSON.parse(window.localStorage.getItem("user"))
            $(".fullname").innerText=`Xin chào, ${user.fullname}`
            $(".btn_login").style.display = "none"
            $(".btn_register").style.display = "none"
      }else{
            window.location = "http://127.0.0.1:5500/login.html"
      }
})
function logout(){
      window.localStorage.removeItem("user")
      window.location.reload()
}
let app = {
      currentIndex:0,
      isPlay: false,
      RandomMusic :false,
      RepeatMusic :false,
      SongMusis: [],
      getAPI: function (callback) {
            fetch(API)
              .then(function (response) {
                return response.json();
              })
              .then(function (data) {
                if (data && Array.isArray(data)) {
                  app.SongMusis = data;// Lưu danh sách bài hát
                  callback(data);
                } else {
                  console.error("Dữ liệu từ API không hợp lệ.");
                }
              })
              .catch(function (error) {
                console.error("Lỗi khi tải dữ liệu từ API:", error);
              });
          },
          
          render: function (data) {
            if (!data) {
              return;
            }
          
            if (Array.isArray(data)) {
                  // data là mảng, bạn có thể thực hiện map
                  const _this = this;
                  let html = Array.from(data).map(function (value, index) {
                      return `
                          <div class="list-music-item ${index === _this.currentIndex ? 'active' : ''}" data-index="${index}">
                              <img src="${value.images}" alt="" class="list-music-item-img">
                              <div class="list-music-item-title">
                                  <span class="list-music-item-name">${value.name}</span>
                                  <span class="list-music-item-author">Nghệ sĩ: ${value.singer}</span>
                              </div>
                              <i class="fas fa-ellipsis-vertical list-music-item-icon"></i>
                          </div>
                      `;
                  });
              
                  list_music.innerHTML = html.join('');
              } else {
                  // data không phải là mảng, xử lý theo trường hợp không có dữ liệu
                  console.log("Không có dữ liệu để render.");
              }
          },
      /* The `defineProperties` function is defining a new property called `baihat` on the `app`
      object. This property uses the `Object.defineProperty` method to create a getter function for
      `baihat`. */
      defineProperties:function(){
            Object.defineProperty(this,"baihat",{
                  get:function(){
                        return this.SongMusis[this.currentIndex]
                  }
            })
      },
      LoadMusic:function(){
            heading.textContent = this.baihat.name;
            CDThumd.src = this.baihat.images;
            audio.src = this.baihat.path;
      },
      NextSong:function(){
            let currentListItem = list_music.querySelector(`[data-index="${this.currentIndex}"]`);
             currentListItem.classList.remove('active');
            this.currentIndex++;
            if(this.currentIndex >= this.SongMusis.length){
                  this.currentIndex = 0;
            }
            let newListItem = list_music.querySelector(`[data-index="${this.currentIndex}"]`);
            newListItem.classList.add('active');
            this.LoadMusic();
            this.render()
      },
      PrevSong:function(){
            let currentListItem = list_music.querySelector(`[data-index="${this.currentIndex}"]`);
            currentListItem.classList.remove('active');
            this.currentIndex--;
            if(this.currentIndex < 0){
                  this.currentIndex = this.SongMusis.length - 1;
            }
            let newListItem = list_music.querySelector(`[data-index="${this.currentIndex}"]`);
            newListItem.classList.add('active');
            this.LoadMusic();
            this.render()
      },
      Random:function(){
            // xử lý khi ramdom
            list_music.querySelector(`[data-index="${this.currentIndex}"]`).classList.remove('active');
            let randomIndex
            do{
                  randomIndex = Math.floor(Math.random() * this.SongMusis.length)
            }while(randomIndex === this.currentIndex)
            this.currentIndex = randomIndex
            this.RenderActiveSong();
            list_music.querySelector(`[data-index="${this.currentIndex}"]`).classList.add('active');
            this.LoadMusic()
            this.render()
      },
      // xử lý khi active bài nào trong list thì chạy animetion đến bài đó
      RenderActiveSong:function(){
            setTimeout(() =>{
                  let SongActive = $('.list-music-item.active')
                  SongActive.scrollIntoView({
                  behavior: "smooth",
                  block:'center'
            })
      },1000)
      },
      HandledEvent:function(){
            let _this = this;
            // Xử lý animation khi click với nút play
            let CdThumdAnimete = CDThumd.animate(
                  [{transform:"rotate(360deg)"}],
                  {
                        duration:3000,
                        iterations:Infinity
                  }
            )
            CdThumdAnimete.pause()
            // xử lý khi click vào nút play
            Play_btn.onclick = function(){
                  if(_this.isPlay){
                        audio.pause()
                  }else{
                        audio.play()
                  }
            };
            // khi Song được play sau khi click với nút play
            audio.onplay = function(){
                  _this.isPlay = true;
                  Play_btn.classList.add('fa-pause')
                  Play_btn.classList.remove('fa-circle-play')
                  CdThumdAnimete.play();
            }
            // khi Song được pause sau khi click với nút pause
            audio.onpause = function(){
                  _this.isPlay = false;
                  Play_btn.classList.remove('fa-pause')
                  Play_btn.classList.add('fa-circle-play')
                  CdThumdAnimete.pause();
            }
            // xử lý khi click với nút next
            Next_btn.onclick = () => {
                  if(_this.RandomMusic){
                        _this.Random();
                        _this.RenderActiveSong();
                  }else{
                        _this.NextSong()
                        _this.RenderActiveSong()      
                  }
                  audio.play()
                  _this.render()
            }
            // xử lý khi click với nút prev
            Prev_btn.onclick = () =>{
                  if(_this.RandomMusic){
                        _this.Random();
                        _this.RenderActiveSong();
                  }else{
                        _this.PrevSong()
                        _this.RenderActiveSong()
                  }
                  audio.play();
                  _this.render()
            }
            // xử lý khi nút Random được bật
            Btn_Random.onclick = function(){
                  _this.RandomMusic = !_this.RandomMusic
                  Btn_Random.classList.toggle('active',_this.RandomMusic)
            }
            // xử lý khi click vào nút Repeat
            Btn_Repeat.onclick = function(){
                  _this.RepeatMusic = !_this.RepeatMusic
                  Btn_Repeat.classList.toggle('active',_this.RepeatMusic)
            }
            // xử lý sau khi kết thúc bài hát
            audio.onended = function() {
                  if(_this.RepeatMusic){
                        audio.play()
                  }else{
                        Next_btn.click()
                  }
            }
            // xử lý updatetime vào input
            audio.ontimeupdate = function(){
                  if(audio.duration){
                        let TimePercent = Math.floor(audio.currentTime / audio.duration * 100)
                        TimeLine.value = TimePercent
                  }
            }
            // xử lý khi tua bài nhạc
            TimeLine.oninput = function(e){
                  let Tua = audio.duration / 100 * e.target.value;
                  audio.currentTime = Tua
            }
            // Xử lý tăng giảm âm lượng
            volumup.onclick = function(e){
                  e.preventDefault()
                  if(audio.volume < 1){
                        audio.volume += 0.1
                  }else{
                        audio.volume = 1
                  }
            }
            volumdown.onclick = function(e){
                  e.preventDefault()
                  if(audio.volume > 0){
                        audio.volume -= 0.1
                  }else{
                        audio.volume = 0
                  }
            }
            // xử lý khi click vào list music
            list_music.onclick = function(e){
                  let active = $('.list-music-item.active')
                  let SongActivate = e.target.closest('.list-music-item:not(.active)')
                  if(SongActivate){
                        _this.currentIndex = Number(SongActivate.dataset.index)
                        active.classList.remove('active')
                        SongActivate.classList.add('active')
                         _this.LoadMusic()
                        _this.render()
                        audio.play()
                  }
            }
      },

      start: function() {
            this.defineProperties()
            this.getAPI(function(data){
                  app.render(data)
                  app.LoadMusic()
                  app.HandledEvent()
            });
      },
      
        
}
app.start()