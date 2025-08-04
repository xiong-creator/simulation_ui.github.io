import { ThreeViewer } from './three-viewer.js';
import { VideoPlayer } from './video-player.js';
import { UIController } from './ui-controller.js';
import { videoMap, modelMap } from './data.js';

export class App {
    constructor() {
        this.threeViewer = null;
        this.videoPlayer = null;
        this.uiController = null;
        this.isInitialized = false;
        
        // 模块配置
        this.moduleConfig = {
            'edit': {
                title: '✏️ 场景编辑',
                description: '编辑和创建3D场景'
            },
            'simulation': {
                title: '🎮 场景仿真',
                description: '进行场景仿真和测试'
            },
            'autonomous-driving': {
                title: '🚗 自动驾驶场景三维编辑',
                description: '选择场景和物体，生成3D Gaussian场景并进行多角度渲染'
            },
            'physics-simulation': {
                title: '🤖 具身场景仿真',
                description: '具身智能体在3D场景中的仿真'
            },
            'behavior-simulation': {
                title: '🚗 自驾场景仿真',
                description: '自动驾驶车辆在3D场景中的仿真'
            }
        };
    }

    async init() {
        if (this.isInitialized) return;
        
        try {
            // 初始化UI控制器
            this.uiController = new UIController();
            this.uiController.init();
            
            // 初始化视频播放器
            this.videoPlayer = new VideoPlayer();
            this.videoPlayer.init();
            
            // 初始化3D查看器
            const modelViewer = document.getElementById('modelViewer');
            if (!modelViewer) {
                throw new Error('3D查看器容器未找到');
            }
            this.threeViewer = new ThreeViewer(modelViewer);
            
            // 设置事件监听器
            this.setupEventListeners();
            
            this.isInitialized = true;
            console.log('应用程序初始化完成');
            
        } catch (error) {
            console.error('应用程序初始化失败:', error);
        }
    }

    setupEventListeners() {
        // 监听生成场景事件
        document.addEventListener('generateScene', async (event) => {
            await this.generateScene(event.detail);
        });

        // 监听模块切换事件
        this.setupModuleNavigation();
    }

    setupModuleNavigation() {
        // 主模块切换（场景编辑、场景仿真）
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const moduleName = item.dataset.module;
                this.switchModule(moduleName);
            });
        });

        // 子模块切换（自动驾驶场景、具身场景、自驾场景）
        const navSubitems = document.querySelectorAll('.nav-subitem');
        navSubitems.forEach(item => {
            item.addEventListener('click', () => {
                const subModuleName = item.dataset.submodule;
                this.switchSubModule(subModuleName);
            });
        });

        // 仿真选项点击事件
        const simulationOptions = document.querySelectorAll('.simulation-option');
        simulationOptions.forEach(option => {
            option.addEventListener('click', () => {
                const subModuleName = option.dataset.submodule;
                this.switchSubModule(subModuleName);
            });
        });
    }

    switchModule(moduleName) {
        // 更新导航状态
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.module === moduleName) {
                item.classList.add('active');
            }
        });

        // 根据模块类型决定显示内容
        if (moduleName === 'edit') {
            // 显示编辑模块的自动驾驶场景
            this.switchSubModule('autonomous-driving');
        } else if (moduleName === 'simulation') {
            // 显示仿真模块的目录页面
            this.showSimulationDirectory();
        }

        console.log('切换到模块:', moduleName);
    }

    showSimulationDirectory() {
        // 更新模块显示
        const moduleContainers = document.querySelectorAll('.module-container');
        moduleContainers.forEach(container => {
            container.classList.remove('active');
        });
        document.getElementById('simulationModule').classList.add('active');

        // 隐藏所有仿真内容，显示目录
        const simulationContents = document.querySelectorAll('.simulation-content');
        simulationContents.forEach(content => {
            content.style.display = 'none';
        });
        document.getElementById('simulation-directory').style.display = 'flex';

        // 更新标题和描述
        const moduleTitle = document.getElementById('moduleTitle');
        const moduleDescription = document.getElementById('moduleDescription');
        if (moduleTitle) moduleTitle.textContent = '🎮 场景仿真';
        if (moduleDescription) moduleDescription.textContent = '选择要进行的仿真类型';

        // 更新子模块导航状态
        const navSubitems = document.querySelectorAll('.nav-subitem');
        navSubitems.forEach(item => {
            item.classList.remove('active');
        });
    }

    switchSubModule(subModuleName) {
        // 更新子模块导航状态
        const navSubitems = document.querySelectorAll('.nav-subitem');
        navSubitems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.submodule === subModuleName) {
                item.classList.add('active');
            }
        });

        // 更新主模块导航状态
        const navItems = document.querySelectorAll('.nav-item');
        if (subModuleName === 'autonomous-driving') {
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.dataset.module === 'edit') {
                    item.classList.add('active');
                }
            });
        } else if (subModuleName === 'physics-simulation' || subModuleName === 'behavior-simulation') {
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.dataset.module === 'simulation') {
                    item.classList.add('active');
                }
            });
        }

        // 更新模块显示
        const moduleContainers = document.querySelectorAll('.module-container');
        moduleContainers.forEach(container => {
            container.classList.remove('active');
        });

        // 根据子模块类型显示对应内容
        if (subModuleName === 'autonomous-driving') {
            document.getElementById('editModule').classList.add('active');
        } else if (subModuleName === 'physics-simulation' || subModuleName === 'behavior-simulation') {
            document.getElementById('simulationModule').classList.add('active');
            
            // 隐藏所有仿真内容
            const simulationContents = document.querySelectorAll('.simulation-content');
            simulationContents.forEach(content => {
                content.style.display = 'none';
            });
            
            // 显示对应的仿真内容
            if (subModuleName === 'physics-simulation') {
                document.getElementById('physics-simulation-content').style.display = 'flex';
            } else if (subModuleName === 'behavior-simulation') {
                document.getElementById('behavior-simulation-content').style.display = 'flex';
            }
        }

        // 更新标题和描述
        const config = this.moduleConfig[subModuleName];
        if (config) {
            const moduleTitle = document.getElementById('moduleTitle');
            const moduleDescription = document.getElementById('moduleDescription');
            if (moduleTitle) moduleTitle.textContent = config.title;
            if (moduleDescription) moduleDescription.textContent = config.description;
        }

        console.log('切换到子模块:', subModuleName);
    }

    backToDirectory() {
        this.showSimulationDirectory();
    }

    async generateScene(sceneInfo) {
        try {
            console.log('开始生成场景:', sceneInfo);
            
            // 显示加载状态
            this.uiController.showLoading();
            
            // 并行加载模型和视频
            const [modelPath, videos] = await Promise.all([
                this.getModelPath(sceneInfo),
                this.getVideos(sceneInfo)
            ]);
            
            // 加载3D模型
            if (modelPath) {
                await this.threeViewer.loadModel(modelPath);
            }
            
            // 更新视频
            if (videos) {
                this.videoPlayer.updateVideos(videos);
            }
            
            console.log('场景生成完成');
            
        } catch (error) {
            console.error('生成场景失败:', error);
            this.showError('生成场景失败，请重试');
        } finally {
            // 隐藏加载状态
            this.uiController.hideLoading();
        }
    }

    getModelPath(sceneInfo) {
        const { scene, objectKey } = sceneInfo;
        const modelPath = modelMap[scene]?.[objectKey];
        
        if (!modelPath) {
            console.warn('未找到对应的模型路径:', sceneInfo);
            return null;
        }
        
        return modelPath;
    }

    getVideos(sceneInfo) {
        const { scene, objectKey } = sceneInfo;
        const videos = videoMap[scene]?.[objectKey];
        
        if (!videos) {
            console.warn('未找到对应的视频:', sceneInfo);
            return null;
        }
        
        return videos;
    }

    showError(message) {
        // 可以在这里实现错误提示UI
        console.error(message);
        alert(message);
    }

    destroy() {
        if (this.threeViewer) {
            this.threeViewer.destroy();
        }
        
        if (this.videoPlayer) {
            this.videoPlayer.resetVideos();
        }
        
        if (this.uiController) {
            this.uiController.reset();
        }
        
        this.isInitialized = false;
        console.log('应用程序已销毁');
    }
}

// 全局应用程序实例
window.app = new App();

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.app.init();
}); 