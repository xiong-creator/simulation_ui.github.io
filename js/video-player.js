export class VideoPlayer {
    constructor() {
        this.videos = {
            front: null,
            left: null,
            right: null
        };
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;
        
        this.videos.front = document.getElementById('videoFront');
        this.videos.left = document.getElementById('videoLeft');
        this.videos.right = document.getElementById('videoRight');
        
        if (!this.videos.front || !this.videos.left || !this.videos.right) {
            console.error('视频元素未找到');
            return;
        }
        
        this.isInitialized = true;
        console.log('视频播放器初始化完成');
    }

    updateVideos(videos) {
        if (!this.isInitialized) {
            this.init();
        }
        
        if (!videos || videos.length < 3) {
            console.warn('视频数据不完整');
            return;
        }

        try {
            // 更新视频源
            this.videos.front.src = videos[0].path;
            this.videos.left.src = videos[1].path;
            this.videos.right.src = videos[2].path;
            
            // 重新加载视频
            this.videos.front.load();
            this.videos.left.load();
            this.videos.right.load();
            
            // 设置视频自动播放
            this.playAllVideos();
            
            console.log('视频更新成功:', videos.map(v => v.name));
        } catch (error) {
            console.error('更新视频失败:', error);
        }
    }

    playAllVideos() {
        const playPromises = [
            this.videos.front.play(),
            this.videos.left.play(),
            this.videos.right.play()
        ];
        
        Promise.allSettled(playPromises).then(results => {
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    console.log(`视频 ${index} 自动播放失败:`, result.reason);
                }
            });
        });
    }

    pauseAllVideos() {
        this.videos.front.pause();
        this.videos.left.pause();
        this.videos.right.pause();
    }

    resetVideos() {
        this.videos.front.src = '';
        this.videos.left.src = '';
        this.videos.right.src = '';
    }

    getVideoStatus() {
        return {
            front: {
                src: this.videos.front.src,
                paused: this.videos.front.paused,
                currentTime: this.videos.front.currentTime,
                duration: this.videos.front.duration
            },
            left: {
                src: this.videos.left.src,
                paused: this.videos.left.paused,
                currentTime: this.videos.left.currentTime,
                duration: this.videos.left.duration
            },
            right: {
                src: this.videos.right.src,
                paused: this.videos.right.paused,
                currentTime: this.videos.right.currentTime,
                duration: this.videos.right.duration
            }
        };
    }
} 