export const legacy = [
  {
    "id": "M01",
    "title": "行程中心搜索",
    "entry": "P03",
    "rule": "关键词/城市/结果",
    "target": "P03结果",
    "link": "center"
  },
  {
    "id": "M02",
    "title": "城市选择",
    "entry": "P03",
    "rule": "定位城市/城市列表",
    "target": "P03",
    "link": null
  },
  {
    "id": "M03",
    "title": "分类筛选",
    "entry": "P03",
    "rule": "分类/推荐/附近/发现/直播",
    "target": "P03",
    "link": "center"
  },
  {
    "id": "M04",
    "title": "行程中心双列/沉浸切换",
    "entry": "P03",
    "rule": "切换显示模式",
    "target": "P04",
    "link": "cover"
  },
  {
    "id": "M05",
    "title": "地点卡展开/照片地图切换",
    "entry": "P05",
    "rule": "地图图标切缩略图、地点底卡",
    "target": "P06",
    "link": null
  },
  {
    "id": "M06",
    "title": "跟着玩方式选择",
    "entry": "P05",
    "rule": "直接使用/复制修改",
    "target": "M07",
    "link": "follow"
  },
  {
    "id": "M07",
    "title": "跟玩成功反馈",
    "entry": "P05",
    "rule": "继续浏览/查看我的行程",
    "target": "P05/P07",
    "link": "follow"
  },
  {
    "id": "M08",
    "title": "收藏成功反馈",
    "entry": "P05",
    "rule": "行程作品收藏",
    "target": "P09",
    "link": null
  },
  {
    "id": "M09",
    "title": "跟玩评价填写",
    "entry": "P15",
    "rule": "推荐选项、文字、照片",
    "target": "P15",
    "link": null
  },
  {
    "id": "M10",
    "title": "跟玩评价筛选",
    "entry": "P15",
    "rule": "最新/已完成",
    "target": "P15",
    "link": null
  },
  {
    "id": "M11",
    "title": "加入行程目标选择",
    "entry": "P06/抖音内容",
    "rule": "已有/新建/收藏地点",
    "target": "P07/P10",
    "link": null
  },
  {
    "id": "M12",
    "title": "空白行程创建",
    "entry": "P07",
    "rule": "目的地必填，日期选填",
    "target": "P07",
    "link": "validate"
  },
  {
    "id": "M13",
    "title": "日期增删确认",
    "entry": "P07",
    "rule": "移动点位或删除点位",
    "target": "P07",
    "link": null
  },
  {
    "id": "M14",
    "title": "地点搜索添加",
    "entry": "P07/P11",
    "rule": "搜索/收藏/当前日末尾",
    "target": "P07/P11",
    "link": "add-place"
  },
  {
    "id": "M15",
    "title": "地点拖拽与跨天移动",
    "entry": "P07",
    "rule": "调整天数/顺序",
    "target": "P07",
    "link": "sort"
  },
  {
    "id": "M16",
    "title": "路线预览",
    "entry": "P07",
    "rule": "按天地图与首屏",
    "target": "P08",
    "link": "preview"
  },
  {
    "id": "M17",
    "title": "完成规划确认",
    "entry": "P05",
    "rule": "草稿→待出发",
    "target": "P05",
    "link": "new-complete"
  },
  {
    "id": "M18",
    "title": "开始行程冲突提示",
    "entry": "P05",
    "rule": "多行程/日期重叠确认",
    "target": "P11",
    "link": null
  },
  {
    "id": "M19",
    "title": "当前执行日选择",
    "entry": "P11",
    "rule": "查看日与执行日分离",
    "target": "P11",
    "link": null
  },
  {
    "id": "M20",
    "title": "打卡时间编辑/取消",
    "entry": "P11",
    "rule": "手动打卡、取消保留体验",
    "target": "P11",
    "link": null
  },
  {
    "id": "M21",
    "title": "删除已打卡点确认",
    "entry": "P11",
    "rule": "提示关联私人数据删除",
    "target": "P11",
    "link": "delete-place"
  },
  {
    "id": "M22",
    "title": "结束行程确认",
    "entry": "P11",
    "rule": "未完成点保留、立即完成",
    "target": "P14",
    "link": null
  },
  {
    "id": "M23",
    "title": "结束后跳过整理",
    "entry": "P14",
    "rule": "退出不强制发布",
    "target": "P05",
    "link": null
  },
  {
    "id": "M24",
    "title": "地点实际花销明细",
    "entry": "P12",
    "rule": "单金额/多笔分类",
    "target": "P12/P13",
    "link": null
  },
  {
    "id": "M25",
    "title": "多币种换算提示",
    "entry": "P13",
    "rule": "仅可靠汇率估算",
    "target": "P13",
    "link": null
  },
  {
    "id": "M26",
    "title": "照片来源选择",
    "entry": "P14/P08",
    "rule": "旅行照片/相册/手动关联作品",
    "target": "P08",
    "link": "publish-content"
  },
  {
    "id": "M27",
    "title": "封面模板选择",
    "entry": "P08",
    "rule": "大图地图/纯大图/地图路线",
    "target": "P08",
    "link": "publish-content"
  },
  {
    "id": "M28",
    "title": "公开路线独立编排",
    "entry": "P08/P07",
    "rule": "选点、增点、改天数顺序",
    "target": "P08",
    "link": null
  },
  {
    "id": "M29",
    "title": "发布隐私与商业资源校验",
    "entry": "P08",
    "rule": "可见范围、私人记录剔除、链接失效",
    "target": "P08",
    "link": "publish-privacy"
  },
  {
    "id": "M30",
    "title": "分享方式选择",
    "entry": "P05",
    "rule": "抖音私信/群聊",
    "target": "M31",
    "link": null
  },
  {
    "id": "M31",
    "title": "私人路线固定快照预览",
    "entry": "P05",
    "rule": "仅公开基础路线、原作者信息",
    "target": "原生聊天",
    "link": null
  },
  {
    "id": "M32",
    "title": "删除行程二次确认",
    "entry": "P09/P05",
    "rule": "不可恢复",
    "target": "P09",
    "link": "delete-trip"
  },
  {
    "id": "M33",
    "title": "再次出发确认",
    "entry": "P05",
    "rule": "复制新草稿",
    "target": "P07",
    "link": null
  },
  {
    "id": "M34",
    "title": "当前行程切换",
    "entry": "P09",
    "rule": "唯一当前，旧进度保留",
    "target": "P11",
    "link": null
  },
  {
    "id": "M35",
    "title": "团购资源卡",
    "entry": "P05/P06",
    "rule": "套餐价及原生入口",
    "target": "E01",
    "link": "native-deals"
  },
  {
    "id": "M36",
    "title": "商品购买链接插入",
    "entry": "P07",
    "rule": "选文案/平台授权商品/预览移除",
    "target": "P07",
    "link": "native-platform"
  },
  {
    "id": "M37",
    "title": "直播资源卡",
    "entry": "P05/P06",
    "rule": "直播状态、跳转",
    "target": "E02",
    "link": "native-platform"
  },
  {
    "id": "M38",
    "title": "商品/直播失效提示",
    "entry": "P05/P06/P08",
    "rule": "不可用/结束/权限不足",
    "target": "来源页",
    "link": "native-error"
  },
  {
    "id": "M39",
    "title": "商业资源预览",
    "entry": "P08",
    "rule": "商品链接可点及合规校验",
    "target": "P08",
    "link": "native-platform"
  },
  {
    "id": "E01",
    "title": "抖音原生团购/商品/门票页",
    "entry": "外部原生节点",
    "rule": "商品详情、购买与支付",
    "target": "回原地点",
    "link": "native-deals"
  },
  {
    "id": "E02",
    "title": "抖音原生直播间",
    "entry": "外部原生节点",
    "rule": "直播观看、原生团购",
    "target": "回原地点",
    "link": "native-platform"
  },
  {
    "id": "E03",
    "title": "手机地图App",
    "entry": "外部应用节点",
    "rule": "导航、返回后手动打卡",
    "target": "P11",
    "link": null
  },
  {
    "id": "E04",
    "title": "抖音原生私信/群聊",
    "entry": "外部原生节点",
    "rule": "分享快照、回聊天",
    "target": "P05",
    "link": null
  },
  {
    "id": "E05",
    "title": "抖音原生评论/分享/举报",
    "entry": "外部原生节点",
    "rule": "平台原生交互",
    "target": "P04/P05",
    "link": "native-services"
  }
];
