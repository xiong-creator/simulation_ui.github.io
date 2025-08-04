import * as THREE from "three";
import { SplatMesh, PackedSplats } from "@sparkjsdev/spark";

export class ThreeViewer {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.currentSplat = null;
        this.modelCache = new Map();
        
        // 鼠标控制变量
        this.isMouseDown = false;
        this.isRightMouseDown = false;
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.init();
        this.setupEventListeners();
    }

    init() {
        // 创建场景
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        
        // 创建相机
        this.camera = new THREE.PerspectiveCamera(
            60, 
            this.container.clientWidth / this.container.clientHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(0, 3, 0);
        this.camera.lookAt(0, 0, 0);
        
        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            powerPreference: "high-performance",
            precision: "mediump"
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // 清除容器并添加渲染器
        this.container.innerHTML = '';
        this.container.appendChild(this.renderer.domElement);
        
        // 添加光源
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        this.scene.add(directionalLight);
        
        // 添加坐标轴辅助器
        const axesHelper = new THREE.AxesHelper(1);
        this.scene.add(axesHelper);
        
        // 添加坐标轴标签
        this.addAxisLabels();
        
        // 开始渲染循环
        this.animate();
    }

    addAxisLabels() {
        const createAxisLabel = (text, position, color) => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 64;
            canvas.height = 64;
            
            context.clearRect(0, 0, 64, 64);
            context.fillStyle = color;
            context.font = 'bold 14px Arial';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(text, 32, 32);
            
            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.SpriteMaterial({ 
                map: texture,
                transparent: true,
                alphaTest: 0.1
            });
            const sprite = new THREE.Sprite(material);
            sprite.position.copy(position);
            sprite.scale.set(0.5, 0.5, 0.5);
            return sprite;
        };
        
        this.scene.add(createAxisLabel('X', new THREE.Vector3(1.5, 0, 0), '#ff0000'));
        this.scene.add(createAxisLabel('Y', new THREE.Vector3(0, 1.5, 0), '#00ff00'));
        this.scene.add(createAxisLabel('Z', new THREE.Vector3(0, 0, 1.5), '#0000ff'));
    }

    async loadModel(modelPath) {
        try {
            // 检查缓存
            if (this.modelCache.has(modelPath)) {
                console.log('从缓存加载模型:', modelPath);
                if (this.currentSplat) {
                    this.scene.remove(this.currentSplat);
                }
                this.currentSplat = this.modelCache.get(modelPath);
                this.scene.add(this.currentSplat);
                return;
            }

            // 清除之前的模型
            if (this.currentSplat) {
                this.scene.remove(this.currentSplat);
            }
            
            // 显示加载状态
            this.showLoading();
            
            try {
                // 使用 PackedSplats 以获得更好的性能和内存效率
                const packedSplats = new PackedSplats({ 
                    url: modelPath,
                    maxSplats: 100000
                });
                
                // 等待 PackedSplats 加载完成
                await new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => {
                        reject(new Error('PackedSplats加载超时'));
                    }, 30000);
                    
                    const checkLoaded = () => {
                        if (packedSplats.numSplats > 0) {
                            clearTimeout(timeout);
                            resolve();
                        } else {
                            setTimeout(checkLoaded, 100);
                        }
                    };
                    checkLoaded();
                });
                
                console.log(`PackedSplats加载成功: ${packedSplats.numSplats} 个splats`);
                
                this.currentSplat = new SplatMesh({ 
                    packedSplats: packedSplats 
                });
                
            } catch (e) {
                console.log('PackedSplats加载失败，回退到SplatMesh:', e);
                this.currentSplat = new SplatMesh({ url: modelPath });
            }
            
            this.currentSplat.position.set(0, 0, 0);
            this.currentSplat.rotation.z = Math.PI;
            
            this.scene.add(this.currentSplat);
            this.modelCache.set(modelPath, this.currentSplat);
            
            // 重新添加渲染器到DOM
            this.container.innerHTML = '';
            this.container.appendChild(this.renderer.domElement);
            
            // 自动调整相机位置
            setTimeout(() => {
                if (this.currentSplat && this.currentSplat.geometry) {
                    const box = new THREE.Box3().setFromObject(this.currentSplat);
                    const size = box.getSize(new THREE.Vector3());
                    const maxDim = Math.max(size.x, size.y, size.z);
                    const distance = maxDim * 1.5;
                    this.camera.position.set(0, -distance, 0);
                    this.camera.lookAt(0, 0, 0);
                }
            }, 100);
            
        } catch (error) {
            console.error('加载3D模型失败:', error);
            this.showPlaceholder('3D模型加载失败');
        }
    }

    showLoading() {
        this.container.innerHTML = '<div class="loading"><span class="spinner"></span>正在加载3D模型...</div>';
    }

    showPlaceholder(message) {
        this.container.innerHTML = `<div class="placeholder">${message}</div>`;
    }

    setupEventListeners() {
        // 鼠标事件
        this.container.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.container.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.container.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.container.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        this.container.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
        this.container.addEventListener('contextmenu', this.handleContextMenu.bind(this));
        this.container.addEventListener('wheel', this.handleWheel.bind(this));
        
        // 窗口大小调整
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    handleMouseDown(e) {
        if (e.button === 0) { // 左键
            this.isMouseDown = true;
            this.container.style.cursor = 'grabbing';
        } else if (e.button === 2) { // 右键
            e.preventDefault();
            e.stopImmediatePropagation();
            this.isRightMouseDown = true;
            this.container.style.cursor = 'move';
        }
        
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }

    handleMouseMove(e) {
        if ((!this.isMouseDown && !this.isRightMouseDown)) return;
        
        if (this.isRightMouseDown) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
        
        const deltaX = e.clientX - this.mouseX;
        const deltaY = e.clientY - this.mouseY;
        
        if (this.isRightMouseDown) {
            // 右键平移模式
            const panSpeed = 0.01;
            const right = new THREE.Vector3();
            const up = new THREE.Vector3();
            this.camera.getWorldDirection(right);
            right.cross(this.camera.up).normalize();
            up.crossVectors(right, this.camera.getWorldDirection(new THREE.Vector3())).normalize();
            
            this.camera.position.add(right.multiplyScalar(-deltaX * panSpeed));
            this.camera.position.add(up.multiplyScalar(-deltaY * panSpeed));
            this.camera.lookAt(0, 0, 0);
        } else if (this.isMouseDown) {
            // 左键旋转模式
            const spherical = new THREE.Spherical();
            spherical.setFromVector3(this.camera.position);
            spherical.theta -= deltaX * 0.01;
            spherical.phi += deltaY * 0.01;
            spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
            
            this.camera.position.setFromSpherical(spherical);
            this.camera.lookAt(0, 0, 0);
        }
        
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }

    handleMouseUp(e) {
        if (e.button === 0) {
            this.isMouseDown = false;
        } else if (e.button === 2) {
            this.isRightMouseDown = false;
        }
        this.container.style.cursor = 'grab';
    }

    handleMouseLeave() {
        this.isMouseDown = false;
        this.isRightMouseDown = false;
        this.container.style.cursor = 'grab';
    }

    handleMouseEnter() {
        this.container.style.cursor = 'grab';
    }

    handleContextMenu(e) {
        e.preventDefault();
    }

    handleWheel(e) {
        e.preventDefault();
        const zoomSpeed = 0.1;
        const direction = e.deltaY > 0 ? 1 : -1;
        this.camera.position.multiplyScalar(1 + direction * zoomSpeed);
    }

    handleResize() {
        if (this.renderer && this.container) {
            this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        }
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    destroy() {
        // 清理资源
        if (this.renderer) {
            this.renderer.dispose();
        }
        // 移除事件监听器
        window.removeEventListener('resize', this.handleResize.bind(this));
    }
} 