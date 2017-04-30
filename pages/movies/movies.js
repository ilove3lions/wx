var util = require('../../utils/util.js')
var app = getApp();
Page({
    data:{
        inTheaters:{},
        comingSoon:{},
        top250:{},
        searchResult:{},
        containerShow:true,
        searchPanelShow:false,

    },
    onLoad:function(event){
        var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters"+"?start=0&count=3";
        var comingSoonUrl = app.globalData.doubanBase +"/v2/movie/coming_soon"+"?start=0&count=3";
        var top250Url = app.globalData.doubanBase +"/v2/movie/top250"+"?start=0&count=3";

        this.getMovieListData(inTheatersUrl,"inTheaters","正在热映");
        this.getMovieListData(comingSoonUrl,"comingSoon","即将上映");
        this.getMovieListData(top250Url,"top250","豆瓣Top250");
    },


    onMoreTap:function(event){
        var category = event.currentTarget.dataset.category;
        wx.navigateTo({
            url:"more-movie/more-movie?category="+category
        })
    },
    onMovieTap:function(event){
        var movieId = event.currentTarget.dataset.movieid;
        wx.navigateTo({
            url:"movie-detail/movie-detail?id="+ movieId
        })
    },
    onShareAppMessage: function (event) {
        return {
            title: '花瓣电影·音乐故事',
            desc: '收获辞霜渚，分明在夕岑。',
            path: '/pages/posts/post-detail/post-detail?id=0'
        }
    },

    getMovieListData:function(url,settedKey,categoryTitle){
        var that = this;
        wx.request({
          url: url,
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
              "Content-Type":"json"
          }, // 设置请求的 header
          success: function(res){
            that.processDoubanData(res.data,settedKey,categoryTitle)
          },
          fail: function(error) {
            console.log(error)
          }
        })
    },
    onCancelImgTap:function(event){
        this.setData({
            containerShow:true,
            searchPanelShow:false,
            inputvalue:""
        })
    },

    onBindFocus:function(event){
        this.setData({
            containerShow:false,
            searchPanelShow:true
        })
    },

    onBindChange:function(event){
        var text = event.detail.value;
        var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" +text;
        this.getMovieListData(searchUrl,"searchResult","");
    },

    processDoubanData:function(moviesDouban,settedKey,categoryTitle){
        var movies =[];
        for(var idx in moviesDouban.subjects){
            var subject = moviesDouban.subjects[idx];
            var title = subject.title;
            if(title.length >=8){
                title = title.substring(0,8) + "...";
            }
            var temp = {
                stars:util.convertToStarsArray(subject.rating.stars),
                title:title,
                average:subject.rating.average,
                coverageUrl:subject.images.large,
                movieId:subject.id
            }
            movies.push(temp)
        }
        var readyData={};
        readyData[settedKey] = {
            categoryTitle:categoryTitle,
            movies:movies
            }
        this.setData(readyData);
    }
})