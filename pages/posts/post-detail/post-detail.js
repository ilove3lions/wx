var postsData = require('../../../data/posts-data.js')
var app = getApp();
Page({
    data: {
        isPlayingMusic: false
    },
    onLoad: function (option) {
        var postId = option.id;
        this.data.currentPostId = postId;
        var postData = postsData.postList[postId];
        // this.data.postData = postData;          无效？
        this.setData({
            postData: postData
        });
        // wx.setStorageSync('key', "风暴英雄")

        // var postsCollected={
        //     1:"true",
        //     2:"false"
        // }
        var postsCollected = wx.getStorageSync('posts_Collected')
        if (postsCollected) {
            var postCollected = postsCollected[postId]
            this.setData({
                collected: postCollected
            })
        }
        else {
            var postsCollected = {}
            postsCollected[postId] = false;
            wx.setStorageSync('posts_Collected', postsCollected);
        }
        if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
            this.setData({
                isPlayingMusic: true
            })
        }
        this.setMusicMonitor();


    },

    setMusicMonitor: function () {
        var that = this;
        wx.onBackgroundAudioPlay(function () {
            that.setData({
                isPlayingMusic: true
            })
            app.globalData.g_isPlayingMusic = true;
            app.globalData.g_currentMusicPostId = that.data.currentPostId;
        });
        wx.onBackgroundAudioPause(function () {
            that.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentMusicPostId = null;
        });
        wx.onBackgroundAudioStop(function () {
            that.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentMusicPostId = null;
        });
    },

    onCollectionTap: function (event) {
        this.getPostsCollectedSyc();
        // this.getPostsCollectedAsy();     无效？
    },
    getPostsCollectedAsy: function () {
        var that = this;
        wx.getStorage({
            key: "posts_collected",
            success: function (res) {
                var postsCollected = res.data;
                var postCollected = postsCollected[that.data.currentPostId];
                postCollected = !postCollected;
                postsCollected[that.data.currentPostId] = postCollected;
                that.showToast(postsCollected, postCollected);
            }
        })
    },

    getPostsCollectedSyc: function () {
        var postsCollected = wx.getStorageSync('posts_Collected');
        var postCollected = postsCollected[this.data.currentPostId];
        postCollected = !postCollected;
        postsCollected[this.data.currentPostId] = postCollected;
        this.showToast(postsCollected, postCollected);
    },


    showToast: function (postsCollected, postCollected) {
        wx.setStorageSync('posts_Collected', postsCollected);
        this.setData({
            collected: postCollected
        })

        wx.showToast({
            title: postCollected ? "已收藏" : "取消收藏",
            duration: 1000,
            icon: "success"
        })
    },


    onShareAppMessage: function (event) {
        return {
            title: '花瓣电影·音乐故事',
            desc: '收获辞霜渚，分明在夕岑。',
            path: '/pages/posts/post-detail/post-detail?id=0'
        }
    },


    onShareTap: function (event) {
        var itemList = [
            "分享给微信好友",
            "分享到群聊",
        ];
        wx.showActionSheet({
            itemList: itemList,
            itemColor: "black",
            success: function (res) {
                wx.showModal({
                    title: "用户" + itemList[res.tapIndex],
                    content: "请点击页面右上角分享按钮！" + res.cancel + "此处暂无分享功能"
                })
            }
        })
    },
    onMusicTap: function (event) {
        var currentPostId = this.data.currentPostId;
        var postData = postsData.postList[currentPostId];
        var isPlayingMusic = this.data.isPlayingMusic;
        if (isPlayingMusic) {
            wx.pauseBackgroundAudio();
            this.setData({
                isPlayingMusic: false
            })
        }
        else {
            wx.playBackgroundAudio({
                dataUrl: postData.music.url,
                title: postData.music.title,
                coverImgUrl: postData.music.coverImg,
            });
            this.setData({
                isPlayingMusic: true
            })
        }

    },
})