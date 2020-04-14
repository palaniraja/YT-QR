var store = {
    'captions': []
};

var player;

Vue.component('app-search', {
  template: `
        <div id="search">
            <div class="row">
                <div class="column column-80">
                    <input type="text" id="url" placeholder="Youtube URL" autocomplete="off" v-model=url />
                </div>
                <div class="column column-20">
                    <input type="button" value="Watch" class="button-outline" v-on:click="loadYoutube"/>
                </div>
            </div>
        </div>
    
  `,
  data: function (){
    return {
        url: 'https://www.youtube.com/embed/7QPlF2UNowM'
    };
  },
  mounted: function() {
    console.log("vue search initialized");
  },
  methods: {
    loadYoutube: function(event){
        store.inputString = url.value;
        console.log('request to load url: ' );
        console.log(url.value);
        var ytId = parseForYoutubeId(url.value)
        if (ytId){
            console.log("youtubeId parsed: " + ytId);
            store.youtubeId = ytId;
            loadYTvideo(ytId);    
            fetchSRT(store.youtubeId);
        }
        
    }
  }

});


Vue.component('app-video', {
  template: `
        <div id="ytVideo">
                </div>
  `,
  mounted: function() {
    console.log("vue app-video initialized");
  },
  methods: {
    loadYoutube: function(event){

    }
  }

});

// javascript:gotoTS(row.tsSec)
Vue.component('app-caption', {
  template: `
                <div class="scroller">
                <ul>
                    <li  v-for="row in captions" v-on:click="seek($event, row.tsSec)"><a href="#" >{{ row.tsDisplay }}</a>{{ row.text }} </li> 
                </ul>
                </div>
  `,
  data: function(){
    return {
        captions: window.store.captions
    }
  },
  mounted: function() {
    console.log("vue app-caption initialized");
  },
  methods: {
    seek: function(event, arg){
        console.log('seek called');
        // console.log(event);
        console.log(arg);
        window.gotoTS(arg);
    }
  }
});

// 
Vue.component('app', {
  template: `
    <div class="app-container">
        <header class="search">
            <app-search />
        </header>
        <main class="app-main">
            <section class="video">
                <app-video />
            </section>
            <section class="text">
                <div class="title">
                    Use browser's search to quickly seek to topic you are interested in.
                </div>
                <app-caption />
            </section>
        </main>
    </div>
  `,
  mounted: function() {
    console.log("vue app-component initialized");

  }
});

var app = new Vue({
  el: '#app',
  template: '<app />',
  data: {
    url: 'Hello Vue!',
    response: '',
  },
  mounted: function() {
    console.log("vue app initialized");
    autoResizeSRTLayout();
  },
  methods: {
    loadVideo: function (){

    },
    
    downloadSubtitle: function(){
        // fetch, trim and split to array
        //return response array - 
        // load to captions model - index, start ts, text
    },
        
    loadSubtitle: function(){
        // load to scroller
    },

    seekToTimestamp: function(ts){

    }

  }
});



function loadYTvideo(url){
    var yt = document.getElementById('ytVideo');
//     yt.innerText = `
// <iframe height="100%" width="100%" src="https://www.youtube.com/embed/`+url+`?enablejsapi=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe> 
//     `;
    console.log('loadYTvideo :'+url);
    onYouTubeIframeAPIReady(url);
}

function parseForYoutubeId(urlIdString){
    // https://stackoverflow.com/a/6904504/240255
    var youtubeId = '';
    try {
        youtubeId = urlIdString.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i)[1];
    }
    catch (err){
        var ytId = urlIdString.match(/^[a-z0-9]+/i);
        if (ytId && ytId.length){
            youtubeId = ytId;
        }
    }
    return youtubeId;

}


function fetchSRT(youtubeId){
    console.log('fetchSRT called with id: ' + youtubeId);

    store.captions.splice(0, store.captions.length); //clear previous captions if any
    store.captions.push(
        {
            'index': 0,
            'ts': "",
            'text': "loading auto generated transcript ...",
            'tsDisplay': "",
            'tsSec': 0
        }
    );
    // https://www.diycaptions.com/php/get-automatic-captions-as-srt.php?id=ATlila3e9dM
    // var srtUrl = 'https://www.diycaptions.com/php/get-automatic-captions-as-srt.php?id='+youtubeId;
    var srtUrl = 'https://ytqr.glitch.me/'+youtubeId;
    var reqSRT = new Request(srtUrl);

   // {
   //      mode: 'cors',
   //      headers: {
   //          'Access-Control-Allow-Origin':'*'
   //      }
   //  }

    fetch(reqSRT)
    .then(function (response){
        // console.log(response);
        return response.json();
    })
    .then(function(data){
        // console.log(data.text);
        // parseSrt(data.text);
        parseTimedText(data)
    })
    .catch(function (error){
        console.log(error);
    });
}

function toHHMMSS (secs) {
    var sec_num = parseInt(secs, 10)
    var hours = Math.floor(sec_num / 3600)
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60

    return [hours, minutes, seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v, i) => v !== "00" || i > 0)
        .join(":")
}


function parseTimedText(response){
    store.response = response;
    store.captions.splice(0, store.captions.length); //clear previous captions if any
    response.forEach(function (line, index){

        var caption = {
            'index': index,
            'ts': line.start,
            'text': line.text,
            'tsDisplay': toHHMMSS(line.start),
            'tsSec': line.start
        };
        store.captions.push(caption);

    });
}

function gotoTS(ts){
    // console.log(ts);
    console.log('seekTo: ' + ts);
    player.seekTo(ts, true);

}

function autoResizeSRTLayout(){
    var text = document.getElementsByClassName('text')[0];
    var maxHeight = parseInt(window.getComputedStyle(text).height);
    var title = document.getElementsByClassName('title')[0];
    var titleHeight = parseInt(window.getComputedStyle(title).height);
    var scroller = document.getElementsByClassName('scroller')[0];
    scroller.style.height = maxHeight-(titleHeight+10);
    scroller.scrollTop = 0;
}


function domInitVue(){
    autoResizeSRTLayout();
}


// youtube - jsapi - https://developers.google.com/youtube/iframe_api_reference
var player;

function onYouTubeIframeAPIReady(url) {
    if(!url){
        return;
    }
    console.log('onYouTubeIframeAPIReady called '+url);
    // var ytdiv = document.getElementById('ytVideo');
    // ytdiv.innerHTML = '&nbsp;';
    if(player){
        player.loadVideoById(url);
    }
    else {
        player = new YT.Player('ytVideo', {
          height: '100%',
          width: '100%',
          videoId: url,
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });        
    }
    
}

function onPlayerReady(event) {
    console.log('onPlayerReady called');
    // event.target.playVideo();
}

var done = false;

function onPlayerStateChange(event) {
    console.log('onPlayerStateChange called');
    if (event.data == YT.PlayerState.PLAYING && !done) {
      // setTimeout(stopVideo, 2000);
      done = true;
    }
}
function stopVideo() {
    console.log('stopVideo called');
    player.stopVideo();
}


// https://www.youtube.com/watch?v=7QPlF2UNowM
