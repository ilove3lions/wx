Page({
    onTap: function (event) {
        wx.switchTab({ 
            url: "../posts/post"
        });
    },
    onShareAppMessage: function (event) {
        return {
            title: '花瓣电影·音乐故事',
            desc: '收获辞霜渚，分明在夕岑。',
            path: '/pages/posts/post-detail/post-detail?id=0'
        }
    },
})