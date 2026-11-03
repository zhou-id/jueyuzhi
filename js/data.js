/* =========================================================
   荒野禁区 · 数据层
   装备 / 地点 / 天气 / 彩蛋 / 成就
   ========================================================= */

const GEAR_CATS = [
  { id: 'wear',  name: '穿着防护' },
  { id: 'sleep', name: '宿营睡眠' },
  { id: 'cook',  name: '炊事净水' },
  { id: 'comm',  name: '通讯导航' },
  { id: 'med',   name: '医药急救' },
  { id: 'tool',  name: '技术工具' },
  { id: 'food',  name: '食物饮水' }
];

// price 单位：元；weight 单位：kg；qty 为可叠加数量
const GEAR = [
  // ---- 穿着 ----
  { id:'shell', name:'硬壳冲锋衣裤', cat:'wear', price:520, weight:1.1, desc:'防风防水的外层。山脊上的风会先剥掉你的体温，再剥掉你的判断力。' },
  { id:'down', name:'800蓬羽绒服', cat:'wear', price:680, weight:0.8, tags:['cold'], desc:'静态保暖的核心。失温不分季节，只分你有没有带它。' },
  { id:'fleece', name:'抓绒中层', cat:'wear', price:240, weight:0.5, desc:'行进时的保暖层。湿了也比棉衣强。' },
  { id:'base', name:'速干排汗内衣', cat:'wear', price:120, weight:0.25, desc:'棉内衣在山里等于慢性自杀。' },
  { id:'boots', name:'高帮登山鞋', cat:'wear', price:460, weight:1.2, desc:'脚踝的护具。扭伤在无人区等于失去一半行动力。' },
  { id:'gaiter', name:'雪套', cat:'wear', price:80, weight:0.15, tags:['snow'], desc:'挡住灌进鞋里的雪和碎石。' },
  { id:'crampon', name:'冰爪', cat:'wear', price:260, weight:0.7, tags:['ice','snow'], desc:'硬雪坡与冰面上的牙齿。没有它，刃脊就是一条滑梯。' },
  { id:'gloves', name:'防水手套', cat:'wear', price:60, weight:0.1, desc:'手冻僵之后，连打火机都按不响。' },
  { id:'hat', name:'羊毛帽', cat:'wear', price:45, weight:0.1, desc:'人体一半的热量从头部散失。' },
  { id:'goggles', name:'雪镜', cat:'wear', price:120, weight:0.15, tags:['snow','storm'], desc:'白毛风里，睁不开眼就等于失明。' },
  { id:'pole', name:'登山杖', cat:'tool', price:90, weight:0.45, desc:'省下的是膝盖，也是最后一天的体力。' },

  // ---- 睡眠 ----
  { id:'tent', name:'四季帐', cat:'sleep', price:420, weight:1.9, tags:['shelter'], desc:'你唯一能自己造出来的“房间”。防风绳比浪漫重要。' },
  { id:'bag', name:'-18℃羽绒睡袋', cat:'sleep', price:520, weight:1.2, tags:['cold'], desc:'夜里失温的人，往往再也没有醒过来。' },
  { id:'pad', name:'气垫防潮垫', cat:'sleep', price:90, weight:0.45, desc:'地面会一整夜吸走你的热量。' },
  { id:'bivy', name:'紧急保温毯', cat:'sleep', price:45, weight:0.1, desc:'锡箔纸一样薄，能在关键时刻留住一度体温。' },

  // ---- 炊事 ----
  { id:'stove', name:'炉头锅具', cat:'cook', price:130, weight:0.6, tags:['cook'], desc:'融雪、烧水、煮一口热食。热的东西能救人。' },
  { id:'fuel', name:'气罐', cat:'cook', price:35, weight:0.35, unit:'罐', qty:true, tags:['cook'], desc:'一罐大约能烧开 20 升水。高海拔会更费。' },
  { id:'lighter', name:'防风打火石', cat:'cook', price:15, weight:0.05, desc:'打火机在低温里会罢工，打火石不会。' },
  { id:'filter', name:'净水器', cat:'cook', price:180, weight:0.3, unit:'套', tags:['water'], desc:'野外的水看着清澈，里面可能有一整套微生物社会。' },

  // ---- 通讯 ----
  { id:'satphone', name:'卫星电话', cat:'comm', price:1500, weight:0.5, tags:['rescue'], desc:'无人区没有一格信号。它会很贵，但比救援队便宜。' },
  { id:'plb', name:'北斗信标', cat:'comm', price:800, weight:0.25, tags:['rescue'], desc:'一键求救，发送坐标。希望你这辈子用不上。' },
  { id:'gps', name:'GPS 导航', cat:'comm', price:420, weight:0.25, tags:['nav'], desc:'雾里、雪里、夜里，它比直觉可靠。' },
  { id:'map', name:'地形图与指南针', cat:'comm', price:45, weight:0.15, tags:['nav'], desc:'电子设备会没电，纸不会。前提是你会看。' },
  { id:'headlamp', name:'头灯', cat:'comm', price:90, weight:0.15, desc:'天黑得比你想的早。双手要留给登山杖。' },
  { id:'battery', name:'备用电池', cat:'comm', price:20, weight:0.1, desc:'低温会让电量掉得很快。' },

  // ---- 医药 ----
  { id:'kit', name:'急救包', cat:'med', price:160, weight:0.5, tags:['medical'], desc:'绷带、止血粉、消炎药、创可贴。处理不了截肢，但能处理大多数意外。' },
  { id:'meds', name:'高原药与止痛药', cat:'med', price:80, weight:0.1, tags:['altitude'], desc:'高反不会因为你年轻就放过你。' },
  { id:'snake', name:'蛇药', cat:'med', price:70, weight:0.1, tags:['wild'], desc:'南方山地的隐藏杀手，藏在落叶里。' },
  { id:'bearspray', name:'防熊喷雾', cat:'med', price:180, weight:0.35, tags:['wild'], desc:'喷程七米。别对着自己，也别等到它站起来。' },

  // ---- 工具 ----
  { id:'rope', name:'30米动力绳', cat:'tool', price:160, weight:1.0, tags:['river','ice'], desc:'过河、下降、拖人。绳子是唯一不会骗你的队友。' },
  { id:'binocular', name:'望远镜', cat:'tool', price:180, weight:0.5, tags:['scout'], desc:'提前看见路，也提前看见它。' },
  { id:'sunscreen', name:'防晒霜', cat:'tool', price:30, weight:0.1, tags:['desert','snow'], desc:'雪面反光会晒伤，沙漠会晒脱皮。' },
  { id:'insect', name:'驱虫剂', cat:'tool', price:35, weight:0.1, tags:['forest'], desc:'墨脱的蚂蟥不怕人，只怕这个味道。' },

  // ---- 食物 ----
  { id:'food', name:'压缩口粮', cat:'food', price:25, weight:0.4, unit:'份', qty:true, tags:['food'], desc:'一份约 700 千卡。一天至少两份，冷天更多。' },
  { id:'freeze', name:'冻干正餐', cat:'food', price:40, weight:0.22, unit:'份', qty:true, tags:['food'], desc:'热水泡开就是一顿热饭。冻干餐的幸福感被严重低估。' },
  { id:'gel', name:'能量胶', cat:'food', price:10, weight:0.04, unit:'支', qty:true, desc:'走不动的时候，挤一支。' },
  { id:'water', name:'饮用水', cat:'food', price:5, weight:1.0, unit:'L', qty:true, desc:'水是最重的物资，也是最先耗尽的物资。' }
];

const GEAR_MAP = {};
GEAR.forEach(g => { GEAR_MAP[g.id] = g; });

// 默认已有装备（不占预算，但计入负重）
const DEFAULT_KIT = ['boots', 'pole'];
const DEFAULT_WEIGHT = 2.4;

// ---------------- 天气 ----------------
const WEATHER = {
  cold: [
    { name:'晴',      icon:'☀', temp:'-6℃', cold:18, heat:0, wet:0, wind:2, w:3 },
    { name:'阴',      icon:'☁', temp:'-9℃', cold:22, heat:0, wet:0, wind:3, w:2 },
    { name:'风雪',    icon:'❄', temp:'-14℃', cold:32, heat:0, wet:2, wind:5, w:3 },
    { name:'白毛风',  icon:'≋', temp:'-20℃', cold:42, heat:0, wet:1, wind:7, w:1 },
    { name:'雪后晴',  icon:'☀', temp:'-4℃', cold:12, heat:2, wet:1, wind:1, w:2 }
  ],
  desert: [
    { name:'晴热',    icon:'☀', temp:'38℃', cold:0, heat:22, wet:0, wind:2, w:3 },
    { name:'热风',    icon:'≋', temp:'41℃', cold:0, heat:26, wet:0, wind:5, w:2 },
    { name:'沙暴',    icon:'◭', temp:'29℃', cold:0, heat:14, wet:0, wind:8, w:1 },
    { name:'夜寒',    icon:'☾', temp:'9℃',  cold:8, heat:4, wet:0, wind:3, w:2 }
  ],
  plateau: [
    { name:'晴',      icon:'☀', temp:'4℃',  cold:14, heat:2, wet:0, wind:3, w:3 },
    { name:'强风',    icon:'≋', temp:'-2℃', cold:24, heat:0, wet:1, wind:6, w:2 },
    { name:'风雪',    icon:'❄', temp:'-9℃', cold:34, heat:0, wet:2, wind:5, w:2 },
    { name:'冰雹',    icon:'◭', temp:'-1℃', cold:26, heat:0, wet:3, wind:5, w:1 }
  ],
  forest: [
    { name:'阴',      icon:'☁', temp:'19℃', cold:2, heat:0, wet:1, wind:1, w:2 },
    { name:'小雨',    icon:'☂', temp:'17℃', cold:5, heat:0, wet:3, wind:1, w:3 },
    { name:'暴雨',    icon:'☂', temp:'15℃', cold:6, heat:0, wet:5, wind:3, w:2 },
    { name:'浓雾',    icon:'≋', temp:'16℃', cold:4, heat:0, wet:4, wind:0, w:2 }
  ],
  gorge: [
    { name:'晴',      icon:'☀', temp:'24℃', cold:0, heat:6, wet:0, wind:1, w:2 },
    { name:'阵雨',    icon:'☂', temp:'21℃', cold:2, heat:0, wet:3, wind:2, w:3 },
    { name:'暴雨',    icon:'☂', temp:'19℃', cold:3, heat:0, wet:5, wind:4, w:2 },
    { name:'江雾',    icon:'≋', temp:'20℃', cold:2, heat:0, wet:4, wind:0, w:2 }
  ],
  caldera: [
    { name:'晴',      icon:'☀', temp:'-5℃', cold:18, heat:1, wet:0, wind:4, w:2 },
    { name:'大风',    icon:'≋', temp:'-13℃', cold:30, heat:0, wet:0, wind:8, w:2 },
    { name:'暴雪',    icon:'❄', temp:'-18℃', cold:40, heat:0, wet:2, wind:6, w:2 },
    { name:'雾凇',    icon:'≋', temp:'-8℃', cold:24, heat:0, wet:3, wind:2, w:2 }
  ],
  karst: [
    { name:'阴',      icon:'☁', temp:'20℃', cold:1, heat:2, wet:1, wind:0, w:2 },
    { name:'浓雾',    icon:'≋', temp:'17℃', cold:2, heat:0, wet:4, wind:0, w:4 },
    { name:'小雨',    icon:'☂', temp:'18℃', cold:2, heat:0, wet:3, wind:1, w:2 },
    { name:'晴',      icon:'☀', temp:'23℃', cold:0, heat:4, wet:0, wind:1, w:2 }
  ],
  glacier: [
    { name:'晴',      icon:'☀', temp:'-2℃', cold:16, heat:2, wet:0, wind:3, w:2 },
    { name:'大风',    icon:'≋', temp:'-10℃', cold:28, heat:0, wet:0, wind:7, w:2 },
    { name:'雪崩云',  icon:'◭', temp:'-7℃', cold:24, heat:0, wet:1, wind:4, w:2 },
    { name:'雪后晴',  icon:'☀', temp:'-5℃', cold:14, heat:3, wet:1, wind:2, w:3 }
  ]
};

// ---------------- 路线 ----------------
const LOCATIONS = [
  {
    id:'aotai', name:'鳌太线', en:'AOTAI TRAVERSE', province:'陕西 · 秦岭', lon:107.4, lat:33.95,
    level:5, days:7, budget:3200, weightCap:34, scene:'ridge', accent:'#c96a3a', season:'10月 · 初雪',
    stamp:'死亡线路',
    brief:'中国死亡率最高的徒步线路之一。四十余公里的刃脊上没有补给、没有信号，天气十分钟内就能翻脸。失温与迷路，是这里最常见、也最安静的两种死法。',
    route:['塘口村','盆景园','药王庙','麦秸岭','导航架','东塬','大爷海'],
    hazards:['cold','storm','nav','ice','fatigue'],
    must:['down','bag','tent','crampon','goggles'],
    intel:['硬壳与羽绒是底线，睡袋温标至少 -15℃','下午三点前必须离开刃脊，风会在傍晚换挡','卫星通讯比相机重要，这里没有一格信号','水源稀缺，出发前把水背够'],
    legend:'在鳌太，下午三点的风一换，所有路标都会指向同一个方向。',
    events:'aotai'
  },
  {
    id:'qiangtang', name:'羌塘无人区', en:'CHANGTANG', province:'西藏 · 那曲', lon:88.6, lat:34.6,
    level:5, days:12, budget:5000, weightCap:40, scene:'plateau', accent:'#8fa3b8', season:'11月 · 封冻',
    stamp:'生命禁区',
    brief:'平均海拔 4800 米，面积接近一个浙江省。这里没有路，只有方向。棕熊、野牦牛、盐碱湖和说来就来的暴风雪，会让任何一次“抄近路”变成永别。',
    route:['双湖','普若岗日','多格错仁','羊湖','黑石滩','月牙湖','界山达坂'],
    hazards:['cold','altitude','wildlife','nav','water'],
    must:['down','bag','tent','satphone','meds','bearspray'],
    intel:['每天爬升不要超过 300 米，高反不看意志力','棕熊对食物气味极其敏感，口粮必须密封','盐湖不能喝，融雪也要过滤','这里没有“顺路”的救援'],
    legend:'双湖的牧人说，无人区里有一片草，牛羊都不吃，人走过去会听见铃声。',
    events:'qiangtang'
  },
  {
    id:'luobubo', name:'罗布泊', en:'LOOP NUR', province:'新疆 · 若羌', lon:90.9, lat:40.5,
    level:5, days:7, budget:4200, weightCap:38, scene:'desert', accent:'#d1a05a', season:'4月 · 风季',
    stamp:'死亡之海',
    brief:'中国最著名的死亡之海。夏季地表可达 70℃，盐壳下面是松软的流沙。彭加木、余纯顺都留在了这里。导航会失灵，人会看见不存在的水。',
    route:['米兰遗址','太阳墓地','余纯顺墓','湖心','钾盐矿','八一泉'],
    hazards:['heat','water','sandstorm','nav','isolation'],
    must:['bag','tent','filter','gps','satphone','sunscreen'],
    intel:['白天赶路等于自杀，把行程留给夜里和清晨','每人每天至少 5 升水，宁可少带一顿饭','沙暴来时不要找“背风处”，要原地趴低','盐壳边缘会突然塌陷'],
    legend:'余纯顺留下的那瓶水，据说每年都会自己满一点。',
    events:'luobubo'
  },
  {
    id:'motuo', name:'墨脱', en:'MÉTOG', province:'西藏 · 林芝', lon:95.3, lat:29.3,
    level:3, days:6, budget:2800, weightCap:28, scene:'forest', accent:'#7f9d6a', season:'8月 · 雨季',
    stamp:'雨林孤岛',
    brief:'中国最后一个通公路的县。雅鲁藏布江在这里拐了一个巨大的弯，一年下八个月的雨。塌方、蚂蟥、藤桥和湿透的睡袋，比野兽更常要命。',
    route:['派镇','松林口','多雄拉','汗密','背崩','墨脱'],
    hazards:['rain','landslide','leech','river','wet'],
    must:['shell','tent','bag','filter','insect','rope'],
    intel:['所有衣物装进防水袋，湿睡袋会要命','过塌方区一次只走一个人，别停','多雄拉山口下午必起雾，上午必须翻过去','蚂蟥会从裤脚往上爬，扎紧'],
    legend:'门巴老人说，月亮瀑布后面有一尊天然佛像，只有在雨停的第三分钟才看得见。',
    events:'motuo'
  },
  {
    id:'kekexili', name:'可可西里', en:'HOH XIL', province:'青海 · 玉树', lon:92.9, lat:35.6,
    level:4, days:9, budget:4600, weightCap:36, scene:'plateau', accent:'#9aae95', season:'6月 · 产羔',
    stamp:'无人之境',
    brief:'藏羚羊的产房，也是人类的地狱。平均海拔 4600 米，氧气只有平原的一半。这里的风能把帐篷吹成风筝，也能把鼾声吹成遗言。',
    route:['不冻泉','索南达杰站','卓乃湖','太阳湖','豹子峡','五道梁'],
    hazards:['cold','altitude','wildlife','storm','water'],
    must:['down','bag','tent','meds','satphone','gps'],
    intel:['不要靠近带崽的野牦牛，它比熊更不讲理','所有河流都是冰川融水，涉水前先探深度','保护站是唯一的文明坐标，记在纸上','夜里气温会掉到 -15℃ 以下'],
    legend:'巡护员相信，暴风雪停后的第三分钟，会有一头金色牦牛从雪线上走过。',
    events:'kekexili'
  },
  {
    id:'shennongjia', name:'神农架', en:'SHENNONGJIA', province:'湖北 · 神农架', lon:110.4, lat:31.6,
    level:3, days:5, budget:3000, weightCap:26, scene:'forest', accent:'#8a9c72', season:'9月 · 雾季',
    stamp:'华中屋脊',
    brief:'原始森林里没有路标。浓雾一起，十米外就是另一个世界。野人没被找到，但每年都有人被找到——迷路的、坠崖的、失温的。',
    route:['木鱼镇','天生桥','金猴岭','板壁岩','神农顶','大九湖'],
    hazards:['fog','nav','cold','wildlife'],
    must:['shell','tent','bag','gps','headlamp'],
    intel:['雾中不要离开既定山脊线，哪怕只偏十米','板壁岩一带磁场异常，指南针会骗人','林中熊出没，食物吊离营地','下午两点后山顶容易起雷'],
    legend:'林场的老工人说，神农架的夜里，树会换位置。',
    events:'shennongjia'
  },
  {
    id:'changbai', name:'长白山天池', en:'TIANCHI', province:'吉林 · 延边', lon:128.1, lat:42.0,
    level:4, days:5, budget:3000, weightCap:26, scene:'caldera', accent:'#a8bcc4', season:'1月 · 隆冬',
    stamp:'雪域火山',
    brief:'天池在头顶，风在骨缝里。这里的雪是横着下的，温泉是烫的，迷路是致命的。水怪传说流传了百年，没人拍到过清晰的照片。',
    route:['二道白河','长白瀑布','小天池','绿渊潭','天池北坡','聚龙泉'],
    hazards:['cold','storm','ice','nav','snow'],
    must:['down','bag','tent','crampon','goggles','gloves'],
    intel:['天池口的阵风能把人吹离地面','温泉边缘的雪壳是空的，别踩','下午的雪会盖掉所有脚印','零下二十度，手机电量会瞬间减半'],
    legend:'天池的水有两层，下面那层从不结冰。',
    events:'changbai'
  },
  {
    id:'taklamakan', name:'塔克拉玛干', en:'TAKLAMAKAN', province:'新疆 · 和田', lon:83.6, lat:38.8,
    level:4, days:9, budget:4800, weightCap:40, scene:'desert', accent:'#d2a35f', season:'9月 · 风季',
    stamp:'流动沙漠',
    brief:'世界第二大流动沙漠。沙丘一夜能移动十几米，昨天的营地今天就是一座新山。考古队在这里找到过千年干尸，也找到过整支失踪商队的账本。',
    route:['民丰','尼雅遗址','牙通古斯','安迪尔','麻扎塔格','和田河'],
    hazards:['heat','water','sandstorm','nav','isolation'],
    must:['tent','bag','filter','gps','satphone','sunscreen'],
    intel:['沙丘背风面最软，最容易陷人','夜里走，白天挖坑遮阳','水比装备重要，别拿水换纪念品','看到“古城”先确认是不是海市蜃楼'],
    legend:'驼队老人说，沙下有一座城，城里的钟每天响一次。',
    events:'taklamakan'
  },
  {
    id:'dulong', name:'独龙江峡谷', en:'DULONGJIANG', province:'云南 · 怒江', lon:98.4, lat:27.8,
    level:3, days:6, budget:2800, weightCap:28, scene:'gorge', accent:'#7d9b88', season:'7月 · 雨季',
    stamp:'峡谷秘境',
    brief:'峡谷深达三千米，一年有半年在下雨。溜索下面是怒江，藤桥下面是怒江，塌方上面还是怒江。纹面女的传说正在老去。',
    route:['贡山','其期','巴坡','马库','月亮瀑布','钦郎当'],
    hazards:['rain','river','landslide','leech'],
    must:['shell','tent','bag','filter','rope','insect'],
    intel:['过溜索前检查钢索和滑轮，别怕丢人','暴雨后两小时内不要进沟','藤桥一次只上两个人','遇到纹面老人，先问好，再举相机'],
    legend:'独龙族的纹面女说，纹路是给死后认路用的。',
    events:'dulong'
  },
  {
    id:'meili', name:'梅里雪山', en:'MEILI', province:'云南 · 迪庆', lon:98.65, lat:28.5,
    level:5, days:7, budget:3800, weightCap:30, scene:'glacier', accent:'#9fb3bd', season:'10月 · 转山',
    stamp:'神山禁区',
    brief:'卡瓦格博至今无人登顶。1991 年，中日联合登山队十七人一夜之间消失于雪崩。转山路上的经幡，一半是祈福，一半是招魂。',
    route:['飞来寺','雨崩','冰湖','笑农大本营','神瀑','尼农'],
    hazards:['cold','avalanche','altitude','storm','ice'],
    must:['down','bag','tent','crampon','goggles','meds'],
    intel:['雪崩路段不要在上午十点后通过','冰湖蓝得越漂亮，冰层越不稳定','转山人也未必认识路，别盲从','神瀑下的石堆是别人的愿，不要踢'],
    legend:'1991年的那场雪崩之后，卡瓦格博的山脊上多了一面没人挂的经幡。',
    events:'meili'
  },
  {
    id:'heizhugou', name:'黑竹沟', en:'HEIZHUGOU', province:'四川 · 乐山', lon:103.0, lat:29.1,
    level:4, days:4, budget:2400, weightCap:22, scene:'karst', accent:'#8b8f7a', season:'5月 · 雾季',
    stamp:'中国百慕大',
    brief:'中国的“百慕大”。指南针在这里会转圈，浓雾里传出人声。1970 年代有测绘队员失踪，搜救队只找回一台还在曝光的相机。',
    route:['黑竹沟镇','石门关','野人谷','阴阳界','罗索依达'],
    hazards:['fog','nav','wildlife','water'],
    must:['shell','tent','bag','headlamp','map'],
    intel:['指南针失灵时用太阳和溪流方向校正','不要回应雾里的声音，那可能是回音','石门关后的岔路全部长得一样','这里的水不能直接喝'],
    legend:'当地人说，黑竹沟的雾会把声音吃掉，所以里面永远听不见呼救。',
    events:'heizhugou'
  },
  {
    id:'kunlun', name:'昆仑死亡谷', en:'KUNLUN DEATH VALLEY', province:'青海 · 那棱格勒', lon:90.6, lat:36.3,
    level:5, days:10, budget:6000, weightCap:44, scene:'plateau', accent:'#a48e6e', season:'8月 · 雷季',
    stamp:'雷暴禁区', secret:true, unlockEggs:4,
    brief:'那棱格勒峡谷，牧民的夏牧场，也是“死亡谷”。1983 年，一支地质队在谷中发现冻僵的牧民，手里还握着猎枪。这里的雷暴会追着金属走。',
    route:['茫崖','那棱格勒河','石棺阵','雷暴台地','冻土湖','死亡谷心'],
    hazards:['storm','altitude','cold','nav','isolation'],
    must:['down','bag','tent','satphone','gps','meds'],
    intel:['雷暴时扔掉所有金属，蹲在低处','牧民的禁忌不是迷信，是统计学','谷里的磁异常会让所有设备漂移','这里没有救援，只有记录'],
    legend:'那棱格勒的牧民赶牛羊绕行三十公里，说谷里有雷，也有不该有的东西。',
    events:'kunlun'
  }
];

const LOC_MAP = {};
LOCATIONS.forEach(l => { LOC_MAP[l.id] = l; });

// ---------------- 彩蛋 ----------------
const EGGS = [
  { id:'aotai_stone',  loc:'aotai',      name:'石堆里的名字',   desc:'那堆石头不是路标，是有人留下的名字。你回应了风里的呼唤，也算替他们应了一声。', hint:'暴风雪夜里，有人喊你的名字。' },
  { id:'aotai_camp',   loc:'aotai',      name:'无人认领的营地', desc:'一顶塌了的帐篷，睡袋里没有人，只有一张写着“明天就下山”的纸条。日期是四年前。', hint:'偏离主脊线，往背风坡多走两百米。' },
  { id:'qiangtang_bear',loc:'qiangtang', name:'熊的餐桌',       desc:'你找到一处棕熊的进食点：挖开的鼠兔洞、啃过的牦牛骨，还有一只被撕开的登山包。包里的相机还能开机。', hint:'食物气味引来的不只是风。' },
  { id:'qiangtang_exp', loc:'qiangtang', name:'1976 年的科考队', desc:'铁皮箱里是泛黄的测绘图、一叠未寄出的信，和半块压缩饼干。信的最后一行写着：湖比地图上大。', hint:'盐湖边的黑色石头下面。' },
  { id:'qiangtang_yak', loc:'qiangtang', name:'金色野牦牛', desc:'一头通体金黄的野牦牛站在雪线上，看了你很久，然后转身走进云里。牧民说，见到它的人这一年不会迷路。', hint:'雪线之上，别追，也别喊。' },
  { id:'luobubo_shuangyu', loc:'luobubo', name:'双鱼玉佩',     desc:'盐壳下埋着一枚青玉双鱼佩。你把它翻过来，背面刻着两个你不认识的符号。当晚，你梦见了一片有水的湖。', hint:'湖心的影子，跟着它走。' },
  { id:'luobubo_yu',   loc:'luobubo',     name:'余纯顺的墓',     desc:'一座孤零零的墓碑，前面摆着几瓶没喝完的水。你把其中一瓶留下了。风很快把脚印抹平。', hint:'在湖心以北，别只顾着赶路。' },
  { id:'luobubo_signal', loc:'luobubo',   name:'三短三长三短',   desc:'卫星电话里传来敲击声，你回了 SOS。那边给了一个坐标，天亮后只有一顶空帐篷。帐篷里的日记最后一页写着：别回应。', hint:'深夜打开对讲频段。' },
  { id:'motuo_menba',  loc:'motuo',       name:'藤桥那边的老人', desc:'门巴老人递给你一碗酥油茶，指着你身后的山说：那边不能去，今年收人了。', hint:'过了藤桥，别急着赶路。' },
  { id:'shennongjia_hair', loc:'shennongjia', name:'树皮上的毛', desc:'一撮棕红色的粗毛，比熊的粗，也比人的硬。你把它夹进笔记本。后来你查遍资料，没有一种已知动物对得上。', hint:'冷杉树皮，离地一米八。' },
  { id:'shennongjia_station', loc:'shennongjia', name:'废弃护林站', desc:'巡山日志的最后一页写着：今天听见了两次，不是人。搪瓷缸里还有半缸水，像刚有人喝过。', hint:'雾最浓的时候，林子里那间塌了一半的屋子。' },
  { id:'motuo_lotus',  loc:'motuo',       name:'莲花秘境',       desc:'瀑布后面的石壁上有一个天然形成的莲花生大师像。你拍下了它，但照片里多了一个不在场的人影。', hint:'月亮瀑布的后面。' },
  { id:'kekexili_station', loc:'kekexili', name:'索南达杰保护站', desc:'保护站里的登记簿上，记着每一支经过的队伍。你翻到最后一页，看见了自己队伍的名字——但你没登记过。', hint:'保护站的门没锁。' },
  { id:'kekexili_yak', loc:'kekexili',    name:'金色野牦牛',     desc:'一头通体金黄的野牦牛站在雪线上，看了你很久，然后转身走进云里。当地人说，见到它的人这一年不会迷路。', hint:'暴风雪停下之后的第三分钟。' },
  { id:'changbai_monster', loc:'changbai', name:'天池水怪',     desc:'夜里，湖面中央浮起一道长长的黑影，比任何船都长。它没有眼睛，但你知道它在看你。', hint:'凌晨两点，去天池边。' },
  { id:'changbai_kang', loc:'changbai',   name:'抗联密营',       desc:'雪坡下露出半截木屋，墙上钉着一张手绘地图和一枚生锈的弹壳。地图上有一条标注为“密道”的线，通向山外。', hint:'绿渊潭北面的雪坡。' },
  { id:'takla_city',   loc:'taklamakan',  name:'沙下古城',       desc:'风把沙丘削开，露出半堵土墙、一枚铜钱和一只彩绘陶罐。你没敢带走陶罐——它太像有人在里面住着。', hint:'沙暴过后的第一天。' },
  { id:'takla_body',   loc:'taklamakan',  name:'干尸的手记',     desc:'一具风干的尸体蜷在胡杨木下，怀里抱着羊皮卷。上面用回鹘文写着：水在前面，别回头。', hint:'牙通古斯河边。' },
  { id:'dulong_face',  loc:'dulong',      name:'最后的纹面女',   desc:'老人脸上的靛蓝纹路像一张地图。她说：这是给死后认路用的。', hint:'巴坡以上的寨子。' },
  { id:'dulong_station', loc:'dulong',    name:'废弃水文站',     desc:'1970 年代的水文站，桌上的记录停在 7 月 12 日。那天之后，整条江改过一次道。', hint:'月亮瀑布下游的凸岸。' },
  { id:'meili_1991',   loc:'meili',       name:'1991 年的遗物',  desc:'冰裂缝里卡着一只相机、一本湿透的日记和一面褪色的旗。日记最后一页只有一句：雪一直在响。', hint:'笑农大本营上方的冰川。' },
  { id:'meili_prayer', loc:'meili',       name:'招魂的经幡',     desc:'神瀑边的经幡上写满了名字，最新的一条是你自己的。', hint:'神瀑下面，别只看水。' },
  { id:'heizhugou_camera', loc:'heizhugou', name:'还在曝光的相机', desc:'1977 年的海鸥相机，胶卷还剩三张。你按下快门，取景器里出现了一个不该出现在这里的人。', hint:'阴阳界附近的石缝。' },
  { id:'heizhugou_door', loc:'heizhugou', name:'磁场里的石门',   desc:'两块巨石之间夹着一道石门，指针在门前疯狂旋转。你没有进去。后来你一直在想，如果进去了会怎样。', hint:'雾最浓的时候，往人声的反方向走。' },
  { id:'kunlun_storm', loc:'kunlun',      name:'雷暴中的牧人',   desc:'闪电照亮河谷的一瞬间，你看见一个牧民站在对岸，手里举着猎枪。第二道闪电亮起时，那里只剩一块石头。', hint:'雷暴台地的第一夜。' },
  { id:'kunlun_gear',  loc:'kunlun',      name:'上一支队伍',     desc:'六顶帐篷，六个睡袋，六本日记，没有一个人。日记都停在同一天。', hint:'死亡谷心的冻土湖。' }
];

const EGG_MAP = {};
EGGS.forEach(e => { EGG_MAP[e.id] = e; });

// ---------------- 成就 ----------------
const ACHIEVEMENTS = [
  { id:'first_blood', name:'活着回来', desc:'完成任意一条路线并生还。', icon:'01' },
  { id:'three_routes', name:'三条线的脚印', desc:'累计生还三条不同路线。', icon:'03' },
  { id:'all_routes', name:'走遍无人区', desc:'生还全部 12 条路线。', icon:'12' },
  { id:'s_rank', name:'S 级档案', desc:'任意一次远征获得 S 级评价。', icon:'S' },
  { id:'egg_hunter', name:'拾遗者', desc:'发现 8 个以上彩蛋。', icon:'08' },
  { id:'egg_master', name:'无人区考古学家', desc:'发现 16 个以上彩蛋。', icon:'16' },
  { id:'close_call', name:'一线生机', desc:'生命值低于 10 时成功生还。', icon:'01' },
  { id:'hard_route', name:'硬骨头', desc:'完成任意一条五星路线。', icon:'05' },
  { id:'no_satphone', name:'断联者', desc:'在没有卫星通讯的情况下生还。', icon:'X' },
  { id:'winter_survivor', name:'与雪同眠', desc:'在长白山或梅里雪山的暴雪天气中生还。', icon:'❄' },
  { id:'secret_found', name:'谷底的秘密', desc:'解锁并进入昆仑死亡谷。', icon:'谷' },
  { id:'speedrun', name:'不眠之夜', desc:'用少于路线节点的天数完成一条路线。', icon:'!' }
];

// 排名阈值（占满分比例）
const RANK_TIERS = [
  { rank:'S', min:0.86 },
  { rank:'A', min:0.68 },
  { rank:'B', min:0.5 },
  { rank:'C', min:0.3 },
  { rank:'D', min:0 }
];
