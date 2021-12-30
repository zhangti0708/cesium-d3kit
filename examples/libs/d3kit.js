"use strict";
/**
 * @description 重构工具包 剥离功能模块 解耦合以及模块权限 可以自动安装不同模块使用
 * @private
 * @author zhangti
 * @version: 1.0.0
 * @Date: 2019-09-05 10:58:30
 * @LastEditors: zhangti
 */
; if (typeof Cesium !== 'undefined')
    Cesium.D3Kit = (function () {
        // 版本
        var version = '1.5'
        // 作者
        var author = 'zhangti'
        // 地址
        var github = 'https://github.com/zhangti0708/cesium-examples'
        // 示例地址
        var examplesAddr = 'http://zhangticcc.gitee.io/webgis'
        // cesium版本
        var CesiumVersion = Cesium.VERSION || ''
        /**
         * 基础模块
         * @param {*} viewer 
         */
        function Base(viewer) {

            if (viewer) {

                this._installBaiduImageryProvider()

                this._installGooGleImageryProvider()

                this._installAmapImageryProvider()

                this._installTencentImageryProvider()

                this._installTdtImageryProvider()
            }
        }
        Base.prototype = {
            // 天空盒
            setOneSkyBox: function () {
                return new Cesium.SkyBox({
                    sources: {
                        positiveX: 'data/images/SkyBox/00h+00.jpg',
                        negativeX: 'data/images/SkyBox/12h+00.jpg',
                        positiveY: 'data/images/SkyBox/06h+00.jpg',
                        negativeY: 'data/images/SkyBox/18h+00.jpg',
                        positiveZ: 'data/images/SkyBox/06h+90.jpg',
                        negativeZ: 'data/images/SkyBox/06h-90.jpg'
                    }
                })
            },
            // 天空盒2
            setTwoSkyBox: function () {
                return new Cesium.SkyBox({
                    sources: {
                        positiveX: 'data/images/SkyBox/Version2_dark_px.jpg',
                        negativeX: 'data/images/SkyBox/Version2_dark_mx.jpg',
                        positiveY: 'data/images/SkyBox/Version2_dark_py.jpg',
                        negativeY: 'data/images/SkyBox/Version2_dark_my.jpg',
                        positiveZ: 'data/images/SkyBox/Version2_dark_pz.jpg',
                        negativeZ: 'data/images/SkyBox/Version2_dark_mz.jpg'
                    }
                })
            },
            // 天空盒3
            setThreeSkyBox: function () {
                return new Cesium.SkyBox({
                    sources: {
                        positiveX: 'data/images/SkyBox/tycho2t3_80_pxs.jpg',
                        negativeX: 'data/images/SkyBox/tycho2t3_80_mxs.jpg',
                        positiveY: 'data/images/SkyBox/tycho2t3_80_pys.jpg',
                        negativeY: 'data/images/SkyBox/tycho2t3_80_mys.jpg',
                        positiveZ: 'data/images/SkyBox/tycho2t3_80_pzs.jpg',
                        negativeZ: 'data/images/SkyBox/tycho2t3_80_mzs.jpg'
                    }
                })
            },
            //近景天空盒
            setOneGroundSkyBox: function () {
                return new Cesium.GroundSkyBox({
                    sources: {
                        positiveX: 'data/images/SkyBox/rightav9.jpg',
                        negativeX: 'data/images/SkyBox/leftav9.jpg',
                        positiveY: 'data/images/SkyBox/frontav9.jpg',
                        negativeY: 'data/images/SkyBox/backav9.jpg',
                        positiveZ: 'data/images/SkyBox/topav9.jpg',
                        negativeZ: 'data/images/SkyBox/bottomav9.jpg'
                    }
                });
            },
            //近景天空盒 2
            setTwoGroundSkyBox: function () {
                return new Cesium.GroundSkyBox({
                    sources: {
                        positiveX: 'data/images/SkyBox/SunSetRight.png',
                        negativeX: 'data/images/SkyBox/SunSetLeft.png',
                        positiveY: 'data/images/SkyBox/SunSetFront.png',
                        negativeY: 'data/images/SkyBox/SunSetBack.png',
                        positiveZ: 'data/images/SkyBox/SunSetUp.png',
                        negativeZ: 'data/images/SkyBox/SunSetDown.png'
                    }
                });
            },
            //近景天空盒 3
            setThreeGroundSkyBox: function () {
                return new Cesium.GroundSkyBox({
                    sources: {
                        positiveX: 'data/images/SkyBox/Right.jpg',
                        negativeX: 'data/images/SkyBox/Left.jpg',
                        positiveY: 'data/images/SkyBox/Front.jpg',
                        negativeY: 'data/images/SkyBox/Back.jpg',
                        positiveZ: 'data/images/SkyBox/Up.jpg',
                        negativeZ: 'data/images/SkyBox/Down.jpg'
                    }
                });
            },
            //黑夜特效
            setDarkEffect: function (options) {
                options = options || {}
                var fs =
                    'uniform sampler2D colorTexture;\n' +
                    'varying vec2 v_textureCoordinates;\n' +
                    'uniform float scale;\n' +
                    'uniform vec3 offset;\n' +
                    'void main() {\n' +
                    ' // vec4 color = texture2D(colorTexture, v_textureCoordinates);\n' +
                    ' vec4 color = texture2D(colorTexture, v_textureCoordinates);\n' +
                    ' // float gray = 0.2989*color.r+0.5870*color.g+0.1140*color.b;\n' +
                    ' // gl_FragColor = vec4(gray,gray,2.0*(gray+1.0), 1.0);\n' +
                    ' gl_FragColor = vec4(color.r*0.2,color.g * 0.4,color.b*0.6, 1.0);\n' +
                    '}\n';
                return this._viewer.scene.postProcessStages.add(new Cesium.PostProcessStage({
                    name: 'darkEffect',
                    fragmentShader: fs,
                    uniforms: {
                        scale: 1.0,
                        offset: function () {
                            return options.offset || new Cesium.Cartesian3(0.1, 0.2, 0.3);
                        }
                    }
                }));
            },
            // 场景蓝光
            setBlurBloom: function (options) {

                if (this._viewer && options) {

                    var fs = 'uniform float height;\n' +
                        'uniform float width;\n' +
                        'uniform sampler2D colorTexture1;\n' +
                        '\n' +
                        'varying vec2 v_textureCoordinates;\n' +
                        '\n' +
                        'const int SAMPLES = 9;\n' +
                        'void main()\n' +
                        '{\n' +
                        'vec2 st = v_textureCoordinates;\n' +
                        'float wr = float(1.0 / width);\n' +
                        'float hr = float(1.0 / height);\n' +
                        'vec4 result = vec4(0.0);\n' +
                        'int count = 0;\n' +
                        'for(int i = -SAMPLES; i <= SAMPLES; ++i){\n' +
                        'for(int j = -SAMPLES; j <= SAMPLES; ++j){\n' +
                        'vec2 offset = vec2(float(i) * wr, float(j) * hr);\n' +
                        'result += texture2D(colorTexture1, st + offset);\n' +
                        '}\n' +
                        '}\n' +
                        'result = result / float(count);\n' +
                        'gl_FragColor = result;\n' +
                        '}\n';

                    return this._viewer.scene.postProcessStages.add(new Cesium.PostProcessStage({
                        name: 'blur_x_direction',
                        fragmentShader: fs,
                        uniforms: {
                            width: options.width,
                            height: options.height,
                            colorTexture1: "Bright"
                        }
                    }));
                }
            },
            //雨天特效
            setRainEffect: function () {

                if (this._viewer) {
                    var fs = "uniform sampler2D colorTexture;\n\
                varying vec2 v_textureCoordinates;\n\
                \n\
                float hash(float x){\n\
                return fract(sin(x*23.3)*13.13);\n\
                }\n\
                \n\
                void main(){\n\
                    float time = czm_frameNumber / 60.0;\n\
                    vec2 resolution = czm_viewport.zw;\n\
                    vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
                    vec3 c=vec3(.6,.7,.8);\n\
                    float a=-.4;\n\
                    float si=sin(a),co=cos(a);\n\
                    uv*=mat2(co,-si,si,co);\n\
                    uv*=length(uv+vec2(0,4.9))*.3+1.;\n\
                    float v=1.-sin(hash(floor(uv.x*100.))*2.);\n\
                    float b=clamp(abs(sin(20.*time*v+uv.y*(5./(2.+v))))-.95,0.,1.)*20.;\n\
                    c*=v*b;\n\
                    gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(c, 1), 0.2);\n\
                }\n\
                ";
                    return this._viewer.scene.postProcessStages.add(new Cesium.PostProcessStage({
                        name: 'rainEffect',
                        fragmentShader: fs
                    }));
                }

            },
            //雪天特效
            setSnowEffect: function () {

                if (this._viewer) {
                    var fs = "uniform sampler2D colorTexture;\n\
                    varying vec2 v_textureCoordinates;\n\
                    \n\
                    float snow(vec2 uv,float scale){\n\
                        float time = czm_frameNumber / 60.0;\n\
                        float w=smoothstep(1.,0.,-uv.y*(scale/10.));\n\
                        if(w<.1)return 0.;\n\
                        uv+=time/scale;\n\
                        uv.y+=time*2./scale;\n\
                        uv.x+=sin(uv.y+time*.5)/scale;\n\
                        uv*=scale;\n\
                        vec2 s=floor(uv),f=fract(uv),p;\n\
                        float k=3.,d;\n\
                        p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;\n\
                        d=length(p);\n\
                        k=min(d,k);\n\
                        k=smoothstep(0.,k,sin(f.x+f.y)*0.01);\n\
                        return k*w;\n\
                    }\n\
                    \n\
                    void main(){\n\
                        vec2 resolution = czm_viewport.zw;\n\
                        vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
                        vec3 finalColor=vec3(0);\n\
                        float c = 0.0;\n\
                        c+=snow(uv,30.)*.0;\n\
                        c+=snow(uv,20.)*.0;\n\
                        c+=snow(uv,15.)*.0;\n\
                        c+=snow(uv,10.);\n\
                        c+=snow(uv,8.);\n\
                        c+=snow(uv,6.);\n\
                        c+=snow(uv,5.);\n\
                        finalColor=(vec3(c));\n\
                        gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(finalColor,1), 0.3);\n\
                        \n\
                    }\n\
                    ";
                    return this._viewer.scene.postProcessStages.add(new Cesium.PostProcessStage({
                        name: 'snowEffect',
                        fragmentShader: fs
                    }));
                }
            },
            // 雾天
            setFogEffect: function () {
                if (this._viewer) {

                    var fs =
                        "float getDistance(sampler2D depthTexture, vec2 texCoords) \n" +
                        "{ \n" +
                        "    float depth = czm_unpackDepth(texture2D(depthTexture, texCoords)); \n" +
                        "    if (depth == 0.0) { \n" +
                        "        return czm_infinity; \n" +
                        "    } \n" +
                        "    vec4 eyeCoordinate = czm_windowToEyeCoordinates(gl_FragCoord.xy, depth); \n" +
                        "    return -eyeCoordinate.z / eyeCoordinate.w; \n" +
                        "} \n" +
                        "float interpolateByDistance(vec4 nearFarScalar, float distance) \n" +
                        "{ \n" +
                        "    float startDistance = nearFarScalar.x; \n" +
                        "    float startValue = nearFarScalar.y; \n" +
                        "    float endDistance = nearFarScalar.z; \n" +
                        "    float endValue = nearFarScalar.w; \n" +
                        "    float t = clamp((distance - startDistance) / (endDistance - startDistance), 0.0, 1.0); \n" +
                        "    return mix(startValue, endValue, t); \n" +
                        "} \n" +
                        "vec4 alphaBlend(vec4 sourceColor, vec4 destinationColor) \n" +
                        "{ \n" +
                        "    return sourceColor * vec4(sourceColor.aaa, 1.0) + destinationColor * (1.0 - sourceColor.a); \n" +
                        "} \n" +
                        "uniform sampler2D colorTexture; \n" +
                        "uniform sampler2D depthTexture; \n" +
                        "uniform vec4 fogByDistance; \n" +
                        "uniform vec4 fogColor; \n" +
                        "varying vec2 v_textureCoordinates; \n" +
                        "void main(void) \n" +
                        "{ \n" +
                        "    float distance = getDistance(depthTexture, v_textureCoordinates); \n" +
                        "    vec4 sceneColor = texture2D(colorTexture, v_textureCoordinates); \n" +
                        "    float blendAmount = interpolateByDistance(fogByDistance, distance); \n" +
                        "    vec4 finalFogColor = vec4(fogColor.rgb, fogColor.a * blendAmount); \n" +
                        "    gl_FragColor = alphaBlend(finalFogColor, sceneColor); \n" +
                        "} \n";

                    return this._viewer.scene.postProcessStages.add(
                        new Cesium.PostProcessStage({
                            fragmentShader: fs,
                            uniforms: {
                                fogByDistance: new Cesium.Cartesian4(10, 0.0, 200, 1.0),
                                fogColor: Cesium.Color.BLACK,
                            },
                        })
                    );
                }
            },
            /**
             * 默认场景配置
             */
            setDefSceneConfig: function () {
                if (this._viewer) {
                    this._viewer.scene.sun.show = false;
                    this._viewer.scene.moon.show = false;
                    this._viewer.scene.fxaa = true;
                    this._viewer.scene.globe.depthTestAgainstTerrain = true;
                    this._viewer.scene.undergroundMode = false;
                    this._viewer.scene.terrainProvider.isCreateSkirt = false;
                    this._viewer.scene.skyAtmosphere.show = false;
                    this._viewer.scene.globe.showGroundAtmosphere = false
                    this._viewer.scene.globe.enableLighting = true
                    this._viewer.scene.fog.enabled = false
                    this._viewer.cesiumWidget.creditContainer.style.display = "none";
                }
            },
            /**
             * 场景泛光
             */
            setBloomLightScene: function () {

                if (this._viewer) {
                    this._viewer.scene.postProcessStages.bloom.enabled = true
                    this._viewer.scene.postProcessStages.bloom.uniforms.contrast = 119
                    this._viewer.scene.postProcessStages.bloom.uniforms.brightness = -0.4
                    this._viewer.scene.postProcessStages.bloom.uniforms.glowOnly = false
                    this._viewer.scene.postProcessStages.bloom.uniforms.delta = 0.9
                    this._viewer.scene.postProcessStages.bloom.uniforms.sigma = 3.78
                    this._viewer.scene.postProcessStages.bloom.uniforms.stepSize = 5
                    this._viewer.scene.postProcessStages.bloom.uniforms.isSelected = false
                }
            },
            //相机定位
            setView: function (options) {

                if (this._viewer && options && options.position) {

                    if (options.distance) { //距离

                        var pos1 = new Cesium.Cartesian3(0, options.distance, opt.distance);
                        options.position = Cesium.Cartesian3.add(options.position, pos1, new Cesium.Cartesian3());
                    }
                    this._viewer.scene.camera.setView({
                        destination: options.position,
                        orientation: options.orientation || {
                            heading: Cesium.Math.toRadians(90.0),
                            pitch: Cesium.Math.toRadians(90.0),
                            roll: Cesium.Math.toRadians(0.0)
                        },
                    });
                }
            },
            //相机飞行
            flyTo: function (options) {

                if (this._viewer && options && options.position) {
                    if (options.distance) { //距离
                        var pos1 = new Cesium.Cartesian3(0, options.distance, options.distance);
                        options.position = Cesium.Cartesian3.add(options.position, pos1, new Cesium.Cartesian3());
                    }
                    this._viewer.scene.camera.flyTo({
                        destination: options.position,
                        orientation: options.orientation || {
                            heading: Cesium.Math.toRadians(90.0),
                            pitch: Cesium.Math.toRadians(90.0),
                            roll: Cesium.Math.toRadians(0.0)
                        },
                        // pitchAdjustHeight: 500,
                        easingFunction: options.easingFunction || Cesium.EasingFunction.LINEAR_NONE,
                        duration: options.duration || 3,
                        complete: options.callback
                    })
                }
            },
            //坐标转换 笛卡尔转84
            transformCartesianToWGS84: function (cartesian) {
                if (this._viewer && cartesian) {
                    var ellipsoid = Cesium.Ellipsoid.WGS84
                    var cartographic = ellipsoid.cartesianToCartographic(cartesian)
                    return {
                        lng: Cesium.Math.toDegrees(cartographic.longitude),
                        lat: Cesium.Math.toDegrees(cartographic.latitude),
                        alt: cartographic.height
                    }
                }
            },
            //坐标数组转换 笛卡尔转84
            transformWGS84ArrayToCartesianArray: function (WSG84Arr, alt) {
                if (this._viewer && WSG84Arr) {
                    var $this = this
                    return WSG84Arr
                        ? WSG84Arr.map(function (item) { return $this.transformWGS84ToCartesian(item, alt) })
                        : []
                }
            },
            //坐标转换 84转笛卡尔
            transformWGS84ToCartesian: function (position, alt) {
                if (this._viewer) {
                    return position
                        ? Cesium.Cartesian3.fromDegrees(
                            position.lng || position.lon,
                            position.lat,
                            position.alt = alt || position.alt,
                            Cesium.Ellipsoid.WGS84
                        )
                        : Cesium.Cartesian3.ZERO
                }
            },
            //坐标数组转换 84转笛卡尔
            transformCartesianArrayToWGS84Array: function (cartesianArr) {
                if (this._viewer) {
                    var $this = this
                    return cartesianArr
                        ? cartesianArr.map(function (item) { return $this.transformCartesianToWGS84(item) })
                        : []
                }
            },
            /**
             * 相机绕点旋转
             * @param viewer
             *  let options = {
                    lng: 117.1423291616,
                    lat: 39.0645831633,
                    height: 15.8,
                    heading: 0.0,
                    pitch: 0.0,
                    roll: 0.0
                };
                viewer.clock.stopTime = viewer.clock.startTime 
            */
            setCameraEotateHeading(options) {
                if (options) {
                    let viewer = this._viewer
                    let position = Cesium.Cartesian3.fromDegrees(options.lng, options.lat, options.height);
                    // 相机看点的角度，如果大于0那么则是从地底往上看，所以要为负值，这里取-30度
                    let pitch = Cesium.Math.toRadians(-30);
                    // 给定飞行一周所需时间，比如10s, 那么每秒转动度数
                    let angle = 360 / 30;
                    // 给定相机距离点多少距离飞行，这里取值为5000m
                    let distance = 5000;
                    let startTime = Cesium.JulianDate.fromDate(new Date());
                    viewer.clock.startTime = startTime.clone();  // 开始时间
                    viewer.clock.currentTime = startTime.clone(); // 当前时间
                    viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; // 行为方式
                    viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK; // 时钟设置为当前系统时间; 忽略所有其他设置。
                    //相机的当前heading
                    let initialHeading = viewer.camera.heading;
                    let Exection = function TimeExecution() {
                        // 当前已经过去的时间，单位s
                        let delTime = Cesium.JulianDate.secondsDifference(viewer.clock.currentTime, viewer.clock.startTime);
                        let heading = Cesium.Math.toRadians(delTime * angle) + initialHeading;
                        viewer.scene.camera.setView({
                            destination: position, // 点的坐标
                            orientation: {
                                heading: heading,
                                pitch: pitch,

                            }
                        });
                        viewer.scene.camera.moveBackward(distance);

                        if (Cesium.JulianDate.compare(viewer.clock.currentTime, viewer.clock.stopTime) >= 0) {
                            viewer.clock.onTick.removeEventListener(Exection);
                        }
                    };
                    viewer.clock.onTick.addEventListener(Exection);
                }
            },
            /**
             *
             * @param {*} position
             * 84坐标转制图坐标
             */
            transformWGS84ToCartographic: function (position) {
                return position
                    ? Cesium.Cartographic.fromDegrees(
                        position.lng || position.lon,
                        position.lat,
                        position.alt
                    )
                    : Cesium.Cartographic.ZERO
            },
            // 拾取位置点
            getCatesian3FromPX: function (px) {

                if (this._viewer && px) {

                    // var picks = this._viewer.scene.drillPick(px); // 3dtilset
                    // for (var i = 0; i < picks.length; i++) {
                    //     if (picks[i] instanceof Cesium.Cesium3DTileFeature) { //模型上拾取
                    //         isOn3dtiles = true;
                    //     }
                    // }
                    var picks = this._viewer.scene.pick(px)
                    var cartesian = null;
                    var isOn3dtiles = false, isOnTerrain = false;
                    if (picks instanceof Cesium.Cesium3DTileFeature) { //模型上拾取
                        isOn3dtiles = true;
                    }
                    // 3dtilset
                    if (isOn3dtiles) {
                        cartesian = this._viewer.scene.pickPosition(px);
                        if (cartesian) {
                            let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                            if (cartographic.height < 0) cartographic.height = 0;
                            let lon = Cesium.Math.toDegrees(cartographic.longitude)
                                , lat = Cesium.Math.toDegrees(cartographic.latitude)
                                , height = cartographic.height;//模型高度 
                            cartesian = this.transformWGS84ToCartesian({ lng: lon, lat: lat, alt: height })
                        }
                    }
                    // 地形
                    if (!picks && !viewer.terrainProvide instanceof Cesium.EllipsoidTerrainProvider) {
                        var ray = this._viewer.scene.camera.getPickRay(px);
                        if (!ray) return null;
                        cartesian = this._viewer.scene.globe.pick(ray, this._viewer.scene);
                        isOnTerrain = true
                    }
                    // 地球
                    if (!isOn3dtiles && !isOnTerrain) {

                        cartesian = this._viewer.scene.camera.pickEllipsoid(px, this._viewer.scene.globe.ellipsoid);
                    }
                    if (cartesian) {
                        let position = this.transformCartesianToWGS84(cartesian)
                        if (position.alt < 0) {
                            cartesian = this.transformWGS84ToCartesian(position, 0.1)
                        }
                        return cartesian;
                    }
                    return false;
                }

            },
            //获取相机位置
            getCameraPosition: function () {
                if (this._viewer) {

                    var result = this._viewer.scene.camera.pickEllipsoid(new Cesium.Cartesian2(this._viewer.canvas.clientWidth / 2, this._viewer.canvas
                        .clientHeight / 2));
                    if (result) {

                        var curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(result),
                            lon = curPosition.longitude * 180 / Math.PI
                            , lat = curPosition.latitude * 180 / Math.PI;

                        var direction = this._viewer.camera._direction,
                            x = Cesium.Math.toDegrees(direction.x),
                            y = Cesium.Math.toDegrees(direction.y),
                            z = Cesium.Math.toDegrees(direction.z),
                            height = this._viewer.camera.positionCartographic.height,
                            heading = Cesium.Math.toDegrees(this._viewer.camera.heading),
                            pitch = Cesium.Math.toDegrees(this._viewer.camera.pitch),
                            roll = Cesium.Math.toDegrees(this._viewer.camera.roll);

                        var rectangle = this._viewer.camera.computeViewRectangle(),
                            west = rectangle.west / Math.PI * 180,
                            north = rectangle.north / Math.PI * 180,
                            east = rectangle.east / Math.PI * 180,
                            south = rectangle.south / Math.PI * 180,
                            centerx = (west + east) / 2,
                            cnetery = (north + south) / 2;

                        return {
                            lon: lon,
                            lat: lat,
                            height: height,
                            heading: heading,
                            pitch: pitch,
                            roll: roll,
                            position: this._viewer.camera.position,
                            center: { x: centerx, y: cnetery },
                            direction: new Cesium.Cartesian3(x, y, z)
                        };
                    }
                }
            },
            //修改相机状态
            updateCameraState: function (flag) {

                this._viewer.scene._screenSpaceCameraController.enableRotate = flag;
                this._viewer.scene._screenSpaceCameraController.enableTranslate = flag;
                this._viewer.scene._screenSpaceCameraController.enableZoom = flag;
                this._viewer.scene._screenSpaceCameraController.enableTilt = flag;
                this._viewer.scene._screenSpaceCameraController.enableLook = flag;
            },
            //鼠标事件注册
            bindHandelEvent: function (_mouseClickHandler, _mouseMoveHandler, _mouseDbClickHandler) {

                if (this._viewer) {
                    var _handlers = new Cesium.ScreenSpaceEventHandler(this._viewer.canvas)
                    _handlers.setInputAction(function (movement) {
                        _mouseClickHandler && _mouseClickHandler(movement, _handlers)
                    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

                    _handlers.setInputAction(function (movement) {
                        _mouseMoveHandler && _mouseMoveHandler(movement, _handlers)
                    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

                    _handlers.setInputAction(function (movement) {
                        _mouseDbClickHandler && _mouseDbClickHandler(movement, _handlers)
                    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
                }
            },
            //获取鼠标信息
            getHandelPosition: function (callback) {

                if (this._viewer) {
                    var _handler = new Cesium.ScreenSpaceEventHandler(this._viewer.scene.canvas), $this = this;
                    _handler.setInputAction(function (movement) {

                        var cartesian = $this._viewer.scene.camera.pickEllipsoid(movement.endPosition, $this._viewer.scene.globe.ellipsoid);

                        if (typeof callback === 'function') {

                            callback($this.transformCartesianToWGS84(cartesian), _handler);
                        }

                    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                }
            },
            //保存当前场景png
            saveSceneImages: function () {

                if (this._viewer) {

                    function dataURLtoBlob(dataurl) {
                        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                        while (n--) {
                            u8arr[n] = bstr.charCodeAt(n);
                        }
                        return new Blob([u8arr], { type: mime });
                    }

                    var canvas = this._viewer.scene.canvas;
                    var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                    var link = document.createElement("a");
                    var strDataURI = image.substr(22, image.length);
                    var blob = dataURLtoBlob(image);
                    var objurl = URL.createObjectURL(blob);
                    link.download = "scene.png";
                    link.href = objurl;
                    link.click();
                }
            },
            /**
             * amap
             */
            _installAmapImageryProvider: function () {
                const IMG_URL =
                    'https://webst{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}';
                const ELEC_URL =
                    'http://webrd{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}';

                function AmapImageryProvider(options) {
                    options['url'] = options.style === 'img' ? IMG_URL : ELEC_URL
                    if (!options.subdomains) {
                        options['subdomains'] = ['01', '02', '03', '04']
                    }
                    return new Cesium.UrlTemplateImageryProvider(options)
                }

                Cesium.AmapImageryProvider = AmapImageryProvider
            },
            /**
             * 天地图
             */
            _installTdtImageryProvider: function () {
                const MAP_URL =
                    'http://t{s}.tianditu.gov.cn/{layer}_c/wmts?service=WMTS&version=1.0.0&request=GetTile&tilematrix={TileMatrix}&layer={layer}&style={style}&tilerow={TileRow}&tilecol={TileCol}&tilematrixset={TileMatrixSet}&format=tiles&tk={key}';

                function TdtImageryProvider(options) {

                    return new Cesium.UrlTemplateImageryProvider({
                        url: MAP_URL.replace(/\{layer\}/g, options.style || 'vec').replace(
                            /\{key\}/g,
                            options.key || ''
                        ),
                        style: 'default',
                        format: 'tiles',
                        tileMatrixSetID: 'c',
                        subdomains: [...Array(6).keys()].map(item => (item + 1).toString()),
                        tileMatrixLabels: [...Array(18).keys()].map(item =>
                            (item + 1).toString()
                        ),
                        tilingScheme: new Cesium.GeographicTilingScheme(),
                        maximumLevel: 18
                    })
                }

                Cesium.TdtImageryProvider = TdtImageryProvider
            },
            /**
             * 腾讯
             */
            _installTencentImageryProvider: function () {
                const ELEC_URL =
                    'https://rt{s}.map.gtimg.com/tile?z={z}&x={x}&y={reverseY}&styleid=1000&scene=0&version=347';

                function TencentImageryProvider(options) {
                    options['url'] = ELEC_URL
                    if (!options.subdomains) {
                        options['subdomains'] = ['0', '1', '2']
                    }
                    return new Cesium.UrlTemplateImageryProvider(options)
                }

                Cesium.TencentImageryProvider = TencentImageryProvider
            },
            /**
             * google
             */
            _installGooGleImageryProvider: function () {
                //标注 影像 地形三种
                const ELEC_URL =
                    'http://mt{s}.google.cn/vt/lyrs=m@207000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Galile';
                const IMG_URL =
                    'http://mt{s}.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali';
                const TER_URL =
                    'http://mt{s}.google.cn/vt/lyrs=t@131,r@227000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galile';

                function GoogleImageryProvider(options) {
                    options['url'] =
                        options.style === 'img'
                            ? IMG_URL
                            : options.style === 'ter'
                                ? TER_URL
                                : ELEC_URL
                    if (!options.subdomains) {
                        options['subdomains'] = ['1', '2', '3', '4', '5']
                    }
                    return new Cesium.UrlTemplateImageryProvider(options)
                }
                Cesium.GoogleImageryProvider = GoogleImageryProvider
            },
            /**
             * 百度影像拓展
             */
            _installBaiduImageryProvider: function () {

                var TEMP_MAP_URL =
                    'http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=1&customid={style}'

                function BaiduImageryProvider(options) {

                    TEMP_MAP_URL = options.temp_url || TEMP_MAP_URL

                    this._url = TEMP_MAP_URL
                    this._tileWidth = 256
                    this._tileHeight = 256
                    this._maximumLevel = 18
                    this._minimumLevel = 1
                    this._tilingScheme = new Cesium.WebMercatorTilingScheme({
                        rectangleSouthwestInMeters: new Cesium.Cartesian2(-33554054, -33746824),
                        rectangleNortheastInMeters: new Cesium.Cartesian2(33554054, 33746824)
                    })
                    this._rectangle = this._tilingScheme.rectangle
                    this._credit = undefined
                    this._style = options.style || 'normal'
                }

                Object.defineProperties(BaiduImageryProvider.prototype, {
                    url: {
                        get: function () {
                            return this._url;
                        }
                    },
                    token: {
                        get: function () {
                            return this._token;
                        }
                    },
                    tileWidth: {
                        get: function () {
                            if (!this.ready) {
                                throw new Cesium.DeveloperError(
                                    'tileWidth must not be called before the imagery provider is ready.'
                                )
                            }
                            return this._tileWidth
                        }
                    },
                    tileHeight: {
                        get: function () {
                            if (!this.ready) {
                                throw new Cesium.DeveloperError(
                                    'tileHeight must not be called before the imagery provider is ready.'
                                )
                            }
                            return this._tileHeight
                        }
                    },
                    maximumLevel: {
                        get: function () {
                            if (!this.ready) {
                                throw new Cesium.DeveloperError(
                                    'tileHeight must not be called before the imagery provider is ready.'
                                )
                            }
                            return this._tileHeight
                        }
                    },
                    minimumLevel: {
                        get: function () {
                            if (!this.ready) {
                                throw new Cesium.DeveloperError(
                                    'minimumLevel must not be called before the imagery provider is ready.'
                                )
                            }
                            return 0
                        }
                    },
                    tilingScheme: {
                        get: function () {
                            if (!this.ready) {
                                throw new Cesium.DeveloperError(
                                    'tilingScheme must not be called before the imagery provider is ready.'
                                )
                            }
                            return this._tilingScheme
                        }
                    },

                    rectangle: {
                        get: function () {
                            if (!this.ready) {
                                throw new Cesium.DeveloperError(
                                    'rectangle must not be called before the imagery provider is ready.'
                                )
                            }
                            return this._rectangle
                        }
                    },

                    ready: {
                        get: function () {
                            return !!this._url
                        }
                    },

                    credit: {
                        get: function () {
                            return this._credit
                        }
                    }
                });

                BaiduImageryProvider.prototype.getTileCredits = function (x, y, level) { }

                BaiduImageryProvider.prototype.requestImage = function (x, y, level) {
                    if (!this.ready) {
                        throw new Cesium.DeveloperError(
                            'requestImage must not be called before the imagery provider is ready.'
                        )
                    }
                    var xTiles = this._tilingScheme.getNumberOfXTilesAtLevel(level)
                    var yTiles = this._tilingScheme.getNumberOfYTilesAtLevel(level)
                    var url = this._url
                        .replace('{x}', x - xTiles / 2)
                        .replace('{y}', yTiles / 2 - y - 1)
                        .replace('{z}', level)
                        .replace('{s}', 1)
                        .replace('{style}', this._style)
                    return Cesium.ImageryProvider.loadImage(this, url)
                }

                Cesium.BaiduImageryProvider = BaiduImageryProvider
            }
        }
        /**
         * dom 工具
         * @param {*} viewer 
         */
        function DomUtil(viewer) { }
        DomUtil.prototype = {
            /**
            * 创建dom元素
            * @param {*} tagName 
            * @param {*} className 
            * @param {*} container 
            */
            createDom: function (tagName, className, container) {
                var el = document.createElement(tagName)
                el.className = className || ''
                if (container) {
                    container.appendChild(el)
                }
                return el
            },
            //删除 element
            removeDom: function (el) {
                var parent = el.parentNode
                if (parent) {
                    parent.removeChild(el)
                }
            },
            //清空 element
            emptyDom: function (el) {
                while (el.firstChild) {
                    el.removeChild(el.firstChild)
                }
            },
            //添加 class
            addDomClass: function (el, name) {
                if (el.classList !== undefined) {
                    var classes = this.splitWords(name)
                    for (var i = 0, len = classes.length; i < len; i++) {
                        el.classList.add(classes[i])
                    }
                } else if (!this.hasClass(el, name)) {
                    var className = this.getClass(el)
                    this.setClass(el, (className ? className + ' ' : '') + name)
                }
            },
            //删除class
            removeDomClass: function (el, name) {
                if (el.classList !== undefined) {
                    el.classList.remove(name)
                } else {
                    this.setClass(el, this.trim((' ' + this.getClass(el) + ' ').replace(' ' + name + ' ', ' ')))
                }
            },
            //设置 class
            setDomClass: function (el, name) {
                if (el.className.baseVal === undefined) {
                    el.className = name
                } else {
                    // in case of SVG element
                    el.className.baseVal = name
                }
            },
            //获取 el class
            getDomClass: function (el) {
                // Check if the element is an SVGElementInstance and use the correspondingElement instead
                // (Required for linked SVG elements in IE11.)
                if (el.correspondingElement) {
                    el = el.correspondingElement
                }
                return el.className.baseVal === undefined ? el.className : el.className.baseVal
            },
            //创建 svg
            createDomSvg: function (width, height, path, container) {
                var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg:svg')
                svg.setAttribute('class', 'svg-path')
                svg.setAttribute('width', width)
                svg.setAttribute('height', height)
                svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height)
                var pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')
                pathEl.setAttribute('d', path)
                svg.appendChild(pathEl)
                if (container) {
                    container.appendChild(svg)
                }
                return svg
            },
            //生成uuid
            createUUID: function (prefix) {
                prefix = prefix || 'D'
                const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(
                    ''
                )
                let uuid = []
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
                uuid[14] = '4'
                let r
                for (let i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | (Math.random() * 16)
                        uuid[i] = CHARS[i == 19 ? (r & 0x3) | 0x8 : r]
                    }
                }
                return prefix + '-' + uuid.join('')
            }
        }
        /**
         * 超图模块
         * @param {*} viewer 
         */
        function SuperMap(viewer) {
            if (viewer) {

                this._superMapLayer = new Cesium.CustomDataSource('superMapLayer')

                viewer && viewer.dataSources.add(this._superMapLayer)
            }
        }
        SuperMap.prototype = {
            //发光纹理纹理
            setHypsometric: function (layer, option) {

                option = option || {}
                if (this._viewer && layer && option) {

                    var hyp = new Cesium.HypsometricSetting();
                    // hypsometricSetting.DisplayMode= Cesium.HysometricSettingEnum.DisplayMode.FACE;LineColor
                    hyp.emissionTextureUrl = option.emissionTextureUrl || "data/images/Textures/lly2.png";
                    hyp.Opacity = 1
                    hyp.emissionTexCoordUSpeed = option.emissionTexCoordUSpeed || 0.3;

                    // var hyp = new Cesium.HypsometricSetting();
                    // //设置颜色表
                    // var colorTable = new Cesium.ColorTable();
                    // colorTable.insert(300, new Cesium.Color(1, 1, 0));
                    // colorTable.insert(200, new Cesium.Color(1, 0, 0));
                    // colorTable.insert(100, new Cesium.Color(0, 0, 1));
                    // hyp.ColorTable = colorTable;

                    layer.hypsometricSetting = {
                        hypsometricSetting: hyp
                    }
                }
            },
            //点光源
            setPointLight: function (position, options) {

                if (this._viewer && position) {

                    var DEF_OPTS = {
                        color: options.color || new Cesium.Color(1, 1, 2, 0.8),
                        cutoffDistance: options.cutoffDistance || 1000,
                        decay: options.decay || 0.5,
                        intensity: options.intensity || 1
                    };
                    options = options || DEF_OPTS

                    var pointLight = new Cesium.PointLight(position, options)

                    this._viewer.scene.addLightSource(pointLight);

                    return pointLight
                }
            },
            //平行光
            setDirectionalLight: function (position, options) {

                if (this._viewer && position) {

                    var DEF_OPTS = {
                        targetPosition: options.targetPosition, //方向
                        color: options.color || new Cesium.Color(1, 1, 2, 0.8),
                        intensity: options.intensity || 1
                    };
                    options = options || DEF_OPTS

                    var directionalLight = new Cesium.DirectionalLight(position, options)

                    this._viewer.scene.addLightSource(directionalLight);

                    return directionalLight
                }
            },
            //扫描圆
            setScanCircleEffect: function (options) {

                if (this._viewer && options && options.position) {

                    this._viewer.scene.scanEffect.color = options.color || new Cesium.Color(2.0, 1.0, 1.0, 1);
                    this._viewer.scene.scanEffect.period = options.period || 3.0;
                    this._viewer.scene.scanEffect.centerPostion = options.position
                    this._viewer.scene.scanEffect.speed = 800
                    this._viewer.scene.scanEffect.textureUrl = options.textureUrl || 'examples/images/cc2.jpg'
                    this._viewer.scene.scanEffect.mode = Cesium.ScanEffectMode.CIRCLE
                    setTimeout(() => {
                        this._viewer.scene.scanEffect.show = true
                    }, 5000)
                }
            },
            //扫描线
            setScanLineEffect: function (options) {

                if (this._viewer && options && options.positions) {

                    var dir = new Cesium.Cartesian3();

                    Cesium.Cartesian3.subtract(options.positions[0], options.positions[1], dir); // 获取扫描方向向量

                    this._viewer.scene.scanEffect.color = options.color || new Cesium.Color(1.0, 1.0, 1.0, 1.0);
                    this._viewer.scene.scanEffect.period = options.period || 3.0;
                    this._viewer.scene.scanEffect.centerPostion = options.positions[0]
                    this._viewer.scene.scanEffect.textureUrl = options.textureUrl || 'examples/images/ll1.jpg'
                    this._viewer.scene.scanEffect.lineMoveDirection = dir;
                    this._viewer.scene.scanEffect.mode = Cesium.ScanEffectMode.LINE
                    setTimeout(() => {
                        this._viewer.scene.scanEffect.show = true
                    }, 5000)
                }

            },
            //添加火焰粒子
            setFlameParticle: function (options) {

                if (this._viewer && options && options.position) {

                    var entity = this._viewer.entities.add({
                        position: options.position,
                    }), emitterModelMatrix = new Cesium.Matrix4(),
                        translation = new Cesium.Cartesian3(),
                        rotation = new Cesium.Quaternion(),
                        hpr = new Cesium.HeadingPitchRoll(),
                        trs = new Cesium.TranslationRotationScale(),
                        flameParticleSystem = this._viewer.scene.primitives.add(new Cesium.ParticleSystem({
                            image: options.image || 'examples/images/ParticleSystem/fire4.png',
                            startColor: options.startColor || new Cesium.Color(1, 1, 1, 1),
                            endColor: options.endColor || new Cesium.Color(0.5, 0, 0, 0),
                            startScale: options.startScale || 5.0,
                            endScale: options.endScale || 3.5,
                            minimumParticleLife: options.minimumParticleLife || 1.5,
                            maximumParticleLife: options.maximumParticleLife || 1.8,
                            minimumSpeed: options.minimumSpeed || 7.0,
                            maximumSpeed: options.maximumSpeed || 9.0,
                            imageSize: options.imageSize || new Cesium.Cartesian2(2, 2),
                            emissionRate: options.emissionRate || 200.0,
                            lifetime: options.lifetime || 6.0,
                            //循环是否开启
                            loop: true,
                            emitter: options.emitter || new Cesium.BoxEmitter(new Cesium.Cartesian3(10.0, 10.0, 10.0)),
                            // emitterModelMatrix: computeEmitterModelMatrix(),
                            // updateCallback: applyGravity,
                            sizeInMeters: true,
                        }));

                    this._viewer.scene.preUpdate.addEventListener(function (scene, time) {
                        flameParticleSystem.modelMatrix = computeModelMatrix(entity, time);
                        // Account for any changes to the emitter model matrix.
                        flameParticleSystem.emitterModelMatrix = computeEmitterModelMatrix();
                    });

                    // 计算矩阵
                    function computeModelMatrix(entity, time) {
                        return entity.computeModelMatrix(time, new Cesium.Matrix4());
                    }
                    //改变粒子系统的位置
                    function computeEmitterModelMatrix() {
                        hpr = Cesium.HeadingPitchRoll.fromDegrees(0.0, 0.0, 0.0, hpr);
                        trs.translation = Cesium.Cartesian3.fromElements(options.tx, options.ty, options.tz, translation);
                        trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, rotation);
                        return Cesium.Matrix4.fromTranslationRotationScale(trs, emitterModelMatrix);
                    }
                    return flameParticleSystem;
                }
            },
            //添加雨滴粒子
            setRainParticle: function (options) {

                options = options || {}
                if (this._viewer && options) {
                    this._viewer.scene.logarithmicDepthBuffer = true;
                    // rain
                    var rainParticleSize = this._viewer.scene.drawingBufferWidth / 80.0, rainRadius = 4000.0, //降雨范围
                        rainImageSize = new Cesium.Cartesian2(rainParticleSize, rainParticleSize * 3.0),
                        rainGravityScratch = new Cesium.Cartesian3(), $this = this;

                    var rainUpdate = function (particle, dt) {

                        rainGravityScratch = Cesium.Cartesian3.normalize(particle.position, rainGravityScratch);
                        rainGravityScratch = Cesium.Cartesian3.multiplyByScalar(rainGravityScratch, -40, rainGravityScratch);
                        particle.position = Cesium.Cartesian3.add(particle.position, rainGravityScratch, particle.position);

                        var distance = Cesium.Cartesian3.distance($this._viewer.scene.camera.position, particle.position);
                        if (distance > rainRadius) {
                            particle.endColor.alpha = 0.0;
                        } else {
                            particle.endColor.alpha = rainSystem.endColor.alpha / (distance / rainRadius + 0.1);
                        }
                    };
                    var rainSystem = new Cesium.ParticleSystem({
                        modelMatrix: new Cesium.Matrix4.fromTranslation(this._viewer.scene.camera.position),
                        speed: -1.0,
                        lifetime: 10.0,
                        scale: 0.8,
                        emitter: new Cesium.SphereEmitter(rainRadius),
                        startScale: 1.0,
                        endScale: 1.0,
                        image: 'examples/images/ParticleSystem/rain.png',
                        emissionRate: 3000.0,
                        startColor: new Cesium.Color(1, 1, 1, 0.8),
                        endColor: new Cesium.Color(1, 1, 1, 0.8),
                        imageSize: rainImageSize,
                        updateCallback: rainUpdate,

                        performance: false,

                    });
                    rainSystem.lodRangeScale = 10000;

                    return this._viewer.scene.primitives.add(rainSystem);
                }
            },
            // 鼠标旋转
            setFlyCircle: function (init) {

                if (this._viewer) {

                    var camera = this._viewer.scene.camera,
                        flag = false, $this = this;
                    camera.flyCircleLoop = true
                    camera.speedRatio = 0.2
                    if (init) {
                        setTimeout(() => {
                            var center = Cesium.Cartesian3.fromDegrees(106.56185470893745, 29.538553141480676, 50.0);
                            camera.flyCircle(center);
                        }, 2000)
                    }
                    _handler = new Cesium.ScreenSpaceEventHandler(this._viewer.scene.canvas)
                    _handler.setInputAction(function (movement) {

                        if (camera) {
                            camera.stopFlyCircle();
                        }
                    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

                    _handler.setInputAction(function (movement) {

                        var cartesian = $this._viewer.scene.camera.pickEllipsoid(movement.position, $this._viewer.scene.globe.ellipsoid);
                        if (cartesian && cartesian.x) {
                            camera.flyCircle(cartesian);
                        }
                    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

                    return _handler;
                }
            },
            //拓展热力图
            createSuperMapHeatMaps: function () {

                if (h337 && document.querySelector('.heatmap')) {

                    var heatmapInstance = h337.create({
                        container: document.querySelector('.heatmap')
                    });
                    var points = [], max = 0, width = 840, height = 400, len = 200;
                    while (len--) {
                        var val = Math.floor(Math.random() * 100);
                        max = Math.max(max, val);
                        var point = {
                            x: Math.floor(Math.random() * width),
                            y: Math.floor(Math.random() * height),
                            value: val
                        };
                        points.push(point)
                    }
                    var data = {
                        max: max,
                        data: points
                    }
                    heatmapInstance.setData(data);

                    return heatmapInstance
                }
            },
            // 旋转聚光灯
            createRotateSpotLightGraphics: function (options) {

                if (this._viewer && options && options.center) {

                    var ellipse = this.computeEllipseEdgePositions({
                        semiMinorAxis: options.semiMinorAxis || 500,
                        semiMajorAxis: options.semiMajorAxis || 500,
                        rotation: 0,
                        center: options.center,
                        granularity: Math.PI / 150.0//间隔
                    })

                    var positions = [], index = 0
                    for (let i = 0; i < ellipse.outerPositions.length; i += 3) {
                        let cartesian = new Cesium.Cartesian3(ellipse.outerPositions[i], ellipse.outerPositions[i + 1], ellipse.outerPositions[i + 2]);
                        positions.push(cartesian)
                    }

                    var spotLight = new Cesium.SpotLight(options.center, positions[0], {
                        color: options.color || new Cesium.Color(9, 15, 160, 0.8),
                        intesity: options.intesity || 5,
                        distance: options.distance || 500,
                        decay: options.decay || 2,
                    })
                    this._viewer.scene.addLightSource(spotLight)
                    // 修改每一帧事件
                    this._viewer.scene.preUpdate.addEventListener(function () {

                        if (index == 0) {

                            spotLight.targetPosition = positions[0], index += 1

                        } else if (index < positions.length - 1) {

                            spotLight.targetPosition = positions[index], index += 1

                        } else if (index == positions.length - 1) {

                            spotLight.targetPosition = positions[index], index = 0

                        }
                    })

                }
            },
        }
        /**
         * 图形模块
         * @param {*} viewer 
         */
        function Graphics(viewer) {

            if (viewer) {

                this._graphicsLayer = new Cesium.CustomDataSource('graphicsLayer')

                viewer && viewer.dataSources.add(this._graphicsLayer)
            }

        }
        Graphics.prototype = {
            // 创建一个实体图形
            createGraphics: function () {

                return new Cesium.Entity()
            },
            //点
            getPointGraphics: function (options) {

                options = options || {}
                if (options) {

                    return new Cesium.PointGraphics({
                        color: options.color || Cesium.Color.GREEN,
                        pixelSize: options.pixelSize || 5,
                        outlineColor: options.outlineColor || Cesium.Color.WHITE,
                        outlineWidth: options.outlineWidth || 1
                    });
                }
            },
            //线
            getLineGraphics: function (options) {
                options = options || {}
                if (options && options.positions) {

                    return new Cesium.PolylineGraphics({
                        show: true,
                        positions: options.positions,
                        material: options.material || Cesium.Color.YELLOW,
                        width: options.width || 1,
                        clampToGround: options.clampToGround || false,
                    });
                }
            },
            // 面
            getPolygonGraphics: function (options) {
                options = options || {}
                if (options && options.positions) {

                    return new Cesium.PolygonGraphics({
                        hierarchy: { positions: options.positions },
                        material: options.material || Cesium.Color.RED.withAlpha(0.2),
                        clampToGround: options.clampToGround || false
                    })
                }
            },
            //标签
            getLabelGraphics: function (options) {

                options = options || {}
                if (options && options.l_text) {

                    return new Cesium.LabelGraphics({ //文字标签
                        text: options.l_text,
                        font: options.l_font || '14px sans-serif',
                        fillColor: options.l_fillColor || Cesium.Color.GOLD,
                        style: options.l_style || Cesium.LabelStyle.FILL_AND_OUTLINE,
                        outlineWidth: options.l_outlineWidth || 2,
                        showBackground: options.l_showBackground || false,
                        backgroundColor: options.l_backgroundColor || new Cesium.Color(0.165, 0.165, 0.165, 0.8),
                        verticalOrigin: options.l_verticalOrigin || Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: options.l_pixelOffset || new Cesium.Cartesian2(0, -30),
                        //heightReference:Cesium.HeightReference.RELATIVE_TO_GROUND
                    });
                }
            },
            //广告牌
            getBillboardGraphics: function (options) {

                options = options || {}
                if (options && options.b_img) {

                    return new Cesium.BillboardGraphics({
                        image: options.b_img,
                        width: options.b_width || 35,
                        height: options.b_height || 35,
                        clampToGround: options.b_clampToGround || true,
                        scale: options.b_scale || 1,
                        // eyeOffset :new Cesium.Cartesian2(0, -20),
                        pixelOffset: options.b_pixelOffset || new Cesium.Cartesian2(0, -20),
                        scaleByDistance: options.b_scaleByDistance || undefined
                        // heightReference:Cesium.HeightReference.RELATIVE_TO_GROUND
                    })
                }
            },
            //路径
            getPathGraphics: function (options) {

                options = options || {}
                if (options) {

                    return new Cesium.PathGraphics({
                        resolution: options.resolution || 1,
                        //设置航线样式，线条颜色，内发光粗细，航线宽度等
                        material: new Cesium.PolylineGlowMaterialProperty({
                            glowPower: options.glowPower || 0.1,
                            color: options.color || Cesium.Color.YELLOW
                        }),
                        width: options.width || 30
                    })
                }
            },
            //模型
            getModelGraphics: function (options) {

                options = options || {}
                if (options) {

                    return new Cesium.ModelGraphics({
                        uri: options.m_url,
                        scale: options.m_scale || 28,
                        minimumPixelSize: options.m_minimumPixelSize || 30,
                        color: options.m_color || Cesium.Color.WHITE
                    })
                }
            },
            //椭圆
            getEllipseGraphics: function (options) {

                options = options || {}
                if (options) {

                    return new Cesium.EllipseGraphics({
                        semiMajorAxis: options.e_semiMinorAxis || 1000000.0,
                        semiMinorAxis: options.e_semiMinorAxis || 1000000.0,
                        metarial: options.e_metarial || Cesium.Color.RED.withAlpha(0.5),
                        outline: options.e_outline || true
                    })
                }
            },
            //球
            getEllipsoidGraphics: function (options) {

                options = options || {}
                if (options) {
                    var r = options.radii || 1000000.0   //默认100公里
                    return new Cesium.EllipsoidGraphics({
                        radii: new Cesium.Cartesian3(r, r, r), //单位 米
                        // innerRadii : options.innerRadii || new Cesium.Cartesian3(r /1.5, r /1.5, r /1.5),
                        maximumCone: options.maximumCone || Cesium.Math.PI_OVER_TWO,
                        stackPartitions: options.stackPartitions || 56,
                        slicePartitions: options.slicePartitions || 56,
                        outlineWidth: options.outlineWidth || 2.0,
                        outlineColor: options.outlineColor || Cesium.Color.YELLOW,
                        outline: options.outline || true,
                        fill: options.fill || true,
                        material: options.material || Cesium.Color.RED.withAlpha(0.1)
                        //heightReference:Cesium.HeightReference.NONE,
                    });
                }
            },
            // 面
            getPlaneGraphics: function (options) {
                options = options || {}
                if (options) {
                    return new Cesium.PlaneGraphics({
                        plane: options.plane || new Cesium.Plane(Cesium.Cartesian3.UNIT_Y, 0.0),
                        dimensions: options.dimensions || new Cesium.Cartesian2(170.0, 130.0),
                        material: options.material || Cesium.Color.BLUE
                    })
                }
            },
            // 锥体
            getCylinderGraphics: function (options) {
                options = options || {}
                if (options) {
                    return new Cesium.CylinderGraphics({
                        HeightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                        length: options.length || 500 / 2,
                        topRadius: options.topRadius || 0,
                        bottomRadius: options.bottomRadius || 0,
                        material: options.material || new Cesium.Color(0, 1, 1, .4),
                        slices: options.slices || 128
                    })
                }
            },
            //创建点信息
            createPointsGraphics: function (options) {

                if (options && options.positions) {
                    let positions = []
                    for (let i in options.positions) {
                        let position = options.positions[i]
                        let entity = this.createGraphics()
                        entity.name = options.name || ''
                        entity.oid = options.oid || 'point';
                        entity.position = position;
                        if (options.point) entity.point = this.getPointGraphics();
                        if (options.billboard) entity.billboard = this.getBillboardGraphics(options.billboard);
                        if (options.label) entity.label = this.getLabelGraphics(options.label);
                        positions.push(this._graphicsLayer.entities.add(entity))
                    }
                    return positions;
                }
            },
            //创建线
            createLineGraphics: function (options) {

                if (options && options.positions) {
                    var entity = this.createGraphics();
                    entity.name = options.name || ''
                    entity.oid = options.oid || 'line';
                    entity.position = options.positions;
                    entity.polyline = this.getLineGraphics(options);

                    return this._graphicsLayer.entities.add(entity);
                }
            },
            //创建面
            createPolygonGraphics: function (options) {

                options = options || {}
                if (options) {
                    var entity = this.createGraphics();
                    entity.polygon = this.getPolygonGraphics(options)
                    entity.clampToS3M = options.clampToS3M || false

                    return this._graphicsLayer.entities.add(entity);
                }
            },
            //创建模型
            createModelGraphics: function (options) {

                if (options && options.position) {
                    var entity = this.createGraphics();
                    entity.model = this.getModelGraphics(options)
                    entity.position = options.position
                    return this._graphicsLayer.entities.add(entity);
                }
            },
            // 创建地面指示
            craeteCorridorGraphics: function (options) {

                if (options && options.positions) {
                    var entity = this.createGraphics()
                    entity.corridor = {
                        positions: options.positions,
                        height: options.height || 6.0,
                        width: options.width || 15.0,
                        material: options.material ||
                            new Cesium.WarnLinkMaterialProperty({ freely: 'cross', color: Cesium.Color.YELLOW, duration: 1000, count: 1.0, direction: '+' }),
                    }

                    return this._graphicsLayer.entities.add(entity)
                }
            },
            //构建动态线
            craeteDynamicPolyLineGraphics: function (options) {

                if (options && options.positions) {
                    var entity = this.createGraphics()
                    entity.polyline = {
                        show: true,
                        positions: [],
                        material: options.material || Cesium.Color.CHARTREUSE,
                        width: options.width || 5,
                        clampToGround: options.clampToGround || false
                    }

                    entity.polyline.positions = new Cesium.CallbackProperty(function () {
                        return options.positions;
                    }, false);

                    return this._graphicsLayer.entities.add(entity);
                }
            },
            //动态椎体
            craeteDynamicCylinderGraphics: function (options) {

                if (options && options.cylinder) {
                    var entity = options.entity, cylinder = options.cylinder, $this = this;
                    param.cylinder = this.getCylinderGraphics(cylinder)
                    param.position = new Cesium.CallbackProperty(function () {
                        var positions = entity.position.getValue($this._viewer.clock.currentTime);
                        var cartographic = $this._viewer.scene.globe.ellipsoid.cartesianToCartographic(positions);
                        var lat = Cesium.Math.toDegrees(cartographic.latitude)
                            , lng = Cesium.Math.toDegrees(cartographic.longitude)
                            , hei = parseFloat(cartographic.height / 4);
                        return Cesium.Cartesian3.fromDegrees(lng, lat, 0);
                    }, false);

                    param.cylinder.length = new Cesium.CallbackProperty(function () {
                        var positions = entity.position.getValue($this._viewer.clock.currentTime);
                        var cartographic = $this._viewer.scene.globe.ellipsoid.cartesianToCartographic(positions);
                        return cartographic.height * 2;
                    }, false);

                    return param;
                }
            },
            // 创建渐变锥体
            createFadeCylinderGraphics: function (options) {
                options = options || {}
                if (options && options.position) {

                    let entity = this.createGraphics()
                    entity.position = options.position
                    options.material = new Cesium.CircleFadeMaterialProperty({
                        color: options.color || Cesium.Color.fromCssColorString("#02ff00"),
                        duration: options.duration || 2000,
                    })
                    entity.cylinder = this.getCylinderGraphics(options)

                    return this._drawLayer.entities.add(entity)
                }
            },
            // 创建旋转圆柱
            craeteRotateCylinderGraphics: function (options) {

                if (options && options.position) {

                    var cylinderEntity = this.createGraphics()
                    cylinderEntity.cylinder = {
                        HeightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                        length: options.length || 500,
                        topRadius: options.topRadius || 500,
                        bottomRadius: options.bottomRadius || 500,
                        material: options.material || new Cesium.ImageMaterialProperty({
                            image: "data/images/file/cc2.jpg",
                            transparent: true,
                            repeat: {
                                x: 1,
                                y: -1
                            }

                        }),
                        slices: options.slices || 128
                    }
                    cylinderEntity.position = options.position

                    this.setGraphicsRotate({
                        entity: cylinderEntity,
                        position: this.transformCartesianToWGS84(options.position),
                        rotateAmount: 4
                    })
                    return this._graphicsLayer.entities.add(cylinderEntity)
                }
            },
            //闪烁圆
            craeteDynamicBlinkCircleGraphics: function (options) {

                if (options && options.position) {

                    var entity = this.createGraphics(), alp = options.alp || 1, flog = options.flog || true;
                    entity.position = options.position
                    entity.ellipse = {
                        semiMinorAxis: options.semiMinorAxis || 2000.0,
                        semiMajorAxis: options.semiMajorAxis || 2000.0,
                        height: options.height || 10,
                        material: new Cesium.ColorMaterialProperty(new Cesium.CallbackProperty(function () {
                            if (flog) {
                                alp = alp - 0.05;
                                if (alp <= 0) {
                                    flog = false; // hide
                                }
                            } else {
                                alp = alp + 0.05;
                                if (alp >= 1) {
                                    flog = true; // show
                                }
                            }
                            return Cesium.Color.RED.withAlpha(alp);
                        }, false))
                    }
                    return this._graphicsLayer.entities.add(entity)
                }
            },
            //动态旋转圆
            craeteDynamicCricleGraphics: function (options) {

                if (options && options.center) {
                    var entity = this.createGraphics(), $this = this,
                        _center = options.center, _radius = options.radius || 800,
                        _rotateAmount = options.rotateAmount || 0.05, _stRotation = 0,
                        _height = options.height || 1, heading = 0, pitch = 0, roll = 0,
                        _scale = options.scale || null, _scale2 = options.scale2 || null,
                        _material = options.material || new Cesium.ImageMaterialProperty({
                            image: options.imge || 'data/images/Textures/circle_bg.png',
                            transparent: true
                        });

                    entity.position = new Cesium.CallbackProperty(function () {

                        return $this.transformWGS84ToCartesian(_center)
                    }, false)

                    entity.orientation = new Cesium.CallbackProperty(function () {

                        return Cesium.Transforms.headingPitchRollQuaternion(
                            $this.transformWGS84ToCartesian(_center),
                            new Cesium.HeadingPitchRoll(
                                Cesium.Math.toRadians(heading),
                                Cesium.Math.toRadians(pitch),
                                Cesium.Math.toRadians(roll)
                            )
                        )
                    }, false)
                    let bg_scale = _radius, flag = false;
                    var updateScalerAxis = () => {
                        if (_radius >= _scale || _radius <= bg_scale) {
                            flag = !flag
                        }
                        flag ? _radius += 2 : _radius -= 2;
                    }
                    var updateScalerAxis2 = () => {

                        _scale2 >= _radius ? _radius += 2 : _radius = bg_scale;
                    }
                    entity.ellipse = {
                        material: _material,
                        height: _height,
                        semiMajorAxis: new Cesium.CallbackProperty(function () {
                            return _radius
                        }, false),
                        semiMinorAxis: new Cesium.CallbackProperty(function () {
                            return _radius
                        }, false),
                        stRotation: new Cesium.CallbackProperty(function () {
                            if (_rotateAmount > 0) {
                                _stRotation += _rotateAmount
                                if (_stRotation >= 360) {
                                    _stRotation = 0
                                }
                            }
                            if (_scale) updateScalerAxis()
                            if (_scale2) updateScalerAxis2()
                            return _stRotation
                        }, false)
                    }
                    return this._graphicsLayer.entities.add(entity)
                }
            },
            //动态渐变墙
            craeteDynamicShadeWallGraphics: function (options) {

                if (options && options.positions) {

                    var alp = options.alp || 1, num = options.num || 20,
                        color = options.color || Cesium.Color.RED, speed = options.speed || 0.003;

                    var wallEntity = this.createGraphics()
                    wallEntity.wall = {
                        positions: options.positions,
                        material: new Cesium.ImageMaterialProperty({
                            image: "data/images/Textures/fence.png",
                            transparent: true,
                            color: new Cesium.CallbackProperty(function () {

                                if ((num % 2) === 0) {
                                    alp -= speed;
                                } else {
                                    alp += speed;
                                }

                                if (alp <= 0.1) {
                                    num++;
                                } else if (alp >= 1) {
                                    num++;
                                }
                                return color.withAlpha(alp)
                            }, false)
                        })
                    }
                    return this._graphicsLayer.entities.add(wallEntity)
                }
            },
            // 默认自定义标牌气泡框
            createCustomDefBillboardGraphics: function (options) {

                if (options && options.position) {

                    var $this = this, img = document.createElement('img');
                    img.src = options.img || 'data/images/file/div1.png'
                    // 绘制canvas
                    function drawCompanyTip(options) {
                        if (!options.image) return
                        var canvas = document.createElement("canvas");
                        canvas.width = options.width || 150;
                        canvas.height = options.height || 80;
                        var context = canvas.getContext('2d');
                        context.drawImage(options.image, 0, 0);
                        var dom = options.text;
                        context.font = '15px bold 宋体';
                        context.fillStyle = "#f4fff0";
                        context.fillText(dom, 55, 36);
                        return canvas;
                    }
                    img.onload = function () {
                        options.image = img;
                        var entity = $this._graphicsLayer.entities.add({
                            position: options.position,
                            billboard: {
                                image: drawCompanyTip(options),
                                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 0.7, 1.5e7, 0.5),
                                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                                pixelOffset: options.b_pixelOffset || new Cesium.Cartesian2(80, -35),
                                width: 140,
                                height: 100,
                                scale: options.b_scale || 1.5,
                                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                                imageSubRegion: { x: 0, y: 0, width: 200, height: 150 }
                            },
                        })
                        if (typeof options.callback === 'function') {

                            options.callback(entity)
                        }
                    };
                }
            },
            // 旋转面
            craeteRotatePlaneGraphics: function (options) {

                if (options && options.center && options.positions) {

                    var entity = this.createGraphics(), index = 0, _center = options.center,
                        _plane, positions = options.positions, _position = positions[0];
                    entity.position = new Cesium.CallbackProperty(function () {

                        if (index == 0) {
                            _position = positions[0], index += 1
                        } else if (index < positions.length - 1) {

                            _position = positions[index], index += 1
                        } else if (index == positions.length - 1) {

                            _position = positions[index], index = 0
                        }
                        return _position;
                    }, false)
                    entity.plane = {
                        // plane: new Cesium.CallbackProperty(function () {
                        //     var normaB = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(_center, _position, new Cesium.Cartesian3()), new Cesium.Cartesian3())
                        //     _plane = new Cesium.Plane(Cesium.Cartesian3.normalize(Cesium.Cartesian3.add(normaB, _center, new Cesium.Cartesian3()), new Cesium.Cartesian3()), 0.0)

                        //     _plane = Cesium.Plane.fromPointNormal(coefficients, result)
                        //     return _plane;
                        // }, false),
                        plane: new Cesium.Plane(Cesium.Cartesian3.UNIT_Y, 0.0),
                        dimensions: options.dimensions || new Cesium.Cartesian2(200.0, 150.0),
                        material: new Cesium.ImageMaterialProperty({
                            image: options.image
                        })
                    }

                    return this._graphicsLayer.entities.add(entity)
                }
            },

            // 视频投放
            createVideoPlaneGraphics: function (options) {

                if (options && options.position) {

                    var entity = this.createGraphics()
                    entity.position = options.position
                    entity.plane = {
                        plane: new Cesium.Plane(options.normal || Cesium.Cartesian3.UNIT_Y, 0.0),
                        dimensions: options.dimensions || new Cesium.Cartesian2(200.0, 150.0),
                        material: new Cesium.ImageMaterialProperty({
                            image: options.videoElement
                        })
                    }
                    return this._graphicsLayer.entities.add(entity)
                }
            },
            //gif 图片投影
            createGifBillboardGraphics: function (options) {

                if (SuperGif && options && options.position) {

                    var gif = [], url = options.url, i = 0, speed = 6;

                    // 遍历gif的每一帧
                    function parseGifImages(url, imageArr) {

                        var img = document.createElement('img');
                        img.src = url
                        img.setAttribute('rel:animated_src', url) // gif库需要img标签配置下面两个属性
                        img.setAttribute('rel:auto_play', '0')
                        document.body.appendChild(img)
                        // 新建gif实例
                        var rub = new SuperGif({ gif: img });
                        return new Promise((resolve) => {
                            rub.load(() => {
                                for (let i = 1; i <= rub.get_length(); i++) {
                                    rub.move_to(i); // 遍历gif实例的每一帧
                                    imageArr.push(rub.get_canvas().toDataURL())
                                }
                                resolve(imageArr)
                                // document.body.removeChild(img)
                            });
                        })
                    }

                    parseGifImages(url, gif)
                    return this._graphicsLayer.entities.add({
                        position: options.position,
                        billboard: {
                            verticalOrigin: Cesium.VerticalOrigin.BASELINE,
                            image: new Cesium.CallbackProperty(function () {
                                if (gif.length) { // 解析每一帧
                                    if (i < speed * (gif.length - 1)) {
                                        i++
                                    } else {
                                        i = 0
                                    }
                                    return gif[Math.floor(i / speed)]
                                } else {
                                    return url//因为loadGif是异步的，在解析完成之前先使用原图
                                }
                            }, false),
                            scale: 0.2
                        }
                    })
                }
            },
            //图形旋转
            setGraphicsRotate: function (options) {

                if (options && options.entity && options.rotateAmount) {

                    var entity = options.entity, rotateAmount = options.rotateAmount, _position = options.position, $this = this;
                    _position.heading = 0, _position.pitch = 0, _position.roll = 0;
                    entity.position = new Cesium.CallbackProperty(function () {
                        return $this.transformWGS84ToCartesian(_position)
                    }, false)

                    entity.orientation = new Cesium.CallbackProperty(function () {
                        if (rotateAmount > 0) {
                            _position.heading += rotateAmount
                            if (_position.heading === 360) {
                                _position.heading = 0
                            }
                        }
                        return Cesium.Transforms.headingPitchRollQuaternion(
                            $this.transformWGS84ToCartesian(_position),
                            new Cesium.HeadingPitchRoll(
                                Cesium.Math.toRadians(_position.heading),
                                Cesium.Math.toRadians(_position.pitch),
                                Cesium.Math.toRadians(_position.roll)
                            )
                        )
                    }, false)
                }
            },
            // 图形浮动
            setGraphicsFloat: function (options) {

                if (options && options.entity && options.maxHeiht) {

                    var entity = options.entity, minHeiht = options.minHeiht || 5,
                        maxHeiht = options.maxHeiht || 100, cartesians = options.cartesians, speed = options.speed || 0.06,
                        $this = this, bg_minHeiht = minHeiht, flag = false;
                    if (cartesians.length) {
                        entity.positions = new Cesium.CallbackProperty(function () {

                            var positions = $this.transformCartesianArrayToWGS84Array(cartesians)
                            for (var i in positions) {
                                var position = positions[i]
                                if (minHeiht >= maxHeiht || minHeiht <= bg_minHeiht) {
                                    flag = !flag
                                }
                                flag ? minHeiht += speed : minHeiht -= speed;
                                position.alt = minHeiht;
                            }
                            return $this.transformWGS84ArrayToCartesianArray(positions);
                        }, false);
                    } else {

                        entity.position = new Cesium.CallbackProperty(function () {

                            var position = $this.transformCartesianToWGS84(cartesians)
                            if (minHeiht >= maxHeiht || minHeiht <= bg_minHeiht) {
                                flag = !flag
                            }
                            flag ? minHeiht += speed : minHeiht -= speed;
                            position.alt = minHeiht;
                            return $this.transformWGS84ToCartesian(position);
                        }, false);
                    }
                }
            },
            //canvas 贴图
            createCanvasGraphics: function (options) {

                if (options && options.positions) {

                    function drawCanvasImage() {

                        var canvas = document.createElement('canvas')
                        var ctx = canvas.getContext("2d");
                        var img = new Image();
                        img.src = options.img || "../../images/ysCesium/logo.png";
                        ctx.clearRect(0, 0, options.cwidth, options.cheight);
                        if (i <= cwidth) {
                            ctx.drawImage(img, i, 0);
                        } else
                            i = 0;
                        i += 3;
                        curCanvas = curCanvas === 'c' ? 'd' : 'c';
                        return canvas;
                    }

                    this._graphicsLayer.entities.add({
                        rectangle: {
                            coordinates: options.positions,
                            material: new Cesium.ImageMaterialProperty({
                                image: new Cesium.CallbackProperty(drawCanvasImage, false),
                                transparent: true
                            })
                        }
                    });

                    if (typeof options.callback === 'function') {

                        options.callback()
                    }
                }
            }
        }
        /**
         * 着色器模块
         * @param {*} viewer 
         */
        function Shaders(viewer) { }
        Shaders.prototype = {
            // 流动线
            _getFlowLineShader: function (options) {
                if (options && options.get) {
                    return "uniform vec4 color;\n\
                uniform float duration;\n\
                \n\
                czm_material czm_getMaterial(czm_materialInput materialInput){\n\
                    czm_material material = czm_getDefaultMaterial(materialInput);\n\
                    vec2 st = materialInput.st;\n\
                    float t =fract(czm_frameNumber / duration);\n\
                    t *= 1.03;\n\
                    float alpha = smoothstep(t- 0.03, t, st.s) * step(-t, -st.s);\n\
                    alpha += 0.1;\n\
                    vec4 fragColor;\n\
                    fragColor.rgb = (color.rgb) / 0.5;\n\
                    fragColor = czm_gammaCorrect(fragColor);\n\
                    material.diffuse = fragColor.rgb;\n\
                    material.alpha = alpha;\n\
                    material.emission = fragColor.rgb;\n\
                    return material;\n\
                }\n\
                ";
                }
            },
            // 动态线
            _getDynamicLineShader: function (options) {
                if (options && options.get) {
                    return "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                {\n\
                    czm_material material = czm_getDefaultMaterial(materialInput);\n\
                    vec2 st = materialInput.st;\n\
                    \n\
                    if(texture2D(image, vec2(0.0, 0.0)).a == 1.0){\n\
                        discard;\n\
                    }else{\n\
                        material.alpha = texture2D(image, vec2(1.0 - fract(time - st.s), st.t)).a * color.a;\n\
                    }\n\
                    \n\
                    material.diffuse = max(color.rgb * material.alpha * 3.0, color.rgb);\n\
                    \n\
                    return material;\n\
                }\n\
                ";
                }
            },
            // 动态泛光线
            _getDynamicLightLineShader: function (options) {
                if (options && options.get) {
                    return "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                {\n\
                    czm_material material = czm_getDefaultMaterial(materialInput);\n\
                    vec2 st = materialInput.st;\n\
                    \n\
                    vec4 colorImage = texture2D(image, vec2(fract(1.0 *st.s - time), fract(st.t)));\n\
                    \n\
                    vec4 fragColor;\n\
                    fragColor.rgb = (colorImage.rgb+color.rgb) / 1.0;\n\
                    fragColor = czm_gammaCorrect(fragColor);\n\
                    material.diffuse = colorImage.rgb;\n\
                    material.alpha = colorImage.a;\n\
                    material.emission = fragColor.rgb;\n\
                    \n\
                    return material;\n\
                }\n\
                ";
                    // material.diffuse = max(color.rgb * material.alpha * 3.0, color.rgb);\n\
                    // material.alpha = texture2D(image, vec2(1.0 - fract(time - st.s), st.t)).a * color.a;\n\
                }
            },
            /**
             * 带方向的墙体
             * @param {*} options 
             */
            _getDirectionWallShader: function (options) {

                if (options && options.get) {
                    var materail =
                        "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                    {\n\
                    czm_material material = czm_getDefaultMaterial(materialInput);\n\
                    vec2 st = materialInput.st;\n\
                    \n\ ";
                    if (options.freely == "vertical") { //（由下到上）

                        materail += "vec4 colorImage = texture2D(image, vec2(fract(float(" + options.count + ")*st.t " + options.direction + " time), fract(st.s)));\n\ ";
                    } else { //（逆时针）

                        materail += "vec4 colorImage = texture2D(image, vec2(fract(float(" + options.count + ")*st.s " + options.direction + " time), fract(st.t)));\n\ ";
                    }
                    //泛光
                    materail += "vec4 fragColor;\n\
                    fragColor.rgb = (colorImage.rgb+color.rgb) / 1.0;\n\
                    fragColor = czm_gammaCorrect(fragColor);\n\ "

                    materail += " material.diffuse = colorImage.rgb;\n\
                    material.alpha = colorImage.a;\n\
                    material.emission = fragColor.rgb;\n\
                    \n\
                    return material;\n\
                    }\n\
                    ";

                    return materail
                }
            },
            _getCircleFadeShader: function (options) {

                if (options && options.get) {

                    return `czm_material czm_getMaterial(czm_materialInput materialInput)\n                
                    {\n                    
                        czm_material material = czm_getDefaultMaterial(materialInput);\n                    
                        material.diffuse = 1.5 * color.rgb;\n                    
                        vec2 st = materialInput.st;\n                    
                        float dis = distance(st, vec2(0.5, 0.5));\n                    
                        float per = fract(time);\n                    
                        if(dis > per * 0.5){\n                        
                            //material.alpha = 0.0;\n                        
                            discard;\n                    
                        }else {\n                            
                            material.alpha = color.a  * dis / per / 2.0;\n                    
                        }\n                    
                        return material;\n                
                    }`
                }
            },
            // 波动圆
            _getDynamicCircleShader: function (options) {

                if (options && options.get) {
                    return "uniform vec4 color;\n\
                uniform float duration;\n\
                uniform float count;\n\
                uniform float gradient;\n\
                \n\
                czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                {\n\
                    czm_material material = czm_getDefaultMaterial(materialInput);\n\
                    material.diffuse = 1.5 * color.rgb;\n\
                    vec2 st = materialInput.st;\n\
                    vec3 str = materialInput.str;\n\
                    float dis = distance(st, vec2(0.5, 0.5));\n\
                    float per = fract(czm_frameNumber / duration);\n\
                    if(abs(str.z) > 0.001){\n\
                        discard;\n\
                    }\n\
                    if(dis > 0.5){\n\
                        discard;\n\
                    } else {\n\
                        float perDis = 0.5 / count;\n\
                        float disNum;\n\
                        float bl = .0;\n\
                        for (int i = 0; i <= 10; i++) {\n\
                            if (float(i) <= count) {\n\
                                disNum = perDis * float(i) - dis + per / count;\n\
                                if (disNum > 0.0) {\n\
                                    if (disNum < perDis) {\n\
                                        bl = 1.0 - disNum / perDis;\n\
                                    } else if (disNum - perDis < perDis) {\n\
                                        bl = 1.0 - abs(1.0 - disNum / perDis);\n\
                                    }\n\
                                    material.alpha = pow(bl, gradient);\n\
                                }\n\
                            }\n\
                        }\n\
                    }\n\
                    return material;\n\
                }\n\
                ";
                }
            },
            // 雷达扫描
            _getRadarScanShader: function (options) {

                if (options && options.get) {
                    return "uniform sampler2D colorTexture;\n\
                uniform sampler2D depthTexture;\n\
                varying vec2 v_textureCoordinates;\n\
                uniform vec4 u_scanCenterEC;\n\
                uniform vec3 u_scanPlaneNormalEC;\n\
                uniform vec3 u_scanLineNormalEC;\n\
                uniform float u_radius;\n\
                uniform vec4 u_scanColor;\n\
                \n\
                vec4 toEye(in vec2 uv, in float depth){\n\
                vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\n\
                vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);\n\
                posInCamera =posInCamera / posInCamera.w;\n\
                return posInCamera;\n\
                }\n\
                \n\
                bool isPointOnLineRight(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt){\n\
                vec3 v01 = testPt - ptOnLine;\n\
                normalize(v01);\n\
                vec3 temp = cross(v01, lineNormal);\n\
                float d = dot(temp, u_scanPlaneNormalEC);\n\
                return d > 0.5;\n\
                }\n\
                \n\
                vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point){\n\
                vec3 v01 = point -planeOrigin;\n\
                float d = dot(planeNormal, v01) ;\n\
                return (point - planeNormal * d);\n\
                }\n\
                \n\
                float distancePointToLine(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt){\n\
                vec3 tempPt = pointProjectOnPlane(lineNormal, ptOnLine, testPt);\n\
                return length(tempPt - ptOnLine);\n\
                }\n\
                \n\
                float getDepth(in vec4 depth){\n\
                float z_window = czm_unpackDepth(depth);\n\
                z_window = czm_reverseLogDepth(z_window);\n\
                float n_range = czm_depthRange.near;\n\
                float f_range = czm_depthRange.far;\n\
                return (2.0 * z_window - n_range - f_range) / (f_range - n_range);\n\
                }\n\
                \n\
                void main(){\n\
                gl_FragColor = texture2D(colorTexture, v_textureCoordinates);\n\
                float depth = getDepth( texture2D(depthTexture, v_textureCoordinates));\n\
                vec4 viewPos = toEye(v_textureCoordinates, depth);\n\
                vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);\n\
                float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);\n\
                float twou_radius = u_radius * 2.0;\n\
                if(dis < u_radius){\n\
                    float f0 = 1.0 -abs(u_radius - dis) / u_radius;\n\
                    f0 = pow(f0, 64.0);\n\
                    vec3 lineEndPt = vec3(u_scanCenterEC.xyz) + u_scanLineNormalEC * u_radius;\n\
                    float f = 0.0;\n\
                    if(isPointOnLineRight(u_scanCenterEC.xyz, u_scanLineNormalEC.xyz, prjOnPlane.xyz)){\n\
                        float dis1= length(prjOnPlane.xyz - lineEndPt);\n\
                        f = abs(twou_radius -dis1) / twou_radius;\n\
                        f = pow(f, float("+ options.width + "));\n\
                    }\n\
                    if(float("+ options.border + ") > 0.0){\n\
                        gl_FragColor = mix(gl_FragColor, u_scanColor, f + f0);\n\
                    } else {\n\
                        gl_FragColor = mix(gl_FragColor, u_scanColor, f);\n\
                    }\n\
                    }\n\
                }\n\
                ";
                }
            },
            // 圆形扫描
            _getCircleScanShader: function (options) {

                if (options && options.get) {
                    return "uniform sampler2D colorTexture;\n\
                uniform sampler2D depthTexture;\n\
                varying vec2 v_textureCoordinates;\n\
                uniform vec4 u_scanCenterEC;\n\
                uniform vec3 u_scanPlaneNormalEC;\n\
                uniform float u_radius;\n\
                uniform vec4 u_scanColor;\n\
                \n\
                vec4 toEye(in vec2 uv, in float depth){\n\
                  vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\n\
                  vec4 posInCamera = czm_inverseProjection * vec4(xy, depth, 1.0);\n\
                  posInCamera =posInCamera / posInCamera.w;\n\
                  return posInCamera;\n\
                }\n\
                \n\
                vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point){\n\
                    vec3 v01 = point - planeOrigin;\n\
                    float d = dot(planeNormal, v01) ;\n\
                    return (point - planeNormal * d);\n\
                }\n\
                \n\
                float getDepth(in vec4 depth){\n\
                    float z_window = czm_unpackDepth(depth);\n\
                    z_window = czm_reverseLogDepth(z_window);\n\
                    float n_range = czm_depthRange.near;\n\
                    float f_range = czm_depthRange.far;\n\
                    return (2.0 * z_window - n_range - f_range) / (f_range - n_range);\n\
                }\n\
                \n\
                void main(){\n\
                    gl_FragColor = texture2D(colorTexture, v_textureCoordinates);\n\
                    float depth = getDepth(texture2D(depthTexture, v_textureCoordinates));\n\
                    vec4 viewPos = toEye(v_textureCoordinates, depth);\n\
                    vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);\n\
                    float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);\n\
                    if(dis < u_radius){\n\
                      float f = 1.0 - abs(u_radius - dis) / u_radius;\n\
                      f = pow(f, float("+ options.border + "));\n\
                      gl_FragColor = mix(gl_FragColor, u_scanColor, f);\n\
                    }\n\
                  }\n\
                  ";
                }
            }
        }
        /**
         * 后期效果模块
         * @param {*} viewer 
         */
        function PassEffect() { }
        PassEffect.prototype = {
            // 圆形扩散效果 自定义
            setCircleScanEffect: function (options) {

                if (options && options.position) {

                    var id = options.id || 'CircleScan' + parseInt(Math.random() * 1000), cartesian = options.position
                        , radius = options.radius, color = options.color || Cesium.Color.RED
                        , duration = options.duration || 1500, $this = this
                        , circleMode = options.circleMode || 'CircleScan', border = options.border || 4.0;

                    var cartesian3Center = cartesian;
                    var cartesian4Center = new Cesium.Cartesian4(
                        cartesian3Center.x,
                        cartesian3Center.y,
                        cartesian3Center.z,
                        1
                    )
                    var position = this.transformCartesianToWGS84(cartesian)
                    var cartesian3Center1 = this.transformWGS84ToCartesian(
                        {
                            lng: position.lng,
                            lat: position.lat,
                            alt: position.alt + 500
                        }
                    )
                    var cartesian4Center1 = new Cesium.Cartesian4(
                        cartesian3Center1.x,
                        cartesian3Center1.y,
                        cartesian3Center1.z,
                        1
                    )

                    var _time = new Date().getTime()
                    var _delegate = new Cesium.PostProcessStage({
                        name: id,
                        fragmentShader: this._getCircleScanShader({ get: true, border: border }),
                        uniforms: {
                            u_scanCenterEC: function () {
                                return Cesium.Matrix4.multiplyByVector(
                                    $this._viewer.camera._viewMatrix,
                                    cartesian4Center,
                                    new Cesium.Cartesian4()
                                )
                            },
                            u_scanPlaneNormalEC: function () {
                                var temp = Cesium.Matrix4.multiplyByVector(
                                    $this._viewer.camera._viewMatrix,
                                    cartesian4Center,
                                    new Cesium.Cartesian4()
                                )
                                var temp1 = Cesium.Matrix4.multiplyByVector(
                                    $this._viewer.camera._viewMatrix,
                                    cartesian4Center1,
                                    new Cesium.Cartesian4()
                                )
                                var _scratchCartesian3Normal = new Cesium.Cartesian3()
                                _scratchCartesian3Normal.x = temp1.x - temp.x
                                _scratchCartesian3Normal.y = temp1.y - temp.y
                                _scratchCartesian3Normal.z = temp1.z - temp.z
                                Cesium.Cartesian3.normalize(
                                    _scratchCartesian3Normal,
                                    _scratchCartesian3Normal
                                )
                                return _scratchCartesian3Normal
                            },
                            u_radius: function () {

                                if (circleMode == 'CircleScan') {
                                    return (
                                        (radius * ((new Date().getTime() - _time) % duration)) /
                                        duration
                                    )

                                } else {

                                    return radius
                                }

                            },
                            u_scanColor: color
                        }
                    })

                    this._viewer.scene.postProcessStages.add(_delegate)

                    return _delegate;
                }
            },
            // 雷达扫描 自定义
            setRadarScanEffect: function (options) {
                if (options && options.position) {

                    var id = options.id || 'radarScan' + parseInt(Math.random() * 1000), cartesian = options.position
                        , radius = options.radius, color = options.color || Cesium.Color.RED
                        , duration = options.duration || 1500, $this = this, border = options.border || 1
                        , width = options.width || 3.0;

                    var cartesian3Center = cartesian
                    var cartesian4Center = new Cesium.Cartesian4(
                        cartesian3Center.x,
                        cartesian3Center.y,
                        cartesian3Center.z,
                        1
                    )
                    var position = this.transformCartesianToWGS84(cartesian)
                    var cartesian3Center1 = this.transformWGS84ToCartesian(
                        {
                            lng: position.lng,
                            lat: position.lat,
                            alt: position.alt + 500
                        }
                    )
                    var cartesian4Center1 = new Cesium.Cartesian4(
                        cartesian3Center1.x,
                        cartesian3Center1.y,
                        cartesian3Center1.z,
                        1
                    )

                    var cartesian3Center2 = this.transformWGS84ToCartesian(
                        {
                            lng: position.lng + 0.001,
                            lat: position.lat,
                            alt: position.alt
                        }
                    )
                    var cartesian4Center2 = new Cesium.Cartesian4(
                        cartesian3Center2.x,
                        cartesian3Center2.y,
                        cartesian3Center2.z,
                        1
                    )
                    var _time = new Date().getTime()
                    var _RotateQ = new Cesium.Quaternion()
                    var _RotateM = new Cesium.Matrix3()
                    var _scratchCartesian4Center = new Cesium.Cartesian4()
                    var _scratchCartesian4Center1 = new Cesium.Cartesian4()
                    var _scratchCartesian4Center2 = new Cesium.Cartesian4()
                    var _scratchCartesian3Normal = new Cesium.Cartesian3()
                    var _scratchCartesian3Normal1 = new Cesium.Cartesian3()
                    var _delegate = new Cesium.PostProcessStage({
                        name: id,
                        fragmentShader: this._getRadarScanShader({ border: border, width: width, get: true }),
                        uniforms: {
                            u_scanCenterEC: function () {
                                return Cesium.Matrix4.multiplyByVector(
                                    $this._viewer.camera._viewMatrix,
                                    cartesian4Center,
                                    _scratchCartesian4Center
                                )
                            },
                            u_scanPlaneNormalEC: function () {
                                var temp = Cesium.Matrix4.multiplyByVector(
                                    $this._viewer.camera._viewMatrix,
                                    cartesian4Center,
                                    _scratchCartesian4Center
                                )
                                var temp1 = Cesium.Matrix4.multiplyByVector(
                                    $this._viewer.camera._viewMatrix,
                                    cartesian4Center1,
                                    _scratchCartesian4Center1
                                )
                                _scratchCartesian3Normal.x = temp1.x - temp.x
                                _scratchCartesian3Normal.y = temp1.y - temp.y
                                _scratchCartesian3Normal.z = temp1.z - temp.z
                                Cesium.Cartesian3.normalize(
                                    _scratchCartesian3Normal,
                                    _scratchCartesian3Normal
                                )
                                return _scratchCartesian3Normal
                            },

                            u_scanLineNormalEC: function () {
                                var temp = Cesium.Matrix4.multiplyByVector(
                                    $this._viewer.camera._viewMatrix,
                                    cartesian4Center,
                                    _scratchCartesian4Center
                                )
                                var temp1 = Cesium.Matrix4.multiplyByVector(
                                    $this._viewer.camera._viewMatrix,
                                    cartesian4Center1,
                                    _scratchCartesian4Center1
                                )
                                var temp2 = Cesium.Matrix4.multiplyByVector(
                                    $this._viewer.camera._viewMatrix,
                                    cartesian4Center2,
                                    _scratchCartesian4Center2
                                )

                                _scratchCartesian3Normal.x = temp1.x - temp.x
                                _scratchCartesian3Normal.y = temp1.y - temp.y
                                _scratchCartesian3Normal.z = temp1.z - temp.z

                                Cesium.Cartesian3.normalize(
                                    _scratchCartesian3Normal,
                                    _scratchCartesian3Normal
                                )

                                _scratchCartesian3Normal1.x = temp2.x - temp.x
                                _scratchCartesian3Normal1.y = temp2.y - temp.y
                                _scratchCartesian3Normal1.z = temp2.z - temp.z

                                var tempTime =
                                    ((new Date().getTime() - _time) % duration) / duration
                                Cesium.Quaternion.fromAxisAngle(
                                    _scratchCartesian3Normal,
                                    tempTime * Cesium.Math.PI * 2,
                                    _RotateQ
                                )
                                Cesium.Matrix3.fromQuaternion(_RotateQ, _RotateM)
                                Cesium.Matrix3.multiplyByVector(
                                    _RotateM,
                                    _scratchCartesian3Normal1,
                                    _scratchCartesian3Normal1
                                )
                                Cesium.Cartesian3.normalize(
                                    _scratchCartesian3Normal1,
                                    _scratchCartesian3Normal1
                                )
                                return _scratchCartesian3Normal1
                            },
                            u_radius: radius,
                            u_scanColor: color
                        }
                    })

                    this._viewer.scene.postProcessStages.add(_delegate)

                    return _delegate;
                }
            }

        }
        /**
         * 画笔模块
         * @param {*} viewer 
         */
        function Draw(viewer) {

            if (viewer) {

                this._drawLayer = new Cesium.CustomDataSource('drawLayer')

                viewer && viewer.dataSources.add(this._drawLayer)
            }
        }
        Draw.prototype = {
            /**
             * 画点
             * @param {*} options 
             */
            drawPointGraphics: function (options) {
                options = options || {}
                options.style = options.style ||
                {
                    image: 'data/images/file/location4.png',
                    width: 35,
                    height: 40,
                    clampToGround: true,
                    scale: 1,
                    pixelOffset: new Cesium.Cartesian2(0, -20),
                }

                if (this._viewer && options) {

                    var _poiEntity = new Cesium.Entity(), position, positions = [], poiObj, $this = this,
                        _handlers = new Cesium.ScreenSpaceEventHandler(this._viewer.scene.canvas);
                    // left
                    _handlers.setInputAction(function (movement) {

                        var cartesian = $this._viewer.scene.camera.pickEllipsoid(movement.position, $this._viewer.scene.globe.ellipsoid);
                        if (cartesian && cartesian.x) {
                            position = cartesian

                            positions.push(cartesian)
                        }
                    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
                    // right
                    _handlers.setInputAction(function (movement) {

                        _handlers.destroy()
                        _handlers = null

                        if (typeof options.callback === 'function') {

                            options.callback($this.transformCartesianArrayToWGS84Array(positions), poiObj);
                        }
                    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

                    _poiEntity.billboard = options.style
                    _poiEntity.position = new Cesium.CallbackProperty(function () {
                        return position
                    }, false)

                    poiObj = this._drawLayer.entities.add(_poiEntity)
                }
            },
            /**
             * 画线 or 测距
             * @param {*} options 
             */
            drawLineGraphics: function (options) {
                options = options || {}
                if (this._viewer && options) {

                    var positions = [], _lineEntity = new Cesium.Entity(), $this = this, lineObj,
                        _handlers = new Cesium.ScreenSpaceEventHandler(this._viewer.scene.canvas);
                    // left
                    _handlers.setInputAction(function (movement) {

                        var cartesian = $this.getCatesian3FromPX(movement.position);
                        if (cartesian && cartesian.x) {
                            if (positions.length == 0) {
                                positions.push(cartesian.clone());
                            }
                            if (options.measure) {
                                _addInfoPoint(cartesian)
                            }
                            // 绘制直线 两个点
                            if (positions.length == 2 && options.type === "straightLine") {
                                _handlers.destroy()
                                _handlers = null
                                if (typeof options.callback === 'function') {

                                    options.callback($this.transformCartesianArrayToWGS84Array(positions), lineObj);
                                }
                            }
                            positions.push(cartesian);
                        }
                    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

                    _handlers.setInputAction(function (movement) {

                        var cartesian = $this.getCatesian3FromPX(movement.endPosition);
                        if (positions.length >= 2) {
                            if (cartesian && cartesian.x) {
                                positions.pop();
                                positions.push(cartesian);
                            }
                        }
                    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    // right
                    _handlers.setInputAction(function (movement) {

                        _handlers.destroy()
                        _handlers = null

                        var cartesian = $this.getCatesian3FromPX(movement.position);
                        if (options.measure) {
                            _addInfoPoint(cartesian)
                        }
                        if (typeof options.callback === 'function') {

                            options.callback($this.transformCartesianArrayToWGS84Array(positions), lineObj);
                        }
                    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

                    _lineEntity.polyline = {
                        width: options.width || 5
                        , material: options.material || Cesium.Color.BLUE.withAlpha(0.8)
                        , clampToGround: options.clampToGround || false
                        , clampToS3M: options.clampToS3M || false
                    }
                    _lineEntity.polyline.positions = new Cesium.CallbackProperty(function () {
                        return positions
                    }, false)

                    lineObj = this._drawLayer.entities.add(_lineEntity)

                    //添加坐标点
                    function _addInfoPoint(position) {
                        _labelEntity = new Cesium.Entity()
                        _labelEntity.position = position
                        _labelEntity.point = {
                            pixelSize: 10,
                            outlineColor: Cesium.Color.BLUE,
                            outlineWidth: 5
                        }
                        _labelEntity.label = {
                            text: ($this.getPositionDistance($this.transformCartesianArrayToWGS84Array(positions)) / 1000).toFixed(4) + '公里',
                            show: true,
                            showBackground: true,
                            font: '14px monospace',
                            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                            pixelOffset: new Cesium.Cartesian2(-20, -80) //left top
                        }
                        $this._drawLayer.entities.add(_labelEntity)
                    }
                }

            },
            /**
             * 画面 or 测面积
             * @param {*} options 
             */
            drawPolygonGraphics: function (options) {

                options = options || {}
                options.style = options.style ||
                {
                    width: 3
                    , material: Cesium.Color.BLUE.withAlpha(0.8)
                    , clampToGround: true
                }
                if (this._viewer && options) {

                    var positions = [], polygon = new Cesium.PolygonHierarchy(), _polygonEntity = new Cesium.Entity(), $this = this, polyObj = null, _label = '',
                        _handler = new Cesium.ScreenSpaceEventHandler(this._viewer.scene.canvas);
                    // left
                    _handler.setInputAction(function (movement) {

                        var cartesian = $this.getCatesian3FromPX(movement.position);
                        if (cartesian && cartesian.x) {
                            if (positions.length == 0) {
                                polygon.positions.push(cartesian.clone())
                                positions.push(cartesian.clone());
                            }
                            positions.push(cartesian.clone());
                            polygon.positions.push(cartesian.clone())

                            if (!polyObj) create()
                        }
                    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
                    // mouse
                    _handler.setInputAction(function (movement) {

                        var cartesian = $this.getCatesian3FromPX(movement.endPosition);
                        if (positions.length >= 2) {
                            if (cartesian && cartesian.x) {
                                positions.pop()
                                positions.push(cartesian);
                                polygon.positions.pop()
                                polygon.positions.push(cartesian);
                            }
                        }
                    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

                    // right
                    _handler.setInputAction(function (movement) {
                        _handler.destroy();

                        positions.push(positions[0]);

                        if (options.height) { //立体
                            _polygonEntity.polygon.extrudedHeight = options.height
                            _polygonEntity.polygon.material = Cesium.Color.BLUE.withAlpha(0.5)
                        }
                        if (options.measure) { // 量测
                            _addInfoPoint(positions[0])
                        }
                        if (typeof options.callback === 'function') {

                            options.callback($this.transformCartesianArrayToWGS84Array(positions), polyObj);
                        }
                    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

                    function create() {
                        _polygonEntity.polyline = options.style

                        _polygonEntity.polyline.positions = new Cesium.CallbackProperty(function () {
                            return positions
                        }, false)

                        _polygonEntity.polygon = {

                            hierarchy: new Cesium.CallbackProperty(function () {
                                return polygon
                            }, false),

                            material: Cesium.Color.WHITE.withAlpha(0.1)
                            , clampToGround: options.clampToGround || false
                        }
                        _polygonEntity.clampToS3M = true

                        polyObj = $this._drawLayer.entities.add(_polygonEntity)
                    }

                    function _addInfoPoint(position) {
                        var _labelEntity = new Cesium.Entity()
                        _labelEntity.position = position
                        _labelEntity.point = {
                            pixelSize: 10,
                            outlineColor: Cesium.Color.BLUE,
                            outlineWidth: 5
                        }
                        _labelEntity.label = {
                            text: ($this.getPositionsArea($this.transformCartesianArrayToWGS84Array(positions)) / 1000000.0).toFixed(4) + '平方公里',
                            show: true,
                            showBackground: true,
                            font: '14px monospace',
                            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                            pixelOffset: new Cesium.Cartesian2(-20, -50) //left top
                        }
                        $this._drawLayer.entities.add(_labelEntity)
                    }
                }

            },
            /**
             * 画矩形
             * @param {*} options 
             */
            drawRectangleGraphics: function (options) {
                options = options || {}
                options.style = options.style ||
                {
                    width: 3
                    , material: Cesium.Color.BLUE.withAlpha(0.5)
                    , clampToGround: true
                }
                if (this._viewer && options) {

                    var _positions = [], _rectangleEntity = new Cesium.Entity(), _coordinates = new Cesium.Rectangle(), $this = this, rectangleObj,
                        _handler = new Cesium.ScreenSpaceEventHandler(this._viewer.scene.canvas);
                    // left
                    _handler.setInputAction(function (movement) {

                        var cartesian = $this.getCatesian3FromPX(movement.position);
                        if (cartesian && cartesian.x) {

                            if (_positions.length == 0) {

                                _positions.push(cartesian.clone());
                            } else {
                                _handler.destroy();

                                _positions.push(cartesian.clone());

                                _coordinates = Cesium.Rectangle.fromCartesianArray([..._positions, cartesian], Cesium.Ellipsoid.WGS84)

                                if (typeof options.callback === 'function') {

                                    options.callback($this.transformCartesianArrayToWGS84Array(_positions), rectangleObj);
                                }
                            }
                        }
                    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
                    // mouse
                    _handler.setInputAction(function (movement) {

                        var cartesian = $this.getCatesian3FromPX(movement.endPosition);

                        if (cartesian) {

                            _coordinates = Cesium.Rectangle.fromCartesianArray([..._positions, cartesian], Cesium.Ellipsoid.WGS84)

                        }
                    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

                    _rectangleEntity.rectangle = options.style

                    if (options.height) _rectangleEntity.rectangle.extrudedHeight = options.height
                    _rectangleEntity.rectangle.coordinates = new Cesium.CallbackProperty(function () {
                        return _coordinates
                    }, false)
                    rectangleObj = this._drawLayer.entities.add(_rectangleEntity)
                }
            },
            /**
             * 画圆
             * @param {*} options 
             */
            drawCircleGraphics: function (options) {
                options = options || {}
                options.style = options.style ||
                {
                    width: 3
                    , material: Cesium.Color.BLUE.withAlpha(0.5)
                    , clampToGround: true
                }
                if (this._viewer && options) {

                    var _center = undefined, _circleEntity = new Cesium.Entity(), $this = this, circleObj, _radius = 1
                    _handler = new Cesium.ScreenSpaceEventHandler(this._viewer.scene.canvas);

                    // 计算半径
                    function computeRadius(src, dest) {
                        let srcCartographic = Cesium.Cartographic.fromCartesian(src)
                        let destCartographic = Cesium.Cartographic.fromCartesian(dest)
                        let geodesic = new Cesium.EllipsoidGeodesic()
                        geodesic.setEndPoints(srcCartographic, destCartographic)
                        let s = geodesic.surfaceDistance
                        _radius = Math.sqrt( //开平方
                            Math.pow(s, 2) +
                            Math.pow(destCartographic.height - srcCartographic.height, 2)
                        )
                    }
                    //
                    function drawGraphics() {

                        _circleEntity.ellipse = options.style
                        _circleEntity.ellipse.semiMajorAxis = new Cesium.CallbackProperty(function () {
                            return _radius
                        }, false)
                        _circleEntity.ellipse.semiMinorAxis = new Cesium.CallbackProperty(function () {
                            return _radius
                        }, false)
                        _circleEntity.position = new Cesium.CallbackProperty(function () {
                            return _center
                        }, false)

                        _circleEntity.point = {
                            pixelSize: 5,
                            outlineColor: Cesium.Color.RED,
                            outlineWidth: 3
                        }

                        if (options.height) _circleEntity.ellipse.extrudedHeight = options.height

                        circleObj = $this._drawLayer.entities.add(_circleEntity)
                    }
                    // left
                    _handler.setInputAction(function (movement) {

                        var cartesian = $this.getCatesian3FromPX(movement.position);

                        if (cartesian && cartesian.x) {
                            if (!_center) {

                                _center = cartesian

                                drawGraphics()

                            } else {

                                computeRadius(_center, cartesian)

                                _handler.destroy();

                                if (typeof options.callback === 'function') {

                                    options.callback({ center: _center, radius: _radius }, circleObj);
                                }
                            }
                        }
                    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
                    // mouse
                    _handler.setInputAction(function (movement) {

                        var cartesian = $this._viewer.scene.camera.pickEllipsoid(movement.endPosition, $this._viewer.scene.globe.ellipsoid);
                        if (_center && cartesian && cartesian.x) {

                            computeRadius(_center, cartesian)
                        }
                    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                }
            },
            /**
             * 画三角量测
             * @param {*} options 
             */
            drawTrianglesGraphics: function (options) {
                options = options || {}
                options.style = options.style ||
                {
                    width: 3
                    , material: Cesium.Color.BLUE.withAlpha(0.5)
                }
                if (this._viewer && options) {

                    var _trianglesEntity = new Cesium.Entity(), _tempLineEntity = new Cesium.Entity(), _tempLineEntity2 = new Cesium.Entity(),
                        _positions = [], _tempPoints = [], _tempPoints2 = [], $this = this,
                        _handler = new Cesium.ScreenSpaceEventHandler(this._viewer.scene.canvas);
                    // 高度
                    function _getHeading(startPosition, endPosition) {
                        if (!startPosition && !endPosition) return 0
                        if (Cesium.Cartesian3.equals(startPosition, endPosition)) return 0
                        let cartographic = Cesium.Cartographic.fromCartesian(startPosition);
                        let cartographic2 = Cesium.Cartographic.fromCartesian(endPosition);
                        return (cartographic2.height - cartographic.height).toFixed(2)
                    }
                    // 偏移点
                    function _computesHorizontalLine(positions) {
                        let cartographic = Cesium.Cartographic.fromCartesian(positions[0]);
                        let cartographic2 = Cesium.Cartographic.fromCartesian(positions[1]);
                        return Cesium.Cartesian3.fromDegrees(
                            Cesium.Math.toDegrees(cartographic.longitude),
                            Cesium.Math.toDegrees(cartographic.latitude),
                            cartographic2.height
                        )
                    }
                    // left
                    _handler.setInputAction(function (movement) {

                        var position = $this.getCatesian3FromPX(movement.position);
                        if (!position) return false
                        if (_positions.length == 0) {
                            _positions.push(position.clone())
                            _positions.push(position.clone())
                            _tempPoints.push(position.clone())
                            _tempPoints.push(position.clone())
                        } else {
                            _handler.destroy();
                            if (typeof options.callback === 'function') {

                                options.callback({ e: _trianglesEntity, e2: _tempLineEntity, e3: _tempLineEntity2 });
                            }
                        }
                    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
                    // mouse
                    _handler.setInputAction(function (movement) {

                        var position = $this.getCatesian3FromPX(movement.endPosition);
                        if (position && _positions.length > 0) {
                            //直线
                            _positions.pop()
                            _positions.push(position.clone());
                            let horizontalPosition = _computesHorizontalLine(_positions)
                            //高度
                            _tempPoints.pop()
                            _tempPoints.push(horizontalPosition.clone())
                            //水平线
                            _tempPoints2.pop(), _tempPoints2.pop()
                            _tempPoints2.push(position.clone())
                            _tempPoints2.push(horizontalPosition.clone())
                        }
                    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

                    // create entity

                    //直线
                    _trianglesEntity.polyline = {
                        positions: new Cesium.CallbackProperty(function () {
                            return _positions
                        }, false),
                        ...options.style
                    }
                    _trianglesEntity.position = new Cesium.CallbackProperty(function () {
                        return _positions[0]
                    }, false)
                    _trianglesEntity.point = {
                        pixelSize: 5,
                        outlineColor: Cesium.Color.BLUE,
                        outlineWidth: 5
                    }
                    _trianglesEntity.label = {
                        text: new Cesium.CallbackProperty(function () {
                            return '直线:' + $this.getPositionDistance($this.transformCartesianArrayToWGS84Array(_positions)) + '米'
                        }, false),
                        show: true,
                        showBackground: true,
                        font: '14px monospace',
                        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(50, -100) //left top
                    }
                    //高度
                    _tempLineEntity.polyline = {
                        positions: new Cesium.CallbackProperty(function () {
                            return _tempPoints
                        }, false),
                        ...options.style
                    }
                    _tempLineEntity.position = new Cesium.CallbackProperty(function () {
                        return _tempPoints2[1]
                    }, false)
                    _tempLineEntity.point = {
                        pixelSize: 5,
                        outlineColor: Cesium.Color.BLUE,
                        outlineWidth: 5
                    }
                    _tempLineEntity.label = {
                        text: new Cesium.CallbackProperty(function () {
                            return '高度:' + _getHeading(_tempPoints[0], _tempPoints[1]) + '米'
                        }, false),
                        show: true,
                        showBackground: true,
                        font: '14px monospace',
                        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(-20, 100) //left top
                    }
                    //水平
                    _tempLineEntity2.polyline = {
                        positions: new Cesium.CallbackProperty(function () {
                            return _tempPoints2
                        }, false),
                        ...options.style
                    }
                    _tempLineEntity2.position = new Cesium.CallbackProperty(function () {
                        return _positions[1]
                    }, false)
                    _tempLineEntity2.point = {
                        pixelSize: 5,
                        outlineColor: Cesium.Color.BLUE,
                        outlineWidth: 5
                    }
                    _tempLineEntity2.label = {
                        text: new Cesium.CallbackProperty(function () {
                            return '水平距离:' + $this.getPositionDistance($this.transformCartesianArrayToWGS84Array(_tempPoints2)) + '米'
                        }, false),
                        show: true,
                        showBackground: true,
                        font: '14px monospace',
                        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(-150, -20) //left top
                    }
                    this._drawLayer.entities.add(_tempLineEntity2)
                    this._drawLayer.entities.add(_tempLineEntity)
                    this._drawLayer.entities.add(_trianglesEntity)
                }
            },
            /**
             * 画围栏
             * @param {*} options 
             */
            drawWallGraphics: function (options) {
                options = options || {}
                options.style = options.style ||
                {
                    material: Cesium.Color.BLUE.withAlpha(0.5),
                    outline: true,
                    outlineColor: Cesium.Color.WHITE
                }
                if (this._viewer && options) {
                    var $this = this;
                    this.drawPolygonGraphics({
                        callback: function (polygon, polygonObj) {

                            var wallEntity = $this._drawLayer.entities.add({
                                wall: {
                                    positions: $this.transformWGS84ArrayToCartesianArray(polygon),
                                    ...options.style
                                }
                            })
                            if (typeof options.callback === 'function') {

                                options.callback(polygon, wallEntity);
                            }
                        }
                    })
                }
            },
            /**
             * 绘制球体
             * @param {*} options 
             */
            drawEllipsoidGraphics: function (options) {
                options = options || {}
                options.style = options.style || {}
                if (this._viewer && options) {
                    var $this = this;
                    this.drawCircleGraphics({
                        callback: function (result, obj) {

                            var entity = $this.createGraphics()
                            entity.ellipsoid = $this.getEllipsoidGraphics({
                                radii: result.radius
                            })
                            entity.position = result.center

                            $this._drawLayer.entities.remove(obj)

                            var ellipsoidObj = $this._drawLayer.entities.add(entity)

                            if (typeof options.callback === 'function') {

                                options.callback({ center: result.center, radius: result.radius }, ellipsoidObj);
                            }
                        }
                    })
                }
            },
            /**
             * 绘制圆柱体 or 圆锥
             * @param {*} options 
             */
            drawCylinderGraphics: function (options) {
                options = options || {}
                options.style = options.style || {}
                if (this._viewer && options) {
                    var $this = this;
                    this.drawCircleGraphics({
                        callback: function (result, obj) {

                            var cylinderObj = $this._drawLayer.entities.add({
                                position: result.center,
                                cylinder: {
                                    length: result.radius * 2 || options.length,
                                    topRadius: options.topRadius || result.radius,
                                    bottomRadius: options.bottomRadius || result.radius,
                                    material: Cesium.Color.BLUE.withAlpha(0.5),
                                    outline: true,
                                    outlineColor: Cesium.Color.WHITE,
                                },
                            })
                            $this._drawLayer.entities.remove(obj)

                            if (typeof options.callback === 'function') {

                                options.callback({ center: result.center, radius: result.radius }, cylinderObj);
                            }
                        }
                    })
                }
            },
            /**
             * 绘制走廊
             * @param {*} options 
             */
            drawCorridorGraphics: function (options) {
                options = options || {}
                options.style = options.style || {}
                if (this._viewer && options) {
                    var $this = this;
                    $this.drawLineGraphics({
                        callback: function (line, lineObj) {

                            var entity = $this.createGraphics()
                            entity.corridor = {
                                positions: $this.transformWGS84ArrayToCartesianArray(line),
                                height: options.height || 1,
                                width: options.width || 100,
                                cornerType: Cesium.CornerType.BEVELED,
                                extrudedHeight: options.extrudedHeight || 1,
                                material: Cesium.Color.BLUE.withAlpha(0.5),
                                outline: true, // height required for outlines to display
                                outlineColor: Cesium.Color.WHITE
                            }

                            $this._drawLayer.entities.remove(lineObj)

                            var corridorObj = $this._drawLayer.entities.add(entity)

                            if (typeof options.callback === 'function') {

                                options.callback(line, corridorObj);
                            }
                        }
                    })
                }
            },
            /**
            * 绘制管道
            * @param {*} options 
            */
            drawPolylineVolumeGraphics: function (options) {
                options = options || {}
                options.style = options.style || {}
                if (this._viewer && options) {
                    var $this = this;
                    $this.drawLineGraphics({
                        callback: function (line, lineObj) {

                            var entity = $this.createGraphics()
                            entity.polylineVolume = {
                                positions: $this.transformWGS84ArrayToCartesianArray(line),
                                shape: $this.computeStar2d(7, 1500, 3000),
                                cornerType: Cesium.CornerType.MITERED,
                                material: Cesium.Color.BLUE,
                            }
                            $this._drawLayer.entities.remove(lineObj)

                            var polylineVolumeObj = $this._drawLayer.entities.add(entity)

                            if (typeof options.callback === 'function') {

                                options.callback(line, polylineVolumeObj);
                            }
                        }
                    })
                }
            }
        }
        /**
         * 平面数学工具
         * 二维模块
         * @param {*} viewer 
         */
        function Math2d(viewer) { }
        Math2d.prototype = {
            /**
             * 计算两个坐标之间的距离
             * @param pnt1
             * @param pnt2
             * @returns {number}
             * @constructor
             */
            mathDistance2d: function (pnt1, pnt2) {
                return (Math.sqrt(Math.pow((pnt1[0] - pnt2[0]), 2) + Math.pow((pnt1[1] - pnt2[1]), 2)))
            },
            /**
             * 求圆周上等分点的坐标
             * @param {*} r r为半径
             * @param {*} ox ox,oy为圆心坐标
             * @param {*} oy d
             * @param {*} count count为等分个数
             */
            getCirclePoints2d: function (r, ox, oy, count) {
                var point = []; //结果
                var radians = (Math.PI / 180) * Math.round(360 / count), //弧度
                    i = 0;
                for (; i < count; i++) {
                    var x = ox + r * Math.sin(radians * i),
                        y = oy + r * Math.cos(radians * i);
                    point.unshift({ x: x, y: y }); //为保持数据顺时针
                }
                return point
            },
            /**
             * 计算点集合的总距离
             * @param points
             * @returns {number}
             */
            wholeDistance2d: function (points) {
                let distance = 0
                if (points && Array.isArray(points) && points.length > 0) {
                    points.forEach((item, index) => {
                        if (index < points.length - 1) {
                            distance += (this.mathDistance2d(item, points[index + 1]))
                        }
                    })
                }
                return distance
            },
            /**
             * 获取基础长度
             * @param points
             * @returns {number}
             */
            getBaseLength2d: function (points) {
                return Math.pow(this.wholeDistance2d(points), 0.99)
            },
            /**
             * 计算星型
             * @param {*} arms 
             * @param {*} rOuter 
             * @param {*} rInner 
             */
            computeStar2d(arms, rOuter, rInner) {
                var angle = Math.PI / arms;
                var length = 2 * arms;
                var positions = new Array(length);
                for (var i = 0; i < length; i++) {
                    var r = i % 2 === 0 ? rOuter : rInner;
                    positions[i] = new Cesium.Cartesian2(
                        Math.cos(i * angle) * r,
                        Math.sin(i * angle) * r
                    );
                }
                return positions;
            },
            /**
             * 求取两个坐标的中间值
             * @param point1
             * @param point2
             * @returns {[*,*]}
             * @constructor
             */
            mid2d: function (point1, point2) {
                return [(point1[0] + point2[0]) / 2, (point1[1] + point2[1]) / 2]
            },

            /**
             * 通过三个点确定一个圆的中心点
             * @param point1
             * @param point2
             * @param point3
             */
            getCircleCenterOfThreePoints2d: function (point1, point2, point3) {
                let pntA = [(point1[0] + point2[0]) / 2, (point1[1] + point2[1]) / 2]
                let pntB = [pntA[0] - point1[1] + point2[1], pntA[1] + point1[0] - point2[0]]
                let pntC = [(point1[0] + point3[0]) / 2, (point1[1] + point3[1]) / 2]
                let pntD = [pntC[0] - point1[1] + point3[1], pntC[1] + point1[0] - point3[0]]
                return this.getIntersectPoint2d(pntA, pntB, pntC, pntD)
            },

            /**
             * 获取交集的点
             * @param pntA
             * @param pntB
             * @param pntC
             * @param pntD
             * @returns {[*,*]}
             */
            getIntersectPoint2d: function (pntA, pntB, pntC, pntD) {
                if (pntA[1] === pntB[1]) {
                    let f = (pntD[0] - pntC[0]) / (pntD[1] - pntC[1])
                    let x = f * (pntA[1] - pntC[1]) + pntC[0]
                    let y = pntA[1]
                    return [x, y]
                }
                if (pntC[1] === pntD[1]) {
                    let e = (pntB[0] - pntA[0]) / (pntB[1] - pntA[1])
                    let x = e * (pntC[1] - pntA[1]) + pntA[0]
                    let y = pntC[1]
                    return [x, y]
                }
                let e = (pntB[0] - pntA[0]) / (pntB[1] - pntA[1])
                let f = (pntD[0] - pntC[0]) / (pntD[1] - pntC[1])
                let y = (e * pntA[1] - pntA[0] - f * pntC[1] + pntC[0]) / (e - f)
                let x = e * y - e * pntA[1] + pntA[0]
                return [x, y]
            },

            /**
             * 获取方位角（地平经度）
             * @param startPoint
             * @param endPoint
             * @returns {*}
             */
            getAzimuth2d: function (startPoint, endPoint) {
                let azimuth
                let angle = Math.asin(Math.abs(endPoint[1] - startPoint[1]) / (this.mathDistance2d(startPoint, endPoint)))
                if (endPoint[1] >= startPoint[1] && endPoint[0] >= startPoint[0]) {
                    azimuth = angle + Math.PI
                } else if (endPoint[1] >= startPoint[1] && endPoint[0] < startPoint[0]) {
                    azimuth = Math.PI * 2 - angle
                } else if (endPoint[1] < startPoint[1] && endPoint[0] < startPoint[0]) {
                    azimuth = angle
                } else if (endPoint[1] < startPoint[1] && endPoint[0] >= startPoint[0]) {
                    azimuth = Math.PI - angle
                }
                return azimuth
            },

            /**
             * 通过三个点获取方位角
             * @param pntA
             * @param pntB
             * @param pntC
             * @returns {number}
             */
            getAngleOfThreePoints2d: function (pntA, pntB, pntC) {
                let angle = this.getAzimuth2d(pntB, pntA) - this.getAzimuth2d(pntB, pntC)
                return ((angle < 0) ? (angle + Math.PI * 2) : angle)
            },

            /**
             * 判断是否是顺时针
             * @param pnt1
             * @param pnt2
             * @param pnt3
             * @returns {boolean}
             */
            isClockWise2d: function (pnt1, pnt2, pnt3) {
                return ((pnt3[1] - pnt1[1]) * (pnt2[0] - pnt1[0]) > (pnt2[1] - pnt1[1]) * (pnt3[0] - pnt1[0]))
            },

            /**
             * 获取线上的点
             * @param t
             * @param startPnt
             * @param endPnt
             * @returns {[*,*]}
             */
            getPointOnLine2d: function (t, startPnt, endPnt) {
                let x = startPnt[0] + (t * (endPnt[0] - startPnt[0]))
                let y = startPnt[1] + (t * (endPnt[1] - startPnt[1]))
                return [x, y]
            },

            /**
             * 获取立方值
             * @param t
             * @param startPnt
             * @param cPnt1
             * @param cPnt2
             * @param endPnt
             * @returns {[*,*]}
             */
            getCubicValue2d: function (t, startPnt, cPnt1, cPnt2, endPnt) {
                t = Math.max(Math.min(t, 1), 0)
                let [tp, t2] = [(1 - t), (t * t)]
                let t3 = t2 * t
                let tp2 = tp * tp
                let tp3 = tp2 * tp
                let x = (tp3 * startPnt[0]) + (3 * tp2 * t * cPnt1[0]) + (3 * tp * t2 * cPnt2[0]) + (t3 * endPnt[0])
                let y = (tp3 * startPnt[1]) + (3 * tp2 * t * cPnt1[1]) + (3 * tp * t2 * cPnt2[1]) + (t3 * endPnt[1])
                return [x, y]
            },

            /**
             * 根据起止点和旋转方向求取第三个点
             * @param startPnt
             * @param endPnt
             * @param angle
             * @param distance
             * @param clockWise
             * @returns {[*,*]}
             */
            getThirdPoint2d: function (startPnt, endPnt, angle, distance, clockWise) {
                let azimuth = this.getAzimuth2d(startPnt, endPnt)
                let alpha = clockWise ? (azimuth + angle) : (azimuth - angle)
                let dx = distance * Math.cos(alpha)
                let dy = distance * Math.sin(alpha)
                return ([endPnt[0] + dx, endPnt[1] + dy])
            },

            /**
             * 函数继承
             * @param childCtor
             * @param parentCtor
             */
            inherits2d: function (childCtor, parentCtor) {
                /** @constructor */
                function TempCtor() {
                }

                TempCtor.prototype = parentCtor.prototype
                childCtor.superClass_ = parentCtor.prototype
                childCtor.prototype = new TempCtor()
                /** @override */
                childCtor.prototype.constructor = childCtor
                childCtor.base = function (me, methodName, varArgs) {
                    let args = Array.prototype.slice.call(arguments, 2)
                    return parentCtor.prototype[methodName].apply(me, args)
                }
            },

            /**
             * 插值弓形线段点
             * @param center
             * @param radius
             * @param startAngle
             * @param endAngle
             * @returns {null}
             */
            getArcPoints2d: function (center, radius, startAngle, endAngle) {
                let [x, y, pnts, angleDiff] = [null, null, [], (endAngle - startAngle)]
                angleDiff = ((angleDiff < 0) ? (angleDiff + (Math.PI * 2)) : angleDiff)
                for (let i = 0; i <= 100; i++) {
                    let angle = startAngle + angleDiff * i / 100
                    x = center[0] + radius * Math.cos(angle)
                    y = center[1] + radius * Math.sin(angle)
                    pnts.push([x, y])
                }
                return pnts
            },

            /**
             * getBisectorNormals
             * @param t
             * @param pnt1
             * @param pnt2
             * @param pnt3
             * @returns {[*,*]}
             */
            getBisectorNormals2d: function (t, pnt1, pnt2, pnt3) {
                let normal = this.getNormal2d(pnt1, pnt2, pnt3)
                let [bisectorNormalRight, bisectorNormalLeft, dt, x, y] = [null, null, null, null, null]
                let dist = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1])
                let uX = normal[0] / dist
                let uY = normal[1] / dist
                let d1 = this.mathDistance2d(pnt1, pnt2)
                let d2 = this.mathDistance2d(pnt2, pnt3)
                if (dist > 0.0001) {
                    if (this.isClockWise(pnt1, pnt2, pnt3)) {
                        dt = t * d1
                        x = pnt2[0] - dt * uY
                        y = pnt2[1] + dt * uX
                        bisectorNormalRight = [x, y]
                        dt = t * d2
                        x = pnt2[0] + dt * uY
                        y = pnt2[1] - dt * uX
                        bisectorNormalLeft = [x, y]
                    } else {
                        dt = t * d1
                        x = pnt2[0] + dt * uY
                        y = pnt2[1] - dt * uX
                        bisectorNormalRight = [x, y]
                        dt = t * d2
                        x = pnt2[0] - dt * uY
                        y = pnt2[1] + dt * uX
                        bisectorNormalLeft = [x, y]
                    }
                } else {
                    x = pnt2[0] + t * (pnt1[0] - pnt2[0])
                    y = pnt2[1] + t * (pnt1[1] - pnt2[1])
                    bisectorNormalRight = [x, y]
                    x = pnt2[0] + t * (pnt3[0] - pnt2[0])
                    y = pnt2[1] + t * (pnt3[1] - pnt2[1])
                    bisectorNormalLeft = [x, y]
                }
                return [bisectorNormalRight, bisectorNormalLeft]
            },

            /**
             * 获取默认三点的内切圆
             * @param pnt1
             * @param pnt2
             * @param pnt3
             * @returns {[*,*]}
             */
            getNormal2d: function (pnt1, pnt2, pnt3) {
                let dX1 = pnt1[0] - pnt2[0]
                let dY1 = pnt1[1] - pnt2[1]
                let d1 = Math.sqrt(dX1 * dX1 + dY1 * dY1)
                dX1 /= d1
                dY1 /= d1
                let dX2 = pnt3[0] - pnt2[0]
                let dY2 = pnt3[1] - pnt2[1]
                let d2 = Math.sqrt(dX2 * dX2 + dY2 * dY2)
                dX2 /= d2
                dY2 /= d2
                let uX = dX1 + dX2
                let uY = dY1 + dY2
                return [uX, uY]
            },

            /**
             * 获取左边控制点
             * @param controlPoints
             * @returns {[*,*]}
             */
            getLeftMostControlPoint2d: function (controlPoints, t) {
                let [pnt1, pnt2, pnt3, controlX, controlY] = [controlPoints[0], controlPoints[1], controlPoints[2], null, null]
                let pnts = this.getBisectorNormals2d(0, pnt1, pnt2, pnt3)
                let normalRight = pnts[0]
                let normal = this.getNormal2d(pnt1, pnt2, pnt3)
                let dist = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1])
                if (dist > 0.0001) {
                    let mid = this.mid2d(pnt1, pnt2)
                    let pX = pnt1[0] - mid[0]
                    let pY = pnt1[1] - mid[1]
                    let d1 = this.mathDistance2d(pnt1, pnt2)
                    let n = 2.0 / d1
                    let nX = -n * pY
                    let nY = n * pX
                    let a11 = nX * nX - nY * nY
                    let a12 = 2 * nX * nY
                    let a22 = nY * nY - nX * nX
                    let dX = normalRight[0] - mid[0]
                    let dY = normalRight[1] - mid[1]
                    controlX = mid[0] + a11 * dX + a12 * dY
                    controlY = mid[1] + a12 * dX + a22 * dY
                } else {
                    controlX = pnt1[0] + t * (pnt2[0] - pnt1[0])
                    controlY = pnt1[1] + t * (pnt2[1] - pnt1[1])
                }
                return [controlX, controlY]
            },

            /**
             * 获取右边控制点
             * @param controlPoints
             * @param t
             * @returns {[*,*]}
             */
            getRightMostControlPoint2d: function (controlPoints, t) {
                let count = controlPoints.length
                let pnt1 = controlPoints[count - 3]
                let pnt2 = controlPoints[count - 2]
                let pnt3 = controlPoints[count - 1]
                let pnts = this.getBisectorNormals2d(0, pnt1, pnt2, pnt3)
                let normalLeft = pnts[1]
                let normal = this.getNormal2d(pnt1, pnt2, pnt3)
                let dist = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1])
                let [controlX, controlY] = [null, null]
                if (dist > 0.0001) {
                    let mid = this.mid2d(pnt2, pnt3)
                    let pX = pnt3[0] - mid[0]
                    let pY = pnt3[1] - mid[1]
                    let d1 = this.mathDistance2d(pnt2, pnt3)
                    let n = 2.0 / d1
                    let nX = -n * pY
                    let nY = n * pX
                    let a11 = nX * nX - nY * nY
                    let a12 = 2 * nX * nY
                    let a22 = nY * nY - nX * nX
                    let dX = normalLeft[0] - mid[0]
                    let dY = normalLeft[1] - mid[1]
                    controlX = mid[0] + a11 * dX + a12 * dY
                    controlY = mid[1] + a12 * dX + a22 * dY
                } else {
                    controlX = pnt3[0] + t * (pnt2[0] - pnt3[0])
                    controlY = pnt3[1] + t * (pnt2[1] - pnt3[1])
                }
                return [controlX, controlY]
            },

            /**
             * 插值曲线点
             * @param t
             * @param controlPoints
             * @returns {null}
             */
            getCurvePoints2d: function (t, controlPoints) {
                let leftControl = this.getLeftMostControlPoint2d(controlPoints, t)
                let [pnt1, pnt2, pnt3, normals, points] = [null, null, null, [leftControl], []]
                for (let i = 0; i < controlPoints.length - 2; i++) {
                    [pnt1, pnt2, pnt3] = [controlPoints[i], controlPoints[i + 1], controlPoints[i + 2]]
                    let normalPoints = this.getBisectorNormals2d(t, pnt1, pnt2, pnt3)
                    normals = normals.concat(normalPoints)
                }
                let rightControl = this.getRightMostControlPoint2d(controlPoints, t)
                if (rightControl) {
                    normals.push(rightControl)
                }
                for (let i = 0; i < controlPoints.length - 1; i++) {
                    pnt1 = controlPoints[i]
                    pnt2 = controlPoints[i + 1]
                    points.push(pnt1)
                    for (let t = 0; t < 100; t++) {
                        let pnt = this.getCubicValue2d(t / 100, pnt1, normals[i * 2], normals[i * 2 + 1], pnt2)
                        points.push(pnt)
                    }
                    points.push(pnt2)
                }
                return points
            },

            /**
             * 贝塞尔曲线
             * @param points
             * @returns {*}
             */
            getBezierPoints2d: function (points) {
                if (points.length <= 2) {
                    return points
                } else {
                    let bezierPoints = []
                    let n = points.length - 1
                    for (let t = 0; t <= 1; t += 0.01) {
                        let [x, y] = [0, 0]
                        for (let index = 0; index <= n; index++) {
                            let factor = this.getBinomialFactor2d(n, index)
                            let a = Math.pow(t, index)
                            let b = Math.pow((1 - t), (n - index))
                            x += factor * a * b * points[index][0]
                            y += factor * a * b * points[index][1]
                        }
                        bezierPoints.push([x, y])
                    }
                    bezierPoints.push(points[n])
                    return bezierPoints
                }
            },

            /**
             * 获取阶乘数据
             * @param n
             * @returns {number}
             */
            getFactorial2d: function (n) {
                let result = 1
                switch (n) {
                    case (n <= 1):
                        result = 1
                        break
                    case (n === 2):
                        result = 2
                        break
                    case (n === 3):
                        result = 6
                        break
                    case (n === 24):
                        result = 24
                        break
                    case (n === 5):
                        result = 120
                        break
                    default:
                        for (let i = 1; i <= n; i++) {
                            result *= i
                        }
                        break
                }
                return result
            },

            /**
             * 获取二项分布
             * @param n
             * @param index
             * @returns {number}
             */
            getBinomialFactor2d: function (n, index) {
                return (this.getFactorial2d(n) / (this.getFactorial2d(index) * this.getFactorial2d(n - index)))
            },

            /**
             * 插值线性点
             * @param points
             * @returns {*}
             */
            getQBSplinePoints2d: function (points) {
                if (points.length <= 2) {
                    return points
                } else {
                    let [n, bSplinePoints] = [2, []]
                    let m = points.length - n - 1
                    bSplinePoints.push(points[0])
                    for (let i = 0; i <= m; i++) {
                        for (let t = 0; t <= 1; t += 0.05) {
                            let [x, y] = [0, 0]
                            for (let k = 0; k <= n; k++) {
                                let factor = this.getQuadricBSplineFactor2d(k, t)
                                x += factor * points[i + k][0]
                                y += factor * points[i + k][1]
                            }
                            bSplinePoints.push([x, y])
                        }
                    }
                    bSplinePoints.push(points[points.length - 1])
                    return bSplinePoints
                }
            },

            /**
             * 得到二次线性因子
             * @param k
             * @param t
             * @returns {number}
             */
            getQuadricBSplineFactor2d: function (k, t) {
                let res = 0
                if (k === 0) {
                    res = Math.pow(t - 1, 2) / 2
                } else if (k === 1) {
                    res = (-2 * Math.pow(t, 2) + 2 * t + 1) / 2
                } else if (k === 2) {
                    res = Math.pow(t, 2) / 2
                }
                return res
            }

        }
        /**
         * 三维数学工具
         * 默认三维
         * @param {*} viewer 
         */
        function Math3d(viewer) { }
        Math3d.prototype = {
            /**
             * 拆分组合坐标数组
             * @param {*} cartesianArr 
             */
            splitCartesians3: function (cartesianArr) {
                var positions = []
                for (var i = 0; i < cartesianArr.length; i += 3) {
                    var cartesian = new Cesium.Cartesian3(cartesianArr[i], cartesianArr[i + 1], cartesianArr[i + 2]);
                    positions.push(cartesian)
                }
                positions.push(positions[0])

                return positions
            },

            /**
             * 计算链路的点集
             * @param startPoint 开始节点
             * @param endPoint 结束节点
             * @param angularityFactor 曲率
             * @param numOfSingleLine 点集数量
             * @returns {Array}
             */
            getLinkedPointList: function (startPoint, endPoint, angularityFactor, numOfSingleLine) {

                if (this._viewer) {
                    var result = [];
                    var startPosition = Cesium.Cartographic.fromCartesian(startPoint);
                    var endPosition = Cesium.Cartographic.fromCartesian(endPoint);

                    var startLon = startPosition.longitude * 180 / Math.PI;
                    var startLat = startPosition.latitude * 180 / Math.PI;
                    var endLon = endPosition.longitude * 180 / Math.PI;
                    var endLat = endPosition.latitude * 180 / Math.PI;

                    var dist = Math.sqrt((startLon - endLon) * (startLon - endLon) + (startLat - endLat) * (startLat - endLat));
                    //var dist = Cesium.Cartesian3.distance(startPoint, endPoint);
                    var angularity = dist * angularityFactor;

                    var startVec = Cesium.Cartesian3.clone(startPoint);
                    var endVec = Cesium.Cartesian3.clone(endPoint);

                    var startLength = Cesium.Cartesian3.distance(startVec, Cesium.Cartesian3.ZERO);
                    var endLength = Cesium.Cartesian3.distance(endVec, Cesium.Cartesian3.ZERO);

                    Cesium.Cartesian3.normalize(startVec, startVec);
                    Cesium.Cartesian3.normalize(endVec, endVec);

                    if (Cesium.Cartesian3.distance(startVec, endVec) == 0) {
                        return result;
                    }

                    var omega = Cesium.Cartesian3.angleBetween(startVec, endVec);

                    result.push(startPoint);
                    for (var i = 1; i < numOfSingleLine - 1; i++) {
                        var t = i * 1.0 / (numOfSingleLine - 1);
                        var invT = 1 - t;

                        var startScalar = Math.sin(invT * omega) / Math.sin(omega);
                        var endScalar = Math.sin(t * omega) / Math.sin(omega);

                        var startScalarVec = Cesium.Cartesian3.multiplyByScalar(startVec, startScalar, new Cesium.Cartesian3());
                        var endScalarVec = Cesium.Cartesian3.multiplyByScalar(endVec, endScalar, new Cesium.Cartesian3());

                        var centerVec = Cesium.Cartesian3.add(startScalarVec, endScalarVec, new Cesium.Cartesian3());

                        var ht = t * Math.PI;
                        var centerLength = startLength * invT + endLength * t + Math.sin(ht) * angularity;
                        centerVec = Cesium.Cartesian3.multiplyByScalar(centerVec, centerLength, centerVec);

                        result.push(centerVec);
                    }

                    result.push(endPoint);

                    return result;
                }
            },
            /**
             * 计算两点的角度 
             * @param {*} option 
             */
            getPositionsAngle: function (option) {

                if (option) {
                    var position1 = option.position1, position2 = option.position2,
                        localToWorld_Matrix = Cesium.Transforms.eastNorthUpToFixedFrame(position1),//以a点为原点建立局部坐标系（东方向为x轴,北方向为y轴,垂直于地面为z轴），得到一个局部坐标到世界坐标转换的变换矩阵
                        worldToLocal_Matrix = Cesium.Matrix4.inverse(localToWorld_Matrix, new Cesium.Matrix4()),//求世界坐标到局部坐标的变换矩阵
                        localPosition_A = Cesium.Matrix4.multiplyByPoint(worldToLocal_Matrix, position1, new Cesium.Cartesian3()), //a点在局部坐标的位置，其实就是局部坐标原点
                        localPosition_B = Cesium.Matrix4.multiplyByPoint(worldToLocal_Matrix, position2, new Cesium.Cartesian3()), //B点在以A点为原点的局部的坐标位置
                        angle;//弧度
                    if ('pitch' === option.type) { //俯仰角

                        angle = Math.atan2((localPosition_B.z - localPosition_A.z), (localPosition_B.x - localPosition_A.x))
                    } else if ('heading ' === option.type) { //偏航角

                        angle = Math.atan2((localPosition_B.y - localPosition_A.y), (localPosition_B.x - localPosition_A.x))
                    }
                    var theta = angle * (180 / Math.PI);//角度
                    if (theta < 0) {
                        theta = theta + 360;
                    }
                    return theta;
                }
            },
            /**
             * 计算一组坐标组成的面的面积
             * @param {*} positions 
             */
            getPositionsArea: function (positions) {
                let result = 0
                if (positions) {
                    let h = 0
                    let ellipsoid = Cesium.Ellipsoid.WGS84
                    positions.push(positions[0])
                    for (let i = 1; i < positions.length; i++) {
                        let oel = ellipsoid.cartographicToCartesian(
                            this.transformWGS84ToCartographic(positions[i - 1])
                        )
                        let el = ellipsoid.cartographicToCartesian(
                            this.transformWGS84ToCartographic(positions[i])
                        )
                        h += oel.x * el.y - el.x * oel.y
                    }
                    result = Math.abs(h).toFixed(2)
                }
                return result
            },
            /**
             * 计算多边形的面积
             * @param {*} points 
             */
            getPolygonArea: function (points) {

                if (this._viewer) {

                    var Bearing = function (from, to) {
                        var lat1 = from.lat * radiansPerDegree,
                            lon1 = from.lon * radiansPerDegree,
                            lat2 = to.lat * radiansPerDegree,
                            lon2 = to.lon * radiansPerDegree, angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
                        if (angle < 0) {
                            angle += Math.PI * 2.0;
                        }
                        angle = angle * degreesPerRadian;//角度
                        return angle;
                    }

                    var Angle = function (p1, p2, p3) {
                        var bearing21 = Bearing(p2, p1),
                            bearing23 = Bearing(p2, p3),
                            angle = bearing21 - bearing23;
                        if (angle < 0) {
                            angle += 360;
                        }
                        return angle;
                    }
                    var res = 0;
                    //拆分三角曲面

                    for (var i = 0; i < points.length - 2; i++) {
                        var j = (i + 1) % points.length, k = (i + 2) % points.length,
                            totalAngle = Angle(points[i], points[j], points[k]),
                            dis_temp1 = this.getPositionsDistance(positions[i], positions[j]),
                            dis_temp2 = this.getPositionsDistance(positions[j], positions[k]);

                        res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle));
                    }


                    return (res / 1000000.0).toFixed(4);
                }
            },
            /**
             * 获取两点距离
             * @param {*} point1 
             * @param {*} point2 
             */
            getPointDistance: function (point1, point2) {

                if (this._viewer) {

                    var point1cartographic = Cesium.Cartographic.fromCartesian(point1),
                        point2cartographic = Cesium.Cartographic.fromCartesian(point2);
                    /**根据经纬度计算出距离**/
                    var geodesic = new Cesium.EllipsoidGeodesic();
                    geodesic.setEndPoints(point1cartographic, point2cartographic);
                    var s = geodesic.surfaceDistance;

                    //返回两点之间的距离
                    s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));

                    return s;
                }
            },
            /**
             * 获取84坐标的距离
             * @param {*} positions 
             */
            getPositionDistance: function (positions) {
                let distance = 0
                for (let i = 0; i < positions.length - 1; i++) {
                    let point1cartographic = this.transformWGS84ToCartographic(positions[i])
                    let point2cartographic = this.transformWGS84ToCartographic(positions[i + 1])
                    let geodesic = new Cesium.EllipsoidGeodesic()
                    geodesic.setEndPoints(point1cartographic, point2cartographic)
                    let s = geodesic.surfaceDistance
                    s = Math.sqrt(
                        Math.pow(s, 2) +
                        Math.pow(point2cartographic.height - point1cartographic.height, 2)
                    )
                    distance = distance + s
                }
                return distance.toFixed(3)
            },
            /**
             * 获取相交对象
             * @param {*} startPos 
             * @param {*} endPos 
             * @param {*} excludeArr 
             * @param {*} bDrillPick 
             */
            getIntersectObj: function (startPos, endPos, excludeArr = [], bDrillPick = false) {

                if (this._viewer) {

                    var direction = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(endPos, startPos, new Cesium.Cartesian3()), new Cesium.Cartesian3());
                    var ray = new Cesium.Ray(startPos, direction); //无限延长的射线

                    var results = [];

                    if (bDrillPick) {
                        results = this._viewer.scene.drillPickFromRay(ray, 10, excludeArr);
                    } else //只pick首个物体
                    {
                        var result = this._viewer.scene.pickFromRay(ray, excludeArr);
                        if (Cesium.defined(result)) {
                            results = [result];
                        }
                    }
                    return results;
                }
            },
            /**
             * 椭圆计算
             * @param {*} theta 
             * @param {*} rotation 
             * @param {*} northVec 
             * @param {*} eastVec 
             * @param {*} aSqr 
             * @param {*} ab 
             * @param {*} bSqr 
             * @param {*} mag 
             * @param {*} unitPos 
             * @param {*} result 
             */
            getPointOnEllipsoid: function (theta, rotation, northVec, eastVec, aSqr, ab, bSqr, mag, unitPos, result) {

                if (this._viewer) {
                    var rotAxis = new Cesium.Cartesian3();
                    var tempVec = new Cesium.Cartesian3();
                    var unitQuat = new Cesium.Quaternion();
                    var rotMtx = new Cesium.Matrix3();

                    var azimuth = theta + rotation;

                    Cesium.Cartesian3.multiplyByScalar(eastVec, Math.cos(azimuth), rotAxis);
                    Cesium.Cartesian3.multiplyByScalar(northVec, Math.sin(azimuth), tempVec);
                    Cesium.Cartesian3.add(rotAxis, tempVec, rotAxis);

                    var cosThetaSquared = Math.cos(theta);
                    cosThetaSquared = cosThetaSquared * cosThetaSquared;

                    var sinThetaSquared = Math.sin(theta);
                    sinThetaSquared = sinThetaSquared * sinThetaSquared;

                    var radius = ab / Math.sqrt(bSqr * cosThetaSquared + aSqr * sinThetaSquared);
                    var angle = radius / mag;

                    // Create the quaternion to rotate the position vector to the boundary of the ellipse.
                    Cesium.Quaternion.fromAxisAngle(rotAxis, angle, unitQuat);
                    Cesium.Matrix3.fromQuaternion(unitQuat, rotMtx);

                    Cesium.Matrix3.multiplyByVector(rotMtx, unitPos, result);
                    Cesium.Cartesian3.normalize(result, result);
                    Cesium.Cartesian3.multiplyByScalar(result, mag, result);
                    return result;
                }
            },
            /**
             * 计算点的插值高度
             * Returns the positions raised to the given heights
             * @private
             */
            raisePositionsToHeight: function (positions, options, extrude) {

                if (this._viewer) {
                    var scratchCartesian1 = new Cesium.Cartesian3();
                    var scratchCartesian2 = new Cesium.Cartesian3();
                    var scratchCartesian3 = new Cesium.Cartesian3();
                    var scratchNormal = new Cesium.Cartesian3();

                    var ellipsoid = options.ellipsoid;
                    var height = options.height;
                    var extrudedHeight = options.extrudedHeight;
                    var size = (extrude) ? positions.length / 3 * 2 : positions.length / 3;

                    var finalPositions = new Float64Array(size * 3);

                    var length = positions.length;
                    var bottomOffset = (extrude) ? length : 0;
                    for (var i = 0; i < length; i += 3) {
                        var i1 = i + 1;
                        var i2 = i + 2;

                        var position = Cesium.Cartesian3.fromArray(positions, i, scratchCartesian1);
                        ellipsoid.scaleToGeodeticSurface(position, position);

                        var extrudedPosition = Cesium.Cartesian3.clone(position, scratchCartesian2);
                        var normal = ellipsoid.geodeticSurfaceNormal(position, scratchNormal);
                        var scaledNormal = Cesium.Cartesian3.multiplyByScalar(normal, height, scratchCartesian3);
                        Cesium.Cartesian3.add(position, scaledNormal, position);

                        if (extrude) {
                            Cesium.Cartesian3.multiplyByScalar(normal, extrudedHeight, scaledNormal);
                            Cesium.Cartesian3.add(extrudedPosition, scaledNormal, extrudedPosition);

                            finalPositions[i + bottomOffset] = extrudedPosition.x;
                            finalPositions[i1 + bottomOffset] = extrudedPosition.y;
                            finalPositions[i2 + bottomOffset] = extrudedPosition.z;
                        }

                        finalPositions[i] = position.x;
                        finalPositions[i1] = position.y;
                        finalPositions[i2] = position.z;
                    }

                    return finalPositions;
                }
            },

            /**
            * options.semiMinorAxis：短半轴
            * options.semiMajorAxis：长半轴
            * options.rotation：旋转角度 弧度
            * options.center：中心点 笛卡尔坐标
            * options.granularity：粒度 弧度
            * Returns an array of positions that make up the ellipse.
            * @private
            */
            computeEllipseEdgePositions: function (options) {

                if (this._viewer) {
                    var unitPosScratch = new Cesium.Cartesian3();
                    var eastVecScratch = new Cesium.Cartesian3();
                    var northVecScratch = new Cesium.Cartesian3();
                    var scratchCartesian1 = new Cesium.Cartesian3();

                    var semiMinorAxis = options.semiMinorAxis;
                    var semiMajorAxis = options.semiMajorAxis;
                    var rotation = options.rotation;//法线
                    var center = options.center;
                    var granularity = options.granularity && (typeof options.granularity === "number") ? options.granularity : (Math.PI / 180.0);// 角度间隔
                    if (granularity > Math.PI / 12.0) { granularity = Math.PI / 12.0; }//最小分24
                    if (granularity < Math.PI / 180.0) { granularity = Math.PI / 180.0; }//最大分360
                    var aSqr = semiMinorAxis * semiMinorAxis;
                    var bSqr = semiMajorAxis * semiMajorAxis;
                    var ab = semiMajorAxis * semiMinorAxis;
                    var mag = Cesium.Cartesian3.magnitude(center);//
                    var unitPos = Cesium.Cartesian3.normalize(center, unitPosScratch);
                    var eastVec = Cesium.Cartesian3.cross(Cesium.Cartesian3.UNIT_Z, center, eastVecScratch);
                    eastVec = Cesium.Cartesian3.normalize(eastVec, eastVec);
                    var northVec = Cesium.Cartesian3.cross(unitPos, eastVec, northVecScratch);
                    var numPts = Math.ceil(Cesium.Math.PI * 2 / granularity);
                    var deltaTheta = granularity;
                    var theta = 0;

                    var position = scratchCartesian1;
                    var i;
                    var outerIndex = 0;
                    var outerPositions = [];
                    for (i = 0; i < numPts; i++) {
                        theta = i * deltaTheta;
                        position = this.getPointOnEllipsoid(theta, rotation, northVec, eastVec, aSqr, ab, bSqr, mag, unitPos, position);

                        outerPositions[outerIndex++] = position.x;
                        outerPositions[outerIndex++] = position.y;
                        outerPositions[outerIndex++] = position.z;
                    }

                    var r = {};
                    r.numPts = numPts;
                    r.outerPositions = outerPositions;
                    return r;
                }
            },

            /**
            * options.semiMinorAxis：短半轴
            * options.semiMajorAxis：长半轴
            * options.rotation：旋转角度 弧度
            * options.center：中心点 笛卡尔坐标
            * options.granularity：粒度 弧度
            * options.angle：角度 弧度
            * Returns an array of positions that make up the ellipse.
            * @private
            */
            computeSectorEdgePositions: function (options) {

                if (this._viewer) {

                    var unitPosScratch = new Cesium.Cartesian3();
                    var eastVecScratch = new Cesium.Cartesian3();
                    var northVecScratch = new Cesium.Cartesian3();
                    var scratchCartesian1 = new Cesium.Cartesian3();

                    var semiMinorAxis = options.semiMinorAxis;
                    var semiMajorAxis = options.semiMajorAxis;
                    var rotation = options.rotation;
                    var angle = options.angle ? options.angle : Math.PI * 2.0;
                    var center = options.center;
                    var granularity = options.granularity && (typeof options.granularity === "number") ? options.granularity : (Math.PI / 180.0);// 角度间隔
                    if (granularity > Math.PI / 12.0) { granularity = Math.PI / 12.0; }//最小分24
                    if (granularity < Math.PI / 180.0) { granularity = Math.PI / 180.0; }//最大分360
                    var aSqr = semiMinorAxis * semiMinorAxis;
                    var bSqr = semiMajorAxis * semiMajorAxis;
                    var ab = semiMajorAxis * semiMinorAxis;
                    var mag = Cesium.Cartesian3.magnitude(center);//
                    var unitPos = Cesium.Cartesian3.normalize(center, unitPosScratch);
                    var eastVec = Cesium.Cartesian3.cross(Cesium.Cartesian3.UNIT_Z, center, eastVecScratch);
                    eastVec = Cesium.Cartesian3.normalize(eastVec, eastVec);
                    var northVec = Cesium.Cartesian3.cross(unitPos, eastVec, northVecScratch);
                    var numPts = Math.ceil(angle / granularity);//Math.ceil(Cesium.Math.PI * 2 / granularity);
                    var deltaTheta = granularity;
                    var theta = 0;

                    var position = scratchCartesian1;
                    var i;
                    var outerIndex = 0;
                    var outerPositions = [];
                    for (i = 0; i < numPts; i++) {
                        theta = i * deltaTheta;
                        position = this.getPointOnEllipsoid(theta, rotation, northVec, eastVec, aSqr, ab, bSqr, mag, unitPos, position);

                        outerPositions[outerIndex++] = position.x;
                        outerPositions[outerIndex++] = position.y;
                        outerPositions[outerIndex++] = position.z;
                    }

                    var r = {};
                    r.numPts = numPts;
                    r.outerPositions = outerPositions;
                    return r;
                }
            },
            /**
             * 获取3DTiles高度
             * 传入lonlat数组 角度制的lon lat
             * @param {*} lonlats 
             * @param {*} callback 
             */
            computeLonlatPointsTerrainData: function (lonlats, callback) {

                if (this._viewer) {
                    var pointArrInput = [];
                    for (var i = 0; i < lonlats.length; i++) {
                        pointArrInput.push(Cesium.Cartographic.fromDegrees(lonlats[i].lon, lonlats[i].lat));
                    }
                    var promise = this._viewer.scene.clampToHeightMostDetailed(pointArrInput);//pointArrInput
                    promise.then(function (updatedPositions) {
                        callback(updatedPositions);
                    });
                }
            },
            /**
             * 获取3DTiles高度
             * 传入Cartographic类型数组 弧度制经纬度
             * @param {*} Cartographics 
             * @param {*} callback 
             */
            computeCartographicPointsTerrainData: function (Cartographics, callback) {

                if (this._viewer) {
                    if (Cartographics.length && Cartographics.length > 0) { } else { return; }
                    var pointArrInput = [];
                    for (var i = 0; i < Cartographics.length; i++) {
                        pointArrInput.push(Cesium.Cartesian3.fromRadians(Cartographics[i].longitude, Cartographics[i].latitude, Cartographics[i].height));
                    }
                    var promise = this._viewer.scene.clampToHeightMostDetailed(pointArrInput), $this = this;//pointArrInput
                    promise.then(function (updatedPositions) {
                        var result = [];
                        var ellipsoid = $this._viewer.scene.globe.ellipsoid;
                        for (var j = 0; j < updatedPositions.length; j++) {
                            result.push(ellipsoid.cartesianToCartographic(updatedPositions[j]));
                        }
                        callback(result);
                    }).otherwise(function (error) {
                        console.log(error)
                    });
                }
            },
            _checkLonDegree: function (value) {
                if (value > 180 || value < -180) {
                    return false;
                }
                return true;
            },
            _checkLatDegree: function (value) {
                if (value > 90 || value < -90) {
                    return false;
                }
                return true;
            },
            /*
            线段插值
            经纬度坐标插值
            start.lon start.lat  单位:度
            return [[lon,lat],...]
            */
            computeInterpolateLineLonlat: function (start, end) {
                if (start && end) { } else { return null; }
                if (start.lon && start.lat && end.lon && end.lat) { } else { return null; }
                if (this._checkLonDegree(start.lon) && this._checkLonDegree(end.lon) && this._checkLatDegree(start.lat) && this._checkLatDegree(end.lat)) { } else { return null; }
                var result = [];
                result.push([start.lon, start.lat]);
                var interval = Math.sqrt(Math.pow((end.lon - start.lon), 2) + Math.pow((end.lat - start.lat), 2));
                if (interval <= 0.00001) {
                    //小于最小间隔
                    result.push([end.lon, end.lat]);
                    return result;
                } else {
                    var num = interval / 0.00001;
                    var stepLon = (end.lon - start.lon) / num;
                    var stepLat = (end.lat - start.lat) / num;
                    for (var i = 0; i < num; i++) {
                        var lon = start.lon + (i + 1) * stepLon;
                        var lat = start.lat + (i + 1) * stepLat;
                        result.push([lon, lat]);
                    }
                }
                return result;
            },
            /*
           线段插值
           经纬度坐标插值
           Cartographic start.longitude start.latitude 单位:弧度
           return [Cartographic,...]
           */
            computeInterpolateLineCartographic: function (start, end, _Delta) {
                if (start && end) { } else { return null; }
                if (start.longitude && start.latitude && end.longitude && end.latitude) { } else { return null; }
                var result = [];
                //开始点
                result.push(new Cesium.Cartographic(start.longitude, start.latitude));
                var interval = Math.sqrt(Math.pow((end.longitude - start.longitude), 2) + Math.pow((end.latitude - start.latitude), 2));
                var delta = _Delta && (typeof _Delta === 'number') ? _Delta : 0.00001 * Math.PI / 180.0;
                if (interval <= delta) {
                    //小于最小间隔
                    result.push(new Cesium.Cartographic(end.longitude, end.latitude));
                    return result;
                } else {
                    var num = interval / delta;
                    var stepLon = (end.longitude - start.longitude) / num;
                    var stepLat = (end.latitude - start.latitude) / num;
                    for (var i = 0; i < num; i++) {
                        var lon = start.longitude + (i + 1) * stepLon;
                        var lat = start.latitude + (i + 1) * stepLat;
                        result.push(new Cesium.Cartographic(lon, lat));//与最后一个点有偏差
                    }
                    result.push(new Cesium.Cartographic(end.longitude, end.latitude, end.height));
                }
                return result;
            },

            /*
            线段插值
            经纬度高程插值
            Cartographic start.longitude start.latitude 单位:弧度 start.height 高程单位m
            return [Cartographic,...]
            */
            computeInterpolateLineHeightCartographic: function (start, end) {
                if (start && end) { } else { return null; }
                if (start.longitude && start.latitude && end.longitude && end.latitude) { } else { return null; }
                var result = [];
                result.push(new Cesium.Cartographic(start.longitude, start.latitude, start.height));
                var interval = Math.sqrt(Math.pow((end.longitude - start.longitude), 2) + Math.pow((end.latitude - start.latitude), 2));
                if (interval <= 0.00001 * Math.PI / 180.0) {
                    //小于最小间隔
                    result.push(new Cesium.Cartographic(end.longitude, end.latitude, end.height));
                    return result;
                } else {
                    var num = interval / 0.00001 * Math.PI / 180.0;
                    var stepLon = (end.longitude - start.longitude) / num;
                    var stepLat = (end.latitude - start.latitude) / num;
                    var stepHeight = (end.height - start.height) / num;
                    for (var i = 0; i < num; i++) {
                        var lon = start.longitude + (i + 1) * stepLon;
                        var lat = start.latitude + (i + 1) * stepLat;
                        var hieght = start.height + (i + 1) * stepHeight;
                        result.push(new Cesium.Cartographic(lon, lat, hieght));
                    }
                    result.push(new Cesium.Cartographic(end.longitude, end.latitude, end.height));
                }
                return result;
            },
            /*
            线段插值
            经纬度高程插值
            Cartographic start.longitude start.latitude 单位:弧度 start.height 高程单位m
            num:分总段数  传入数组长度-1
            index:获取到第index点的所有插值 0点是开始点
            return [Cartographic,...]
            */
            computeInterpolate2IndexLineHeightCartographic: function (start, end, num, curIndex) {
                if (start && end) { } else { return null; }
                if (start.longitude && start.latitude && end.longitude && end.latitude) { } else { return null; }
                var result = [];
                result.push(new Cesium.Cartographic(start.longitude, start.latitude, start.height));
                var stepLon = (end.longitude - start.longitude) / num;
                var stepLat = (end.latitude - start.latitude) / num;
                var stepHeight = (end.height - start.height) / num;
                for (var i = 0; i < curIndex; i++) {
                    var lon = start.longitude + (i + 1) * stepLon;
                    var lat = start.latitude + (i + 1) * stepLat;
                    var hieght = start.height + (i + 1) * stepHeight;
                    result.push(new Cesium.Cartographic(lon, lat, hieght));
                }
                //result.push(new Cesium.Cartographic(end.longitude, end.latitude, end.height));
                return result;
            },

            /*
            线段插值 指定第index值
            经纬度高程插值
            Cartographic start.longitude start.latitude 单位:弧度 start.height 高程单位m
            num:分总段数  传入数组长度-1
            index:获取第index个插值点  0点是开始点
            return Cartographic
            */
            computeInterpolateIndexLineHeightCartographic: function (start, end, num, index) {
                if (start && end) { } else { return null; }
                if (start.longitude && start.latitude && end.longitude && end.latitude) { } else { return null; }
                //var delta = _Delta && (typeof _Delta === 'number') ? _Delta :  0.00001 * Math.PI / 180.0;    
                var stepLon = (end.longitude - start.longitude) / num;
                var stepLat = (end.latitude - start.latitude) / num;
                var stepHeight = (end.height - start.height) / num;
                var lon = start.longitude + index * stepLon;
                var lat = start.latitude + index * stepLat;
                var hieght = start.height + index * stepHeight;
                var result = new Cesium.Cartographic(lon, lat, hieght);
                return result;
            }
        }
        /**
         * 材质模块
         * @param {*} viewer 
         */
        function Material(viewer) {
            if (viewer) {

                this._installMaterial()
            }
        }
        Material.prototype = {
            /**
             * 添加材质线
             * 动态炫光线
             * @param {*} options 
             */
            addMaterialLineGraphics: function (options) {

                if (this._viewer && options && options.image) {
                    // 初始化自定义材质线
                    this._initPolylineCustomMaterialProperty(options)

                    var _entity = this.createGraphics()

                    _entity.polyline = {
                        positions: options.positions,
                        material: new Cesium.PolylineCustomMaterialProperty({ color: options.color || Cesium.Color.RED, duration: options.duration || 500 }),
                        width: options.width
                    }

                    return this._viewer.entities.add(_entity)
                }

            },
            /**
             * 获取一个材质线
             * @param {*} options 
             */
            getCustomMaterialLine: function (options) {

                if (this._viewer && options && options.image) {
                    // 初始化自定义材质线
                    return this._initPolylineCustomMaterialProperty(options)
                }
            },
            // 动态初始化材质线
            _initPolylineCustomMaterialProperty(options) {

                if (options) {

                    var Color = Cesium.Color,
                        defaultValue = Cesium.defaultValue,
                        defined = Cesium.defined,
                        defineProperties = Object.defineProperties,
                        Event = Cesium.Event,
                        createPropertyDescriptor = Cesium.createPropertyDescriptor,
                        Property = Cesium.Property,
                        Material = Cesium.Material,
                        defaultColor = Color.WHITE,
                        MaterialType = options.MaterialType || 'wallType' + parseInt(Math.random() * 1000);

                    function PolylineCustomMaterialProperty(options) {

                        options = defaultValue(options, defaultValue.EMPTY_OBJECT);
                        this._definitionChanged = new Event();
                        this._color = undefined;
                        this._colorSubscription = undefined;
                        this.color = options.color || Cesium.Color.BLUE;
                        this.duration = options.duration || 1000;
                        this._time = undefined;
                    }

                    defineProperties(PolylineCustomMaterialProperty.prototype, {
                        isvarant: {
                            get: function () {
                                return false;
                            }
                        },
                        definitionChanged: {
                            get: function () {
                                return this._definitionChanged;
                            }
                        },
                        color: createPropertyDescriptor('color')
                    });
                    PolylineCustomMaterialProperty.prototype.getType = function (time) {
                        return MaterialType;
                    };
                    PolylineCustomMaterialProperty.prototype.getValue = function (time, result) {
                        if (!defined(result)) {
                            result = {};
                        }
                        result.color = Property.getValueOrClonedDefault(this._color, time, defaultColor, result.color);
                        result.image = options.image;
                        if (this._time === undefined) {
                            this._time = time.secondsOfDay;
                        }
                        result.time = (time.secondsOfDay - this._time) * 1000 / this.duration;
                        return result;
                    };
                    PolylineCustomMaterialProperty.prototype.equals = function (other) {
                        return this === other || //
                            (other instanceof PolylineCustomMaterialProperty &&
                                Property.equals(this._color, other._color));
                    };
                    Material._materialCache.addMaterial(MaterialType, {
                        fabric: {
                            type: MaterialType,
                            uniforms: {
                                color: options.color || new Cesium.Color(1.0, 0.0, 0.0, 0.5),
                                image: options.image,
                                time: options.color.time || 0
                            },
                            source: this._getDynamicLineShader({ get: true })
                        },
                        translucent: function (material) {
                            return true;
                        }
                    })
                    return new PolylineCustomMaterialProperty(options);
                }
            },
            /**
             * 动态围栏
             * 炫光墙体
             * @param {*} options 
             */
            addMaterialWallGraphics: function (options) {
                if (this._viewer && options && options.image) {
                    // 初始化自定义材质
                    this._initWallCustomMaterialProperty(options)

                    var _entity = this.createGraphics()

                    _entity.wall = {
                        positions: options.positions,
                        material: new Cesium.WallLinkCustomMaterialProperty({ color: options.color || Cesium.Color.RED, duration: options.duration || 500 }),
                        width: options.width
                    }

                    return this._viewer.entities.add(_entity)
                }

            },
            /**
            * 获取一个材质围栏
            * @param {*} options 
            */
            getCustomMaterialWall: function (options) {
                if (this._viewer && options && options.image) {

                    return this._initWallCustomMaterialProperty(options)
                }
            },
            // 动态初始化材质线
            _initWallCustomMaterialProperty(options) {

                var Color = Cesium.Color,
                    defaultValue = Cesium.defaultValue,
                    defined = Cesium.defined,
                    defineProperties = Object.defineProperties,
                    Event = Cesium.Event,
                    createPropertyDescriptor = Cesium.createPropertyDescriptor,
                    Property = Cesium.Property,
                    Material = Cesium.Material,
                    MaterialType = options.MaterialType || 'wallType' + parseInt(Math.random() * 1000);

                function WallLinkCustomMaterialProperty(options) {

                    options = defaultValue(options, defaultValue.EMPTY_OBJECT);
                    this._definitionChanged = new Event();
                    this._color = undefined;
                    this._colorSubscription = undefined;
                    this.color = options.color || Color.BLUE;
                    this.duration = options.duration || 3000;
                    this._time = new Date().getTime();
                }

                defineProperties(WallLinkCustomMaterialProperty.prototype, {
                    isvarant: {
                        get: function () {
                            return false;
                        }
                    },
                    definitionChanged: {
                        get: function () {
                            return this._definitionChanged;
                        }
                    },
                    color: createPropertyDescriptor('color')
                });
                WallLinkCustomMaterialProperty.prototype.getType = function (time) {
                    return MaterialType;
                };
                WallLinkCustomMaterialProperty.prototype.getValue = function (time, result) {
                    if (!defined(result)) {
                        result = {};
                    }
                    result.color = Property.getValueOrClonedDefault(
                        this._color,
                        time,
                        Color.WHITE,
                        result.color
                    );
                    result.image = options.image;;
                    result.time =
                        ((new Date().getTime() - this._time) % this.duration) / this.duration;
                    return result;
                };
                WallLinkCustomMaterialProperty.prototype.equals = function (other) {
                    return (
                        this === other ||
                        (other instanceof WallLinkCustomMaterialProperty &&
                            Property.equals(this._color, other._color))
                    );
                };
                //动态墙
                Material._materialCache.addMaterial(MaterialType,
                    {
                        fabric: {
                            type: MaterialType,
                            uniforms: {
                                color: new Color(1.0, 0.0, 0.0, 0.5),
                                image: options.image,
                                time: 0
                            },
                            source: this._getDirectionWallShader({
                                get: true,
                                count: options.count,
                                freely: options.freely,
                                direction: options.direction
                            })
                        },
                        translucent: function (material) {
                            return true;
                        }
                    }
                );

                return new WallLinkCustomMaterialProperty(options)
            },
            /**
             * 安装默认拓展材质
             */
            _installMaterial: function () {

                this._installWaveCircleMaterial()

                this._installCircleFadeMaterial()

                this._installCityLineMaterial()

                this._installWarnMaterial()

                this._installFlowMaterial()

            },
            // 波动圆材质
            _installWaveCircleMaterial: function () {
                var Color = Cesium.Color,
                    defaultValue = Cesium.defaultValue,
                    defineProperties = Object.defineProperties,
                    Event = Cesium.Event,
                    Property = Cesium.Property,
                    Material = Cesium.Material;

                function CircleWaveMaterialProperty(options) {

                    options = options || {}
                    this._definitionChanged = new Event()
                    this._color = undefined
                    this._colorSubscription = undefined
                    this._duration = undefined
                    this._durationSubscription = undefined
                    this.color = defaultValue(
                        options.color,
                        Color.fromBytes(0, 255, 255, 255)
                    )
                    this.duration = defaultValue(options.duration, 45)
                    this.count = Math.max(defaultValue(options.count, 2), 1)
                    this.gradient = defaultValue(options.gradient, 0.1)
                    if (this.gradient < 0) {
                        this.gradient = 0
                    } else if (this.gradient > 1) {
                        this.gradient = 1
                    }
                }

                defineProperties(CircleWaveMaterialProperty.prototype, {
                    isConstant: {
                        get: function () {
                            return false;
                        }
                    },
                    definitionChanged: {
                        get: function () {
                            return this._definitionChanged;
                        }
                    }
                });

                CircleWaveMaterialProperty.prototype.getType = function (time) {
                    return Material.CircleWaveType
                };
                CircleWaveMaterialProperty.prototype.getValue = function (time, result) {
                    if (!result) {
                        result = {}
                    }
                    result.color = Property.getValueOrUndefined(this._color, time)
                    result.duration = this._duration
                    result.count = this.count
                    result.gradient = this.gradient
                    return result
                };
                CircleWaveMaterialProperty.prototype.equals = function (other) {
                    return (
                        this === other ||
                        (other instanceof CircleWaveMaterialProperty &&
                            Cesium.Property.equals(this._color, other._color))
                    )
                };

                defineProperties(CircleWaveMaterialProperty.prototype, {
                    color: Cesium.createPropertyDescriptor('color'),
                    duration: Cesium.createPropertyDescriptor('duration')
                })

                Cesium.CircleWaveMaterialProperty = CircleWaveMaterialProperty
                Material.CircleWaveType = 'CircleWave'
                Material._materialCache.addMaterial(Material.CircleWaveType, {
                    fabric: {
                        type: Material.CircleWaveType,
                        uniforms: {
                            color: new Color(1.0, 0.0, 0.0, 0.7),
                            duration: 45,
                            count: 1,
                            gradient: 0.1
                        },
                        source: this._getDynamicCircleShader({ get: true })
                    },
                    translucent: function (material) {
                        return true
                    }
                })
            },
            // 渐变圆
            _installCircleFadeMaterial: function () {
                var Color = Cesium.Color,
                    defaultValue = Cesium.defaultValue,
                    defineProperties = Object.defineProperties,
                    Event = Cesium.Event,
                    Property = Cesium.Property,
                    Material = Cesium.Material,
                    _color = new Color(0, 0, 0, 0);

                function CircleFadeMaterialProperty(options) {

                    options = defaultValue(options, defaultValue.EMPTY_OBJECT)
                    this._definitionChanged = new Event
                    this._color = void 0
                    this._colorSubscription = void 0
                    this.color = defaultValue(options.color, _color)
                    this._duration = options.duration || 1e3
                    this._time = void 0
                }

                defineProperties(CircleFadeMaterialProperty.prototype, {
                    isConstant: {
                        get: function () {
                            return false;
                        }
                    },
                    definitionChanged: {
                        get: function () {
                            return this._definitionChanged;
                        }
                    }
                });

                CircleFadeMaterialProperty.prototype.getType = function (time) {
                    return Material.CircleFadeMaterialType
                };
                CircleFadeMaterialProperty.prototype.getValue = function (time, result) {
                    if (!result) {
                        result = {}
                    }
                    result.color = Property.getValueOrClonedDefault(this._color, time, _color, result.color),
                        void 0 === this._time && (this._time = (new Date).getTime()),
                        result.time = ((new Date).getTime() - this._time) / this._duration
                    return result
                };
                CircleFadeMaterialProperty.prototype.equals = function (other) {
                    return (
                        this === other ||
                        (other instanceof CircleFadeMaterialProperty &&
                            Cesium.Property.equals(this._color, other._color))
                    )
                };
                defineProperties(CircleFadeMaterialProperty.prototype, {
                    color: Cesium.createPropertyDescriptor("color")
                });
                Cesium.CircleFadeMaterialProperty = CircleFadeMaterialProperty;
                Material.CircleFadeMaterialType = "CircleFadeMaterial"
                Material._materialCache.addMaterial(Material.CircleFadeMaterialType, {
                    fabric: {
                        type: Material.CircleFadeMaterialType,
                        uniforms:
                        {
                            color: new Color(1, 0, 0, 1),
                            time: 1
                        },
                        source: this._getCircleFadeShader({ get: true })
                    },
                    translucent: function () {
                        return !0
                    }
                })
            },
            // 城市光效线
            _installCityLineMaterial: function () {

                var Color = Cesium.Color,
                    defaultValue = Cesium.defaultValue,
                    defined = Cesium.defined,
                    defineProperties = Object.defineProperties,
                    Event = Cesium.Event,
                    createPropertyDescriptor = Cesium.createPropertyDescriptor,
                    Property = Cesium.Property,
                    Material = Cesium.Material,
                    defaultColor = Color.WHITE;

                function PolylineCityLinkMaterialProperty(options) {

                    options = defaultValue(options, defaultValue.EMPTY_OBJECT);
                    this._definitionChanged = new Event();
                    this._color = undefined;
                    this._colorSubscription = undefined;
                    this.color = options.color || Cesium.Color.BLUE;
                    this.duration = options.duration || 1000;
                    this._time = undefined;
                }

                defineProperties(PolylineCityLinkMaterialProperty.prototype, {
                    isvarant: {
                        get: function () {
                            return false;
                        }
                    },
                    definitionChanged: {
                        get: function () {
                            return this._definitionChanged;
                        }
                    },
                    color: createPropertyDescriptor('color')
                });
                PolylineCityLinkMaterialProperty.prototype.getType = function (time) {
                    return Material.PolylineCityLinkType;
                };
                PolylineCityLinkMaterialProperty.prototype.getValue = function (time, result) {
                    if (!defined(result)) {
                        result = {};
                    }
                    result.color = Property.getValueOrClonedDefault(this._color, time, defaultColor, result.color);
                    result.image = Material.PolylineCityLinkImage;
                    if (this._time === undefined) {
                        this._time = time.secondsOfDay;
                    }
                    result.time = (time.secondsOfDay - this._time) * 1000 / this.duration;
                    return result;
                };
                PolylineCityLinkMaterialProperty.prototype.equals = function (other) {
                    return this === other || //
                        (other instanceof PolylineCityLinkMaterialProperty &&
                            Property.equals(this._color, other._color));
                };

                Cesium.PolylineCityLinkMaterialProperty = PolylineCityLinkMaterialProperty
                Material.PolylineCityLinkType = 'PolylineCityLink';
                Material.PolylineCityLinkImage = 'data/images/Textures/meteor_01.png';
                Material._materialCache.addMaterial(Material.PolylineCityLinkType,
                    {
                        fabric: {
                            type: Material.PolylineCityLinkType,
                            uniforms: {
                                color: new Color(1, 0, 0, 1.0),
                                image: Material.PolylineCityLinkImage,
                                time: 0,
                            },
                            source: this._getDynamicLightLineShader({ get: true })
                        },
                        translucent: function () {
                            return true;
                        }
                    });
            },
            // 城市警示墙
            _installWarnMaterial: function () {
                var Color = Cesium.Color,
                    defaultValue = Cesium.defaultValue,
                    defined = Cesium.defined,
                    defineProperties = Object.defineProperties,
                    Event = Cesium.Event,
                    createPropertyDescriptor = Cesium.createPropertyDescriptor,
                    Property = Cesium.Property,
                    Material = Cesium.Material;

                function WarnLinkMaterialProperty(options) {

                    options = defaultValue(options, defaultValue.EMPTY_OBJECT);
                    this._definitionChanged = new Event();
                    this._color = undefined;
                    this._colorSubscription = undefined;
                    this.color = options.color || Color.BLUE;
                    this.duration = options.duration || 3000;
                    this._time = new Date().getTime();
                }

                defineProperties(WarnLinkMaterialProperty.prototype, {
                    isvarant: {
                        get: function () {
                            return false;
                        }
                    },
                    definitionChanged: {
                        get: function () {
                            return this._definitionChanged;
                        }
                    }
                });
                WarnLinkMaterialProperty.prototype.getType = function (time) {
                    return Material.WarnLinkType;
                };
                WarnLinkMaterialProperty.prototype.getValue = function (time, result) {
                    if (!defined(result)) {
                        result = {};
                    }
                    result.color = Property.getValueOrClonedDefault(
                        this._color,
                        time,
                        Color.WHITE,
                        result.color
                    );
                    result.image = Material.WarnLinkImage;
                    result.time =
                        ((new Date().getTime() - this._time) % this.duration) / this.duration;
                    return result;
                };
                WarnLinkMaterialProperty.prototype.equals = function (other) {
                    return (
                        this === other ||
                        (other instanceof WarnLinkMaterialProperty &&
                            Property.equals(this._color, other._color))
                    );
                };

                defineProperties(WarnLinkMaterialProperty.prototype, {
                    color: createPropertyDescriptor("color")
                });


                Cesium.WarnLinkMaterialProperty = WarnLinkMaterialProperty
                Material.WarnLinkType = "WarnWallLinkType";
                Material.WarnLinkImage = "data/images/Textures/jsx2.png";
                Material._materialCache.addMaterial(Material.WarnLinkType,
                    {
                        fabric: {
                            type: Material.WarnLinkType,
                            uniforms: {
                                color: new Color(1.0, 0.0, 0.0, 0.5),
                                image: Material.WarnLinkImage,
                                time: 0
                            },
                            source: this._getDirectionWallShader({
                                get: true,
                                count: 10.0,
                                freely: 'cross',
                                direction: '-'
                            })
                        },
                        translucent: function (material) {
                            return true;
                        }
                    }
                );
            },
            // 轨迹流动线
            _installFlowMaterial: function () {

                var Color = Cesium.Color,
                    defaultValue = Cesium.defaultValue,
                    defineProperties = Object.defineProperties,
                    Event = Cesium.Event,
                    createPropertyDescriptor = Cesium.createPropertyDescriptor,
                    Property = Cesium.Property,
                    Material = Cesium.Material;

                function PolylineFlowMaterialProperty(options) {

                    options = defaultValue(options, defaultValue.EMPTY_OBJECT);
                    this._definitionChanged = new Event()
                    this._color = undefined
                    this._colorSubscription = undefined
                    this.color = options.color || Color.fromBytes(0, 255, 255, 255)
                    this._duration = undefined
                    this._durationSubscription = undefined
                    this.duration = defaultValue(options.duration, 45)
                }

                defineProperties(PolylineFlowMaterialProperty.prototype, {
                    isConstant: {
                        get: function () {
                            return false;
                        }
                    },
                    definitionChanged: {
                        get: function () {
                            return this._definitionChanged;
                        }
                    }
                });

                PolylineFlowMaterialProperty.prototype.getType = function (time) {
                    return Material.PolylineFlowType;
                };

                PolylineFlowMaterialProperty.prototype.getValue = function (time, result) {
                    if (!result) {
                        result = {}
                    }
                    result.color = Property.getValueOrClonedDefault(
                        this._color,
                        time,
                        Cesium.Color.WHITE,
                        result.color
                    )
                    result.duration = this._duration
                    return result
                };
                PolylineFlowMaterialProperty.prototype.equals = function (other) {
                    return (
                        this === other ||
                        (other instanceof PolylineFlowMaterialProperty &&
                            Property.equals(this._color, other._color))
                    )
                };
                defineProperties(PolylineFlowMaterialProperty.prototype, {
                    color: createPropertyDescriptor('color'),
                    duration: createPropertyDescriptor('duration')
                })

                Cesium.PolylineFlowMaterialProperty = PolylineFlowMaterialProperty
                Material.PolylineFlowType = 'PolylineFlow'
                Material._materialCache.addMaterial(Material.PolylineFlowType, {
                    fabric: {
                        type: Material.PolylineFlowType,
                        uniforms: {
                            color: new Color(1.0, 1.0, 2.0, 0.7),
                            duration: 45
                        },
                        source: this._getFlowLineShader({ get: true })
                    },
                    translucent: function (material) {
                        return true
                    }
                })
            }
        }
        /**
         * 外部插件模块
         * @param {*} viewer 
         */
        function Plugin(viewer) {

            if (viewer) {

                this._pluginLayer = new Cesium.CustomDataSource('pluginLayer')

                viewer && viewer.dataSources.add(this._pluginLayer)

                this._installPlugin()
            }

        }
        Plugin.prototype = {
            // 安装插件
            _installPlugin: function () {

                this._installCss3Renderer()

                this._installGroundSkyBox()

                this._installTerrainClipPlan()
            },
            /**
             * 地形裁剪
             */
            _installTerrainClipPlan: function () {

                function TerrainClipPlan(t, i) {
                    this.viewer = t,
                        this.options = i || {},
                        this._positions = i.positions,
                        this._height = this.options.height || 0,
                        this.bottomImg = i.bottomImg,
                        this.wallImg = i.wallImg,
                        this.splitNum = Cesium.defaultValue(i.splitNum, 50),
                        this._positions && this._positions.length > 0 && this.updateData(this._positions)
                }

                Object.defineProperties(TerrainClipPlan.prototype, {
                    show: {
                        get: function () {
                            return this._show
                        },
                        set: function (e) {
                            this._show = e, this.viewer.scene.globe.clippingPlanes && (this.viewer.scene.globe.clippingPlanes.enabled = e), this._switchExcavate(e)
                        }
                    },

                    height: {
                        get: function () {
                            return this._height
                        },
                        set: function (e) {
                            this._height = e, this._updateExcavateDepth(e)
                        }
                    }
                })
                TerrainClipPlan.prototype.updateData = function (e) {
                    this.clear();
                    var t = [],
                        i = e.length,
                        a = new Cesium.Cartesian3,
                        n = Cesium.Cartesian3.subtract(e[0], e[1], a);
                    n = n.x > 0, this.excavateMinHeight = 9999;
                    for (var r = 0; r < i; ++r) {
                        var s = (r + 1) % i,
                            l = Cesium.Cartesian3.midpoint(e[r], e[s], new Cesium.Cartesian3),
                            u = Cesium.Cartographic.fromCartesian(e[r]),
                            c = this.viewer.scene.globe.getHeight(u) || u.height;
                        c < this.excavateMinHeight && (this.excavateMinHeight = c);
                        var d, h = Cesium.Cartesian3.normalize(l, new Cesium.Cartesian3);
                        d = n ? Cesium.Cartesian3.subtract(e[r], l, new Cesium.Cartesian3) : Cesium.Cartesian3.subtract(e[s], l, new Cesium.Cartesian3), d = Cesium.Cartesian3.normalize(d, d);
                        var f = Cesium.Cartesian3.cross(d, h, new Cesium.Cartesian3);
                        f = Cesium.Cartesian3.normalize(f, f);
                        var p = new Cesium.Plane(f, 0),
                            m = Cesium.Plane.getPointDistance(p, l);
                        t.push(new Cesium.ClippingPlane(f, m))
                    }
                    this.viewer.scene.globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
                        planes: t,
                        edgeWidth: 1,
                        edgeColor: Cesium.Color.WHITE,
                        enabled: !0
                    }), this._prepareWell(e), this._createWell(this.wellData)
                }

                TerrainClipPlan.prototype.clear = function () {

                    this.viewer.scene.globe.clippingPlanes && (this.viewer.scene.globe.clippingPlanes.enabled = !1, this.viewer.scene.globe.clippingPlanes.removeAll(), this.viewer.scene.globe.clippingPlanes.isDestroyed() || this.viewer.scene.globe.clippingPlanes.destroy()), this.viewer.scene.globe.clippingPlanes = void 0, this.bottomSurface && this.viewer.scene.primitives.remove(this.bottomSurface), this.wellWall && this.viewer.scene.primitives.remove(this.wellWall), delete this.bottomSurface, delete this.wellWall, this.viewer.scene.render()
                }

                TerrainClipPlan.prototype._prepareWell = function (e) {
                    var t = this.splitNum,
                        i = e.length;
                    if (0 != i) {
                        for (var a = this.excavateMinHeight - this.height, n = [], r = [], s = [], l = 0; l < i; l++) {
                            var u = l == i - 1 ? 0 : l + 1,
                                c = Cesium.Cartographic.fromCartesian(e[l]),
                                d = Cesium.Cartographic.fromCartesian(e[u]),
                                h = [c.longitude, c.latitude],
                                f = [d.longitude, d.latitude];

                            0 == l && (
                                s.push(new Cesium.Cartographic(h[0], h[1])),
                                r.push(Cesium.Cartesian3.fromRadians(h[0], h[1], a)),
                                n.push(Cesium.Cartesian3.fromRadians(h[0], h[1], 0)));

                            for (var p = 1; p <= t; p++) {
                                var m = Cesium.Math.lerp(h[0], f[0], p / t),
                                    g = Cesium.Math.lerp(h[1], f[1], p / t);
                                l == i - 1 && p == t || (
                                    s.push(new Cesium.Cartographic(m, g)),
                                    r.push(Cesium.Cartesian3.fromRadians(m, g, a)),
                                    n.push(Cesium.Cartesian3.fromRadians(m, g, 0)))
                            }
                        }
                        this.wellData = {
                            lerp_pos: s,
                            bottom_pos: r,
                            no_height_top: n
                        }
                    }
                }

                TerrainClipPlan.prototype._createWell = function (e) {
                    if (Boolean(this.viewer.terrainProvider._layers)) {
                        var t = this;
                        this._createBottomSurface(e.bottom_pos);
                        var i = Cesium.sampleTerrainMostDetailed(this.viewer.terrainProvider, e.lerp_pos);
                        Cesium.when(i, function (i) {
                            for (var a = i.length, n = [], r = 0; r < a; r++) {
                                var s = Cesium.Cartesian3.fromRadians(i[r].longitude, i[r].latitude, i[r].height);
                                n.push(s)
                            }
                            t._createWellWall(e.bottom_pos, n)
                        })
                    } else {
                        this._createBottomSurface(e.bottom_pos);
                        this._createWellWall(e.bottom_pos, e.no_height_top)
                    }
                }


                TerrainClipPlan.prototype._getMinHeight = function (e) {
                    let minHeight = 5000000;
                    let minPoint = null;
                    for (let i = 0; i < e.length; i++) {
                        let height = e[i]['z'];
                        if (height < minHeight) {
                            minHeight = height;
                            minPoint = this._ellipsoidToLonLat(e[i]);
                        }
                    }
                    return minPoint.altitude;
                }


                TerrainClipPlan.prototype._ellipsoidToLonLat = function (c) {
                    let ellipsoid = this.viewer.scene.globe.ellipsoid;
                    let cartesian3 = new Cesium.Cartesian3(c.x, c.y, c.z);
                    let cartographic = ellipsoid.cartesianToCartographic(cartesian3);
                    let lat = Cesium.Math.toDegrees(cartographic.latitude);
                    let lng = Cesium.Math.toDegrees(cartographic.longitude);
                    let alt = cartographic.height;
                    return {
                        longitude: lng,
                        latitude: lat,
                        altitude: alt
                    }
                }
                TerrainClipPlan.prototype._createBottomSurface = function (e) {
                    if (e.length) {
                        let minHeight = this._getMinHeight(e);
                        let positions = [];
                        for (let i = 0; i < e.length; i++) {
                            let p = this._ellipsoidToLonLat(e[i]);
                            positions.push(p.longitude);
                            positions.push(p.latitude);
                            positions.push(minHeight);
                        }

                        let polygon = new Cesium.PolygonGeometry({
                            polygonHierarchy: new Cesium.PolygonHierarchy(
                                Cesium.Cartesian3.fromDegreesArrayHeights(positions)
                            ),
                            perPositionHeight: true
                        });
                        let geometry = Cesium.PolygonGeometry.createGeometry(polygon);


                        var i = new Cesium.Material({
                            fabric: {
                                type: "Image",
                                uniforms: {
                                    image: this.bottomImg
                                }
                            }
                        }),
                            a = new Cesium.MaterialAppearance({
                                translucent: !1,
                                flat: !0,
                                material: i
                            });
                        this.bottomSurface = new Cesium.Primitive({
                            geometryInstances: new Cesium.GeometryInstance({
                                geometry: geometry
                            }),
                            appearance: a,
                            asynchronous: !1
                        }), this.viewer.scene.primitives.add(this.bottomSurface)
                    }
                }

                TerrainClipPlan.prototype._createWellWall = function (e, t) {
                    let minHeight = this._getMinHeight(e);
                    let maxHeights = [];
                    let minHeights = [];
                    for (let i = 0; i < t.length; i++) {
                        maxHeights.push(this._ellipsoidToLonLat(t[i]).altitude);
                        minHeights.push(minHeight);
                    }
                    let wall = new Cesium.WallGeometry({
                        positions: t,
                        maximumHeights: maxHeights,
                        minimumHeights: minHeights,
                    });
                    let geometry = Cesium.WallGeometry.createGeometry(wall);
                    var a = new Cesium.Material({
                        fabric: {
                            type: "Image",
                            uniforms: {
                                image: this.wallImg
                            }
                        }
                    }),
                        n = new Cesium.MaterialAppearance({
                            translucent: !1,
                            flat: !0,
                            material: a
                        });
                    this.wellWall = new Cesium.Primitive({
                        geometryInstances: new Cesium.GeometryInstance({
                            geometry: geometry,
                            attributes: {
                                color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.GREY)
                            },
                            id: "PitWall"
                        }),
                        appearance: n,
                        asynchronous: !1
                    }), this.viewer.scene.primitives.add(this.wellWall)
                }
                TerrainClipPlan.prototype._switchExcavate = function (e) {
                    e ? (this.viewer.scene.globe.material = Cesium.Material.fromType("WaJue"), this.wellWall.show = !0, this.bottomSurface.show = !0) : (this.viewer.scene.globe.material = null, this.wellWall.show = !1, this.bottomSurface.show = !1)
                }

                TerrainClipPlan.prototype._updateExcavateDepth = function (e) {
                    this.bottomSurface && this.viewer.scene.primitives.remove(this.bottomSurface), this.wellWall && this.viewer.scene.primitives.remove(this.wellWall);
                    for (var t = this.wellData.lerp_pos, i = [], a = t.length, n = 0; n < a; n++) i.push(Cesium.Cartesian3.fromRadians(t[n].longitude, t[n].latitude, this.excavateMinHeight - e));
                    this.wellData.bottom_pos = i, this._createWell(this.wellData), this.viewer.scene.primitives.add(this.bottomSurface), this.viewer.scene.primitives.add(this.wellWall)
                }

                Cesium.TerrainClipPlan = TerrainClipPlan
            },
            // 灯光扫描插件
            buildLightScanGraphics: function (data) {

                if (this._viewer && data) {
                    var $this = this
                    //生成 entityCList面--形成圆锥
                    var createLightScan_entityCList = function (point, data) {
                        var lon = data.observer[0], lat = data.observer[1], h = data.observer[2];
                        var entityCList = [];
                        //创建 面
                        for (var i = 0; i < point.length; i++) {
                            var hierarchy;
                            if (i === (point.length - 1)) {
                                hierarchy = new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights(
                                    [
                                        lon, lat, h,
                                        point[i].x, point[i].y, 0,
                                        point[0].x, point[0].y, 0
                                    ]))
                            } else {
                                hierarchy = new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights(
                                    [
                                        lon, lat, h,
                                        point[i].x, point[i].y, 0,
                                        point[i + 1].x, point[i + 1].y, 0
                                    ]))
                            }

                            var entityC = $this._pluginLayer.entities.add({
                                name: "三角形",
                                polygon: {
                                    hierarchy: hierarchy,
                                    outline: false,
                                    perPositionHeight: true,//允许三角形使用点的高度
                                    material: data.material
                                }
                            });
                            entityCList.push(entityC);
                        }

                        return entityCList
                    }
                    /**
                     * 改变每个面的位置
                     * @param {*} data 
                     * @param {*} entity 
                     * @param {*} arr 
                     */
                    var createLightScan_changeOnePosition = function (data, entity, arr) {
                        var positionList = data.positionList;
                        var x, y, x0, y0, X0, Y0, n = 0, a = 0;//x代表差值 x0代表差值等分后的值，X0表示每次回调改变的值。a表示回调的循环窜次数，n表示扫描的坐标个数
                        function f(i) {
                            x = positionList[i + 1][0] - positionList[i][0];//差值
                            y = positionList[i + 1][1] - positionList[i][1];//差值
                            x0 = x / data.number;//将差值等分500份
                            y0 = y / data.number;
                            a = 0;
                        }
                        f(n);
                        entity.polygon.hierarchy = new Cesium.CallbackProperty(function () { //回调函数
                            if ((Math.abs(X0) >= Math.abs(x)) && (Math.abs(Y0) >= Math.abs(y))) { //当等分差值大于等于差值的时候 就重新计算差值和等分差值  Math.abs
                                n = n + 1;
                                if (n === positionList.length - 1) {
                                    n = 0;
                                }
                                arr[0] = arr[0] + X0;
                                arr[1] = arr[1] + Y0;
                                arr[2] = arr[2] + X0;
                                arr[3] = arr[3] + Y0;
                                f(n);//重新赋值 x y x0 y0
                            }
                            X0 = a * x0;//将差值的等份逐渐递增。直到大于差值 会有精度丢失,所以扩大再加 x0=x0+0.0001
                            Y0 = a * y0;//将差值的等份逐渐递增。直到大于差值 会有精度丢失,所以扩大再加
                            a++;
                            return new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights(
                                [
                                    data.observer[0], data.observer[1], data.observer[2],
                                    arr[0] + X0, arr[1] + Y0, 0,
                                    arr[2] + X0, arr[3] + Y0, 0
                                ]))
                        }, false)
                    }

                    //生成分割点
                    var point = $this._getCirclePoints(data.circle[0], data.circle[1], data.circle[2], data.circle[3]); //生成分割点 
                    //生成 entityCList 圆锥
                    var entityCList = createLightScan_entityCList(point, data) //生成 entityCList 圆锥

                    for (var i = 0; i < entityCList.length; i++) {

                        if (i !== entityCList.length - 1) {

                            createLightScan_changeOnePosition(data, entityCList[i], [point[i].x, point[i].y, point[i + 1].x, point[i + 1].y]) //中间arr 代表的是点的坐标
                        } else {

                            createLightScan_changeOnePosition(data, entityCList[i], [point[i].x, point[i].y, point[0].x, point[0].y])
                        }
                    }
                    return entityCList
                }
            },
            // 路径漫游
            buildPathRoaming: function (options) {

                if (this._viewer && options && options.paths) {

                    var _paths = options.paths, _property = new Cesium.SampledPositionProperty(),
                        _rEntity = this.createGraphics(),
                        _startTime = new Cesium.JulianDate(),
                        _stopTime = Cesium.JulianDate.addSeconds(
                            _startTime,
                            (_paths.length - 1) * 120,
                            new Cesium.JulianDate()
                        );
                    var startTime = options.startTime || _startTime
                    var stopTime = options.stopTime || _stopTime
                    this._viewer.clock.startTime = startTime.clone(); // 设置始时钟始时间
                    this._viewer.clock.currentTime = startTime.clone(); // 设置时钟当前时间
                    this._viewer.clock.stopTime = stopTime.clone(); // 设置始终停止时间
                    this._viewer.clock.multiplier = options.multiplier || 10; // 时间速率，数字越大时间过的越快
                    this._viewer.clock.clockRange = options.clockRange || Cesium.ClockRange.LOOP_STOP; // 循环执行
                    for (var i = 0; i < _paths.length; i++) {
                        var cartesian = Cesium.Cartesian3.fromDegrees(
                            _paths[i].lon,
                            _paths[i].lat,
                            _paths[i].alt
                        );
                        var time = Cesium.JulianDate.addSeconds(
                            startTime,
                            _paths[i].time,
                            new Cesium.JulianDate()
                        );
                        _property.addSample(time, cartesian); // 添加位置，和时间对应
                    }
                    _rEntity.name = options.name || "路径漫游";
                    _rEntity.availability = new Cesium.TimeIntervalCollection([

                        new Cesium.TimeInterval({ start: startTime, stop: stopTime })
                    ]); // 和时间轴关联

                    _rEntity.position = _property;

                    _rEntity.orientation = new Cesium.VelocityOrientationProperty(_property); //基于位置移动自动计算方向

                    // 添加图形
                    var polyline = [];
                    if (options.polyline) {
                        _rEntity.polyline = {
                            positions: new Cesium.CallbackProperty(function () {
                                return polyline;
                            }, false),
                            width: 10,
                            material: new Cesium.PolylineGlowMaterialProperty({
                                glowPower: 1,
                                color: Cesium.Color.RED
                            }),
                            clampToGround: true
                        };
                    }

                    if (options.model) {
                        _rEntity.model = this.getModelGraphics(options)
                    }

                    if (options.label) {

                        _rEntity.label = this.getLabelGraphics(options)
                    }
                    if (options.billboard) {
                        _rEntity.billboard = this.getBillboardGraphics(options)
                    }

                    return this._pluginLayer.entities.add(_rEntity)
                }
            },
            /**
             * 拓展css3的动画 html元素
             */
            _installCss3Renderer: function () {
                /**
                 * 添加css3 html元素
                 * @param app
                 * @param elements
                 * @param isBackHide
                 * @constructor
                 */
                if (this._viewer) {
                    var viewer = this._viewer;
                    function Css3Renderer(elements, isBackHide) {

                        this._scratch = new Cesium.Cartesian2()
                        this._viewer = viewer
                        this._scene = viewer.scene,
                            this._camera = viewer.camera

                        this._container = null
                        this._elements = elements
                        this._isBackHide = isBackHide

                        this.init()
                    }
                    Css3Renderer.prototype.init = function () {

                        var container = document.createElement('div')
                        container.className = `ys-css3-container`
                        document.body.appendChild(container)
                        this._container = container

                        this._elements.forEach(function (e) {
                            container.insertAdjacentHTML('beforeend', e.element);
                        })
                        var $this = this
                        this._scene.preRender.addEventListener(function () {
                            //
                            for (var i = 0; i < container.children.length; i++) {
                                var p = Cesium.Cartesian3.fromDegrees($this._elements[i].position[0], $this._elements[i].position[1], $this._elements[i].position[2] || 0)
                                var canvasPosition = $this._scene.cartesianToCanvasCoordinates(p, $this._scratch)
                                if (Cesium.defined(canvasPosition)) {
                                    container.children[i].style.left = parseFloat(canvasPosition.x) + parseFloat($this._elements[i].offset[0]) + 'px'
                                    container.children[i].style.top = parseFloat(canvasPosition.y) + parseFloat($this._elements[i].offset[1]) + 'px'
                                    if ($this._isBackHide) {
                                        var j = $this._camera.position, n = $this._scene.globe.ellipsoid.cartesianToCartographic(j).height;
                                        if (!(n += 1 * $this._scene.globe.ellipsoid.maximumRadius, Cesium.Cartesian3.distance(j, p) > n)) {
                                            container.children[i].style.display = 'block'
                                        } else {
                                            container.children[i].style.display = 'none'
                                        }
                                    }
                                }
                            }
                        })
                    }
                    Css3Renderer.prototype.remove = function (id) {
                        this._elements = this._elements.filter(function (e) { e.id !== id })
                        this._container.removeChild(document.getElementById(id))
                    }

                    Css3Renderer.prototype.append = function (object) {
                        this._elements.push(object)
                        this._container.insertAdjacentHTML('beforeend', object.element)
                    }

                    Css3Renderer.prototype.removeEntityLayer = function (id) {
                        this._viewer.entities.removeById(id + "_1")
                        this._viewer.entities.removeById(id + "_2")
                        this._viewer.entities.removeById(id + "_3")
                        this.remove(id)
                    }

                    Css3Renderer.prototype.addEntityLayer = function (object) {
                        var lon = object.position[0],
                            lat = object.position[1],
                            sStartFlog = false,
                            $this = this,
                            s1 = 0.001,
                            s2 = s1,
                            s3 = s1,
                            s4 = s1
                        setTimeout(function (sStartFlog) { sStartFlog = true }, 300)
                        var rotation = Cesium.Math.toRadians(30);
                        var rotation2 = Cesium.Math.toRadians(30);

                        //构建entity
                        var height = object.boxHeight || 300, heightMax = object.boxHeightMax || 400, heightDif = object.boxHeightDif || 10;
                        var goflog = true
                        //添加正方体
                        if (object.boxShow) {
                            this._viewer.entities.add({
                                id: object.id + "_1",
                                name: "立方体盒子",
                                position: new Cesium.CallbackProperty(function () {
                                    height = height + heightDif;
                                    if (height >= heightMax) {
                                        height = heightMax
                                    }
                                    return Cesium.Cartesian3.fromDegrees(lon, lat, height / 2)
                                }, false),
                                box: {
                                    dimensions: new Cesium.CallbackProperty(function () {
                                        height = height + heightDif
                                        if (height >= heightMax) {
                                            height = heightMax
                                            if (goflog) { //需要增加判断 不然它会一直执行; 导致对div的dom操作 会一直重复
                                                goflog = false
                                                $this.append(object, true)
                                            }
                                        }
                                        return new Cesium.Cartesian3(object.boxSide || 100, object.boxSide || 100, height)
                                    }, false),
                                    material: object.boxMaterial || Cesium.Color.DEEPSKYBLUE.withAlpha(0.5)
                                }
                            });
                        } else {
                            // 只要弹出框
                            setTimeout(function () { $this.append(object, true) }, 100)
                        }
                        if (object.circleShow) {
                            object.circleSize = object.circleSize || 120
                            //添加底座 一 外环
                            this._viewer.entities.add({
                                id: object.id + "_2",
                                name: "椭圆",
                                position: Cesium.Cartesian3.fromDegrees(lon, lat),
                                ellipse: {
                                    // semiMinorAxis : object.circleSize, //直接这个大小 会有一个闪白的材质 因为cesium材质默认是白色 所以我们先将大小设置为0
                                    // semiMajorAxis : object.circleSize,
                                    semiMinorAxis: new Cesium.CallbackProperty(function () {
                                        if (sStartFlog) {
                                            s1 = s1 + object.circleSize / 20;
                                            if (s1 >= object.circleSize) {
                                                s1 = object.circleSize;
                                            }
                                        }
                                        return s1;
                                    }, false),
                                    semiMajorAxis: new Cesium.CallbackProperty(function () {
                                        if (sStartFlog) {
                                            s2 = s2 + object.circleSize / 20;
                                            if (s2 >= object.circleSize) {
                                                s2 = object.circleSize
                                            }
                                        }
                                        return s2;
                                    }, false),
                                    material: "data/images/Textures/circle2.png",
                                    rotation: new Cesium.CallbackProperty(function () {
                                        rotation += 0.05;
                                        return rotation;
                                    }, false),
                                    stRotation: new Cesium.CallbackProperty(function () {
                                        rotation += 0.05;
                                        return rotation;
                                    }, false),
                                    zIndex: 2,
                                }
                            });
                            //添加底座二 内环
                            this._viewer.entities.add({
                                id: object.id + "_3",
                                name: "椭圆",
                                position: Cesium.Cartesian3.fromDegrees(lon, lat),
                                ellipse: {
                                    semiMinorAxis: new Cesium.CallbackProperty(function () {
                                        if (sStartFlog) {
                                            s3 = s3 + object.circleSize / 20;
                                            if (s3 >= object.circleSize / 2) {
                                                s3 = object.circleSize / 2;
                                            }
                                        }
                                        return s3;
                                    }, false),
                                    semiMajorAxis: new Cesium.CallbackProperty(function () {
                                        if (sStartFlog) {
                                            s4 = s4 + object.circleSize / 20;
                                            if (s4 >= object.circleSize / 2) {
                                                s4 = object.circleSize / 2;
                                            }
                                        }
                                        return s4;
                                    }, false),
                                    material: "data/images/Textures/circle1.png",
                                    rotation: new Cesium.CallbackProperty(function () {
                                        rotation2 -= 0.03
                                        return rotation2
                                    }, false),
                                    stRotation: new Cesium.CallbackProperty(function () {
                                        rotation2 -= 0.03
                                        return rotation2
                                    }, false),
                                    zIndex: 3
                                }
                            })
                        }
                    }
                    Cesium.Css3Renderer = Css3Renderer
                }

            },
            // 拓展近景天空盒
            _installGroundSkyBox: function () {

                var BoxGeometry = Cesium.BoxGeometry,
                    Cartesian3 = Cesium.Cartesian3,
                    defaultValue = Cesium.defaultValue,
                    defined = Cesium.defined,
                    destroyObject = Cesium.destroyObject,
                    DeveloperError = Cesium.DeveloperError,
                    GeometryPipeline = Cesium.GeometryPipeline,
                    Matrix3 = Cesium.Matrix3,
                    Matrix4 = Cesium.Matrix4,
                    Transforms = Cesium.Transforms,
                    VertexFormat = Cesium.VertexFormat,
                    BufferUsage = Cesium.BufferUsage,
                    CubeMap = Cesium.CubeMap,
                    DrawCommand = Cesium.DrawCommand,
                    loadCubeMap = Cesium.loadCubeMap,
                    RenderState = Cesium.RenderState,
                    VertexArray = Cesium.VertexArray,
                    BlendingState = Cesium.BlendingState,
                    SceneMode = Cesium.SceneMode,
                    ShaderProgram = Cesium.ShaderProgram,
                    ShaderSource = Cesium.ShaderSource;
                //片元着色器，直接从源码复制
                var SkyBoxFS = "uniform samplerCube u_cubeMap;\n\
                varying vec3 v_texCoord;\n\
                void main()\n\
                {\n\
                vec4 color = textureCube(u_cubeMap, normalize(v_texCoord));\n\
                gl_FragColor = vec4(czm_gammaCorrect(color).rgb, czm_morphTime);\n\
                }\n\
                ";

                //顶点着色器有修改，主要是乘了一个旋转矩阵
                var SkyBoxVS = "attribute vec3 position;\n\
                varying vec3 v_texCoord;\n\
                uniform mat3 u_rotateMatrix;\n\
                void main()\n\
                {\n\
                vec3 p = czm_viewRotation * u_rotateMatrix * (czm_temeToPseudoFixed * (czm_entireFrustum.y * position));\n\
                gl_Position = czm_projection * vec4(p, 1.0);\n\
                v_texCoord = position.xyz;\n\
                }\n\
                ";
                /**
                 * 为了兼容高版本的Cesium，因为新版cesium中getRotation被移除
                 */
                if (!defined(Matrix4.getRotation)) {
                    Matrix4.getRotation = Matrix4.getMatrix3
                }
                function SkyBoxOnGround(options) {

                    this.sources = options.sources;
                    this._sources = undefined;
                    /**
                     * Determines if the sky box will be shown.
                     *
                     * @type {Boolean}
                     * @default true
                     */
                    this.show = defaultValue(options.show, true);

                    this._command = new DrawCommand({
                        modelMatrix: Matrix4.clone(Matrix4.IDENTITY),
                        owner: this
                    });
                    this._cubeMap = undefined;

                    this._attributeLocations = undefined;
                    this._useHdr = undefined;
                }
                var skyboxMatrix3 = new Matrix3();
                SkyBoxOnGround.prototype.update = function (frameState, useHdr) {
                    var that = this;

                    if (!this.show) {
                        return undefined;
                    }

                    if ((frameState.mode !== SceneMode.SCENE3D) &&
                        (frameState.mode !== SceneMode.MORPHING)) {
                        return undefined;
                    }

                    if (!frameState.passes.render) {
                        return undefined;
                    }

                    var context = frameState.context;

                    if (this._sources !== this.sources) {
                        this._sources = this.sources;
                        var sources = this.sources;

                        if ((!defined(sources.positiveX)) ||
                            (!defined(sources.negativeX)) ||
                            (!defined(sources.positiveY)) ||
                            (!defined(sources.negativeY)) ||
                            (!defined(sources.positiveZ)) ||
                            (!defined(sources.negativeZ))) {
                            throw new DeveloperError('this.sources is required and must have positiveX, negativeX, positiveY, negativeY, positiveZ, and negativeZ properties.');
                        }

                        if ((typeof sources.positiveX !== typeof sources.negativeX) ||
                            (typeof sources.positiveX !== typeof sources.positiveY) ||
                            (typeof sources.positiveX !== typeof sources.negativeY) ||
                            (typeof sources.positiveX !== typeof sources.positiveZ) ||
                            (typeof sources.positiveX !== typeof sources.negativeZ)) {
                            throw new DeveloperError('this.sources properties must all be the same type.');
                        }

                        if (typeof sources.positiveX === 'string') {
                            // Given urls for cube-map images.  Load them.
                            loadCubeMap(context, this._sources).then(function (cubeMap) {
                                that._cubeMap = that._cubeMap && that._cubeMap.destroy();
                                that._cubeMap = cubeMap;
                            });
                        } else {
                            this._cubeMap = this._cubeMap && this._cubeMap.destroy();
                            this._cubeMap = new CubeMap({
                                context: context,
                                source: sources
                            });
                        }
                    }

                    var command = this._command;

                    command.modelMatrix = Transforms.eastNorthUpToFixedFrame(frameState.camera._positionWC);
                    if (!defined(command.vertexArray)) {
                        command.uniformMap = {
                            u_cubeMap: function () {
                                return that._cubeMap;
                            },
                            u_rotateMatrix: function () {
                                return Matrix4.getRotation(command.modelMatrix, skyboxMatrix3);
                            },
                        };

                        var geometry = BoxGeometry.createGeometry(BoxGeometry.fromDimensions({
                            dimensions: new Cartesian3(2.0, 2.0, 2.0),
                            vertexFormat: VertexFormat.POSITION_ONLY
                        }));
                        var attributeLocations = this._attributeLocations = GeometryPipeline.createAttributeLocations(geometry);

                        command.vertexArray = VertexArray.fromGeometry({
                            context: context,
                            geometry: geometry,
                            attributeLocations: attributeLocations,
                            bufferUsage: BufferUsage._DRAW
                        });

                        command.renderState = RenderState.fromCache({
                            blending: BlendingState.ALPHA_BLEND
                        });
                    }

                    if (!defined(command.shaderProgram) || this._useHdr !== useHdr) {
                        var fs = new ShaderSource({
                            defines: [useHdr ? 'HDR' : ''],
                            sources: [SkyBoxFS]
                        });
                        command.shaderProgram = ShaderProgram.fromCache({
                            context: context,
                            vertexShaderSource: SkyBoxVS,
                            fragmentShaderSource: fs,
                            attributeLocations: this._attributeLocations
                        });
                        this._useHdr = useHdr;
                    }

                    if (!defined(this._cubeMap)) {
                        return undefined;
                    }

                    return command;
                };
                SkyBoxOnGround.prototype.isDestroyed = function () {
                    return false
                };
                SkyBoxOnGround.prototype.destroy = function () {
                    var command = this._command;
                    command.vertexArray = command.vertexArray && command.vertexArray.destroy();
                    command.shaderProgram = command.shaderProgram && command.shaderProgram.destroy();
                    this._cubeMap = this._cubeMap && this._cubeMap.destroy();
                    return destroyObject(this);
                }

                Cesium.GroundSkyBox = SkyBoxOnGround
            }
        }
        /**
         * 图元拓展模块
         * @param {*} viewer 
         */
        function Primitive(viewer) {
            if (viewer) {
                this._installPrimitives()
            }
        }
        Primitive.prototype = {
            /**
             * 安装拓展图元
             */
            _installPrimitives: function () {

                this._installProbingPrimitive()

                this._installTexturePrimitive()

                this._installWaterPrimitive()

                this._installPointsPrimitive()

                this._installShadowPrimitive()

                this._installArrowPolylinePrimitive()

                this._installXyzAxisPrimitive()

                this._installTetrahedronPrimitive()

                this._installCustomPrimitive()

            },
            /**
             * 自定义图元
             */
            _installCustomPrimitive: function () {

                function CustomPrimitive(options) {

                }
            },
            /**
             * 光锥图元
             */
            _installTetrahedronPrimitive: function () {
                try {


                    var Cartesian3 = Cesium.Cartesian3
                        , ComponentDatatype = Cesium.ComponentDatatype
                        , PrimitiveType = Cesium.PrimitiveType
                        , BoundingSphere = Cesium.BoundingSphere
                        , GeometryAttribute = Cesium.GeometryAttribute
                        , GeometryPipeline = Cesium.GeometryPipeline
                        , Geometry = Cesium.Geometry
                        , defined = Cesium.defined
                        , RenderState = Cesium.RenderState
                        , ShaderSource = Cesium.ShaderSource
                        , ShaderProgram = Cesium.ShaderProgram
                        , DrawCommand = Cesium.DrawCommand
                        , RenderState = Cesium.RenderState
                        , Pass = Cesium.Pass
                        , Appearance = Cesium.Appearance
                        , BufferUsage = Cesium.BufferUsage
                        , Color = Cesium.Color
                        , VertexArray = Cesium.VertexArray
                        , Pass = Cesium.Pass
                        , buildModuleUrl = Cesium.buildModuleUrl
                        , Matrix4 = Cesium.Matrix4
                        , Matrix3 = Cesium.Matrix3
                        , Texture = Cesium.Texture
                        , Resource = Cesium.Resource
                        , Transforms = Cesium.Transforms
                        , defaultValue = Cesium.defaultValue
                        , _viewer = this._viewer;

                    function TetrahedronPrimitive(options) {
                        this.show = true;
                        this._command = undefined;
                        this._enuMatrix = undefined;
                        this._scaleMatrix = undefined;
                        this._localPosition = options.position
                        this._createCommand = createCommand;
                        this._angle = 0;
                        this._distance = defaultValue(options.distance, 1);
                        this._setInterval = undefined;
                        this._viewer = _viewer;
                        this._speed = defaultValue(options.speed, 1.0);
                        this._color = defaultValue(options.color, new Color(1.0, 1.0, 0.0, 0.8));
                        this._scale = defaultValue(options.scale, new Cartesian3(10, 10, 15));
                        this._texture = undefined;
                        this._imageUrl = buildModuleUrl('ThirdParty/fence.png');
                        this._modelMatrix = computeModelMatrix(this);
                        this._height = computeHeight(this);
                        createTexture(this);
                    }
                    TetrahedronPrimitive.prototype.update = function (frameState) {
                        if (!this.show) {
                            return;
                        }
                        if (!defined(this._command)) {
                            this._command = this._createCommand(frameState.context, this);
                            this._command.pickId = 'v_pickColor';
                        }
                        if (defined(this._command)) {
                            frameState.commandList.push(this._command);
                        }
                    }
                    TetrahedronPrimitive.prototype.isDestroyed = function () {
                        return false;
                    }
                    TetrahedronPrimitive.prototype.destroy = function () {
                        if (defined(this._command)) {
                            this._command.shaderProgram = this._command.shaderProgram && this._command.shaderProgram.destroy();
                        }
                        return destroyObject(this);
                    }
                    //开启动画
                    TetrahedronPrimitive.prototype.startAnimate = function () {
                        let that = this;
                        this._setInterval = setInterval(animateFunc, 5);
                        function animateFunc() {
                            that._angle = that._angle + 0.01;
                            Math.sin(that._angle) > 0 ? that._height = 0.01 : that._height = -0.01;
                            let translation = new Cesium.Cartesian3(0, 0, that._height);
                            Matrix4.multiplyByTranslation(that._modelMatrix, translation, that._modelMatrix)
                            let rotationZ = Matrix4.fromRotationTranslation(Matrix3.fromRotationZ(Cesium.Math.toRadians(that._speed)));
                            Matrix4.multiply(that._modelMatrix, rotationZ, that._modelMatrix);
                        }
                    }
                    //关闭动画
                    TetrahedronPrimitive.prototype.closeAnimate = function () {
                        clearInterval(this._setInterval);
                    }
                    //创建command
                    function createCommand(context, tetrahedronPrimitive) {
                        var translucent = false;
                        var closed = true;
                        var vs = creaateVertexShader();
                        var fs = createFragmentShader();
                        // 借用一下Appearance.getDefaultRenderState
                        var rawRenderState = Appearance.getDefaultRenderState(translucent, closed, undefined);
                        var renderState = RenderState.fromCache(rawRenderState);
                        var vertexShaderSource = new ShaderSource({
                            sources: [vs]
                        });
                        var fragmentShaderSource = new ShaderSource({
                            sources: [fs]
                        });
                        var uniformMap = {
                            color: function () {
                                return tetrahedronPrimitive._color;
                            },
                            myImage: function () {
                                if (defined(tetrahedronPrimitive._texture)) {
                                    return tetrahedronPrimitive._texture;
                                } else {
                                    return tetrahedronPrimitive._viewer.scene.context.defaultTexture;
                                }
                            }
                        }
                        let attributeLocations = {
                            position: 0,
                            textureCoordinates: 1
                        };
                        var shaderProgram = ShaderProgram.fromCache({
                            context: context,
                            vertexShaderSource: vertexShaderSource,
                            fragmentShaderSource: fragmentShaderSource,
                            attributeLocations: attributeLocations
                        });
                        return new DrawCommand({
                            vertexArray: createVertexArray(context),
                            primitiveType: PrimitiveType.TRIANGLES,
                            renderState: renderState,
                            shaderProgram: shaderProgram,
                            uniformMap: uniformMap,
                            owner: this,
                            pass: Pass.TRANSLUCENT,
                            modelMatrix: tetrahedronPrimitive._modelMatrix,
                        });
                    }
                    //创建vertexArray
                    function createVertexArray(context) {
                        let attributeLocations = {
                            position: 0,
                            textureCoordinates: 1
                        };
                        var positionsAndIndice = cereatePositionsAndIndice();
                        var geometry = new Geometry({
                            attributes: {
                                position: new GeometryAttribute({
                                    // 使用double类型的position进行计算
                                    // componentDatatype : Cesium.ComponentDatatype.DOUBLE,
                                    componentDatatype: ComponentDatatype.FLOAT,
                                    componentsPerAttribute: 3,
                                    values: positionsAndIndice.positions
                                }),
                                textureCoordinates: new GeometryAttribute({
                                    componentDatatype: ComponentDatatype.FLOAT,
                                    componentsPerAttribute: 2,
                                    values: positionsAndIndice.sts
                                }),
                            },
                            // Workaround Internet Explorer 11.0.8 lack of TRIANGLE_FAN
                            indices: positionsAndIndice.indices,
                            primitiveType: PrimitiveType.TRIANGLES,
                            boundingSphere: BoundingSphere.fromVertices(positionsAndIndice.positions)
                        });
                        //计算geometry的法向量
                        var geometryNormal = GeometryPipeline.computeNormal(geometry);
                        var vertexArray = VertexArray.fromGeometry({
                            context: context,
                            geometry: geometryNormal,
                            attributeLocations: attributeLocations,
                            bufferUsage: BufferUsage.STATIC_DRAW,
                        });

                        return vertexArray;
                    }
                    //创建顶点数组与索引
                    function cereatePositionsAndIndice() {
                        var positions = new Float64Array(5 * 3);
                        // position 0
                        positions[0] = 0.0;
                        positions[1] = 1.0;
                        positions[2] = 0.0;

                        // position 1
                        positions[3] = -1.0;
                        positions[4] = 0.0;
                        positions[5] = 0.0;

                        // position 2
                        positions[6] = 0.0;
                        positions[7] = -1.0;
                        positions[8] = 0.0;

                        // position 3
                        positions[9] = 1.0;
                        positions[10] = 0.0;
                        positions[11] = 0.0;

                        // position 4
                        positions[12] = 0.0;
                        positions[13] = 0.0;
                        positions[14] = -1.0;
                        var indices = new Uint16Array(6 * 3);
                        // back triangle
                        indices[0] = 4;
                        indices[1] = 2;
                        indices[2] = 3;

                        // left triangle
                        indices[3] = 4;
                        indices[4] = 3;
                        indices[5] = 0;

                        // right triangle
                        indices[6] = 4;
                        indices[7] = 0;
                        indices[8] = 1;

                        // bottom triangle
                        indices[9] = 4;
                        indices[10] = 1;
                        indices[11] = 2;
                        // bottom triangle
                        indices[12] = 1;
                        indices[13] = 2;
                        indices[14] = 3;

                        // bottom triangle
                        indices[15] = 1;
                        indices[16] = 3;
                        indices[17] = 0;

                        // 1.3 定义纹理数组
                        var sts = new Float32Array([
                            0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
                            0.0, 1.0, 0.5, 0.5,
                        ]);
                        return {
                            indices: indices,
                            positions: positions,
                            sts: sts
                        }
                    }
                    //创建顶点着色器
                    function creaateVertexShader() {
                        var vertexShader =
                            `
                        attribute vec3 position;
                        attribute vec3 normal;
                        attribute vec2 st;
                        attribute float batchId;
                        varying vec3 v_positionEC;
                        varying vec3 v_normalEC;
                        varying vec2 v_st;
                        varying vec4 v_pickColor;
                        void main()
                        {
                            v_positionEC = (czm_modelView * vec4(position, 1.0)).xyz;       // position in eye coordinates
                            v_normalEC = czm_normal * normal;                               // normal in eye coordinates
                            v_st = st;
                            //v_pickColor = czm_batchTable_pickColor(batchId);
                            gl_Position = czm_modelViewProjection * vec4(position, 1.0);
                        }
                        `;
                        return vertexShader;
                    }
                    //创建片源着色器
                    function createFragmentShader() {
                        var fragmentShader =
                            `
                        varying vec3 v_positionEC;
                        varying vec3 v_normalEC;
                        varying vec2 v_st;
                        uniform vec4 color;
                        varying vec4 v_pickColor;
                        uniform sampler2D myImage;
                        void main()
                        {
                            vec3 positionToEyeEC = -v_positionEC;
                            vec3 normalEC = normalize(v_normalEC);
                        #ifdef FACE_FORWARD
                            normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);
                        #endif
                            czm_materialInput materialInput;
                            materialInput.normalEC = normalEC;
                            materialInput.positionToEyeEC = positionToEyeEC;
                            materialInput.st = v_st;
                            vec2 st = materialInput.st;
                            czm_material material = czm_getDefaultMaterial(materialInput);
                            float dt_a11 = fract(czm_frameNumber / 100.0) * 3.14159265 * 2.0;
                            float dt_a12 = sin(dt_a11);
                            float vst=smoothstep(0.7, 1.0, dt_a12)+0.4;
                            vec4 colorImage = texture2D(myImage, vec2(fract(st.s- czm_frameNumber*0.003), st.t));
                            material.alpha =mix(0.1,1.0,clamp((1.0-st.t) * color.a,0.0,1.0)) +(1.0-sign(st.t-czm_frameNumber*0.001))*0.2*(1.0-colorImage.r)+0.4 ;
                            material.diffuse =(1.0-colorImage.a)*vec3(1.0,2.0,1.0)+colorImage.rgb*vec3(1.0,2.0,1.0);
                        #ifdef FLAT
                            gl_FragColor = vec4(material.diffuse + material.emission, material.alpha);
                        #else
                            gl_FragColor = czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC);
                        #endif
                        }
                        `;
                        return fragmentShader;
                    }
                    //创建纹理
                    function createTexture(tetrahedronPrimitive) {

                        Resource.createIfNeeded(tetrahedronPrimitive._imageUrl).fetchImage().then(function (image) {
                            var vTexture;
                            var context = tetrahedronPrimitive._viewer.scene.context;
                            if (defined(image.internalFormat)) {
                                vTexture = new Texture({
                                    context: context,
                                    pixelFormat: image.internalFormat,
                                    width: image.naturalWidth,
                                    height: image.naturalHeight,
                                    source: {
                                        arrayBufferView: image.bufferView
                                    }
                                });
                            } else {
                                vTexture = new Texture({
                                    context: context,
                                    source: image
                                });
                            }
                            tetrahedronPrimitive._texture = vTexture;
                        });
                    }
                    //计算矩阵
                    function computeModelMatrix(tetrahedronPrimitive) {
                        let enuMatrix = Transforms.eastNorthUpToFixedFrame(tetrahedronPrimitive._localPosition);
                        let scaleMatrix = Matrix4.fromScale(tetrahedronPrimitive._scale);
                        let modelMatrix = Matrix4.multiply(enuMatrix, scaleMatrix, new Matrix4());
                        tetrahedronPrimitive._scaleMatrix = scaleMatrix;
                        tetrahedronPrimitive._enuMatrix = enuMatrix;
                        return modelMatrix;
                    }
                    //计算高度
                    function computeHeight(tetrahedronPrimitive) {
                        let point = Cartesian3.fromElements(0, 0, tetrahedronPrimitive._distance, new Cesium.Cartesian3());
                        let enuPoint = Cesium.Matrix4.multiplyByPoint(tetrahedronPrimitive._enuMatrix, point, new Cartesian3());
                        let upPositionEC = Matrix4.multiplyByPoint(tetrahedronPrimitive._viewer.scene.camera._viewMatrix, enuPoint, new Cartesian3());
                        let upPositionPC = Matrix4.multiplyByPoint(tetrahedronPrimitive._viewer.scene.camera.frustum.projectionMatrix, upPositionEC, new Cartesian3());
                        return Cartesian3.normalize(upPositionPC, new Cartesian3()).z;
                    }

                    Cesium.TetrahedronPrimitive = TetrahedronPrimitive;
                } catch (error) {

                    console.log(error)
                }

            },
            _installXyzAxisPrimitive: function () {

                function XyzAxisPrimitive(option) {
                    this._viewer = option.viewer

                    this._model = option.model

                    this._matrix = option.matrix

                    this._radius = undefined

                    this._layer = new Cesium.CustomDataSource('xyz-axis')

                    this._viewer.dataSources.add(this._layer)

                    this._handler = new Cesium.ScreenSpaceEventHandler(this._viewer.scene.canvas);

                    this._xyzState = false
                    this._xyzPid = undefined

                    this._build()
                }
                XyzAxisPrimitive.prototype = {
                    _build() {
                        this._createAxisXYZ()
                        this._bindHandler()
                    },
                    remove() {
                        this._layer._primitives.removeAll()
                        this._handler.distory()
                    },
                    _createAxisXYZ: function () {

                        this._model.readyPromise.then(m => {
                            const center1 = Cesium.Matrix4.getTranslation(
                                m.modelMatrix,
                                new Cesium.Cartesian3()
                            );
                            const boundingShpere = m.boundingSphere;
                            const radius = boundingShpere.radius
                            const axisZ = new Cesium.ArrowPolylinePrimitive({
                                id: "axisZ",
                                color: Cesium.Color.RED,
                                position: center1,
                                width: 3,
                                headWidth: 5,
                                length: radius * 2 + 50,
                                headLength: 10
                            });
                            const axisX = new Cesium.ArrowPolylinePrimitive({
                                id: "axisX",
                                color: Cesium.Color.GREEN,
                                position: center1,
                                width: 3,
                                headWidth: 5,
                                length: radius * 2 + 50,
                                headLength: 10
                            });
                            const axisY = new Cesium.ArrowPolylinePrimitive({
                                id: "axisY",
                                color: Cesium.Color.BLUE,
                                position: center1,
                                width: 3,
                                headWidth: 5,
                                length: radius * 2 + 50,
                                headLength: 10
                            });

                            const mx = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(90));
                            this._rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
                            Cesium.Matrix4.multiply(
                                axisX.geometryInstances[0].modelMatrix,
                                this._rotationX,
                                axisX.geometryInstances[0].modelMatrix
                            );
                            Cesium.Matrix4.multiply(
                                axisX.geometryInstances[1].modelMatrix,
                                this._rotationX,
                                axisX.geometryInstances[1].modelMatrix
                            );
                            const my = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(90));
                            this._rotationY = Cesium.Matrix4.fromRotationTranslation(my);
                            Cesium.Matrix4.multiply(
                                axisY.geometryInstances[0].modelMatrix,
                                this._rotationY,
                                axisY.geometryInstances[0].modelMatrix
                            );
                            Cesium.Matrix4.multiply(
                                axisY.geometryInstances[1].modelMatrix,
                                this._rotationY,
                                axisY.geometryInstances[1].modelMatrix
                            );
                            this._layer._primitives.add(axisZ)
                            this._layer._primitives.add(axisX)
                            this._layer._primitives.add(axisY)

                            this._radius = boundingShpere.radius
                            this._createAxisSphere()
                        });
                    },
                    _createAxisSphere: function () {
                        const position = [];
                        for (let i = 0; i <= 360; i += 3) {
                            const sin = Math.sin(Cesium.Math.toRadians(i));
                            const cos = Math.cos(Cesium.Math.toRadians(i));
                            const x = this._radius * cos;
                            const y = this._radius * sin;
                            position.push(new Cesium.Cartesian3(x, y, 0));
                        }

                        const axisSphereZ = this._createAxisSpheres(
                            "axisSphereZ",
                            position,
                            this._matrix,
                            Cesium.Color.RED
                        );
                        this._layer._primitives.add(axisSphereZ);
                        const axisSphereY = this._createAxisSpheres(
                            "axisSphereY",
                            position,
                            this._matrix,
                            Cesium.Color.GREEN
                        );
                        this._layer._primitives.add(axisSphereY);
                        Cesium.Matrix4.multiply(
                            axisSphereY.geometryInstances.modelMatrix,
                            this._rotationY,
                            axisSphereY.geometryInstances.modelMatrix
                        );
                        const axisSphereX = this._createAxisSpheres(
                            "axisSphereX",
                            position,
                            this._matrix,
                            Cesium.Color.BLUE
                        );
                        this._layer._primitives.add(axisSphereX);
                        Cesium.Matrix4.multiply(
                            axisSphereX.geometryInstances.modelMatrix,
                            this._rotationX,
                            axisSphereX.geometryInstances.modelMatrix
                        );
                    },
                    _createAxisSpheres: function (id, position, matrix, color) {
                        const geometry = new Cesium.PolylineGeometry({
                            positions: position,
                            width: 10
                        });
                        const instnce = new Cesium.GeometryInstance({
                            geometry: geometry,
                            id: id,
                            attributes: {
                                color: Cesium.ColorGeometryInstanceAttribute.fromColor(color)
                            }
                        });
                        return new Cesium.Primitive({
                            geometryInstances: instnce,
                            appearance: new Cesium.PolylineColorAppearance({
                                translucent: false
                            }),
                            modelMatrix: matrix
                        });
                    },
                    _updateAxis(cartesian) {
                        if (this._layer) {
                            let primitives = this._layer._primitives._primitives
                            for (let i = 1, j = primitives.length; i < j; i++) {
                                let primitive = primitives[i]
                                const translation = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(cartesian.x, cartesian.y, cartesian.z))
                                Cesium.Matrix4.multiply(primitive.modelMatrix, translation, primitive.modelMatrix)
                            }
                        }
                        const translation = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(cartesian.x, cartesian.y, cartesian.z))
                        Cesium.Matrix4.multiply(this._model.modelMatrix, translation, this._model.modelMatrix)
                    },
                    _updateAxisSphere(angel) {
                        if (this._layer) {
                            let primitives = this._layer._primitives._primitives
                            for (let i = 1, j = primitives.length; i < j; i++) {
                                let primitive = primitives[i]
                                const rotation = Cesium.Matrix4.fromRotationTranslation(angel)
                                Cesium.Matrix4.multiply(primitive.modelMatrix, rotation, primitive.modelMatrix)
                            }
                        }
                        const rotation = Cesium.Matrix4.fromRotationTranslation(angel)
                        Cesium.Matrix4.multiply(this._model.modelMatrix, rotation, this._model.modelMatrix)
                    },
                    _bindHandler() {
                        //拖动
                        this._handler.setInputAction((click) => {
                            if (this._xyzState && this._xyzPid) {
                                switch (this._xyzPid) {
                                    case "axisX-line": this._updateAxis({ x: -1, y: 0, z: 0 }); break;
                                    case "axisY-line": this._updateAxis({ x: 0, y: -1, z: 0 }); break;
                                    case "axisZ-line": this._updateAxis({ x: 0, y: 0, z: -1 }); break;
                                    case "axisX-arrow": this._updateAxis({ x: 1, y: 0, z: 0 }); break;
                                    case "axisY-arrow": this._updateAxis({ x: 0, y: 1, z: 0 }); break;
                                    case "axisZ-arrow": this._updateAxis({ x: 0, y: 0, z: 1 }); break;
                                    case "axisSphereX": this._updateAxisSphere(Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(1))); break;
                                    case "axisSphereY": this._updateAxisSphere(Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(1))); break;
                                    case "axisSphereZ": this._updateAxisSphere(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(1))); break;
                                }
                            }
                        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

                        //拾取
                        this._handler.setInputAction((click) => {
                            let pickObj = viewer.scene.pick(click.position)
                            if (pickObj && pickObj.id) {
                                this._xyzPid = pickObj.id
                                    , this._xyzState = true
                            }
                        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

                        //结束
                        this._handler.setInputAction((click) => {
                            this._xyzState = false
                                , this._xyzPid = undefined;
                        }, Cesium.ScreenSpaceEventType.LEFT_UP);
                    }

                }
                Cesium.XyzAxisPrimitive = XyzAxisPrimitive
            },
            /**
             * 箭头线
             */
            _installArrowPolylinePrimitive: function () {

                function ArrowPolylinePrimitive(option = {}) {
                    this._color = option.color || Cesium.Color.RED;
                    this._width = option.width || 3;
                    this._headWidth = option.headWidth || 2 * this._width;
                    this._length = option.length || 300
                    this._headLength = option.headLength || 10
                    this._inverse = option.inverse || false
                    this.position = option.position
                    const id = option.id
                    //这里用的是圆锥几何对象，当topRadius和bottomRadius相同时，它就是一个圆柱
                    const line = Cesium.CylinderGeometry.createGeometry(new Cesium.CylinderGeometry({
                        length: this._length,
                        topRadius: this._width,
                        bottomRadius: this._width
                    }));
                    const arrow = Cesium.CylinderGeometry.createGeometry(new Cesium.CylinderGeometry({
                        length: this._headLength,
                        topRadius: 0,
                        bottomRadius: this._headWidth
                    }));
                    let offset = (this._length + this._headLength) / 2
                    if (this._inverse) {
                        offset = -offset
                    }

                    translate(arrow, [0, 0, offset]);

                    return new Cesium.Primitive({
                        modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(this.position),
                        geometryInstances: [new Cesium.GeometryInstance(
                            {
                                id: id + '-line',
                                geometry: line,
                            }
                        ),
                        new Cesium.GeometryInstance({
                            id: id + '-arrow',
                            geometry: arrow,
                        })],
                        appearance: new Cesium.MaterialAppearance({
                            material: Cesium.Material.fromType('Color', { color: this._color })
                        })
                    });
                }
                /**
                * 按上面的方法画出的箭头在线的中间，我们需要把它平移到线的一端
                */
                let translate = function (geometry, offset) {
                    const scratchOffset = new Cesium.Cartesian3();
                    if (offset.length) {
                        scratchOffset.x = offset[0];
                        scratchOffset.y = offset[1];
                        scratchOffset.z = offset[2];
                    } else {
                        Cesium.Cartesian3.clone(offset, scratchOffset);
                    }

                    for (let i = 0; i < geometry.attributes.position.values.length; i += 3) {
                        geometry.attributes.position.values[i] += scratchOffset.x;
                        geometry.attributes.position.values[i + 1] += scratchOffset.y;
                        geometry.attributes.position.values[i + 2] += scratchOffset.z;
                    }
                }
                Cesium.ArrowPolylinePrimitive = ArrowPolylinePrimitive
            },
            /**
             * 阴影图元
             */
            _installShadowPrimitive: function () {
                const ViewshedLineVS = "ttribute vec3 position;\n\
                uniform mat4 u_modelViewMatrix;\n\
                void main()\n\
                {\n\
                gl_Position = czm_projection* u_modelViewMatrix* vec4(position.xyz,1.0);\n\
                }\n\
                ";
                const ViewshedLineFS = "uniform vec4 u_bgColor;\n\
                void main()\n\
                {\n\
                gl_FragColor = u_bgColor;\n\
                }\n\
                ";
                function ShadowPrimitive(options) {

                    options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);
                    var scene = options.scene;
                    if (!Cesium.defined(scene)) {
                        throw new Cesium.DeveloperError('scene is required.');
                    }
                    this._scene = scene;
                    // options.context is an undocumented option
                    var context = scene._context;

                    // includeStart('debug', pragmas.debug);
                    if (!Cesium.defined(context)) {
                        throw new Cesium.DeveloperError('context is required.');
                    }

                    if (!Cesium.defined(options.viewerPosition)) {
                        throw new Cesium.DeveloperError('this view position is required.');
                    }
                    this._viewerPosition = options.viewerPosition;

                    this._positions = undefined
                    this._indices = undefined
                    this._drawLineCommand = undefined
                    this._depthCamera = new Cesium.Camera(scene);
                    this._depthCamera.position = this._viewerPosition;

                    this._direction = 0;
                    this._pitch = 0;
                    this._horizontalFov = Cesium.defaultValue(options.horizontalFov, 60);
                    this._verticalFov = Cesium.defaultValue(options.verticalFov, 45);

                    this._cameraUpdated = false;
                    this._targetPoint = this._viewerPosition.clone();

                    var t = new Cesium.Cartesian3(0, 0, 100);
                    var matrix_ENU = Cesium.Transforms.eastNorthUpToFixedFrame(this._viewerPosition);
                    //Cesium.Matrix4.inverse(matrix_ENU, matrix_ENU),
                    Cesium.Matrix4.multiplyByPoint(matrix_ENU, t, this._targetPoint);

                    this._distance = 100;
                    this._cameraUpdated = false;

                    this._modelMatrix = new Cesium.Matrix4,
                        this._shadowMap = new Cesium.ShadowMap({
                            context: context,
                            enabled: true,
                            lightCamera: this._depthCamera,
                            cascadesEnabled: false
                        });
                    //this._shadowMap.debugShow=true;

                    this.show = true;


                    this._invisiblyColor = Cesium.Color.RED;
                    this._visiblyColor = Cesium.Color.GREEN;
                    this._shadowMap.useCustomColor = true;
                    this.shadowMap._customColor = {
                        invisibly: Cesium.Color.RED,
                        visibly: Cesium.Color.GREEN
                    };

                    this._initialize = function () {
                        this._positions = new Float32Array(633),
                            this._indices = new Uint16Array(408);
                        var indices = this._indices
                            , r = 0;
                        indices[r++] = 0,
                            indices[r++] = 1,
                            indices[r++] = 0,
                            indices[r++] = 21,
                            indices[r++] = 0,
                            indices[r++] = 85,
                            indices[r++] = 0,
                            indices[r++] = 105;
                        for (var i = 0, n = 0; n < 5; ++n) {
                            i++;
                            for (var a = 0; a < 20; ++a)
                                indices[r++] = i++,
                                    indices[r++] = i
                        }
                        i++;
                        for (var s = 0; s < 20; ++s)
                            for (var l = 0; l < 5; ++l)
                                indices[r++] = i,
                                    indices[r++] = 5 + i++;
                        this._initialized = true;
                    };
                    //this._initialize();

                    this._debugLightFrustum = undefined;

                    this._debugShow = true;



                }

                Object.defineProperties(ShadowPrimitive.prototype, {

                    shadowMap: {
                        get: function () {
                            return this._shadowMap;
                        }
                    },
                    debugLightFrustum: {
                        get: function () {
                            return this._debugLightFrustum;
                        }
                    },
                    debugShow: {
                        get: function () {
                            return this._debugShow;
                        },
                        set: function (bShow) {
                            this.shadowMap.debugShow = bShow
                            this._debugShow = bShow;
                        }
                    },
                    invisiblyColor: {
                        get: function () {
                            return this._invisiblyColor;
                        },
                        set: function (color) {
                            this._invisiblyColor = color;
                            var shadowMap = this.shadowMap;
                            shadowMap._customColor.invisibly = color;
                        }
                    },
                    visiblyColor: {
                        get: function () {
                            return this._visiblyColor;
                        },
                        set: function (color) {
                            this._visiblyColor = color;
                            var shadowMap = this.shadowMap;
                            shadowMap._customColor.visibly = color;
                        }
                    },
                    viewerPosition: {
                        get: function () {
                            return this._viewerPosition
                        },
                        set: function (position) {
                            this._viewerPosition = position,
                                this._cameraUpdated = !1
                        }
                    },
                    direction: {
                        get: function () {
                            return this._direction
                        },
                        set: function (direction) {
                            this._direction = direction,
                                this._cameraUpdated = !1
                        }
                    },
                    pitch: {
                        get: function () {
                            return this._pitch
                        },
                        set: function (pitch) {
                            this._pitch = pitch,
                                this._cameraUpdated = !1
                        }
                    },
                    horizontalFov: {
                        get: function () {
                            return this._horizontalFov
                        },
                        set: function (e) {
                            this._horizontalFov = e,
                                this._cameraUpdated = !1,
                                this._hintLineUpdated = !1
                        }
                    },
                    verticalFov: {
                        get: function () {
                            return this._verticalFov
                        },
                        set: function (e) {
                            this._verticalFov = e,
                                this._cameraUpdated = !1,
                                this._hintLineUpdated = !1
                        }
                    },
                    distance: {
                        get: function () {
                            return this._distance
                        },
                        set: function (distance) {
                            this._distance = distance,
                                this._cameraUpdated = !1;
                        }
                    },
                });

                ShadowPrimitive.prototype.setDebugFrustumEffect = function (bShowPlane, bShowOutline) {
                    if (!this.debugShow) return;
                    var planesPrimitives = this.debugLightFrustum._planesPrimitives;
                    var outlinePrimitives = this.debugLightFrustum._outlinePrimitives;
                    planesPrimitives.forEach(function (plane) {
                        plane.show = bShowPlane;
                    });
                    outlinePrimitives.forEach(function (outline) {
                        outline.show = bShowOutline;
                    });
                };

                ShadowPrimitive.prototype.update = function (frameState) {
                    if (!this.show) return;
                    if (!this._cameraUpdated) {
                        this._updateCamera();
                        //更新debug
                        if (this.debugShow) {
                            if (!Cesium.defined(this.debugLightFrustum)) {
                                this._debugLightFrustum = new Cesium.DebugCameraPrimitive({
                                    camera: this._depthCamera,
                                    color: Cesium.Color.YELLOW,
                                    updateOnChange: true
                                });
                                this.setDebugFrustumEffect(false, true);
                            }
                        }
                    }
                    var frustumSplitsFar = frameState.frustumSplits[1];
                    frameState.frustumSplits[1] = this._distance;
                    this._debugLightFrustum.update(frameState);
                    frameState.frustumSplits[1] = frustumSplitsFar;
                    //if(!this._initialized)this._initialize();
                    //if (!this._hintLineUpdated)this._updateHintLine(frameState);
                    frameState.shadowMaps.push(this.shadowMap);
                };

                ShadowPrimitive.prototype._updateCamera = function () {
                    this._depthCamera.frustum.near = .001 * this._distance,
                        this._depthCamera.frustum.far = this._distance,
                        this._depthCamera.frustum.fov = Cesium.Math.toRadians(Math.max(this._horizontalFov, this._verticalFov)),
                        this._depthCamera.frustum.aspectRatio = this._horizontalFov / this._verticalFov,
                        this._depthCamera.setView({
                            destination: this._viewerPosition,
                            orientation: {
                                heading: Cesium.Math.toRadians(this._direction),
                                pitch: Cesium.Math.toRadians(this._pitch)
                            }
                        }),
                        this._modelMatrix = this._depthCamera.inverseViewMatrix;
                    this._cameraUpdated = !0
                };
                ShadowPrimitive.prototype.setPoseByTargetPoint = function (point) {
                    this.distance = Cesium.Cartesian3.distance(this._viewerPosition, point);
                    var t = new Cesium.Cartesian3
                        , matrix_ENU = Cesium.Transforms.eastNorthUpToFixedFrame(this._viewerPosition);
                    Cesium.Matrix4.inverse(matrix_ENU, matrix_ENU),
                        Cesium.Matrix4.multiplyByPoint(matrix_ENU, point, t),
                        Cesium.Cartesian3.normalize(t, t),
                        this.direction = Cesium.Math.toDegrees(Math.atan2(t.x, t.y)),
                        this.pitch = Cesium.Math.toDegrees(Math.asin(t.z))
                }

                ShadowPrimitive.prototype._updateHintLine = function (frameState) {
                    var i, a, s, d, p = this._positions, m = Cesium.Math.toRadians(this._horizontalFov), v = Cesium.Math.toRadians(this._verticalFov), b = Math.tan(.5 * m), S = Math.tan(.5 * v);
                    a = this._distance * b,
                        d = this._distance * S,
                        i = -a,
                        s = -d;
                    var w = new Cesium.Cartesian3(i, s, -this._distance)
                        , x = new Cesium.Cartesian3(a, d, 0);
                    Cesium.Matrix4.multiplyByPoint(this._modelMatrix, w, w),
                        Cesium.Matrix4.multiplyByPoint(this._modelMatrix, x, x);
                    var boundingSphere = Cesium.BoundingSphere.fromCornerPoints(w, x);
                    if (frameState.cullingVolume.computeVisibility(boundingSphere) === Intersect.OUTSIDE)
                        return void (this._valid = !1);
                    this._valid = !0;
                    var P = 0;
                    p[P++] = 0,
                        p[P++] = 0,
                        p[P++] = 0;
                    for (var D, I, M = Math.PI - .5 * m, R = m / 4, L = 0; L < 5; ++L) {
                        D = M + L * R;
                        for (var B = d / (this._distance / Math.cos(D)), F = Math.atan(B), U = -F, V = F / 10, z = 0; z < 21; ++z)
                            I = U + z * V,
                                p[P++] = this._distance * Math.cos(I) * Math.sin(D),
                                p[P++] = this._distance * Math.sin(I),
                                p[P++] = this._distance * Math.cos(I) * Math.cos(D)
                    }
                    R = m / 20;
                    for (var G = 0; G < 21; ++G) {
                        D = M + G * R;
                        for (var B = d / (this._distance / Math.cos(D)), F = Math.atan(B), U = -F, V = F / 2, H = 0; H < 5; ++H)
                            I = U + H * V,
                                p[P++] = this._distance * Math.cos(I) * Math.sin(D),
                                p[P++] = this._distance * Math.sin(I),
                                p[P++] = this._distance * Math.cos(I) * Math.cos(D)
                    }
                    var context = frameState.context
                        , indexBuffer = Cesium.Buffer.createIndexBuffer({
                            context: context,
                            typedArray: new Uint32Array(this._indices),
                            usage: Cesium.BufferUsage.STATIC_DRAW,
                            indexDatatype: IndexDatatype.UNSIGNED_INT
                        })
                        , vertexBuffer = Cesium.Buffer.createVertexBuffer({
                            context: context,
                            typedArray: Cesium.ComponentDatatype.createTypedArray(Cesium.ComponentDatatype.FLOAT, this._positions),
                            usage: Cesium.BufferUsage.STATIC_DRAW
                        })
                        , attributes = [];
                    attributes.push({
                        index: 0,
                        vertexBuffer: vertexBuffer,
                        componentDatatype: Cesium.ComponentDatatype.FLOAT,
                        componentsPerAttribute: 3,
                        normalize: !1
                    });
                    var vertexArray = new Cesium.VertexArray({
                        context: context,
                        attributes: attributes,
                        indexBuffer: indexBuffer
                    });
                    if (Cesium.defined(this._drawLineCommand))
                        this._drawLineCommand.vertexArray.destroy(),
                            this._drawLineCommand.vertexArray = vertexArray,
                            this._drawLineCommand.modelMatrix = this._modelMatrix,
                            this._drawLineCommand.boundingVolume = boundingSphere;
                    else {
                        var shaderProgram = Cesium.ShaderProgram.fromCache({
                            context: context,
                            vertexShaderSource: ViewshedLineVS,
                            fragmentShaderSource: ViewshedLineFS
                        })
                            , renderState = Cesium.RenderState.fromCache({
                                depthTest: {
                                    enabled: !0
                                }
                            })
                            , _this = this
                            , uniformMap = {
                                u_bgColor: function () {
                                    return _this._lineColor
                                },
                                u_modelViewMatrix: function () {
                                    return context.uniformState.modelView
                                }
                            };
                        this._drawLineCommand = new Cesium.DrawCommand({
                            boundingVolume: boundingSphere,
                            modelMatrix: _this._modelMatrix,
                            primitiveType: Cesium.PrimitiveType.LINES,
                            vertexArray: vertexArray,
                            shaderProgram: shaderProgram,
                            castShadows: !1,
                            receiveShadows: !1,
                            uniformMap: uniformMap,
                            renderState: renderState,
                            pass: Cesium.Pass.OPAQUE
                        })
                    }
                    this._hintLineUpdated = true;
                }

                Cesium.ShadowPrimitive = ShadowPrimitive;
            },
            /**
             * 图元点
             */
            _installPointsPrimitive: function () {
                /**
                 * 
                 * @param {*} options 
                 */
                function PointsPrimitive(options) {

                    if (options && options.viewer && options.Cartesians) {
                        this._vertexShader = this.getVSPolylie();
                        this._fragmentShader = this.getFSPolyline();
                        this._geometry = null;
                        this._appearance = null;
                        this._viewer = options.viewer

                        this.build(options)
                    }
                }
                PointsPrimitive.prototype = {
                    build: function (options) {

                        if (options.Cartesians && options.Cartesians.length >= 2) {
                            var postionsTemp = [];
                            var colorsTemp = [];
                            var indicesTesm = [];
                            if (options.Colors && options.Colors.length === options.Cartesians.length * 4) {
                                for (var i = 0; i < options.Cartesians.length; i++) {
                                    postionsTemp.push(options.Cartesians[i].x);
                                    postionsTemp.push(options.Cartesians[i].y);
                                    postionsTemp.push(options.Cartesians[i].z);
                                }
                                colorsTemp = options.Colors;
                            } else {
                                for (var i = 0; i < options.Cartesians.length; i++) {
                                    postionsTemp.push(options.Cartesians[i].x);
                                    postionsTemp.push(options.Cartesians[i].y);
                                    postionsTemp.push(options.Cartesians[i].z);
                                    //
                                    colorsTemp.push(0.0);
                                    colorsTemp.push(0.0);
                                    colorsTemp.push(1.0);
                                    colorsTemp.push(1.0);
                                }
                            }
                            for (var i = 0; i < options.Cartesians.length; i++) {
                                indicesTesm.push(i);
                            }
                            this.positionArr = new Float64Array(postionsTemp);
                            this.colorArr = new Float32Array(colorsTemp);
                            this.indiceArr = new Uint16Array(indicesTesm);

                        } else {
                            var p1 = Cesium.Cartesian3.fromDegrees(0, 0, -10);
                            var p2 = Cesium.Cartesian3.fromDegrees(0, 0.001, -10);
                            this.positionArr = new Float64Array([
                                p1.x, p1.y, p1.z,
                                p2.x, p2.y, p2.z
                            ]);
                            //默认蓝色
                            this.colorArr = new Float32Array([
                                0.0, 0.0, 1.0, 1.0,
                                0.0, 0.0, 1.0, 1.0
                            ]);
                            this.indiceArr = new Uint16Array([0, 1]);
                        }

                        this._geometry = this.createGeometry(this.positionArr, this.colorArr, this.indiceArr);
                        this._appearance = this.createAppearence(this._fragmentShader, this._vertexShader);

                        this.primitive = this._viewer.scene.primitives.add(new Cesium.Primitive({
                            geometryInstances: new Cesium.GeometryInstance({
                                geometry: this._geometry
                            }),
                            appearance: this._appearance,
                            asynchronous: false
                        }));
                    },
                    getVSPolylie: function () {
                        return "attribute vec3 position3DHigh;\
                    attribute vec3 position3DLow;\
                    attribute vec4 color;\
                    varying vec4 v_color;\
                    attribute float batchId;\
                    void main()\
                    {\
                        vec4 p = czm_computePosition();\
                        v_color =color;\
                        p = czm_modelViewProjectionRelativeToEye * p;\
                        gl_Position = p;\
                        gl_PointSize=4.0;\
                    }\
                    ";
                    },
                    getFSPolyline: function () {
                        return "varying vec4 v_color;\
                    void main()\
                    {\
                         float d = distance(gl_PointCoord, vec2(0.5,0.5));\
                         if(d < 0.5){\
                            gl_FragColor = v_color;\
                         }else{\
                            discard;\
                         }\
                    }\
                    ";
                    },
                    createAppearence: function (fs, vs) {
                        return new Cesium.Appearance({
                            renderState: {
                                blending: Cesium.BlendingState.PRE_MULTIPLIED_ALPHA_BLEND,
                                depthTest: { enabled: true },
                                depthMask: true
                            },
                            fragmentShaderSource: fs,
                            vertexShaderSource: vs
                        });
                    },
                    createGeometry: function (positions, colors, indices) {
                        return new Cesium.Geometry({
                            attributes: {
                                position: new Cesium.GeometryAttribute({
                                    componentDatatype: Cesium.ComponentDatatype.DOUBLE,
                                    componentsPerAttribute: 3,
                                    values: positions
                                }),
                                color: new Cesium.GeometryAttribute({
                                    componentDatatype: Cesium.ComponentDatatype.FLOAT,
                                    componentsPerAttribute: 4,
                                    values: colors
                                })
                            },
                            indices: indices,
                            primitiveType: Cesium.PrimitiveType.POINTS,
                            boundingSphere: Cesium.BoundingSphere.fromVertices(positions)
                        });
                    },
                    remove: function () {
                        if (this.primitive != null) {
                            this._viewer.scene.primitives.remove(this.primitive);
                            this.primitive = null;
                        }
                    },
                    updateCartesianPosition: function (cartesians) {
                        if (this.primitive != null) {
                            this._viewer.scene.primitives.remove(this.primitive);
                            if (cartesians && cartesians.length < 2) { return; }
                            if (cartesians.length === this.positionArr.length / 3) {
                                var p1 = cartesians[0];
                                var p2 = cartesians[1];
                                this.positionArr = new Float64Array([
                                    p1.x, p1.y, p1.z,
                                    p2.x, p2.y, p2.z
                                ]);
                                this._geometry = this.createGeometry(this.positionArr, this.colorArr, this.indiceArr);
                            } else {
                                //默认蓝色
                                var postionsTemp = [];
                                var colorsTemp = [];
                                var indicesTesm = [];
                                for (var i = 0; i < cartesians.length; i++) {
                                    postionsTemp.push(cartesians[i].x);
                                    postionsTemp.push(cartesians[i].y);
                                    postionsTemp.push(cartesians[i].z);

                                    colorsTemp.push(0.0);
                                    colorsTemp.push(0.0);
                                    colorsTemp.push(1.0);
                                    colorsTemp.push(1.0);
                                }
                                for (var i = 0; i < cartesians.length; i++) {
                                    indicesTesm.push(i);
                                }
                                this.positionArr = new Float64Array(postionsTemp);
                                this.colorArr = new Float32Array(colorsTemp);
                                this.indiceArr = new Uint16Array(indicesTesm);

                                geometry = this.createGeometry(this.positionArr, this.colorArr, this.indiceArr);
                                appearance = this.createAppearence(this._fragmentShader, this._vertexShader);
                            }

                            this.primitive = this._viewer.scene.primitives.add(new Cesium.Primitive({
                                geometryInstances: new Cesium.GeometryInstance({
                                    geometry: this._geometry
                                }),
                                appearance: this._appearance,
                                asynchronous: false
                            }));
                        } else { return; }
                    },
                    updateCartesianPositionColor: function (cartesians, colors) {
                        if (colors.length === cartesians.length * 4) { } else { return; }
                        if (this.primitive != null) {
                            viewer.scene.primitives.remove(this.primitive);
                            if (cartesians && cartesians.length < 2) { return; }
                            if (cartesians.length === this.positionArr.length / 3) {
                                var p1 = cartesians[0];
                                var p2 = cartesians[1];
                                this.positionArr = new Float64Array([
                                    p1.x, p1.y, p1.z,
                                    p2.x, p2.y, p2.z
                                ]);

                                this.colorArr = new Float32Array(colors);

                                geometry = CreateGeometry(this.positionArr, this.colorArr, this.indiceArr);
                            } else {
                                var postionsTemp = [];
                                var indicesTesm = [];

                                for (var i = 0; i < cartesians.length; i++) {
                                    postionsTemp.push(cartesians[i].x);
                                    postionsTemp.push(cartesians[i].y);
                                    postionsTemp.push(cartesians[i].z);
                                }
                                for (var i = 0; i < cartesians.length; i++) {
                                    indicesTesm.push(i);
                                }
                                this.positionArr = new Float64Array(postionsTemp);
                                this.colorArr = new Float32Array(colors);
                                this.indiceArr = new Uint16Array(indicesTesm);

                                this._geometry = this.createGeometry(this.positionArr, this.colorArr, this.indiceArr);
                                this._appearance = this.createAppearence(this._fragmentShader, this._vertexShader);
                            }

                            this.primitive = viewer.scene.primitives.add(new Cesium.Primitive({
                                geometryInstances: new Cesium.GeometryInstance({
                                    geometry: this._geometry
                                }),
                                appearance: this._appearance,
                                asynchronous: false
                            }));
                        } else { return; }
                    }
                }

                Cesium.PointsPrimitive = PointsPrimitive
            },
            /**
             * 水面效果
             */
            _installWaterPrimitive: function () {
                /**
                 * 
                 * @param {*} options 
                 */
                function WaterPrimitive(options) {

                    this._positions = opt.positions
                    this._url = opt.normalMapUrl || 'data/images/Textures/waterNormals.jpg'
                    this._frequency = opt.frequency || 1000.0
                    this._animationSpeed = opt.animationSpeed || 0.01
                    this._amplitude = opt.amplitude || 10.0
                    this._extrudedHeight = opt.extrudedHeight || 0

                    this._fs = this.getFS()
                }

                WaterPrimitive.prototype.build = function () {

                    this._geometry = this._createGeometry();

                    this._appearance = this._createAppearence();

                    this.primitive = this._viewer.scene.primitives.add(new Cesium.Primitive({
                        allowPicking: false,
                        geometryInstances: new Cesium.GeometryInstance({
                            geometry: this._geometry
                        }),
                        appearance: this._appearance,
                        asynchronous: false
                    }));
                }

                WaterPrimitive.prototype._createAppearence = function () {

                    return new Cesium.EllipsoidSurfaceAppearance({
                        material: new Cesium.Material({
                            fabric: {
                                type: 'Water',
                                uniforms: {
                                    normalMap: this._url,
                                    frequency: this._frequency,
                                    animationSpeed: this._animationSpeed,
                                    amplitude: this._amplitude
                                }
                            }
                        }),
                        fragmentShaderSource: this._fs
                    });
                }

                WaterPrimitive.prototype._createGeometry = function (_degreesArrayHeights, _extrudedHeight) {

                    return new Cesium.PolygonGeometry({
                        polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights(this._positions)),
                        extrudedHeight: this._extrudedHeight,
                        perPositionHeight: true
                    });
                }

                WaterPrimitive.prototype.getFS = function () {

                    return 'varying vec3 v_positionMC;\n\
                    varying vec3 v_positionEC;\n\
                    varying vec2 v_st;\n\
                    \n\
                    void main()\n\
                    {\n\
                        czm_materialInput materialInput;\n\
                        vec3 normalEC = normalize(czm_normal3D * czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0)));\n\
                    #ifdef FACE_FORWARD\n\
                        normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n\
                    #endif\n\
                        materialInput.s = v_st.s;\n\
                        materialInput.st = v_st;\n\
                        materialInput.str = vec3(v_st, 0.0);\n\
                        materialInput.normalEC = normalEC;\n\
                        materialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);\n\
                        vec3 positionToEyeEC = -v_positionEC;\n\
                        materialInput.positionToEyeEC = positionToEyeEC;\n\
                        czm_material material = czm_getMaterial(materialInput);\n\
                    #ifdef FLAT\n\
                        gl_FragColor = vec4(material.diffuse + material.emission, material.alpha);\n\
                    #else\n\
                        gl_FragColor = czm_phong(normalize(positionToEyeEC), material);\n\
                        gl_FragColor.a = 0.5;\n\
                    #endif\n\
                    }\n\
                    ';
                }

                _.prototype.updateDegreesPosition = function (_degreesArrayHeights, _extrudedHeight) {

                    if (this.primitive != null) {
                        this._viewer.scene.primitives.remove(this.primitive);
                        if (_degreesArrayHeights && _degreesArrayHeights.length < 3) { return; }
                        var geometry = this._createGeometry(_degreesArrayHeights, _extrudedHeight ? _extrudedHeight : 0);

                        this.primitive = this._viewer.scene.primitives.add(new Cesium.Primitive({
                            allowPicking: false,
                            geometryInstances: new Cesium.GeometryInstance({
                                geometry: geometry
                            }),
                            appearance: this._appearance,
                            asynchronous: false
                        }));
                    } else { return; }
                }

                Cesium.WaterPrimitive = WaterPrimitive
            },
            /**
             * 纹理图 视频图像
             */
            _installTexturePrimitive: function () {
                /**
                 * 
                 * @param {*} options 
                 */
                function TexturePrimitive(options) {

                    this._vertexShader = this.getVS()
                    this._fragmentShader = this.getFS()
                    this._materialShader = this.getMS()

                    this._url = options.url
                    this._cartesians = options.cartesians
                    this._id = options.id || ''

                }
                // 构建
                TexturePrimitive.prototype.build = function (opt) {

                    var postionsTemp = []
                        , stsTemp = [0, 0, 1, 0, 1, 1, 0, 1] //纹理坐标，调整纹理坐标顺序即可完成贴图的旋转
                        // var stsTemp = [1,1,0,1,0,0,1,0];
                        , indicesTesm = [0, 1, 2, 0, 2, 3];  //索引数组

                    for (var i = 0; i < this._cartesians.length; i++) {
                        postionsTemp.push(this._cartesians[i].x);
                        postionsTemp.push(this._cartesians[i].y);
                        postionsTemp.push(this._cartesians[i].z);
                    }

                    this._positionArr = new Float32Array(postionsTemp);
                    this._sts = new Uint8Array(stsTemp);
                    this._indiceArr = new Uint16Array(indicesTesm);
                    //通过坐标数组，索引数组，纹理坐标数组创建多边形
                    this._geometry = this._createGeometry();
                    this._appearance = this._createAppearence();

                    this.primitive = this._viewer.scene.primitives.add(new Cesium.Primitive({
                        geometryInstances: new Cesium.GeometryInstance({
                            geometry: this._geometry,
                            id: this._id
                        }),
                        appearance: this._appearance,
                        asynchronous: false
                    }));
                }
                // 生成几何
                TexturePrimitive.prototype._createGeometry = function () {

                    var sess = new Cesium.GeometryAttribute({
                        componentDatatype: Cesium.ComponentDatatype.FLOAT,
                        componentsPerAttribute: 2,
                        values: this._sts
                    })
                    return new Cesium.Geometry({
                        attributes: {
                            position: new Cesium.GeometryAttribute({
                                componentDatatype: Cesium.ComponentDatatype.DOUBLE,
                                componentsPerAttribute: 3,
                                values: this._positions
                            }),
                            st: sess
                        },
                        indices: this._indices,//索引指标，指示创建三角形的顺序
                        primitiveType: Cesium.PrimitiveType.TRIANGLES,
                        boundingSphere: Cesium.BoundingSphere.fromVertices(positions)
                    });
                }
                //生成外观
                TexturePrimitive.prototype._createAppearence = function () {

                    return new Cesium.Appearance({
                        material: new Cesium.Material({
                            fabric: {
                                uniforms: {
                                    image: this._url
                                },
                                source: this._materialShader
                            }
                        }),
                        aboveGround: true,
                        faceForward: true,
                        flat: true,
                        translucent: false,
                        renderState: {
                            blending: Cesium.BlendingState.PRE_MULTIPLIED_ALPHA_BLEND,
                            depthTest: { enabled: true },
                            depthMask: true,
                        },
                        fragmentShaderSource: this._fragmentShader,
                        vertexShaderSource: this._vertexShader
                    });
                }

                TexturePrimitive.prototype.getVS = function () {
                    return "attribute vec3 position3DHigh;\
                    attribute vec3 position3DLow;\
                    attribute vec2 st;\
                    attribute float batchId;\
                    varying vec2 v_st;\
                    void main()\
                    {\
                        vec4 p = czm_computePosition();\
                        v_st=st;\
                        p = czm_modelViewProjectionRelativeToEye * p;\
                        gl_Position = p;\
                    }\
                    ";
                }

                TexturePrimitive.prototype.getFS = function () {
                    return "varying vec2 v_st;\
                    void main()\
                    {\
                        czm_materialInput materialInput;\
                        czm_material material=czm_getMaterial(materialInput,v_st);\
                        vec4 color=vec4(material.diffuse + material.emission,material.alpha);\
                        if(color.x==1.0&&color.y==1.0&&color.z==1.0&&color.w==1.0) color=vec4(vec3(0.0,0.0,0.0),0.0);\
                        gl_FragColor =color;\
                    }\
                    ";
                }

                TexturePrimitive.prototype.getMS = function () {
                    return "czm_material czm_getMaterial(czm_materialInput materialInput,vec2 v_st)\
                        {\
                            vec4 color = texture2D(image, v_st);\
                            czm_material material = czm_getDefaultMaterial(materialInput);\
                            material.diffuse= color.rgb;\
                            material.alpha=color.a;\
                            return material;\
                        }\
                        ";
                }

                Cesium.TexturePrimitive = TexturePrimitive
            },
            /**
             * 卫星雷达波
             */
            _installProbingPrimitive: function () {

                var DEF_OPT = {
                    color: new Cesium.Color(1.0, 0.0, 1.0, 0.8),
                    repeat: 30.0,
                    offset: 0.0,
                    thickness: 0.3,
                    center: Cesium.Cartesian3.fromDegrees(116.39, 39.9),
                    length: 400000.0,
                    bottom: 1000,
                    top: 0.0
                }
                var viewer = this._viewer;
                /**
                 * 
                 * @param {*} option 
                 */
                function ProbingPrimitive(option) {

                    this._viewer = viewer
                    this._length = option.length || DEF_OPT.length
                    this._center = option.center || DEF_OPT.center
                    this._color = option.color || DEF_OPT.color
                    this._repeat = option.repeat || DEF_OPT.repeat
                    this._offset = option.offset || DEF_OPT.offset
                    this._thickness = option.thickness || DEF_OPT.thickness
                    this._bottom = option.bottom || DEF_OPT.bottom
                    this._top = option.top || DEF_OPT.top
                    this._radar = undefined

                    this.build()
                }
                ProbingPrimitive.prototype.build = function () {

                    var cylinderGeometry = new Cesium.CylinderGeometry({
                        length: this._length,
                        topRadius: this._top,
                        bottomRadius: this._bottom,
                        vertexFormat: Cesium.MaterialAppearance.MaterialSupport.TEXTURED.vertexFormat
                    }), redCone = new Cesium.GeometryInstance({
                        geometry: cylinderGeometry,
                        modelMatrix: this.getModelMatrix(),
                    }), appearance = new Cesium.MaterialAppearance({
                        material: this.getMaterial(),
                        faceForward: false,
                        closed: true
                    }), $this = this;
                    this._radar = this._viewer.scene.primitives.add(
                        new Cesium.Primitive({
                            geometryInstances: [redCone],
                            appearance: appearance
                        }));
                    //监听渲染事件 动态修改雷达材质中的offset变量 从而实现动态效果
                    this._viewer.scene.preUpdate.addEventListener(function () {
                        var offset = $this._radar.appearance.material.uniforms.offset;
                        offset -= 0.001;
                        if (offset > 1.0) {
                            offset = 0.0;
                        }
                        $this._radar.appearance.material.uniforms.offset = offset;
                    })
                }

                ProbingPrimitive.prototype.getModelMatrix = function () {
                    return Cesium.Matrix4.multiplyByTranslation( //转换矩阵
                        Cesium.Transforms.eastNorthUpToFixedFrame(this._center), //矩阵
                        new Cesium.Cartesian3(0.0, 0.0, this._length * 0.5), //要转换的笛卡尔坐标 
                        new Cesium.Matrix4() //返回新的矩阵
                    );
                }

                ProbingPrimitive.prototype.updateModelMatrix = function (position) {

                }

                ProbingPrimitive.prototype.getMaterial = function () {
                    var materialSource = `uniform vec4 color; 
                uniform float repeat; 
                uniform float offset; 
                uniform float thickness;
    
                czm_material czm_getMaterial(czm_materialInput materialInput){
                    czm_material material = czm_getDefaultMaterial(materialInput);
                    float sp = 1.0/repeat;
                    vec2 st = materialInput.st;
                    float dis = distance(st, vec2(0.5));
                    float m = mod(dis + offset, sp);
                    float a = step(sp*(1.0-thickness), m); 
    
                    material.diffuse = color.rgb;
                    material.alpha = a * color.a;
                    return material;
                }`

                    return new Cesium.Material({
                        fabric: {
                            type: 'radarPrimitive',
                            uniforms: { //动态传递参数
                                color: this._color,
                                repeat: this._repeat,
                                offset: this._offset,
                                thickness: this._thickness,
                            },
                            source: materialSource
                        },
                        translucent: false
                    })
                }

                ProbingPrimitive.prototype.remove = function () {

                    if (this._radar) {
                        this._viewer.scene.primitives.remove(this._radar)
                    }
                }

                Cesium.ProbingPrimitive = ProbingPrimitive;
            }

        }
        /**
         * 控件模块
         * @param {*} viewer 
         */
        function Control(viewer) {
            if (viewer) {
                this._installFileDragDropHandler()
            }
        }
        Control.prototype = {
            /**
             * 拖拽加载
             */
            _installFileDragDropHandler() {
                function FileDragDropHandler(targetDiv, viewer) {
                    var dragBox = document.createElement("div");
                    dragBox.id = 'fileDragDrop'
                    dragBox.classList.add("filedragdrop");
                    dragBox.innerHTML = "请将Json文件拖拽到此区域";
                    this._dragBox = dragBox;
                    this._viewer = viewer;
                    this._parentDiv = targetDiv;
                    targetDiv.appendChild(dragBox);
                    this.fileDragDropCallBack = undefined;
                    this.callBackParms = undefined;
                }
                FileDragDropHandler.prototype.startuploadfile = function () {
                    var _this = this;
                    var oBox = _this._dragBox;
                    var timer = null;
                    document.ondragover = function () {
                        clearTimeout(timer);
                        timer = setTimeout(function () {
                           //  oBox.style.display = 'none';
                           oBox.innerHTML = '请将文件拖拽到此区域';
                        }, 200);
                        // oBox.style.display = 'block';
                    };
                    //进入子集的时候 会触发ondragover 频繁触发 不给ondrop机会
                    oBox.ondragenter = function () {
                        oBox.innerHTML = '请释放鼠标';
                    };
                    oBox.ondragover = function () {
                        return false;
                    };
                    oBox.ondragleave = function () {
                        oBox.innerHTML = '请将文件拖拽到此区域';
                    };
                    oBox.ondrop = function (ev) {
                        ev.preventDefault();
                        var oFile = ev.dataTransfer.files[0];
                        var reader = new FileReader();
                        reader.readAsText(oFile, "UTF-8");
                        //读取成功
                        reader.onload = function () {
                            var data = JSON.parse(this.result);
                            if (_this.fileDragDropCallBack) {
                                //回调函数，callBackParms为回调函数的参数,需要自己传入，data与_this._viewer不需要传入，但是声明的回调函数中要有该参数
                                _this.fileDragDropCallBack(_this.callBackParms, data, _this._viewer);
                            }
                        };
                        reader.onloadstart = function () {
                            //alert('读取开始');
                        };
                        reader.onloadend = function () {
                            // alert('读取结束');
                        };
                        reader.onabort = function () {
                            alert('读取数据中断');
                        };
                        reader.onerror = function () {
                            alert('读取数据失败');
                        };
                        return false;
                    };
                }
                function FileDragDropMixin(viewer) {
                    var fileDragDropHandler = new FileDragDropHandler(document.querySelector(".cesium-viewer"), viewer);
                    Object.defineProperties(viewer, {
                        fileDragDropMixin: {
                            get: function () {
                                return fileDragDropHandler;
                            }
                        }
                    });
                }
                Cesium.FileDragDropMixin = FileDragDropMixin
            },
            /**
             * 加载本地数据
             * @param {*} param 
             */
            showLoadDataToScenePanel(param) {
                param = param || {}
                if (param) {
                    let gui = new dat.GUI();
                    let viewer = this._viewer
                    let geojson = gui.addFolder('加载数据文件');
                    let commonUpload = (callback) => {
                        let inputUpload = document.createElement('input')
                        inputUpload.type = 'file'
                        inputUpload.className = 'datgui_upload'
                        inputUpload.onchange = function () {
                            if (typeof callback === 'function' && inputUpload.files.length) {

                                callback(URL.createObjectURL(inputUpload.files[0]))
                            }
                        }
                        document.getElementsByTagName('body') && document.getElementsByTagName('body')[0].appendChild(inputUpload)
                        inputUpload.click()
                    }
                    let geojsonParam = {
                        'point': () => {
                            commonUpload((fileData) => {
                                var promise = Cesium.GeoJsonDataSource.load(fileData);
                                promise.then(function (dataSource) {
                                    viewer.dataSources.add(dataSource);
                                    var entities = dataSource.entities.values;
                                    for (var o = 0; o < entities.length; o++) {
                                        var r = entities[o];
                                        r.nameID = o;
                                        r.point = { color: Cesium.Color.BLUE }
                                    }
                                    viewer.flyTo(dataSource)
                                })
                            })
                        },
                        'polyline': () => {
                            commonUpload((fileData) => {
                                var promise = Cesium.GeoJsonDataSource.load(fileData);
                                promise.then(function (dataSource) {
                                    viewer.dataSources.add(dataSource);
                                    var entities = dataSource.entities.values;
                                    for (var o = 0; o < entities.length; o++) {
                                        var r = entities[o];
                                        r.nameID = o;
                                        r.polyline.width = 5;
                                        (r.polyline.material = new Cesium.PolylineGlowMaterialProperty({
                                            glowPower: .1,
                                            color: Cesium.Color.ORANGERED.withAlpha(.9)
                                        }), 10)
                                    }
                                    viewer.flyTo(dataSource)
                                })
                            })
                        },
                        'polygon': () => {
                            commonUpload((fileData) => {
                                var promise = Cesium.GeoJsonDataSource.load(fileData);
                                promise.then(function (dataSource) {
                                    viewer.dataSources.add(dataSource);
                                    var entities = dataSource.entities.values;
                                    for (var o = 0; o < entities.length; o++) {
                                        var r = entities[o];
                                        r.nameID = o;
                                        r.polygon.width = 10;
                                        r.polygon.material = Cesium.Color.BLUE.withAlpha(.9)
                                    }
                                    viewer.flyTo(dataSource)
                                })
                            })
                        },
                        'model': () => {
                            commonUpload((fileData) => {
                                viewer.flyTo(d3kit.createModelGraphics({
                                    position: Cesium.Cartesian3.fromDegrees(120.38105869, 31.10115627),
                                    m_url: fileData
                                }))
                            })
                        },
                        'czml': () => {
                            commonUpload((fileData) => {
                                viewer.flyTo(viewer.dataSources.add(Cesium.CzmlDataSource.load(fileData)))
                            })
                        },
                        '3dtilset': () => {
                            commonUpload((fileData) => {
                                viewer.flyTo(viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
                                    url: fileData
                                })))
                            })
                        }
                    }
                    geojson.add(geojsonParam, "point")
                    geojson.add(geojsonParam, "polyline")
                    geojson.add(geojsonParam, "polygon")
                    geojson.add(geojsonParam, "model")
                    geojson.add(geojsonParam, "czml")
                    geojson.add(geojsonParam, "3dtilset")
                    geojson.open()
                }
            },
            /**
             * 后处理面板
             * @param {*} param 
             */
            showPostProcessStagesPanel(param) {
                param = param || {}
                let Options = function () {
                    this.blackAndWhiteShow = false
                    this.blackAndWhiteGradations = 5.0
                    this.brightnessShow = false
                    this.brightnessValue = 0.5
                    this.nightVisionShow = false
                    this.silhouette = false
                }
                let option = new Options();
                let gui = new dat.GUI();
                let viewer = this._viewer
                let stages = viewer.scene.postProcessStages;
                let silhouette = stages.add(Cesium.PostProcessStageLibrary.createSilhouetteStage());
                let blackAndWhite = stages.add(Cesium.PostProcessStageLibrary.createBlackAndWhiteStage());
                let brightness = stages.add(Cesium.PostProcessStageLibrary.createBrightnessStage());
                let nightVision = stages.add(Cesium.PostProcessStageLibrary.createNightVisionStage());
                //config
                silhouette.uniforms.color = param.silhouetteColor || Cesium.Color.YELLOW;
                silhouette.enabled = false;
                blackAndWhite.enabled = false;
                blackAndWhite.uniforms.gradations = 5.0;
                brightness.enabled = false;
                brightness.uniforms.brightness = 0.5;
                nightVision.enabled = false;
                gui.add(option, 'blackAndWhiteShow').name("blackAndWhiteShow").onChange(function (value) {
                    blackAndWhite.enabled = value;
                })
                gui.add(option, 'blackAndWhiteGradations', 0, 10, 0.1).name("blackAndWhiteGradations").onChange(function (value) {
                    blackAndWhite.uniforms.gradations = value;
                })
                gui.add(option, 'brightnessShow').name("brightnessShow").onChange(function (value) {
                    brightness.enabled = value;
                })
                gui.add(option, 'brightnessValue', 0, 10, 0.1).name("brightnessValue").onChange(function (value) {
                    brightness.uniforms.brightness = value;
                })
                gui.add(option, 'nightVisionShow').name("nightVisionShow").onChange(function (value) {
                    nightVision.enabled = value;
                })
                gui.add(option, 'silhouette').name("silhouette").onChange(function (value) {
                    silhouette.enabled = value;
                })
            },
            /**
            * 环境控制
            * @param {*}  
            */
            showSceneBloomPanel(param) {
                let Options = function () {
                    this.contrast = 128;
                    this.brightness = -0.3;
                    this.delta = 1;
                    this.gamma = 3.5;
                    this.enabled = false;
                    this.highDynamicRange = false;
                    this.shadows = false;
                    this.glowOnly = false;
                    this.sigma = 1.0;
                    this.stepSize = 5.0;
                }
                let option = new Options();
                let gui = new dat.GUI();
                let viewer = this._viewer
                gui.__closeButton.innerHTML = "收缩面板";

                let bloom = viewer.scene.postProcessStages.bloom;

                gui.add(option, 'enabled').name("bloom").onChange(function (value) {
                    bloom.enabled = value;
                })
                gui.add(option, 'glowOnly').name("发光").onChange(function (value) {
                    bloom.uniforms.glowOnly = value;
                })
                gui.add(option, 'enabled').name("启用模糊").onChange(function (value) {
                    bloom.enabled = value;
                })
                gui.add(option, 'contrast', -255.0, 255.0, 0.01).name("对比度").onChange(function (value) {
                    bloom.uniforms.contrast = value;
                })
                gui.add(option, 'brightness', -1.0, 1.0, 0.01).name("光泽亮度").onChange(function (value) {
                    bloom.uniforms.brightness = value;
                })
                gui.add(option, 'delta', 1, 5, 0.01).name("因子").onChange(function (value) {
                    bloom.uniforms.delta = value;
                })
                gui.add(option, 'sigma', 1, 10, 0.01).name("sigma").onChange(function (value) {
                    bloom.uniforms.sigma = value;
                })
                gui.add(option, 'stepSize', 0.1, 10).name("stepSize").onChange(function (value) {
                    bloom.uniforms.stepSize = value;
                })
                gui.add(option, 'shadows').name("启用阴影").onChange(function (value) {
                    viewer.shadows = value;
                })
                gui.add(option, 'highDynamicRange').name("高动态范围").onChange(function (value) {
                    viewer.scene.highDynamicRange = value;
                })
                gui.add(option, 'gamma', 1, 10, 0.01).name("伽马亮度").onChange(function (value) {
                    viewer.scene.gamma = value;
                })
            },
            /**
             * 矩阵调整面板
             * @param {*} primitives 
             */
            showPrimitiveMatrixPanel(primitives) {
                let primitive = primitives._delegate || primitives, viewer = this._viewer;
                function update3dtilesMaxtrix(params) {
                    //旋转
                    let mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(params.rx));
                    let my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(params.ry));
                    let mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(params.rz));
                    let rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
                    let rotationY = Cesium.Matrix4.fromRotationTranslation(my);
                    let rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
                    //平移
                    let position = Cesium.Cartesian3.fromDegrees(params.tx, params.ty, params.tz);
                    let m = Cesium.Transforms.eastNorthUpToFixedFrame(position);

                    let scale = Cesium.Matrix4.fromUniformScale(0.85);
                    // //缩放
                    Cesium.Matrix4.multiply(m, scale, m);
                    //旋转、平移矩阵相乘
                    Cesium.Matrix4.multiply(m, rotationX, m);
                    Cesium.Matrix4.multiply(m, rotationY, m);
                    Cesium.Matrix4.multiply(m, rotationZ, m);
                    //赋值给tileset
                    return m;
                }

                let gui = new dat.GUI();

                //高度
                let heightMatrix = {
                    height: 100
                };
                let height = gui.addFolder('离地高度');
                height.add(heightMatrix, "height", 0, 1000, 1).onChange(function (value) {

                    var boundingSphere = primitives.boundingSphere;
                    var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
                    var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
                    var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, value);
                    var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
                    primitives.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
                });
                height.open()
                //缩放矩阵
                let scale = gui.addFolder('缩放大小');
                let scaleParam = {
                    'm+Scale': () => {
                        primitive.readyPromise.then(data => {
                            let modelMatrix = data.root.transform
                            Cesium.Matrix4.multiplyByUniformScale(modelMatrix, 1.2, modelMatrix);
                            data.root.transform = modelMatrix
                        });
                    },
                    'm-Scale': () => {
                        primitive.readyPromise.then(data => {
                            let modelMatrix = data.root.transform
                            Cesium.Matrix4.multiplyByUniformScale(modelMatrix, 0.8, modelMatrix);
                            data.root.transform = modelMatrix
                        });
                    }
                }
                scale.add(scaleParam, "m+Scale")
                scale.add(scaleParam, "m-Scale")
                scale.open()
                let translationMatrix = {
                    x: 0,
                    y: 0,
                    z: 0
                }
                //平移矩阵
                let translationParam = {
                    'x+Axis': () => {
                        translationMatrix.x += 1
                        const translation = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(20, 0, 0))
                        Cesium.Matrix4.multiply(primitive.modelMatrix, translation, primitive.modelMatrix)
                    },
                    'x-Axis': () => {
                        translationMatrix.x -= 1
                        const translation = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(-20, 0, 0))
                        Cesium.Matrix4.multiply(primitive.modelMatrix, translation, primitive.modelMatrix)
                    },
                    'y+Axis': () => {
                        translationMatrix.y += 1
                        const translation = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0, 20, 0))
                        Cesium.Matrix4.multiply(primitive.modelMatrix, translation, primitive.modelMatrix)
                    },
                    'y-Axis': () => {
                        translationMatrix.y -= 1
                        const translation = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0, -20, 0))
                        Cesium.Matrix4.multiply(primitive.modelMatrix, translation, primitive.modelMatrix)
                    },
                    'z+Axis': () => {
                        translationMatrix.z += 1
                        const translation = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0, 0, 20))
                        Cesium.Matrix4.multiply(primitive.modelMatrix, translation, primitive.modelMatrix)
                    },
                    'z-Axis': () => {
                        translationMatrix.z -= 1
                        const translation = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0, 0, -20))
                        Cesium.Matrix4.multiply(primitive.modelMatrix, translation, primitive.modelMatrix)
                    }
                };
                let translation = gui.addFolder('矩阵平移');
                translation.add(translationParam, "x+Axis")
                translation.add(translationParam, "x-Axis")
                translation.add(translationParam, "y+Axis")
                translation.add(translationParam, "y-Axis")
                translation.add(translationParam, "z+Axis")
                translation.add(translationParam, "z-Axis")
                translation.open()

                //旋转矩阵
                let rotationMatrix = {
                    x: 0,
                    y: 0,
                    z: 0
                };
                let rotationParam = {
                    'x+Axis': () => {
                        rotationMatrix.x += 15
                        primitive.readyPromise.then(data => {
                            const angel = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(rotationMatrix.x))
                            const rotation = Cesium.Matrix4.fromRotationTranslation(angel)
                            const m = Cesium.Transforms.eastNorthUpToFixedFrame(data.boundingSphere.center);
                            Cesium.Matrix4.multiply(m, rotation, m)
                            // const rotationX =  Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(rotationMatrix.x)))
                            // const rotationY =  Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(rotationMatrix.y)))
                            // const rotationZ =  Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(rotationMatrix.z)))
                            // Cesium.Matrix4.multiply(m, rotationX, m);
                            // Cesium.Matrix4.multiply(m, rotationY, m);
                            // Cesium.Matrix4.multiply(m, rotationZ, m);

                            data._root.transform = m
                        })
                    },
                    'x-Axis': () => {
                        rotationMatrix.x -= 15
                        primitive.readyPromise.then(data => {
                            const angel = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(rotationMatrix.x))
                            const rotation = Cesium.Matrix4.fromRotationTranslation(angel)
                            const m = Cesium.Transforms.eastNorthUpToFixedFrame(data.boundingSphere.center);
                            Cesium.Matrix4.multiply(m, rotation, m)
                            data._root.transform = m
                        })
                    },
                    'y+Axis': () => {
                        rotationMatrix.y += 15
                        primitive.readyPromise.then(data => {
                            const angel = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(rotationMatrix.y))
                            const rotation = Cesium.Matrix4.fromRotationTranslation(angel)
                            const m = Cesium.Transforms.eastNorthUpToFixedFrame(data.boundingSphere.center);
                            Cesium.Matrix4.multiply(m, rotation, m)
                            data._root.transform = m
                        })
                    },
                    'y-Axis': () => {
                        rotationMatrix.y -= 15
                        primitive.readyPromise.then(data => {
                            const angel = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(rotationMatrix.y))
                            const rotation = Cesium.Matrix4.fromRotationTranslation(angel)
                            const m = Cesium.Transforms.eastNorthUpToFixedFrame(data.boundingSphere.center);
                            Cesium.Matrix4.multiply(m, rotation, m)
                            data._root.transform = m
                        })
                    },
                    'z+Axis': () => {
                        rotationMatrix.z += 15
                        primitive.readyPromise.then(data => {
                            const angel = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(rotationMatrix.z))
                            const rotation = Cesium.Matrix4.fromRotationTranslation(angel)
                            const m = Cesium.Transforms.eastNorthUpToFixedFrame(data.boundingSphere.center);
                            Cesium.Matrix4.multiply(m, rotation, m)
                            data._root.transform = m
                        })
                    },
                    'z-Axis': () => {
                        rotationMatrix.z -= 15
                        primitive.readyPromise.then(data => {
                            const angel = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(rotationMatrix.z))
                            const rotation = Cesium.Matrix4.fromRotationTranslation(angel)
                            const m = Cesium.Transforms.eastNorthUpToFixedFrame(data.boundingSphere.center);
                            Cesium.Matrix4.multiply(m, rotation, m)
                            data._root.transform = m
                        })
                    }
                }
                let rotation = gui.addFolder('旋转矩阵');
                rotation.add(rotationParam, "x+Axis")
                rotation.add(rotationParam, "x-Axis")
                rotation.add(rotationParam, "y+Axis")
                rotation.add(rotationParam, "y-Axis")
                rotation.add(rotationParam, "z+Axis")
                rotation.add(rotationParam, "z-Axis")
                rotation.open()

                gui.__closeButton.innerHTML = "收缩面板";
            },
            /**
             * 图层参数调整
             * @param {*} options 
             */
            showLayerParamPanel: function (layer) {
                if (layer) {
                    var gui = new dat.GUI()
                    var layerObj = new function () {
                        this.alpha = layer.alpha
                        this.brightness = layer.brightness
                        this.contrast = layer.contrast
                        this.gamma = layer.gamma
                        this.hue = layer.hue
                        this.dayAlpha = layer.dayAlpha
                        this.nightAlpha = layer.nightAlpha
                        this.saturation = layer.saturation
                    };
                    var layerParam = gui.addFolder('图层调整')
                    layerParam.add(layerObj, 'alpha', 0, 1, 0.05).name('透明度').onChange(function (value) {
                        layer.alpha = value
                    });
                    layerParam.add(layerObj, 'brightness', 0, 5, 0.05).name('亮度').onChange(function (value) {
                        layer.brightness = value
                    });
                    layerParam.add(layerObj, 'contrast', 0, 5, 0.05).name('对比').onChange(function (value) {
                        layer.contrast = value
                    });
                    layerParam.add(layerObj, 'gamma', 0, 5, 0.05).name('伽马').onChange(function (value) {
                        layer.gamma = value
                    });
                    layerParam.add(layerObj, 'hue', 0, 5, 0.05).name('色调').onChange(function (value) {
                        layer.hue = value
                    });
                    layerParam.add(layerObj, 'dayAlpha', 0, 1, 0.05).name('白天透明').onChange(function (value) {
                        layer.dayAlpha = value
                    });
                    layerParam.add(layerObj, 'nightAlpha', 0, 1, 0.05).name('夜晚透明').onChange(function (value) {
                        layer.nightAlpha = value
                    });
                    layerParam.add(layerObj, 'saturation', 0, 5, 0.05).name('饱和').onChange(function (value) {
                        layer.saturation = value
                    });

                    layerParam.open()
                }
            },
            /**
             * 图层切换
             * @param {*} options 
             */
            showLayerSwitchPanel: function (layers) {
                if (layers && layers.length) {
                    var gui = new dat.GUI()

                    var layerObj = new function () {
                        for (let i in layers) {
                            this[layers[i].id] = layers[i].show
                        }
                    };
                    var layerSwitch = gui.addFolder('图层切换')
                    for (let i in layers) {
                        layerSwitch.add(layerObj, layers[i].id).name(layers[i].name).onChange(function (value) {
                            layers[i].show = value
                        });
                    }
                    var layerAlphaObj = new function () {
                        for (let i in layers) {
                            this[layers[i].id] = layers[i].alpha
                        }
                    };
                    var layerAlpha = gui.addFolder('透明度')
                    for (let i in layers) {
                        layerAlpha.add(layerAlphaObj, layers[i].id, 0, 1, 0.05).name(layers[i].name).onChange(function (value) {
                            layers[i].alpha = value
                        });
                    }
                    layerSwitch.open()
                    layerAlpha.open()
                }
            },
            /**
             * 场景效果调整面板
             * @param {*} opt 
             */
            showSceneEffectEditPanel: function (options) {
                options = options || {}
                if (dat.GUI && this._viewer.scene.colorCorrection) {

                    var gui = new dat.GUI(), viewer = this._viewer;

                    /**
                     * 初始化场景
                     */
                    //设置环境光
                    viewer.scene.lightSource.ambientLightColor = options.ambientLightColor || new Cesium.Color(0.3, 0.3, 0.3, 1);
                    //开启颜色校正
                    viewer.scene.colorCorrection.show = options.colorCorrection || false;
                    viewer.scene.colorCorrection.saturation = options.saturation || 3.1;
                    viewer.scene.colorCorrection.brightness = options.brightness || 1.8;
                    viewer.scene.colorCorrection.contrast = options.contrast || 1.2;
                    viewer.scene.colorCorrection.hue = options.hue || 0;

                    //开启泛光和HDR
                    viewer.scene.bloomEffect.show = options.bloomEffect || false;
                    viewer.scene.hdrEnabled = options.hdrEnabled || true;
                    viewer.scene.bloomEffect.threshold = options.threshold || 1;
                    viewer.scene.bloomEffect.bloomIntensity = options.bloomIntensity || 2;

                    /**
                     * 初始化dat
                     */
                    var sceneObj = new function () {
                        //泛光开关
                        this.bloomEffectShow = options.bloomEffect || false
                        //泛光阈值
                        this.bloomThreshold = options.threshold || 1
                        //泛光强度
                        this.bloomIntensity = options.bloomIntensity || 2
                        //环境光
                        this.ambientLightColor = options.ambientLightColor || 0.3
                        //HDR开关
                        this.hdrEnabled = options.hdrEnabled || true
                        //颜色校正
                        this.colorCorrectionShow = false
                        //饱和度
                        this.colorCorrectionSaturation = options.saturation || 3.1
                        //亮度
                        this.colorCorrectionBrightness = options.brightness || 1.8
                        //对比度
                        this.colorCorrectionContrast = options.contrast || 1.2
                        //色调
                        this.colorCorrectionHue = options.hue || 0
                    };
                    var sceneEffect = gui.addFolder('场景效果')

                    sceneEffect.add(sceneObj, 'bloomEffectShow').name('泛光开关').onChange(function (value) {
                        viewer.scene.bloomEffect.show = value;
                        viewer.scene.bloomEffect.threshold = sceneObj.bloomThreshold;
                        viewer.scene.bloomEffect.bloomIntensity = sceneObj.bloomIntensity;
                    });
                    sceneEffect.add(sceneObj, 'bloomThreshold', 0, 1, 0.1).name('泛光阈值').onChange(function (value) {
                        viewer.scene.bloomEffect.threshold = value;
                    });
                    sceneEffect.add(sceneObj, 'bloomIntensity', 0, 10, 0.1).name('泛光强度').onChange(function (value) {
                        viewer.scene.bloomEffect.bloomIntensity = value;
                    });
                    sceneEffect.add(sceneObj, 'hdrEnabled').name('HDR开关').onChange(function (value) {
                        viewer.scene.hdrEnabled = value;
                    });
                    sceneEffect.add(sceneObj, 'colorCorrectionShow').name('颜色校正').onChange(function (value) {
                        viewer.scene.colorCorrection.show = value;
                    });
                    sceneEffect.add(sceneObj, 'colorCorrectionSaturation', 0, 5, 0.1).name('饱和度').onChange(function (value) {
                        viewer.scene.colorCorrection.saturation = value;
                    });
                    sceneEffect.add(sceneObj, 'colorCorrectionBrightness', 0, 5, 0.1).name('亮度').onChange(function (value) {
                        viewer.scene.colorCorrection.brightness = value;
                    });
                    sceneEffect.add(sceneObj, 'colorCorrectionContrast', 0, 5, 0.1).name('对比度').onChange(function (value) {
                        viewer.scene.colorCorrection.contrast = value;
                    });
                    sceneEffect.add(sceneObj, 'colorCorrectionHue', 0, 5, 0.1).name('色调').onChange(function (value) {
                        viewer.scene.hdrEnabled = value;
                    });
                    sceneEffect.add(sceneObj, 'colorCorrectionHue', 0, 1, 0.1).name('环境光').onChange(function (value) {
                        viewer.scene.lightSource.ambientLightColor = new Cesium.Color(value, value, value, 1);
                    });
                    sceneEffect.open()
                }
            },
            /**
             * 位置姿态编辑面板啊
             * @param {*} Entity 
             */
            showEntityOrientationEditPanel: function (Entity) {
                if (Entity) {
                    var gui = new dat.GUI()

                    var OrientationObj = new function () {

                        this.heading = 360

                        this.pitch = 1

                        this.roll = 1
                    };
                    var Orientation = gui.addFolder('实体姿态调整'), $this = this;
                    Orientation.add(OrientationObj, 'heading', 0, 360, 1).name('角度').onChange(function (value) {

                        OrientationObj.heading = value
                        Entity.orientation =
                            Cesium.Transforms.headingPitchRollQuaternion(
                                Entity.position.getValue($this._viewer.clock.currentTime),
                                new Cesium.HeadingPitchRoll(
                                    Cesium.Math.toRadians(OrientationObj.heading),
                                    Cesium.Math.toRadians(OrientationObj.pitch),
                                    Cesium.Math.toRadians(OrientationObj.roll)
                                ))
                    });

                    Orientation.add(OrientationObj, 'pitch', 0, 360, 1).name('航向').onChange(function (value) {

                        OrientationObj.pitch = value
                        Entity.orientation =
                            Cesium.Transforms.headingPitchRollQuaternion(
                                Entity.position.getValue($this._viewer.clock.currentTime),
                                new Cesium.HeadingPitchRoll(
                                    Cesium.Math.toRadians(OrientationObj.heading),
                                    Cesium.Math.toRadians(OrientationObj.pitch),
                                    Cesium.Math.toRadians(OrientationObj.roll)
                                ))
                    });

                    Orientation.add(OrientationObj, 'roll', 0, 360, 1).name('翻转').onChange(function (value) {

                        OrientationObj.roll = value
                        Entity.orientation =
                            Cesium.Transforms.headingPitchRollQuaternion(
                                Entity.position.getValue($this._viewer.clock.currentTime),
                                new Cesium.HeadingPitchRoll(
                                    Cesium.Math.toRadians(OrientationObj.heading),
                                    Cesium.Math.toRadians(OrientationObj.pitch),
                                    Cesium.Math.toRadians(OrientationObj.roll)
                                ))
                    });
                    Orientation.open()
                }
            }
        }
        /**
         * 箭头标绘模块
         * @param {*} viewer 
         */
        function ArrowPlot(viewer) {
            if (!this._drawLayer) {

                alert('绘制图层 drawLayer 未添加!')
            }
        }
        ArrowPlot.prototype = {

            // getAttackArrowHeadPoints
            _pl_getAttackArrowHeadPoints: function (t, o, e) {
                var headHeightFactor = .18;
                var headTailFactor = .8;
                var headWidthFactor = .3;
                var neckWidthFactor = .15;
                var neckHeightFactor = .85;
                var r = this.getBaseLength2d(t),
                    n = r * headHeightFactor,
                    g = t[t.length - 1];
                r = this.mathDistance2d(g, t[t.length - 2]);
                var i = this.mathDistance2d(o, e);
                n > i * headTailFactor && (n = i * headTailFactor);
                var s = n * headWidthFactor,
                    a = n * neckWidthFactor;
                n = n > r ? r : n;
                var l = n * neckHeightFactor,
                    u = this.getThirdPoint2d(t[t.length - 2], g, 0, n, !0),
                    c = this.getThirdPoint2d(t[t.length - 2], g, 0, l, !0),
                    p = this.getThirdPoint2d(g, u, Math.PI / 2, s, !1),
                    h = this.getThirdPoint2d(g, u, Math.PI / 2, s, !0),
                    d = this.getThirdPoint2d(g, c, Math.PI / 2, a, !1),
                    f = this.getThirdPoint2d(g, c, Math.PI / 2, a, !0);
                return [d, p, g, h, f]
            },
            // dereplication
            _pl_dereplication: function (array) {
                var last = array[array.length - 1];
                var change = false;
                var newArray = [];
                newArray = array.filter(function (i) {
                    if (i[0] != last[0] && i[1] != last[1]) {
                        return i;
                    }
                    change = true;
                });
                if (change) newArray.push(last);
                return newArray;
            },
            // getAttackArrowBodyPoints
            _pl_getAttackArrowBodyPoints: function (t, o, e, r) {
                for (var n = this.wholeDistance2d(t), g = this.getBaseLength2d(t), i = g * r, s = this.mathDistance2d(o, e), a = (i - s) / 2, l = 0, u = [], c = [], p = 1; p < t.length - 1; p++) {
                    var h = this.getAngleOfThreePoints2d(t[p - 1], t[p], t[p + 1]) / 2;
                    l += this.mathDistance2d(t[p - 1], t[p]);
                    var d = (i / 2 - l / n * a) / Math.sin(h),
                        f = this.getThirdPoint2d(t[p - 1], t[p], Math.PI - h, d, !0),
                        E = this.getThirdPoint2d(t[p - 1], t[p], h, d, !1);
                    u.push(f),
                        c.push(E)
                }
                return u.concat(c)
            },
            // array2Dto1D
            _pl_array2Dto1D: function (array) {
                var newArray = [];
                array.forEach(function (elt) {
                    newArray.push(elt[0]);
                    newArray.push(elt[1]);
                });
                return newArray;
            },
            // getTempPoint4
            _pl_getTempPoint4: function (t, o, e) {
                var r, n, g, i, s = [(t[0] + o[0]) / 2, (t[1] + o[1]) / 2],
                    a = this.mathDistance2d(s, e),
                    l = this.getAngleOfThreePoints2d(t, s, e);
                return l < Math.PI / 2 ? (n = a * Math.sin(l), g = a * Math.cos(l), i = this.getThirdPoint2d(t, s, Math.PI / 2, n, !1), r = this.getThirdPoint2d(s, i, Math.PI / 2, g, !0)) : l >= Math.PI / 2 && l < Math.PI ? (n = a * Math.sin(Math.PI - l), g = a * Math.cos(Math.PI - l), i = this.getThirdPoint2d(t, s, P.Constants.HALF_PI, n, !1), r = this.getThirdPoint2d(s, i, Math.PI / 2, g, !1)) : l >= Math.PI && l < 1.5 * Math.PI ? (n = a * Math.sin(l - Math.PI), g = a * Math.cos(l - Math.PI), i = this.getThirdPoint2d(t, s, Math.PI / 2, n, !0), r = this.getThirdPoint2d(s, i, Math.PI / 2, g, !0)) : (n = a * Math.sin(2 * Math.PI - l), g = a * Math.cos(2 * Math.PI - l), i = this.getThirdPoint2d(t, s, Math.PI / 2, n, !0), r = this.getThirdPoint2d(s, i, Math.PI / 2, g, !1)),
                    r
            },
            // getArrowHeadPoints
            _pl_getArrowHeadPoints: function (t, o, e) {
                var type = 'doublearrow'
                var headHeightFactor = .25
                var headWidthFactor = .3
                var neckHeightFactor = .85
                var neckWidthFactor = .15
                var r = this.getBaseLength2d(t),
                    n = r * headHeightFactor,
                    g = t[t.length - 1],
                    i = (this.mathDistance2d(o, e), n * headWidthFactor),
                    s = n * neckWidthFactor,
                    a = n * neckHeightFactor,
                    l = this.getThirdPoint2d(t[t.length - 2], g, 0, n, !0),
                    u = this.getThirdPoint2d(t[t.length - 2], g, 0, a, !0),
                    c = this.getThirdPoint2d(g, l, Math.PI / 2, i, !1),
                    p = this.getThirdPoint2d(g, l, Math.PI / 2, i, !0),
                    h = this.getThirdPoint2d(g, u, Math.PI / 2, s, !1),
                    d = this.getThirdPoint2d(g, u, Math.PI / 2, s, !0);
                return [h, c, g, p, d];
            },
            // getArrowBodyPoints
            _pl_getArrowBodyPoints: function (t, o, e, r) {
                for (var n = this.wholeDistance2d(t), g = this.getBaseLength2d(t), i = g * r, s = this.mathDistance2d(o, e), a = (i - s) / 2, l = 0, u = [], c = [], p = 1; p < t.length - 1; p++) {
                    var h = this.getAngleOfThreePoints2d(t[p - 1], t[p], t[p + 1]) / 2;
                    l += this.mathDistance2d(t[p - 1], t[p]);
                    var d = (i / 2 - l / n * a) / Math.sin(h),
                        f = this.getThirdPoint2d(t[p - 1], t[p], Math.PI - h, d, !0),
                        E = this.getThirdPoint2d(t[p - 1], t[p], h, d, !1);
                    u.push(f),
                        c.push(E)
                }
                return u.concat(c)
            },
            // getArrowPoints
            _pl_getArrowPoints: function (t, o, e, r) {
                var type = 'doublearrow'
                var headHeightFactor = .25
                var headWidthFactor = .3
                var neckHeightFactor = .85
                var neckWidthFactor = .15
                var n = [(t[0] + o[0]) / 2, (t[1] + o[1]) / 2],
                    g = this.mathDistance2d(n, e),
                    i = this.getThirdPoint2d(e, n, 0, .3 * g, !0),
                    s = this.getThirdPoint2d(e, n, 0, .5 * g, !0);
                i = this.getThirdPoint2d(n, i, Math.PI / 2, g / 5, r),
                    s = this.getThirdPoint2d(n, s, Math.PI / 2, g / 4, r);
                var a = [n, i, s, e],
                    l = this._pl_getArrowHeadPoints(a, headHeightFactor, headWidthFactor, neckHeightFactor, neckWidthFactor),
                    u = l[0],
                    c = l[4],
                    p = this.mathDistance2d(t, o) / this.getBaseLength2d(a) / 2,
                    h = this._pl_getArrowBodyPoints(a, u, c, p),
                    d = h.length,
                    f = h.slice(0, d / 2),
                    E = h.slice(d / 2, d);
                return f.push(u),
                    E.push(c),
                    f = f.reverse(),
                    f.push(o),
                    E = E.reverse(),
                    E.push(t),
                    f.reverse().concat(l, E)
            },
            /**
             * 直角箭头
             * @param {*} options 
             */
            drawStraightArrowGraphics: function (options) {

                options = options || {}
                options.style = options.style ||
                {
                    show: true,
                    fill: true,
                    material: Cesium.Color.BLUE.withAlpha(0.5)
                }
                if (this._viewer && options) {

                    var _handler = new Cesium.ScreenSpaceEventHandler(this._viewer.scene.canvas), $this = this, _drawArr = []
                        , _positions = [], _arrowEntity = undefined;
                    // 计算箭头
                    function fineArrow(tailPoint, headerPoint) {
                        if ((tailPoint.length < 2) || (headerPoint.length < 2)) return;
                        //画箭头的函数
                        let tailWidthFactor = 0.15;
                        let neckWidthFactor = 0.20;
                        let headWidthFactor = 0.25;
                        let headAngle = Math.PI / 8.5;
                        let neckAngle = Math.PI / 13;
                        var o = [];
                        o[0] = tailPoint;
                        o[1] = headerPoint;
                        let e = o[0],
                            r = o[1],
                            n = $this.getBaseLength2d(o),
                            g = n * tailWidthFactor,
                            //尾部宽度因子
                            i = n * neckWidthFactor,
                            //脖子宽度银子
                            s = n * headWidthFactor,
                            //头部宽度因子
                            a = $this.getThirdPoint2d(r, e, Math.PI / 2, g, !0),
                            l = $this.getThirdPoint2d(r, e, Math.PI / 2, g, !1),
                            u = $this.getThirdPoint2d(e, r, headAngle, s, !1),
                            c = $this.getThirdPoint2d(e, r, headAngle, s, !0),
                            p = $this.getThirdPoint2d(e, r, neckAngle, i, !1),
                            h = $this.getThirdPoint2d(e, r, neckAngle, i, !0),
                            d = [];
                        d.push(a[0], a[1], p[0], p[1], u[0], u[1], r[0], r[1], c[0], c[1], h[0], h[1], l[0], l[1], e[0], e[1]);
                        return Cesium.Cartesian3.fromDegreesArray(d);
                    }
                    // 创建箭头图形
                    function showArrowOnMap(positions) {

                        var update = function () {
                            if (positions.length < 2) {
                                return null;
                            }
                            var p1 = positions[1];
                            var p2 = positions[2];
                            var firstPoint = $this.transformCartesianToWGS84(p1), firstPoint = [firstPoint.lng, firstPoint.lat];
                            var endPoints = $this.transformCartesianToWGS84(p2), endPoints = [endPoints.lng, endPoints.lat];
                            var arrow = [];
                            var res = fineArrow([firstPoint[0], firstPoint[1]], [endPoints[0], endPoints[1]]);
                            var index = JSON.stringify(res).indexOf("null");
                            if (index != -1) return [];
                            for (var i = 0; i < res.length; i++) {
                                var c3 = new Cesium.Cartesian3(res[i].x, res[i].y, res[i].z);
                                arrow.push(c3);
                            }
                            return new Cesium.PolygonHierarchy(arrow);
                        }
                        return $this._drawLayer.entities.add({
                            polygon: new Cesium.PolygonGraphics({
                                hierarchy: new Cesium.CallbackProperty(update, false),
                                ...options.style
                            })
                        });
                    }
                    // left
                    _handler.setInputAction(function (evt) { //单机开始绘制
                        // var ray = viewer.camera.getPickRay(evt.position);
                        // if (!ray) return;
                        // var cartesian = viewer.scene.globe.pick(ray, $this.viewer.scene);
                        var cartesian = $this.getCatesian3FromPX(evt.position);

                        if (!cartesian) return;

                        if (_positions.length == 0) {

                            _positions.push(cartesian);
                        }
                        if (_positions.length == 3) {

                            _handler.destroy();
                        }

                        _positions.push(cartesian.clone());

                    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
                    // move
                    _handler.setInputAction(function (evt) { //移动时绘制面
                        var cartesian;
                        cartesian = $this.getCatesian3FromPX(evt.endPosition);
                        if (!cartesian) return;
                        if (_positions.length < 2) {

                            return;
                        }

                        if (_positions.length >= 2) {
                            if (!Cesium.defined(_arrowEntity)) {

                                _positions.push(cartesian);

                                _arrowEntity = showArrowOnMap(_positions);
                            } else {

                                _positions.pop();

                                _positions.push(cartesian);
                            }
                        }
                    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                }
            },
            /**
            * 攻击箭头
            * @param {*} options 
            */
            drawAttackArrowGraphics: function (options) {

                options = options || {}
                options.style = options.style ||
                {
                    show: true,
                    fill: true,
                    material: Cesium.Color.BLUE.withAlpha(0.5)
                }
                if (this._viewer && options) {

                    var _handler = new Cesium.ScreenSpaceEventHandler(this._viewer.scene.canvas), $this = this
                        , _positions = [], _arrowEntity = undefined;

                    // 计算箭头 tailedAttackArrow
                    function tailedAttackArrow(inputPoint) {
                        inputPoint = $this._pl_dereplication(inputPoint);
                        var tailWidthFactor = .1;
                        var swallowTailFactor = 1;
                        var swallowTailPnt;
                        //控制点
                        var result = {
                            controlPoint: null,
                            polygonalPoint: null
                        };
                        result.controlPoint = inputPoint;
                        var t = inputPoint.length;
                        if (!(2 > t)) {
                            if (2 == inputPoint.length) {
                                result.polygonalPoint = inputPoint;
                                return result;
                            }
                            var o = inputPoint,
                                e = o[0],
                                r = o[1];
                            $this.isClockWise2d(o[0], o[1], o[2]) && (e = o[1], r = o[0]);
                            var n = [(e[0] + r[0]) / 2, (e[1] + r[1]) / 2],
                                g = [n].concat(o.slice(2)),
                                i = $this._pl_getAttackArrowHeadPoints(g, e, r),
                                s = i[0],
                                a = i[4],
                                l = $this.mathDistance2d(e, r),
                                u = $this.getBaseLength2d(g),
                                c = u * tailWidthFactor * swallowTailFactor;
                            swallowTailPnt = $this.getThirdPoint2d(g[1], g[0], 0, c, !0);
                            var p = l / u,
                                h = $this._pl_getAttackArrowBodyPoints(g, s, a, p),
                                t = h.length,
                                d = [e].concat(h.slice(0, t / 2));
                            d.push(s);
                            var f = [r].concat(h.slice(t / 2, t));
                            var newArray = [];
                            f.push(a),
                                d = $this.getQBSplinePoints2d(d),
                                f = $this.getQBSplinePoints2d(f),
                                newArray = $this._pl_array2Dto1D(d.concat(i, f.reverse(), [swallowTailPnt, d[0]]));
                            result.polygonalPoint = Cesium.Cartesian3.fromDegreesArray(newArray);
                        }
                        return result;
                    }
                    // 创建箭头图形
                    function showArrowOnMap(positions) {

                        var update = function () {
                            //计算面
                            if (positions.length < 3) {
                                return null;
                            }
                            var lnglatArr = [];
                            for (var i = 0; i < positions.length; i++) {
                                var lnglat = $this.transformCartesianToWGS84(positions[i]), lnglat = [lnglat.lng, lnglat.lat];
                                lnglatArr.push(lnglat)
                            }
                            var res = tailedAttackArrow(lnglatArr);
                            var index = JSON.stringify(res.polygonalPoint).indexOf("null");
                            var returnData = [];
                            if (index == -1) returnData = res.polygonalPoint;
                            return new Cesium.PolygonHierarchy(returnData);
                        }
                        return $this._drawLayer.entities.add({
                            polygon: new Cesium.PolygonGraphics({
                                hierarchy: new Cesium.CallbackProperty(update, false),
                                ...options.style
                            })
                        });
                    }
                    // left
                    _handler.setInputAction(function (evt) { //单机开始绘制
                        var cartesian = $this.getCatesian3FromPX(evt.position);
                        if (!cartesian) return;

                        _positions.push(cartesian);

                    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
                    // move
                    _handler.setInputAction(function (evt) { //移动时绘制面
                        var cartesian = $this.getCatesian3FromPX(evt.endPosition);
                        if (!cartesian) return;
                        if (_positions.length < 2) {

                            return;
                        }

                        if (_positions.length >= 2) {

                            if (!Cesium.defined(_arrowEntity)) {

                                _positions.push(cartesian);

                                _arrowEntity = showArrowOnMap(_positions);
                            } else {
                                _positions.pop();

                                _positions.push(cartesian);
                            }
                        }
                    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    // right
                    _handler.setInputAction(function (evt) { //右击结束绘制

                        _handler.destroy();

                    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
                }
            },
            /**
             * 钳击箭头
             * @param {*} options 
             */
            drawPincerArrowGraphics: function (options) {

                options = options || {}
                options.style = options.style ||
                {
                    show: true,
                    fill: true,
                    material: Cesium.Color.BLUE.withAlpha(0.5)
                }
                if (this._viewer && options) {

                    var _handler = new Cesium.ScreenSpaceEventHandler(this._viewer.scene.canvas), $this = this
                        , _positions = [], _arrowEntity = undefined, pointArr = [];
                    // 计算箭头 doubleArrow
                    function doubleArrow(inputPoint) {
                        var connPoint = null;
                        var tempPoint4 = null;
                        var points = inputPoint;
                        var result = {
                            controlPoint: null,
                            polygonalPoint: null
                        };
                        //获取已经点击的坐标数
                        var t = inputPoint.length;
                        if (!(2 > t)) {
                            if (2 == t) return inputPoint;
                            var o = points[0],    //第一个点
                                e = points[1],        //第二个点
                                r = points[2],        //第三个点
                                t = inputPoint.length; //获取已经点击的坐标数
                            //下面的是移动点位后的坐标
                            3 == t ? tempPoint4 = $this._pl_getTempPoint4(o, e, r) : tempPoint4 = points[3],
                                3 == t || 4 == t ? connPoint = [(o[0] + e[0]) / 2, (o[1] + e[1]) / 2] : connPoint = points[4];
                            var n, g;

                            $this.isClockWise2d(o, e, r) ? (n = $this._pl_getArrowPoints(o, connPoint, tempPoint4, !1), g = $this._pl_getArrowPoints(connPoint, e, r, !0)) : (n = $this._pl_getArrowPoints(e, connPoint, r, !1), g = $this._pl_getArrowPoints(connPoint, o, tempPoint4, !0));
                            var i = n.length,
                                s = (i - 5) / 2,
                                a = n.slice(0, s),
                                l = n.slice(s, s + 5),
                                u = n.slice(s + 5, i),
                                c = g.slice(0, s),
                                p = g.slice(s, s + 5),
                                h = g.slice(s + 5, i);
                            c = $this.getBezierPoints2d(c);
                            var d = $this.getBezierPoints2d(h.concat(a.slice(1)));
                            u = $this.getBezierPoints2d(u);
                            var f = c.concat(p, d, l, u);
                            var newArray = $this._pl_array2Dto1D(f);
                            result.controlPoint = [o, e, r, tempPoint4, connPoint];
                            result.polygonalPoint = Cesium.Cartesian3.fromDegreesArray(newArray);
                        }
                        return result;
                    }
                    // 创建箭头图形
                    function showArrowOnMap(positions) {

                        var update = function () {
                            //计算面
                            if (positions.length < 3) {
                                return null;
                            }
                            var lnglatArr = [];
                            for (var i = 0; i < positions.length; i++) {
                                var lnglat = $this.transformCartesianToWGS84(positions[i]), lnglat = [lnglat.lng, lnglat.lat];
                                lnglatArr.push(lnglat)
                            }
                            var res = doubleArrow(lnglatArr);
                            var returnData = [];
                            var index = JSON.stringify(res.polygonalPoint).indexOf("null");
                            if (index == -1) returnData = res.polygonalPoint;
                            return new Cesium.PolygonHierarchy(returnData);
                        }
                        return $this._drawLayer.entities.add({
                            polygon: new Cesium.PolygonGraphics({
                                hierarchy: new Cesium.CallbackProperty(update, false),
                                ...options.style
                            })
                        });
                    }
                    // left
                    _handler.setInputAction(function (evt) { //单机开始绘制
                        // var ray = viewer.camera.getPickRay(evt.position);
                        // if (!ray) return;
                        // var cartesian = viewer.scene.globe.pick(ray, $this.viewer.scene);
                        var cartesian;
                        var cartesian = $this.getCatesian3FromPX(evt.position);
                        if (!cartesian) return;
                        if (_positions.length > 4) { //结束绘制

                            _handler.destroy();
                            return;
                        } else {
                            _positions.push(cartesian);
                        }
                    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
                    // move
                    _handler.setInputAction(function (evt) { //移动时绘制面
                        var cartesian;
                        cartesian = $this.getCatesian3FromPX(evt.endPosition);
                        if (!cartesian) return;
                        if (_positions.length < 2) {
                            return;
                        }
                        if (_positions.length >= 2) {
                            if (!Cesium.defined(_arrowEntity)) {
                                _positions.push(cartesian);
                                _arrowEntity = showArrowOnMap(_positions);
                            } else {

                                _positions.pop();
                                _positions.push(cartesian);
                            }
                        }
                    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                }
            }
        }
        /**
         * 基于three的融合
         * 
         * cesium 需要关闭自带的循环渲染
         * useDefaultRenderLoop: false
         * @param {*} viewer 
         */
        function ThreeJs(viewer) {
            if (viewer) {

                this._initContainer()
                this._initThree()
            }
        }
        ThreeJs.prototype = {
            /**
             * 初始化容器
             */
            _initContainer: function () {

                this.cesiumContainer = undefined
                this.threeContainer = undefined
                this.cesiumContainer = document.getElementById('cesiumContainer')
                this.threeContainer = document.getElementById('threeContainer')

                //元素都已经创建默认集成
                if (this.cesiumContainer && this.threeContainer) {

                    return false
                }
                if (!this.cesiumContainer) {

                    alert('未获取到 cesiumContainer 容器!')
                    return false

                } else {
                    //是否符合
                    if (this.cesiumContainer.style.position !== 'absolute') {
                        // 重写样式
                        this.cesiumContainer.style.position = 'absolute'
                        this.cesiumContainer.style.top = 0
                        this.cesiumContainer.style.left = 0
                        this.cesiumContainer.style.height = '100%'
                        this.cesiumContainer.style.width = '100%'
                        this.cesiumContainer.style.margin = 0
                        this.cesiumContainer.style.overflow = 'hidden'
                        this.cesiumContainer.style.padding = 0
                        this.cesiumContainer.style.fontFamily = 'sans-serif'
                    }
                }
                //no create
                if (!this.threeContainer) {
                    var body = document.getElementsByTagName('body')[0];
                    if (body) {
                        this.threeContainer = document.createElement('div')
                        this.threeContainer.id = 'threeContainer'
                        this.threeContainer.style.position = 'absolute'
                        this.threeContainer.style.top = 0
                        this.threeContainer.style.left = 0
                        this.threeContainer.style.height = '100%'
                        this.threeContainer.style.width = '100%'
                        this.threeContainer.style.margin = 0
                        this.threeContainer.style.overflow = 'hidden'
                        this.threeContainer.style.padding = 0
                        this.threeContainer.style.fontFamily = 'sans-serif'
                        this.threeContainer.style.pointerEvents = 'none'
                        body.appendChild(this.threeContainer)
                    }
                }
            },
            /**
             * 初始化three
             */
            _initThree: function () {

                var fov = 45,
                    width = window.innerWidth,
                    height = window.innerHeight,
                    aspect = width / height,
                    near = 1,
                    far = 10 * 1000 * 1000;

                this._three = {
                    renderer: null,
                    camera: null,
                    scene: null
                }

                this._three.scene = new THREE.Scene();
                this._three.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
                this._three.renderer = new THREE.WebGLRenderer({ alpha: true });

                if (this.threeContainer) {

                    this.threeContainer.appendChild(this._three.renderer.domElement);
                }
            },
            /**
             * threeObjects 对象
             * 
             * 用于实例化到cesium球上
             */
            createThreeObject: function () {

                function _3DObject() {
                    this.threeMesh = null;
                    this.minWGS84 = null;
                    this.maxWGS84 = null;
                }
                return new _3DObject()
            },
            /**
             * 添加three obj对象
             */
            addThreeObjects: function (objects) {

                if (objects && objects.length > 0) {

                    this._3Dobjects = objects;
                    //注册
                    this._renderCesium()
                    this._renderThreeObj()
                    this._loop()
                }
            },
            /**
             * 开始渲染cesium和three
             */
            _loop: function () {

                window.loop = function () {
                    //循环渲染
                    requestAnimationFrame(loop)
                    //渲染cesium
                    renderCesium()
                    //渲染three
                    renderThreeObj()
                }

                loop()
            },

            /**
             * 渲染cesium
             */
            _renderCesium: function () {

                var $this = this
                window.renderCesium = function () {

                    $this._viewer && $this._viewer.render()
                }
            },
            /**
             * 渲染three
             */
            _renderThreeObj: function () {
                var $this = this
                window.renderThreeObj = function () {

                    var cartToVec = function (cart) {
                        return new THREE.Vector3(cart.x, cart.y, cart.z);
                    };

                    if ($this._three && $this._viewer && $this._3Dobjects) {
                        //同步相机事件
                        $this._three.camera.fov = Cesium.Math.toDegrees($this._viewer.camera.frustum.fovy)
                        $this._three.camera.updateProjectionMatrix();

                        // 同步位置 Configure Three.js meshes to stand against globe center position up direction
                        for (var id in $this._3Dobjects) {
                            var minWGS84 = $this._3Dobjects[id].minWGS84,
                                maxWGS84 = $this._3Dobjects[id].maxWGS84,
                                // convert lat/long center position to Cartesian3
                                center = Cesium.Cartesian3.fromDegrees((minWGS84[0] + maxWGS84[0]) / 2, (minWGS84[1] + maxWGS84[1]) / 2),
                                // get forward direction for orienting model
                                centerHigh = Cesium.Cartesian3.fromDegrees((minWGS84[0] + maxWGS84[0]) / 2, (minWGS84[1] + maxWGS84[1]) / 2, 1);
                            // use direction from bottom left to top left as up-vector
                            var bottomLeft = cartToVec(Cesium.Cartesian3.fromDegrees(minWGS84[0], minWGS84[1]));
                            var topLeft = cartToVec(Cesium.Cartesian3.fromDegrees(minWGS84[0], maxWGS84[1]));
                            var latDir = new THREE.Vector3().subVectors(bottomLeft, topLeft).normalize();
                            // configure entity position and orientation
                            $this._3Dobjects[id].threeMesh.position.copy(center);
                            $this._3Dobjects[id].threeMesh.lookAt(centerHigh);
                            $this._3Dobjects[id].threeMesh.up.copy(latDir);
                        }

                        // Clone Cesium Camera projection position so the
                        // Three.js Object will appear to be at the same place as above the Cesium Globe
                        $this._three.camera.matrixAutoUpdate = false;
                        var cvm = $this._viewer.camera.viewMatrix,
                            civm = $this._viewer.camera.inverseViewMatrix;
                        $this._three.camera.matrixWorld.set(
                            civm[0], civm[4], civm[8], civm[12],
                            civm[1], civm[5], civm[9], civm[13],
                            civm[2], civm[6], civm[10], civm[14],
                            civm[3], civm[7], civm[11], civm[15]
                        );
                        $this._three.camera.matrixWorldInverse.set(
                            cvm[0], cvm[4], cvm[8], cvm[12],
                            cvm[1], cvm[5], cvm[9], cvm[13],
                            cvm[2], cvm[6], cvm[10], cvm[14],
                            cvm[3], cvm[7], cvm[11], cvm[15]
                        );
                        $this._three.camera.lookAt(new THREE.Vector3(0, 0, 0));

                        var width = $this.threeContainer.clientWidth,
                            height = $this.threeContainer.clientHeight,
                            aspect = width / height;
                        $this._three.camera.aspect = aspect;
                        $this._three.camera.updateProjectionMatrix();

                        $this._three.renderer.setSize(width, height);
                        $this._three.renderer.render($this._three.scene, $this._three.camera);
                    }
                }

            }
        }
        /**
        * @description D3Kit 拓展包
        * 
        * 分析模块
        * @param {*} viewer 
        */
        function Analysis(viewer) {
            if (viewer) {
                this._analysisLayer = new Cesium.CustomDataSource('analysisLayer')

                viewer && viewer.dataSources.add(this._analysisLayer)
            }
        }
        Analysis.prototype = {
            /**
             * 创建通视分析
             * @param {*} options 
             */
            createVisibilityAnalysis: function (options) {
                options = options || {}
                var $this = this
                $this.drawLineGraphics({
                    type: 'straightLine',
                    clampToGround: false,
                    callback: function (line, lineObj) {
                        var _visibilityAnalysis = new VisibilityAnalysis({ positions: line, that: $this })

                        if ($this._graphicsLayer) $this._graphicsLayer.entities.remove(lineObj)

                        if (typeof options.callback === 'function') {
                            options.callback(_visibilityAnalysis)
                        }
                    }
                })
            },
            /**
             * 创建环视分析
             * @param {*} options 
             */
            createLookAroundAnalysis: function (options) {
                options = options || {}
                if (this._viewer && options) {
                    var $this = this;
                    $this.drawCircleGraphics({
                        callback: function (result, obj) {

                            $this._drawLayer.entities.remove(obj)

                            let _lookAroundAnalysis = new LookAroundAnalysis({ that: $this, radius: result.radius, center: result.center })

                            if (typeof options.callback === 'function') {

                                options.callback(_lookAroundAnalysis);
                            }
                        }
                    })
                }
            },
            /**
             * 创建可视域分析
             * @param {*} options 
             */
            createVisualFieldAnalysis: function (options) {
                options = options || {}
                if (this._viewer && options) {
                    var $this = this, _shadowPrimitive = null;
                    $this.bindHandelEvent(
                        function click(event, _handlers) {
                            var position = $this._viewer.scene.pickPosition(event.position);
                            if (!position) return false
                            if (!Cesium.defined(_shadowPrimitive)) {
                                // 创建shadowPrimitve
                                _shadowPrimitive = new Cesium.ShadowPrimitive({

                                    scene: $this._viewer.scene,
                                    viewerPosition: position
                                });

                                $this._analysisLayer._primitives.add(_shadowPrimitive);
                            } else {

                                _handlers.destroy()
                                _handlers = null
                            }
                        },
                        function move(event) {

                            var position = $this._viewer.scene.pickPosition(event.endPosition);
                            if (!position) return false
                            if (_shadowPrimitive) _shadowPrimitive.setPoseByTargetPoint(position);
                        })
                }
            },
            /**
             * 地形开挖分析
             * @param {*} options 
             */
            createClipPlanAnalysis: function (options) {
                options = options || {}
                if (this._viewer && options) {
                    var $this = this;
                    var _height = options.height || 30,
                        _splitNum = options.splitNum || 50,
                        _wallImg = options.wallImg || "data/images/excavate_side_min.jpg",
                        _bottomImg = options.bottomImg || "data/images/excavate_bottom_min.jpg";
                    $this.drawPolygonGraphics({
                        callback: function (polygon, polygonObj) {

                            $this._drawLayer.entities.remove(polygonObj)

                            let terrainClipPlan = new Cesium.TerrainClipPlan($this._viewer, {
                                height: _height,
                                splitNum: _splitNum,
                                wallImg: _wallImg,
                                bottomImg: _bottomImg
                            })
                            terrainClipPlan.updateData($this.transformWGS84ArrayToCartesianArray(polygon))

                            if (typeof options.callback === 'function') {

                                options.callback(terrainClipPlan);
                            }
                        }
                    })
                }
            },
            /**
             * 创建淹没分析
             * @param {*} options 
             */
            createSubmergedAnalysis: function (options) {
                options = options || {}
                if (this._viewer && options) {
                    var $this = this,
                        _maxH = options.maxH || 15,
                        _speed = options.speed || 1,
                        _interval = options.interval || 10;
                    $this.drawPolygonGraphics({
                        height: 1,
                        callback: function (polygon, polygonObj) {
                            if (!$this._viewer.scene.globe.depthTestAgainstTerrain) {
                                alert('请开启深度检测')
                                return false;
                            }
                            if (polygonObj) {
                                setTimeout(() => {

                                    polygonObj.polygon.heightReference = "CLAMP_TO_GROUND";
                                    polygonObj.polygon.material = "data/images/water.png";
                                    var h = 0.0;
                                    polygonObj.polygon.extrudedHeight = h;
                                    var st = setInterval(function () {
                                        h = h + _speed;
                                        if (h >= _maxH) {
                                            h = _maxH;
                                            clearTimeout(st);
                                        }
                                        polygonObj.polygon.extrudedHeight = h;
                                    }, _interval);

                                }, 2000);
                            }
                        }
                    })
                }
            },
            /**
             * 创建坡度分析
             * @param {*} options 
             */
            createSlopeAnalysis: function (options) {
                options = options || {}
                if (!echarts) {

                    alert('需要引入echarts库')
                    return false;
                }
                if (this._viewer && options) {
                    $this.drawLineGraphics({
                        type: 'straightLine',
                        clampToGround: false,
                        callback: function (line, lineObj) {
                            var _slopeAnalysis = new SlopeAnalysis({ positions: line, that: $this })

                            if ($this._graphicsLayer) $this._graphicsLayer.entities.remove(lineObj)

                            if (typeof options.callback === 'function') {
                                options.callback(_slopeAnalysis)
                            }
                        }
                    })
                }
            },
            /**
             * 方量分析
             * @param {*} options 
             */
            createCutVolumeAnalysis: function (options) {
                options = options || {}
                if (this._viewer && options) {
                    var $this = this;
                    $this.drawWallGraphics({
                        callback: function (wall, wallobj) {

                            var _cutVolumeAnalysis = new CutVolumeAnalysis({

                                positions: $this.transformWGS84ArrayToCartesianArray(wall, 100),
                                that: $this
                            })

                            if (typeof options.callback === 'function') {
                                options.callback(_cutVolumeAnalysis)
                            }
                        }
                    })
                }
            }
        }

        /**
         * 通视分析
         * @param {*} params 
         */
        function VisibilityAnalysis(params) {

            if (params && params.positions) {
                var positions = params.positions, that = params.that, points = [], lines = [], pickedObjs = [],
                    position1 = that.transformWGS84ToCartesian(positions[0]), position2 = that.transformWGS84ToCartesian(positions[1]);
                points = that.createPointsGraphics({
                    point: true,
                    positions: [position1, position2]
                })

                var results = that.getIntersectObj(position1, position2, points, true); //碰撞检测

                if (results.length === 0) {

                    alert("没有取到相交点 , 请检查是否开启深度检测。")
                    return false
                }
                //显示相交对象 高亮
                function showIntersections() {
                    for (let i = 0; i < results.length; ++i) {
                        var object = results[i].object;
                        if (object) {
                            if (object instanceof Cesium.Cesium3DTileFeature) {

                                pickedObjs.push(object);
                                object.oldColor = object.color.clone();
                                object.color = Cesium.Color.fromAlpha(Cesium.Color.YELLOW, object.color.alpha);
                            } else if (object.id instanceof Cesium.Entity) {
                                var entity = object.id;
                                pickedObjs.push(entity);
                                var color = entity.polygon.material.color.getValue();
                                entity.polygon.oldColor = color.clone();
                                entity.polygon.material = Cesium.Color.fromAlpha(Cesium.Color.YELLOW, color.alpha);
                            }
                        }
                        //相交点
                        points.push(that._analysisLayer.entities.add({
                            position: results[i].position,
                            ellipsoid: {
                                radii: new Cesium.Cartesian3(0.8, 0.8, 0.8),
                                material: Cesium.Color.RED
                            }
                        }));
                    }
                }
                // 计算分析结果
                function computesResult() {

                    //分析一下是否都有position
                    for (let index = results.length - 1; index >= 0; index--) {
                        const element = results[index];
                        if (!Cesium.defined(element.position)) {
                            results.splice(index, 1);
                        }
                    }
                    if (!Cesium.defined(results[0].position)) {
                        throw new Cesium.DeveloperError("position is undefined");
                    }
                    var pickPos1 = results[0].position;
                    var dis = Cesium.Cartesian3.distance(pickPos1, position2);
                    var bVisibility = dis < 5 ? true : false; //
                    var arrowPositions = [position1, results[0].position];
                    //通视线
                    var greenLine = that._analysisLayer.entities.add({
                        polyline: {
                            positions: arrowPositions,
                            width: 10,
                            arcType: Cesium.ArcType.NONE,
                            material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.GREEN)
                        }
                    });
                    lines.push(greenLine);
                    //不通视
                    if (!bVisibility) {
                        var unArrowPositions = [results[0].position, position2];
                        var redLine = that._analysisLayer.entities.add({
                            polyline: {
                                positions: unArrowPositions,
                                width: 10,
                                arcType: Cesium.ArcType.NONE,
                                material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.RED)
                            }
                        });

                        lines.push(redLine);
                    }
                    showIntersections()
                    var rad1 = Cesium.Cartographic.fromCartesian(position1);
                    var rad2 = Cesium.Cartographic.fromCartesian(position2);
                    var degree1 = { longitude: rad1.longitude / Math.PI * 180, latitude: rad1.latitude / Math.PI * 180, height: rad1.height };
                    var degree2 = { longitude: rad2.longitude / Math.PI * 180, latitude: rad2.latitude / Math.PI * 180, height: rad2.height };

                    var length_ping = Math.sqrt(Math.pow(position1.x - position2.x, 2) + Math.pow(position1.y - position2.y, 2) + Math.pow(position1.z - position2.z, 2));
                    var length_h = Math.abs(degree2.height - degree1.height);
                    var length = Math.sqrt(Math.pow(length_ping, 2) + Math.pow(length_h, 2));

                    var visTxt = bVisibility ? '是' : '否';
                    var text =
                        '起点坐标: ' + ('   (' + degree1.longitude.toFixed(6)) + '\u00B0' + ',' + (degree1.latitude.toFixed(6)) + '\u00B0' + ',' + degree1.height.toFixed(2) + ')' +
                        '\n终点坐标: ' + ('   (' + degree2.longitude.toFixed(6)) + '\u00B0' + ',' + (degree2.latitude.toFixed(6)) + '\u00B0' + ',' + degree2.height.toFixed(2) + ')' +
                        '\n垂直距离: ' + '   ' + length_h.toFixed(2) + 'm' +
                        '\n水平距离: ' + '   ' + length_ping.toFixed(2) + 'm' +
                        '\n空间距离: ' + '   ' + length.toFixed(2) + 'm' +
                        '\n是否可视: ' + '   ' + visTxt;

                    if (points && points[0]) {
                        points[0].label = {
                            text: text,
                            showBackground: true,
                            font: '14px monospace',
                            fillColor: Cesium.Color.YELLOW,
                            pixelOffset: { x: 0, y: -20 },
                            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                            horizontalOrigin: Cesium.HorizontalOrigin.LEFT
                        }
                    }
                }

                computesResult() // 计算相交结果
            }

            VisibilityAnalysis.prototype.remove = function () { }
        }

        /**
         * 环视分析
         * @param {*} params 
         */
        function LookAroundAnalysis(params) {
            if (!params && !params.center && !params.radius && params.that) {

                alert('没有获取到分析参数')
                return false;
            }

            var that = params.that, $this = this;
            if (!that._viewer.scene.globe.depthTestAgainstTerrain) {

                alert('请开启深度检测')
                return false;
            }

            var viewHeight = params.viewHeight || 10
            var cartographicCenter = Cesium.Cartographic.fromCartesian(params.center);
            // 分析
            try {
                var ab = params.radius;
                var eopt = {};
                eopt.semiMinorAxis = ab;
                eopt.semiMajorAxis = ab;
                eopt.rotation = 0;
                eopt.center = params.center;
                eopt.granularity = Math.PI / 45.0;//间隔
                let ellipse = that.computeEllipseEdgePositions(eopt); //范围当前椭圆位置的数组
                for (let i = 0; i < ellipse.outerPositions.length; i += 3) {
                    //逐条计算可视域
                    let cartesian = new Cesium.Cartesian3(ellipse.outerPositions[i], ellipse.outerPositions[i + 1], ellipse.outerPositions[i + 2]);
                    let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                    let deltaRadian = 0.00005 * Math.PI / 180.0; //Cesium.Math.RADIANS_PER_DEGREE
                    let cartographicArr = that.computeInterpolateLineCartographic(cartographicCenter, cartographic, deltaRadian);
                    that.computeCartographicPointsTerrainData(cartographicArr,
                        function (terrainData) {
                            if (terrainData.length > 0) {
                                let preVisible = true;
                                let cartesiansLine = [];
                                let colors = [];
                                for (let j = 1; j < terrainData.length; j++) {
                                    //逐点计算可见性
                                    let visible = true;//该点可见性
                                    if (j > 1) {
                                        let cartographicCenterHV = new Cesium.Cartographic(terrainData[0].longitude, terrainData[0].latitude, terrainData[0].height + viewHeight);
                                        if (preVisible) {
                                            //   
                                            let curPoint = that.computeInterpolateIndexLineHeightCartographic(cartographicCenterHV, terrainData[j], j, j - 1);
                                            if (curPoint.height >= terrainData[j - 1].height) {
                                                preVisible = true;
                                                visible = true;
                                            } else {
                                                preVisible = false;
                                                visible = false;
                                            }
                                        } else {
                                            //插值到当前
                                            let curPointArr = that.computeInterpolateIndexLineHeightCartographic(cartographicCenterHV, terrainData[j], j, j - 1);
                                            for (let k = 0; k < curPointArr.length; k++) {
                                                if (curPointArr[k].height >= terrainData[k].height) {
                                                    preVisible = true;
                                                    visible = true;
                                                } else {
                                                    preVisible = false;
                                                    visible = false;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    let cartesianTemp = Cesium.Cartesian3.fromRadians(terrainData[j].longitude, terrainData[j].latitude, terrainData[j].height + 1);
                                    cartesiansLine.push(cartesianTemp);
                                    //绘制点
                                    if (visible) {
                                        colors.push(0);
                                        colors.push(0);
                                        colors.push(1);
                                        colors.push(1);
                                    } else {
                                        colors.push(1);
                                        colors.push(0);
                                        colors.push(0);
                                        colors.push(1);
                                    }
                                }
                                //绘制结果
                                $this._pointsKSYResult = new Cesium.PointsPrimitive({ 'viewer': that._viewer, 'Cartesians': cartesiansLine, 'Colors': colors });
                            } else { alert("高程异常！"); }
                        });
                }
            } catch (error) {
                console.log(error);
            }

            LookAroundAnalysis.prototype.remove = function () { }
        }

        /**
         * 坡度分析
         * @param {*} params 
         */
        function SlopeAnalysis(params) {

            if (params && params.positions) {

                var positions = params.positions, that = params.that, points = [],
                    position1 = that.transformWGS84ToCartesian(positions[0]), position2 = that.transformWGS84ToCartesian(positions[1]);
                points = that.createPointsGraphics({
                    point: true,
                    positions: [position1, position2]
                })
                //显示结果
                function showResult(startPoint, endPoint) {
                    //起止点相关信息
                    var scartographic = Cesium.Cartographic.fromCartesian(startPoint);
                    var samplePoint = [scartographic];
                    var pointSum = 10;  //取样点个数
                    var tempCartesians = new Cesium.Cartesian3();
                    var slopePercent = [0];
                    var disL = [0];
                    var angle = 0;
                    for (var i = 1; i <= pointSum; i++) {
                        Cesium.Cartesian3.lerp(startPoint, endPoint, i / pointSum, tempCartesians);
                        var tempCartographic = Cesium.Cartographic.fromCartesian(tempCartesians);
                        var surfaceHeight = $this._viewer.scene.globe.getHeight(tempCartographic);
                        tempCartographic.height = surfaceHeight;
                        samplePoint.push(tempCartographic);
                        var lastCarto = samplePoint[i - 1];
                        var dis = Cesium.Cartesian3.distance(Cesium.Cartographic.toCartesian(lastCarto), Cesium.Cartographic.toCartesian(tempCartographic));
                        disL.push(disL[i - 1] + dis);
                        angle = Math.asin((tempCartographic.height - lastCarto.height) / dis);
                        slopePercent.push(Math.tan(angle) * 100);
                    }

                    var echartContainer = document.createElement('div');
                    echartContainer.className = 'echart-viewer';
                    $this._viewer.container.appendChild(echartContainer, 'dark', {
                        renderer: 'canvas',
                        width: 640,
                        height: 480
                    });
                    echartContainer.style.position = "absolute";
                    echartContainer.style.right = '140px';
                    echartContainer.style.top = '100px';
                    echartContainer.style.height = '300px';
                    echartContainer.style.width = '640px';
                    echartContainer.style.overflow = "hidden";
                    echartContainer.style.zIndex = "9999";
                    echartContainer.style.opacity = 0.9;
                    var myChart = echarts.init(echartContainer);
                    var option = {
                        title: {
                            text: '剖面示意图',
                            left: 'center',
                            subtext: '',
                            textStyle: {
                                color: 'white',
                                fontSize: 15
                            }
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['']
                        },
                        //右上角工具条
                        toolbox: {
                            show: false,
                            feature: {
                                mark: { show: true },
                                dataView: { show: true, readOnly: false },
                                magicType: { show: true, type: ['line', 'bar'] },
                                restore: { show: true },
                                saveAsImage: { show: true }
                            }
                        },
                        calculable: true,
                        xAxis: [
                            {
                                type: 'category',
                                name: "长度(米)",
                                boundaryGap: false,
                                data: disL,
                                axisLabel: {
                                    textStyle: {
                                        color: 'white'
                                    }
                                },
                                axisLine: {
                                    lineStyle: {
                                        color: "white"
                                    }
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                name: "坡度（%）",
                                axisLabel: {
                                    formatter: function (data) { return data.toFixed(2) + "%"; },
                                    // formatter: '{value} 米',
                                    textStyle: {
                                        color: 'white'
                                    }
                                },
                                axisLine: {
                                    lineStyle: {
                                        color: "white"
                                    }
                                }
                            }
                        ],
                        series: [
                            {
                                name: '坡度',
                                type: 'line',
                                areaStyle: {},
                                smooth: true,
                                data: slopePercent,
                                markPoint: {
                                    data: [
                                        { type: 'max', name: '最大值' },
                                        { type: 'min', name: '最小值' }
                                    ]
                                },
                                markLine: {
                                    data: [
                                        { type: 'average', name: '平均值' }
                                    ]
                                }
                            }
                        ]
                    };

                    // 为echarts对象加载数据
                    myChart.setOption(option);
                    return myChart;
                }
            }

            showResult(points[0], points[1])
        }

        /**
         * 方量分析
         * @param {*} params 
         */
        function CutVolumeAnalysis(params) {

            if (params && params.positions && params.that) {

                var that = params.that, positions = params.positions
                    , _debugShowSubTriangles = true, $this = this;


                computeCutVolume()
            }
            /**
             * 计算多边形的重心点
             * @param {*} positions 
             */
            function computeCentroidOfPolygon(positions) {
                var x = [];
                var y = [];

                for (var i = 0; i < positions.length; i++) {
                    var cartographic = Cesium.Cartographic.fromCartesian(positions[i]);

                    x.push(cartographic.longitude);
                    y.push(cartographic.latitude);
                }

                var x0 = 0.0, y0 = 0.0, x1 = 0.0, y1 = 0.0;
                var signedArea = 0.0;
                var a = 0.0;
                var centroidx = 0.0, centroidy = 0.0;

                for (i = 0; i < positions.length; i++) {
                    x0 = x[i];
                    y0 = y[i];

                    if (i == positions.length - 1) {
                        x1 = x[0];
                        y1 = y[0];
                    } else {
                        x1 = x[i + 1];
                        y1 = y[i + 1];
                    }

                    a = x0 * y1 - x1 * y0;
                    signedArea += a;
                    centroidx += (x0 + x1) * a;
                    centroidy += (y0 + y1) * a;
                }

                signedArea *= 0.5;
                centroidx /= (6.0 * signedArea);
                centroidy /= (6.0 * signedArea);

                return new Cesium.Cartographic(centroidx, centroidy);
            }

            /**
             * 计算三角形的面积
             * @param {*} pos1 
             * @param {*} pos2 
             * @param {*} pos3 
             */
            function computeAreaOfTriangle(pos1, pos2, pos3) {
                var a = Cesium.Cartesian3.distance(pos1, pos2);
                var b = Cesium.Cartesian3.distance(pos2, pos3);
                var c = Cesium.Cartesian3.distance(pos3, pos1);

                var S = (a + b + c) / 2;

                return Math.sqrt(S * (S - a) * (S - b) * (S - c));
            }
            /**
             * 计算方量
             */
            function computeCutVolume() {

                var tileAvailability = that._viewer.terrainProvider.availability;
                if (!tileAvailability) {
                    alert("未获取到地形")
                    return false;
                }
                var maxLevel = 0;
                var minHeight = 15000;
                // 计算差值点
                for (var i = 0; i < positions.length; i++) {
                    var cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
                    var height = that._viewer.scene.globe.getHeight(cartographic);

                    if (minHeight > height)
                        minHeight = height;

                    var level = tileAvailability.computeMaximumLevelAtPosition(cartographic);

                    if (maxLevel < level)
                        maxLevel = level;
                }

                var granularity = Math.PI / Math.pow(2, 11);
                granularity = granularity / (64);
                var polygonGeometry = new Cesium.PolygonGeometry.fromPositions(
                    {
                        positions: positions,
                        vertexFormat: Cesium.PerInstanceColorAppearance.FLAT_VERTEX_FORMAT,
                        granularity: granularity
                    }
                );

                //polygon subdivision

                var geom = new Cesium.PolygonGeometry.createGeometry(polygonGeometry);

                var totalCutVolume = 0;
                var maxHeight = 0;

                var i0, i1, i2;
                var height1, height2, height3;
                var p1, p2, p3;
                var bottomP1, bottomP2, bottomP3;
                var scratchCartesian = new Cesium.Cartesian3();
                var cartographic;
                var bottomArea;
                var subTrianglePositions;


                for (i = 0; i < geom.indices.length; i += 3) {
                    i0 = geom.indices[i];
                    i1 = geom.indices[i + 1];
                    i2 = geom.indices[i + 2];

                    subTrianglePositions = geom.attributes.position.values;

                    scratchCartesian.x = subTrianglePositions[i0 * 3];
                    scratchCartesian.y = subTrianglePositions[i0 * 3 + 1];
                    scratchCartesian.z = subTrianglePositions[i0 * 3 + 2];

                    cartographic = Cesium.Cartographic.fromCartesian(scratchCartesian);

                    height1 = that._viewer.scene.globe.getHeight(cartographic);

                    p1 = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height1);
                    bottomP1 = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0);

                    if (maxHeight < height1)
                        maxHeight = height1;

                    scratchCartesian.x = subTrianglePositions[i1 * 3];
                    scratchCartesian.y = subTrianglePositions[i1 * 3 + 1];
                    scratchCartesian.z = subTrianglePositions[i1 * 3 + 2];

                    cartographic = Cesium.Cartographic.fromCartesian(scratchCartesian);

                    height2 = that._viewer.scene.globe.getHeight(cartographic);

                    p2 = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height2);
                    bottomP2 = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0);

                    if (maxHeight < height2)
                        maxHeight = height2;

                    scratchCartesian.x = subTrianglePositions[i2 * 3];
                    scratchCartesian.y = subTrianglePositions[i2 * 3 + 1];
                    scratchCartesian.z = subTrianglePositions[i2 * 3 + 2];

                    cartographic = Cesium.Cartographic.fromCartesian(scratchCartesian);

                    height3 = that._viewer.scene.globe.getHeight(cartographic);

                    p3 = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height3);
                    bottomP3 = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0);

                    if (maxHeight < height3)
                        maxHeight = height3;

                    bottomArea = computeAreaOfTriangle(bottomP1, bottomP2, bottomP3);

                    totalCutVolume = totalCutVolume + bottomArea * (height1 - minHeight + height2 - minHeight + height3 - minHeight) / 3;

                    if (_debugShowSubTriangles) {
                        var positionsarr = [];

                        positionsarr.push(p1);
                        positionsarr.push(p2);
                        positionsarr.push(p3);

                        var drawingPolygon = {
                            polygon: {
                                hierarchy: {
                                    positions: positionsarr
                                },
                                extrudedHeight: 0,
                                perPositionHeight: true,
                                material: Cesium.Color.fromRandom().withAlpha(0.5),
                                outline: true,
                                closeTop: true,
                                closeBottom: true,
                                outlineColor: Cesium.Color.WHITE,
                                outlineWidth: 2
                            }
                        };

                        that._analysisLayer.entities.add(drawingPolygon);
                    }

                }
                var centroid = computeCentroidOfPolygon(positions);
                $this._volumeLabel = that._analysisLayer.entities.add({
                    position: Cesium.Cartesian3.fromRadians(centroid.longitude, centroid.latitude, maxHeight + 1000),
                    label: {
                        text: 'Cut Volume ' + totalCutVolume.toString() + 'm3'
                    }
                });

                return maxHeight;
            };
        }
        /**
         * mapv 插件
         */
        function MapvLayer(viewer) { this._mapvLayer = null }
        MapvLayer.prototype = {
            createMapvLayer(option) {
                if (this._viewer && option) {
                    this._mapvLayer = new mapv.cesiumMapLayer(
                        this._viewer,
                        new mapv.DataSet([]),
                        option || {}
                    )
                    this._viewer.scene.canvas.setAttribute('tabIndex', 0)

                    return this._mapvLayer
                }
            },
            setMapvData(dataSet, option) {
                if (dataSet && option) {
                    this._mapvLayer &&
                        this._mapvLayer.update({ data: dataSet, option: option })
                }
            },
            removeMapvLayer() { }
        }
        /**
         * chart 插件
         */
        function ChartLayer(viewer) { this._chartLayer = null }
        ChartLayer.prototype = {
            createChartLayer() {
                this._chartLayer = new Cesium.ChartLayer()
                return this._chartLayer.install({
                    csmContainer: this._csmContainer,
                    canvas: this._viewer.scene.canvas,
                    viewer: this._viewer
                })
            },
            setChartData(options) {
                if (options) {
                    this._chartLayer &&
                        this._chartLayer.setOption(options)
                }
            },
            removeChartLayer() { }
        }
        /**
         * 自定义插件
         * @param {*} viewer 
         */
        function CustomCesiumPlugin(viewer) {
            if (viewer) {
                this._customPluginLayer = new Cesium.CustomDataSource('_customPluginLayer')

                viewer && viewer.dataSources.add(this._customPluginLayer)
            }
        }
        CustomCesiumPlugin.prototype = {

            createRectangularSensorGraphics: function (options) {
                if (this._customPluginLayer && options) {
                    let r = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(options.heading || 90),
                        Cesium.Math.toRadians(options.pitch || 0),
                        Cesium.Math.toRadians(options.roll || 0));
                    let l = options.position;
                    return this._customPluginLayer.entities.add({
                        position: l,
                        orientation: Cesium.Transforms.headingPitchRollQuaternion(l, r),
                        rectangularSensor: new Cesium.RectangularSensorGraphics({
                            radius: options.radius || 100000,
                            xHalfAngle: Cesium.Math.toRadians(options.xHalfAngle || 45),
                            yHalfAngle: Cesium.Math.toRadians(options.yHalfAngle || 45),
                            material: options.material || new Cesium.Color(1.0, 0.0, 1.0, 0.4),
                            lineColor: options.lineColor || new Cesium.Color(1.0, 0.0, 1.0, 1.0),
                            showScanPlane: options.showScanPlane || true,
                            scanPlaneColor: options.scanPlaneColor || new Cesium.Color(1.0, 0.0, 1.0, 1.0),
                            scanPlaneMode: options.scanPlaneMode || "vertical",
                            scanPlaneRate: options.scanPlaneRate || 3,
                            showThroughEllipsoid: options.showThroughEllipsoid || !1
                        })
                    })
                }
            },
            createSatelliteCoverageSimulationGraphics: function (options) {

                if (options) {
                    return new Cesium.SatelliteCoverageSimulation(this._viewer, {
                        position: options.position,
                        angle1: options.angle1 || 30,
                        angle2: options.angle2 || 45,
                        areaType: options.areaType || 2,
                        rotation: {
                            heading: Cesium.Math.toRadians(options.heading || 0),
                            pitch: Cesium.Math.toRadians(options.pitch || 0),
                            roll: Cesium.Math.toRadians(options.roll || 0)
                        },
                        color: options.color || { red: 0.43137254901960786, green: 0.9607843137254902, blue: 0, alpha: 0.8 }
                    })
                }
            },
            createRadarPrimitive: function (options) {

                if (options) {
                    return new Cesium.RadarPrimitive(this._viewer, {
                        position: options.position,
                        angle: options.angle || 90 - 10,
                        radius: options.radius || 700000,
                        rotation: {
                            heading: Cesium.Math.toRadians(options.heading || 0),
                            pitch: Cesium.Math.toRadians(options.pitch || 40),
                            roll: Cesium.Math.toRadians(options.roll || 0)
                        },
                        color: options.color || { red: 1, green: 0, blue: 0, alpha: 0.4 },
                        lineColor: options.lineColor || { red: 1, green: 1, blue: 1, alpha: 0.9 }
                    })
                }
            }
        }
        /**
         * 初始化入口
         * 三维地图工具拓展
         * @param {*} viewer 
         * @param {*} options 
         */
        function _(viewer, options) {

            this._viewer = viewer

            options = options || {}
            if (this._viewer && Cesium) {

                /**
                 * 基础模块
                 */
                this._install([Base, Shaders, Graphics, Primitive, Draw, Math3d, Math2d, Material, Plugin, PassEffect, ArrowPlot, SuperMap, DomUtil])

                /**
                 * 拓展分析模块
                 */
                if (Analysis instanceof Object) {

                    this._install([Analysis])
                }
                /**
                 * 外部自定义插件
                 */
                if (options.loadCustomCesiumPlugin && typeof _installCustomCesiumPlugin !== 'undefined') {

                    this._install([CustomCesiumPlugin])
                }
                /**
                 * threeJS相关模块
                 */
                if (options && options.three && THREE && ThreeJs instanceof Object) {

                    this._install([ThreeJs])
                }
                /**
                 * GUI控件模块
                 */
                if (typeof dat !== 'undefined' && Control instanceof Object) {

                    this._install([Control])
                }
                /**
                 * Mapv 组件
                 */
                if (typeof mapv !== 'undefined' && MapvLayer instanceof Object) {
                    this._install([MapvLayer])
                }
                /**
                 * chart 组件
                 */
                if (typeof echarts !== 'undefined' && ChartLayer instanceof Object
                    && Cesium.ChartLayer instanceof Object) {

                    Cesium.getUUID = this.getuuid
                    Cesium.createDom = this.createDom
                    this._install([ChartLayer])
                    options.container = options.container || 'viewer-container'
                }
                /**
                 *  创建信用容器
                 */
                if (options && options.container !== '' &&
                    document.getElementById(options.container)) {
                    this._csmContainer = this.createDom(
                        'div',
                        'cesium-container',
                        document.getElementById(options.container)
                    )
                }
            } else {

                alert("请检查 Cesium 是否初始化 !!")
            }
        }
        _.prototype = {
            // 安装组件
            _install: function (objects) {
                // 拷贝
                for (var i in objects) {

                    this._mixin(objects[i])
                }
            },
            // 深拷贝
            _mixin: function (obj) {

                if (obj instanceof Object) {

                    //拷贝方法
                    var keys = Object.keys(obj.prototype);
                    var i, len;
                    for (var i = 0, len = keys.length; i < len; i++) {
                        _.prototype[keys[i]] = obj.prototype[keys[i]];
                    }

                    //拷贝属性
                    obj.call(this, this._viewer)
                }
            },
            /**
             * 获取id
             * @returns {*|string|!Array.<T>}
             */
            getuuid: function () {
                let [s, hexDigits] = [[], '0123456789abcdef']
                for (let i = 0; i < 36; i++) {
                    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
                }
                s[14] = '4'
                s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
                s[8] = s[13] = s[18] = s[23] = '-'
                return (s.join(''))
            },
            /**
             * 添加标识
             * @param obj
             * @returns {*}
             */
            stamp: function (obj) {
                let key = '_event_id_'
                obj[key] = obj[key] || (this.getuuid())
                return obj[key]
            },
            /**
             * 去除字符串前后空格
             * @param str
             * @returns {*}
             */
            trim: function (str) {
                return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '')
            },
            /**
             * 将类名截取成数组
             * @param str
             * @returns {Array|*}
             */
            splitWords: function (str) {
                return this.trim(str).split(/\s+/)
            },

            /**
             * 判断是否为对象
             * @param value
             * @returns {boolean}
             */
            isObject: function (value) {
                const type = typeof value
                return value !== null && (type === 'object' || type === 'function')
            },

            /**
             * merge
             * 合并对象
             * @param a
             * @param b
             * @returns {*}
             */
            merge: function (a, b) {
                for (const key in b) {
                    if (this.isObject(b[key]) && this.isObject(a[key])) {
                        this.merge(a[key], b[key])
                    } else {
                        a[key] = b[key]
                    }
                }
                return a
            },
            /**
             * 取消默认行为
             * @param {*} e 
             */
            preventDefault: function (e) {
                e = e || window.event
                if (e.preventDefault) {
                    e.preventDefault()
                } else {
                    e.returnValue = false
                }
            },
            /**
             * 函数绑定到某个对象
             * @param {*} fns 
             * @param {*} context 
             */
            bindAll: function (fns, context) {
                fns.forEach((fn) => {
                    if (!context[fn]) { return }
                    context[fn] = context[fn].bind(context)
                })
            },
            /**
             * 对数据分组
             * @param {*} array 数据集
             */
            groupBy: function (array, call) {
                const groups = {};
                array.forEach(function (a) {
                    const group = JSON.stringify(call(a));
                    groups[group] = groups[group] || [];
                    groups[group].push(a);
                });
                return Object.keys(groups).map(function (group) {
                    return groups[group];
                });
            }
        }


        // install to Cesium
        // if (typeof Cesium !== "undefined") {
        //     Cesium.D3Kit = D3Kit;
        // }

        console.clear()
        console.log(
            `%c \n D3-KIT \n  %c \n  基于Cesium三维拓展包  %c \n
        版本:${version}
        作者:${author}
        主页: http://www.ztwow.top
        github: ${github}
        示例地址: ${examplesAddr}
        Cesium版本:${CesiumVersion}
        版权声明:
        1.代码包基于Cesium拓展,部分模块开源已上传github。
        2.后续会继续更新拓展,目前该代码包不开源,如需使用:
            1)代码包的完整引用
            2)此版权信息在控制台输出
        我方保留对此版权信息的最终解释权。`,
            'font-size:20px;padding-left:70px;color:#EEB422',
            'font-size:14px;padding-left:50px;color:#EEB422;font-style:oblique',
            'font-size:14px;color:#0865ba'
        )

        return _
    })();

// export default {};