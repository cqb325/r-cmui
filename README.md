![](https://img.shields.io/badge/r--cmui-2.7.0-blue.svg) ![](https://img.shields.io/badge/licence-MIT%20License-blue.svg) ![](https://img.shields.io/badge/build-passing-brightgreen.svg)
### r-cmui

#demo

[https://cqb325.github.io/cmui/#/](https://cqb325.github.io/cmui/#/ "cmui demo")

v2.7.0

1. 添加SideMenu组件
2. scroll当内容超长的时候可以设置滑动块的最小值
3. Menu组件代码选择menuItem的时候清除上次选中的菜单
4. Table refresh hide rows bug

v2.6.2

1. Button 添加title属性
2. Select 在朝上显示的时候样式修改
3. Tree data 变化之后不更新问题
4. Dialog this.panel为undefined问题

v2.6.1

1. Select 和 LargeSelect添加alwaysdown属性  不进行高度计算朝上显示
2. fetch get请求中为null或undefined数据改为空字符串请求
3. Form和FormControl中修改关于layout的处理
4. Notification 无法使用success等方法的问题

v2.6.0

1. 添加LargeSelect组件支持百万级数据
2. scroll的style只读bug
3. 修复LargeSelect data为空时的bug
4. Scroll IE兼容性
5. Date组件下个月不能刷新问题

v2.5.3

1. DateRange 添加对象属性 displayName SimpleListPage 判断DateRange修改
2. Date中 startDate和endDate报错问题

v2.5.2

1. Button防止连续两次单击
2. fetch 添加X-Request-With的header，可以让后台识别是ajax请求
3. MessageBox和Dialog保存防止两次提交
4. scroll 添加wrapDiaplay参数控制内容区域是否撑满

v2.5.1

1. ButtonGroup中记录Button的实例对象不用数组
2. 修改GridTree样式 会与Tree冲突
3. SimpleListPage在autoSearch的时候添加setTimeout

v2.5.0

1. 添加ResizeContent和CloseableContent组件
2. InnerDropdown修改报错bug
3. ConfirmButton onConfirm修改
4. Form中value为boolean的话不需要转化为字符串
5. add Scrollbar组件和Scroll自定义滚动条组件

v2.4.3

1. MessageBox默认title为提示/Tip
2. Dialog默认title为提示/Tip
3. Select 点击后回调时机修改 在SimpleListPage中的autoSearch会延迟获得正确的值
4. Select 级联的时候Option可能产生update unmount 错误

v2.4.2

1. RadioGroup和CheckBoxGroup的setValue中将value强制转化为字符串
2. InnerDropdown组件unmount的时候注销事件
3. fetch中的fetchJSON修改Accept错误
4. Form中默认value转化为字符串,Object类型的值保持不变

v2.4.1

1. Form有变化的时候添加emit事件
2. SimpleListPage添加autoSearch属性，为true时可以监听condition的变化，可以自动查询
3. Dropdown修改滚动后不停刷新的问题
4. SubmitButton添加成功和失败回调onSuccess/onError
5. FormControl添加labelStyle属性可以自定义label的样式
6. ConfirmButton 添加 onBeforeClick 回调
7. Dialog 组件移除的时候将挂在的Panel也移除 减少页面容量
8. MessageBox 组件移除的时候将挂在的Panel也移除 减少页面容量

v2.4.0

1. 添加TreeGrid组件
2. TouchRipple 修改兼容firefox
3. form setData 中isValid 延迟校验
4. Form setData 中赋值延迟执行，先resetValid再验证，默认不立即验证当传参immediateValid为true时可以立即验证
5. 添加ConfirmButton组件
6. 添加SubmitButton组件
7. FormControl对Lable类型的不需要验证， 支持动态type,动态rules和messages 删除setRule和setMessage
8. SimpleListPage 对DateRange拆分查询条件
9. 添加GridTree表格样式的树，和TreeGrid不一样
10. fetch get的时候拼url问题
11. SubmitButton逻辑修改
12. Sider 设置className问题
13. Form添加onChange事件回调，监听表单中元素变化事件
14. ConfirmButton使布局错乱问题修复
15. DateRange 设置startDate和endDate精确到秒 无法限制时间的选择问题 添加setStartDate和setEndDate
16. MessageBox和Dialog双击取消遮罩层bug

v2.3.4

1. fetch添加fetchJSON 修复headers assign错误
2. Transfer修改参数transfered拼写错误
3. Spin添加style属性
4. 重构ScrollDateTime组件， 删除ScrollDateTimeRange组件
5. TimePicker添加键盘加减
6. 修改Grid组件横向滚动条无法滚动问题

v2.3.3

1. SimpleListPage参数是字符串的删除头尾空格,添加查询的try catch避免查询出错后js不执行
1. InnerDropdown 删除ref  会将外面设置的ref覆盖
1. FormControl当注册的元素为disable的时候不进行验证, 远程验证携带参数问题
1. RadioGroup添加自定义style属性
1. Transfer 数据id为数字的时候bug
1. Form元素的LabelWidth优先级更高
1. ScrollDateTime在未初始化的时候time变化而date获取为空的问题
1. DateRange隐藏时间框的时候将选取状态设置为false

v2.3.2

1. Tree添加右键菜单
1. 删除Notification的immutable依赖
1. 删除Select组件的immutable依赖
1. Progress注册到FormControl中
1. FormControl中range规则错误信息展示错误问题
1. Table有边框没数据的时候样式问题修复

v2.3.1

1. Tree添加level属性
1. ScrollDateTime兼容firefox

v2.3.0

1. 添加 ScrollDateTime & ScrollRangeDateTime
1. select选项添加disabled参数
1. 添加国际化支持添加了简体中文和英文 通过window.RCMUI_LANG指定 默认为zh_cn
1. 将ScrollDateTime & ScrollRangeDateTime加入FormControl中
1. ScrollDateTime设置起止时间方法
1. ScrollDate的setStartDate和SetEndDate方法在初始无值状态下的bug
1. Menu 修复child为空的节点渲染问题

8、添加二维码QRCode组件

9、修改fetch组件 添加fetchText和fetchJSON 添加options可以自定义header

v2.2.1

1、修改Select接收新props的时候value为undefined的问题

2、修改RadioGroup和CheckBoxGroup接收新props的时候value为undefined的问题

3、Spinner的props变化的时候setState改为调用setValue方法

v2.2.0

1、添加contacts组件

2、DateTime clear&today

3、修改Suggest初始显示值问题

4、修改Spinner中如果设置min或max则默认值需要根据min和max进行比较

5、修复InputGroup传递props错误

6、select 添加分组功能，指定group属性进行分组显示，默认按照首字母分组，可自定义分组

7、修改DateTime的setValue处理value为null或undefined

8、修改DateTime处于选项时间状态进行关闭时不能直接隐藏的问题

9、添加ScrollTop组件

10、messageBox和Dialog多次两用show或open后backdrop无法关闭问题

11、修改Uploadify中removeFile函数

12、修改Select中Option变化之后再次点击报错lastSelectItem设置激活状态的时候unmount的问题

v2.1.1

1、TableForm 验证rules对象重复问题

2、修复DateTime clock中的spinner样式

3、修改Dom的closest函数

4、DateTime和DateRange show hide 取消使用super 在IE10有问题

v2.1.0

1、修改suggest添加inputOption，可以将输入内容作为选项值。

2、tag 添加圆角circle属性

3、FormControl hidden 需隐藏

4、Label支持format

5、Grid 添加过滤，支持远程排序和过滤，远程排序支持多字段排序， 添加autoHeight，smart模式不起效果,添加可编辑模式

6、DateRange setValue 时间没变bug  SimpleListPage添加自定className

7、add Timeline

v2.0.3

1、TableForm refs混乱问题

2、add Transfer

3、fetch在get的时候添加时间戳，firefox缓存

4、新增Grid组件

5、uploadify文件类型错误提示

6、add List

7、tree 添加禁用项

8、add Tag & Tags 

9、重设验证提示、setData之后进行验证

10、MessageBox Dialog 添加showLoading、hideLoading 确认按钮可实现loading

11、Menu优化

12、添加contextMenu  Grid 添加contextMenu

13、DateRange&TimePicker bug  手动设置DateRange的值调用setValue时，当value为空时，重新进行初始化，删除Date的componentWillReceiveProps生命周期，删除TimePicker的plus和sub回调，与change重复。

14、Input添加addon和affix， 添加 InputGroup

v2.0.2

1、fixed many bugs & stylrs

2、add Slider Component

3、change Form and FormControl layout, can init Form use data property

4、add Draggable to Dialog & MessageBox

5、add filter to Select

6、Button add loadding

7、SimpleListPage use Form as condition ,will search when press enter key

8、modify tip z-index

v2.0.1

1、new structure

2、use PureComponent
