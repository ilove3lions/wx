var postsData = require('../../data/posts-data.js')

Page({
  data: {
  },
  onLoad: function (options) {

    this.setData({
      posts_key: postsData.postList
    });
  },
  onPostTap: function (event) {
    var postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })
  },
  // onSwiperItemTap: function (event) {
  //   var postId = event.currentTarget.dataset.postid;
  //   wx.navigateTo({
  //     url: 'post-detail/post-detail?id=' + postId
  //   })
  // },
  onShareAppMessage: function (event) {
        return {
            title: '花瓣电影·音乐故事',
            desc: '收获辞霜渚，分明在夕岑。',
            path: '/pages/posts/post-detail/post-detail?id=0'
        }
    },
  onSwiperTap:function(event){
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })
  }
})