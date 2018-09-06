Vue.component('search', {
  template: `
  <div id="search">
    <div class="row">
        <div class="column column-75">
            <input type="text" id="url" placeholder="Youtube URL or Video ID" autocomplete="off" value="https://www.youtube.com/watch?v=7QPlF2UNowM" />
        </div>
        <div class="column column-25">
            <input type="button" value="Watch" class="button-outline" />
        </div>
    </div>
</div>
  `
});

// 
Vue.component('app', {
  template: `
    <div id="main">
        <search />
    </div>
  `
});

var app = new Vue({
  el: '#app',
  template: '<app />',
  data: {
    url: 'Hello Vue!',
    response: '',
    captions: []
  },
  methods: {
    loadVideo: function (){

    },
    downloadSubtitle: function(){

    },
    parseSubtitle: function(){

    },
    loadSubtitle: function(){

    }
  }
});


var s = `
hello 
tereh
`