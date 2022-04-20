# cesium-d3kit

### 基于cesium的基础功能封装包，包含一些常用分析,绘制，特效，材质，计算，三方插件等近一百个接口并提供使用示例;
### cesium-d3kit

### 在线示例
##### http://zhangticcc.gitee.io/webgis

### 使用

##### 打开 https://gitee.com/ 登录
##### 新建仓库 选择导入仓库 https://github.com/zhangti0708/cesium-d3kit.git
##### 创建仓库并 git clone 到本地即可. 一分钟左右
##### unzip cesium-d3kit.zip
##### 将map目录直接放在web服务器下直接浏览
##### 打开examples目录下的html功能示例文件需要自行引入插件。

#####  在项目中引入Cesium.js 相关文件

#####  然后引入 cesium-d3kit.js 即可

```
    // 个别功能需要引入三方js和css 按需引入即可
    <link href="lib/Cesium/Widgets/widgets.css" rel="stylesheet">
    <script src="lib/Cesium/Cesium.js"></script>
    <script src="lib/cesium-d3kit.js"></script>
    <div id="viewerContainer"></div>
    <script>

    this._viewer = new Cesium.Viewer("viewerContainer", { infoBox: false });

    this._d3kit = new Cesium.D3Kit(this._viewer)

    let layer = this._viewer.imageryLayers.addImageryProvider(new Cesium.GoogleImageryProvider({
        style: 'img'
    }));
    layer.name = '地图', layer.id = 'layer1', layer.show = false;

    let layer2 = this._viewer.imageryLayers.addImageryProvider(new Cesium.GoogleImageryProvider({}));
    layer2.name = '电子', layer2.id = 'layer2', layer2.show = false;

    let layer3 = this._viewer.imageryLayers.addImageryProvider(new Cesium.GoogleImageryProvider({
        style: 'ter'
    }));
    layer3.name = '地形', layer3.id = 'layer3', layer3.show = true;

    this._d3kit.showLayerSwitchPanel([layer, layer2, layer3])
    </script>
```
  
<a href="http://zhangticcc.gitee.io/webgis/#/gis/examples?exampleURL=measure&tempUrl=%2Fwebgis%2Fd3kit%2Ftemp.html&type=d3old"><img alt="" height="80%" src="https://img-blog.csdnimg.cn/20200512160451599.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MDkwMjUyNw==,size_16,color_FFFFFF,t_70" width="80%" ></a>&nbsp;
<a href="http://zhangticcc.gitee.io/webgis/#/gis/examples?exampleURL=measure&tempUrl=%2Fwebgis%2Fd3kit%2Ftemp.html&type=d3old"></a><br>

<a href="http://zhangticcc.gitee.io/webgis/#/gis/examples?exampleURL=measure&tempUrl=%2Fwebgis%2Fd3kit%2Ftemp.html&type=d3old"><img alt="" height="80%" src="https://img-blog.csdnimg.cn/20200522190732776.gif" width="80%" ></a>&nbsp;
<a href="http://zhangticcc.gitee.io/webgis/#/gis/examples?exampleURL=measure&tempUrl=%2Fwebgis%2Fd3kit%2Ftemp.html&type=d3old"></a><br>
