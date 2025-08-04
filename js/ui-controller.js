import { sceneData, sceneObjects, objectImages } from './data.js';

export class UIController {
    constructor() {
        this.selectedScene = null;
        this.selectedObjects = [];
        this.isInitialized = false;
        
        // DOM 元素
        this.elements = {
            sceneCards: null,
            objectsGrid: null,
            generateBtn: null
        };
    }

    init() {
        if (this.isInitialized) return;
        
        this.elements.sceneCards = document.querySelectorAll('.scene-card');
        this.elements.objectsGrid = document.getElementById('objectsGrid');
        this.elements.generateBtn = document.getElementById('generateBtn');
        
        if (!this.elements.objectsGrid || !this.elements.generateBtn) {
            console.error('UI元素未找到');
            return;
        }
        
        this.setupEventListeners();
        this.isInitialized = true;
        console.log('UI控制器初始化完成');
    }

    setupEventListeners() {
        // 场景选择事件
        this.elements.sceneCards.forEach(card => {
            card.addEventListener('click', () => {
                this.selectScene(card.dataset.scene);
            });
        });

        // 生成按钮事件
        this.elements.generateBtn.addEventListener('click', () => {
            this.onGenerateScene();
        });
    }

    selectScene(sceneId) {
        // 移除其他选中状态
        this.elements.sceneCards.forEach(c => c.classList.remove('selected'));
        
        // 添加选中状态
        const selectedCard = document.querySelector(`[data-scene="${sceneId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        this.selectedScene = sceneId;
        this.selectedObjects = []; // 清空物体选择
        
        // 更新物体选择选项
        this.updateObjectsChoices();
        
        // 更新生成按钮状态
        this.updateGenerateButton();
        
        console.log('场景已选择:', sceneId);
    }

    updateObjectsChoices() {
        this.elements.objectsGrid.innerHTML = '';
        
        if (!this.selectedScene) return;
        
        const objects = sceneObjects[this.selectedScene] || [];
        objects.forEach(obj => {
            const card = this.createObjectCard(obj);
            this.elements.objectsGrid.appendChild(card);
        });
    }

    createObjectCard(obj) {
        const card = document.createElement('div');
        card.className = 'object-card';
        card.dataset.object = obj;
        card.innerHTML = `
            <img src="${objectImages[obj]}" alt="${obj}">
            <h4>${obj.replace('_', ' ').toUpperCase()}</h4>
        `;
        
        card.addEventListener('click', () => {
            this.toggleObjectSelection(obj, card);
        });
        
        return card;
    }

    toggleObjectSelection(obj, card) {
        card.classList.toggle('selected');
        
        if (card.classList.contains('selected')) {
            this.selectedObjects.push(obj);
        } else {
            this.selectedObjects = this.selectedObjects.filter(o => o !== obj);
        }
        
        this.updateGenerateButton();
        console.log('物体选择更新:', this.selectedObjects);
    }

    updateGenerateButton() {
        const canGenerate = this.selectedScene && this.selectedObjects.length > 0;
        this.elements.generateBtn.disabled = !canGenerate;
    }

    onGenerateScene() {
        if (!this.selectedScene || this.selectedObjects.length === 0) {
            console.warn('请先选择场景和物体');
            return;
        }
        
        const sceneInfo = {
            scene: this.selectedScene,
            objects: [...this.selectedObjects],
            objectKey: this.selectedObjects.sort().join(',')
        };
        
        console.log('生成场景:', sceneInfo);
        
        // 触发自定义事件
        const event = new CustomEvent('generateScene', { 
            detail: sceneInfo 
        });
        document.dispatchEvent(event);
    }

    getSelectedScene() {
        return this.selectedScene;
    }

    getSelectedObjects() {
        return [...this.selectedObjects];
    }

    getObjectKey() {
        return this.selectedObjects.sort().join(',');
    }

    reset() {
        this.selectedScene = null;
        this.selectedObjects = [];
        
        // 清除UI状态
        this.elements.sceneCards.forEach(c => c.classList.remove('selected'));
        this.elements.objectsGrid.innerHTML = '';
        this.updateGenerateButton();
    }

    showLoading() {
        this.elements.generateBtn.disabled = true;
        this.elements.generateBtn.textContent = '🔄 生成中...';
    }

    hideLoading() {
        this.elements.generateBtn.disabled = false;
        this.elements.generateBtn.textContent = '生成3D场景';
    }
} 