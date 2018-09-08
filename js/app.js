var store = {
    'captions': [
        {
            'index': 1,
            'ts': '00:00:00,010 --> 00:00:01,800',
            'text': 'hello my name is Paul Hudson and this',
            'tsDisplay': '00:00:00',
            'tsSec': 1
        },
        {
            'index': 2,
            'ts': '00:00:01,800 --> 00:00:05,490',
            'text': 'video is called iOS 12 in 45 minutes now',
            'tsDisplay': '00:00:01',
            'tsSec': 2
        },
        {
            'index': 3,
            'ts': '00:00:05,490 --> 00:00:06,899',
            'text': 'I know some of you are watching this',
            'tsDisplay': '00:00:05',
            'tsSec': 3
        },
        {
            'index': 4,
            'ts': '00:00:06,899 --> 00:00:08,970',
            'text': 'thinking this guy is almost certainly',
            'tsDisplay': '00:00:06',
            'tsSec': 4
        }
    ]
};

Vue.component('app-search', {
  template: `
        <div id="search">
            <div class="row">
                <div class="column column-75">
                    <input type="text" id="url" placeholder="Youtube URL or Video ID" autocomplete="off" v-model=url />
                </div>
                <div class="column column-25">
                    <input type="button" value="Watch" class="button-outline" v-on:click="loadYoutube"/>
                </div>
            </div>
        </div>
    
  `,
  data: function (){
    return {
        url: 'https://www.youtube.com/embed/7QPlF2UNowM?enablejsapi=1'
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

Vue.component('app-caption', {
  template: `
                <div class="scroller">
                <ul>
                        <li  v-for="row in captions"><a href="#">{{ row.tsDisplay }}</a>{{ row.text }}, </li> 
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
                    <h4>&nbsp;</h4>
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
    yt.innerText = `
<iframe height="100%" width="100%" src="https://www.youtube.com/embed/`+url+`?enablejsapi=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe> 
    `;
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
        parseSrt(data.text);
    })
    .catch(function (error){
        console.log(error);
    });
}

function parseSrt(response){
    store.response = response;
    var srt = store.response.split('\n\n');
    console.log('srt length: ' + srt.length);
    // store.captions = [];
    srt.forEach(function(line){
        var tsLine = line.split('\n');
        // console.log('ts length: '+ tsLine.length);
        var caption = {
            'index': tsLine[0],
            'ts': tsLine[1],
            'text': tsLine[2],
            'tsDisplay': tsLine[1].substr(0,8),
            'tsSec': tsToSeconds(tsLine[1])
        };
        store.captions.push(caption);
    });
}

function tsToSeconds(ts){
    
    var startTime = ts.substr(0,8).split(':'); //01:01:26 from 01:01:26,789 --> 00:00:26,189'
    // h:3600, m:60 , s: 
    var inSeconds = (parseInt(startTime[0]*3600)) +(parseInt(startTime[1]*60)) + parseInt(startTime[2]);
    return inSeconds;
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

// https://www.youtube.com/watch?v=7QPlF2UNowM