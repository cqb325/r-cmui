![](https://img.shields.io/badge/r--cmui-2.3.0-blue.svg) ![](https://img.shields.io/badge/licence-MIT%20License-blue.svg) ![](https://img.shields.io/badge/build-passing-brightgreen.svg)
### r-cmui

#demo

[https://cqb325.github.io/cmui/#/](https://cqb325.github.io/cmui/#/ "cmui demo")

v2.3.0

1、添加 ScrollDateTime & ScrollRangeDateTime

2、select选项添加disabled参数

3、添加国际化支持添加了简体中文和英文 通过window.RCMUI_LANG指定 默认为zh_cn

4、将ScrollDateTime & ScrollRangeDateTime加入FormControl中

5、ScrollDateTime设置起止时间方法

6、ScrollDate的setStartDate和SetEndDate方法在初始无值状态下的bug

7、Menu 修复child为空的节点渲染问题

8、添加二维码QRCode组件

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
