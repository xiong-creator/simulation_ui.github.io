// 数据映射配置
export const videoMap = {
    'scene_02': {
        'bike': [
            { name: "FRONT_LEFT", path: "./videos/001_bike_fl.mp4" },
            { name: "FRONT", path: "./videos/001_bike_f.mp4" },
            { name: "FRONT_RIGHT", path: "./videos/001_bike_fr.mp4" }
        ],
        'car_audi': [
            { name: "FRONT_LEFT", path: "./videos/001_audi_fl.mp4" },
            { name: "FRONT", path: "./videos/001_audi_f.mp4" },
            { name: "FRONT_RIGHT", path: "./videos/001_audi_fr.mp4" }
        ],
        'bike,car_audi': [
            { name: "FRONT_LEFT", path: "./videos/001_audi_bike_fl.mp4" },
            { name: "FRONT", path: "./videos/001_audi_bike_f.mp4" },
            { name: "FRONT_RIGHT", path: "./videos/001_audi_bike_fr.mp4" }
        ]
    },
    'scene_01': {
        'motor': [
            { name: "FRONT_LEFT", path: "./videos/002_motor_fl.mp4" },
            { name: "FRONT", path: "./videos/002_motor_f.mp4" },
            { name: "FRONT_RIGHT", path: "./videos/002_motor_bl.mp4" }
        ],
        'car_benz': [
            { name: "FRONT_LEFT", path: "./videos/002_benz_fl.mp4" },
            { name: "FRONT", path: "./videos/002_benz_f.mp4" },
            { name: "FRONT_RIGHT", path: "./videos/002_benz_bl.mp4" }
        ],
        'motor,car_benz': [
            { name: "FRONT_LEFT", path: "./videos/002_motor_benz_fl.mp4" },
            { name: "FRONT", path: "./videos/002_motor_benz_f.mp4" },
            { name: "FRONT_RIGHT", path: "./videos/002_motor_benz_bl.mp4" }
        ]
    }
};

export const modelMap = {
    'scene_01': {
        'motor': './spz/motor_scene2.spz',
        'car_benz': './spz/benz_scene2.spz',
        'motor,car_benz': './spz/motor_benz_scene2.spz'
    },
    'scene_02': {
        'bike': './spz/bike_scene1.spz',
        'car_audi': './spz/audi_scene1.spz',
        'bike,car_audi': './spz/audi_bike_scene1.spz'
    }
};

export const objectImages = {
    "bike": "./objs/bike.png",
    "car_audi": "./objs/car_audi.png",
    "motor": "./objs/motor.png",
    "car_benz": "./objs/car_benz.png"
};

export const sceneObjects = {
    "scene_01": ["motor", "car_benz"],
    "scene_02": ["bike", "car_audi"]
};

export const sceneData = {
    "scene_01": {
        name: "场景 01",
        description: "城市道路场景1",
        image: "./scenes/scene_002.png"
    },
    "scene_02": {
        name: "场景 02", 
        description: "城市道路场景2",
        image: "./scenes/scene_001.png"
    }
}; 