/* =========================================================
   荒野禁区 · 事件库（下）
   神农架 / 长白山 / 塔克拉玛干 / 独龙江 / 梅里 / 黑竹沟 / 昆仑
   ========================================================= */

Object.assign(window.EVENTS, {

  /* ---------------- 神农架 ---------------- */
  shennongjia: [
    {
      id:'sn_fog', title:'雾墙', tag:'fog', stage:[1,4], once:true,
      text:'浓雾像一堵墙从谷底推上来。十米外的树只剩下轮廓，你的指南针在手里慢慢转圈。',
      options:[
        { label:'停下来，用地图和 GPS 定线', hint:'需要导航装备', req:['map','gps'],
          outcomes:[{ w:10, text:'你在一块平坦的石头上摊开地图，等到雾稍微薄一点，确认了山脊走向。', eff:{ stamina:-6, progress:1 } }] },
        { label:'沿着溪流下游走', hint:'水往低处流，低处有人家', req:null,
          outcomes:[
            { w:6, text:'你顺着水声走了两个小时，雾散时看见了一条护林道。', eff:{ stamina:-16, progress:1 } },
            { w:4, text:'溪流把你带到一处断崖。你只能原路爬回去，浪费了半天。', eff:{ stamina:-24, warmth:-8, morale:-8 } }
          ] },
        { label:'原地等雾散', hint:'消耗半天和体温', req:null,
          outcomes:[{ w:10, text:'你靠在树下，听着雾里的水滴声。三小时后，雾散开一道缝。', eff:{ stamina:4, warmth:-10, food:-1 } }] }
      ]
    },
    {
      id:'sn_hair', title:'树皮上的毛', tag:'wild', stage:[2,4], once:true,
      text:'一棵冷杉的树皮被蹭掉一大块，离地一米八的位置挂着一撮棕红色的粗毛。附近没有熊的脚印。',
      options:[
        { label:'取样，收进密封袋', hint:'带回去也许能说明什么', req:null,
          outcomes:[{ w:10, text:'毛发比熊的粗，也比人的硬。你把它夹进笔记本，忽然觉得林子里有谁在看你。', eff:{ morale:4, egg:'shennongjia_hair' } }] },
        { label:'拍张照，赶紧离开', hint:'有些问题不该有答案', req:null,
          outcomes:[{ w:10, text:'照片里，树皮上的抓痕比你先看到的高了半米。你走得很快。', eff:{ morale:-4, stamina:-4, egg:'shennongjia_hair' } }] }
      ]
    },
    {
      id:'sn_bear', title:'黑熊', tag:'wildlife', stage:[2,4], once:true,
      text:'灌木丛里传来一声低吼。一头黑熊站起来，比你高出一个头。它闻到了你背包里的食物。',
      options:[
        { label:'喷雾，后退', hint:'需要防熊喷雾', req:'bearspray',
          outcomes:[
            { w:8, text:'喷雾在它面前形成一团白雾。它甩了甩头，转身走了。', eff:{ morale:-10, stamina:-6 } },
            { w:2, text:'它冲得太快，你被拍倒在地。喷雾救了你，但肩膀被抓伤。', eff:{ hp:-16, injury:'肩部抓伤' } }
          ] },
        { label:'慢慢后退，不跑', hint:'别让它觉得你是猎物', req:null,
          outcomes:[
            { w:6, text:'你退到一棵大树后面，它跟了几步，最后去翻你的营地。', eff:{ food:-2, morale:-8 } },
            { w:4, text:'你踩断了一根树枝。它冲过来，你滚下山坡才甩掉它。', eff:{ hp:-18, stamina:-20, injury:'擦伤' } }
          ] }
      ]
    },
    {
      id:'sn_station', title:'废弃护林站', tag:'scout', stage:[2,4], once:true,
      text:'林子里有一间塌了一半的护林站，门牌上的年份已经看不清。桌上还摆着一个搪瓷缸。',
      options:[
        { label:'进去避雨，翻看抽屉', hint:'也许有旧地图', req:null,
          outcomes:[{ w:10, text:'抽屉里有一本巡山日志，最后一页写着：今天听见了两次，不是人。你带走了一截蜡烛。', eff:{ warmth:6, morale:-4, egg:'shennongjia_station' } }] },
        { label:'在门口坐一会儿', hint:'不碰屋里的东西', req:null,
          outcomes:[{ w:10, text:'你在屋檐下躲了半小时雨。走的时候，搪瓷缸里多了一点水。', eff:{ water:1, warmth:2 } }] }
      ]
    },
    {
      id:'sn_river', title:'暗河', tag:'water', stage:[2,4], once:true,
      text:'一片乱石滩下面传来流水声，但看不见水面。石头缝里渗出的水很清，也很冷。',
      options:[
        { label:'用净水器取水', hint:'需要净水器', req:'filter',
          outcomes:[{ w:10, text:'你接了半小时，灌满两个水袋。水里有股石头的味道。', eff:{ water:4, stamina:-8 } }] },
        { label:'直接喝', hint:'山里的水看起来干净', req:null,
          outcomes:[
            { w:6, text:'水很甜。你喝了个饱，又灌了一瓶。', eff:{ water:3 } },
            { w:4, text:'半夜你开始肚子疼，跑了三趟。', eff:{ hp:-8, stamina:-10, injury:'肠胃感染' } }
          ] }
      ]
    }
  ],

  /* ---------------- 长白山 ---------------- */
  changbai: [
    {
      id:'cb_wind', title:'天池口的风', tag:'storm', stage:[1,4], once:true,
      text:'通往天池的最后一道梁子上，风从火山口里往外灌。你几乎站不住，雪粒横着打进眼睛。',
      options:[
        { label:'戴上雪镜，压低身体通过', hint:'需要雪镜', req:'goggles',
          outcomes:[
            { w:8, text:'视野恢复成一条窄缝。你侧着身，一步一步挪过了风口。', eff:{ stamina:-16, warmth:-12, progress:1 } },
            { w:2, text:'一阵横风把你掀倒，你滑出几米，撞在冰面上。', eff:{ hp:-12, stamina:-20, warmth:-18 } }
          ] },
        { label:'等风小一点', hint:'风口的风不会小', req:null,
          outcomes:[{ w:10, text:'你躲在岩石后面等了两个小时，体温掉得比风快。最后只能撤回。', eff:{ warmth:-20, stamina:-8, progress:-1 } }] },
        { label:'四肢着地爬过去', hint:'难看，但稳', req:null,
          outcomes:[{ w:10, text:'你像动物一样爬过风口，手套冻在冰面上。站起来时，天池就在脚下。', eff:{ stamina:-20, warmth:-14, progress:1, morale:-6 } }] }
      ]
    },
    {
      id:'cb_spring', title:'聚龙泉', tag:'scout', stage:[2,4], once:true,
      text:'雪地里冒着热气，温泉把周围的石头染成硫黄色。水很烫，空气里有鸡蛋的味道。',
      options:[
        { label:'泡脚，恢复体温', hint:'别泡太久', req:null,
          outcomes:[{ w:10, text:'你把冻僵的脚放进水里，疼得倒吸冷气。十分钟后，脚趾重新有了知觉。', eff:{ warmth:18, stamina:10, hp:4 } }] },
        { label:'煮一锅热食', hint:'需要炉头锅具', req:'stove',
          outcomes:[{ w:10, text:'你用温泉水煮了冻干餐。热气把帐篷里的冰都化了。', eff:{ warmth:10, food:1, stamina:8 } }] }
      ]
    },
    {
      id:'cb_monster', title:'湖心的黑影', tag:'night', stage:[3,4], once:true,
      text:'凌晨两点，天池中央浮起一道长长的黑影，比任何船都长。它没有眼睛，但你知道它在看你。',
      options:[
        { label:'举起相机', hint:'手别抖', req:null,
          outcomes:[{ w:10, text:'快门声在冰面上很响。照片洗出来后，只有一片模糊的白色。但你记得它看了你很久。', eff:{ morale:-6, egg:'changbai_monster' } }] },
        { label:'退回帐篷，不再看', hint:'有些东西不看也罢', req:null,
          outcomes:[{ w:10, text:'你拉上帐篷拉链，听见湖面传来一声很低的响，像叹气。', eff:{ morale:-10, egg:'changbai_monster' } }] }
      ]
    },
    {
      id:'cb_kang', title:'雪坡下的木屋', tag:'scout', stage:[2,4], once:true,
      text:'雪坡下露出半截木屋，门被雪埋了一半。墙上钉着一张手绘地图和一枚生锈的弹壳。',
      options:[
        { label:'进去看看', hint:'抗联密营的传说', req:null,
          outcomes:[{ w:10, text:'屋里有一口铁锅、几双草鞋。地图上标着一条“密道”，通向山外。你记下了方向。', eff:{ morale:10, stamina:-4, egg:'changbai_kang' } }] },
        { label:'在门口敬个礼', hint:'不拿走任何东西', req:null,
          outcomes:[{ w:10, text:'你站了一会儿，把门重新掩上。雪落在门框上，像一层新的封条。', eff:{ morale:8, egg:'changbai_kang' } }] }
      ]
    },
    {
      id:'cb_slide', title:'雪坡滑坠', tag:'ice', stage:[2,4], once:true,
      text:'你踩上一片看起来结实的雪面，整块雪板突然断裂。你开始下滑，速度越来越快。',
      options:[
        { label:'用冰镐/登山杖制动', hint:'需要登山杖', req:'pole',
          outcomes:[
            { w:8, text:'你把杖尖插进雪里，身体猛地一顿，停在坡中间。', eff:{ stamina:-14, hp:-4 } },
            { w:2, text:'杖断了。你滑到坡底，撞进一堆积雪里。', eff:{ hp:-14, stamina:-18, warmth:-10 } }
          ] },
        { label:'翻身用背包摩擦', hint:'背包是最好的刹车', req:null,
          outcomes:[{ w:10, text:'你翻过身，用背包和身体压住雪面。停下来时，离悬崖只剩几米。', eff:{ hp:-6, stamina:-16, morale:-12 } }] }
      ]
    }
  ],

  /* ---------------- 塔克拉玛干 ---------------- */
  taklamakan: [
    {
      id:'tk_storm', title:'移动的墙', tag:'sandstorm', stage:[2,6], once:true,
      text:'沙暴从西边压过来，沙丘的脊线在风里像开水一样翻滚。你来不及搭帐篷。',
      options:[
        { label:'挖沙坑，把睡袋埋进去', hint:'需要睡袋', req:'bag',
          outcomes:[{ w:10, text:'你把自己埋进沙里，只留一条呼吸的缝。沙暴过去时，你被埋了一米深。', eff:{ stamina:-16, water:-2, warmth:-4 } }] },
        { label:'用帐篷裹住身体', hint:'需要帐篷', req:'tent',
          outcomes:[{ w:10, text:'帐篷布挡住了大部分沙粒。你在风里蹲了三个小时，像一尊沙雕。', eff:{ stamina:-12, water:-2, warmth:-6 } }] },
        { label:'继续走，赌方向', hint:'最危险的选择', req:null,
          outcomes:[
            { w:4, text:'你靠 GPS 摸黑走了两公里，居然没有偏。', eff:{ stamina:-20, water:-3, progress:1 } },
            { w:6, text:'你在沙暴里彻底失去方向，走了很久才发现回到了原地。', eff:{ hp:-10, stamina:-26, water:-4, morale:-12 } }
          ] }
      ]
    },
    {
      id:'tk_quicksand', title:'流沙', tag:'heat', stage:[2,6], once:true,
      text:'脚下的沙突然变得像水。你的小腿陷了进去，越挣扎，陷得越深。',
      options:[
        { label:'把背包甩到身前，慢慢爬', hint:'扩大受力面积', req:null,
          outcomes:[{ w:8, text:'你把背包横在沙面上，一点一点把腿拔出来。鞋留在了沙里。', eff:{ stamina:-18, water:-2 } }] },
        { label:'用登山杖探底', hint:'需要登山杖', req:'pole',
          outcomes:[{ w:10, text:'杖尖触到了硬底。你借力翻了出去，躺在沙上大口喘气。', eff:{ stamina:-12 } }] },
        { label:'拼命挣扎', hint:'错误示范', req:null,
          outcomes:[{ w:10, text:'你越动陷得越快，最后几乎是用手刨出来的。', eff:{ hp:-10, stamina:-24, morale:-8 } }] }
      ]
    },
    {
      id:'tk_city', title:'沙下的墙', tag:'scout', stage:[3,6], once:true,
      text:'一场大风削开了沙丘，露出半堵土墙、一枚铜钱和一只彩绘陶罐。陶罐上的图案还没有褪色。',
      options:[
        { label:'只拍照，不动文物', hint:'让它们留在原地', req:null,
          outcomes:[{ w:10, text:'你在墙上坐了很久。风又开始动沙，陶罐慢慢被埋回去，像有人替它盖被子。', eff:{ morale:8, egg:'takla_city' } }] },
        { label:'带走铜钱', hint:'一件小东西', req:null,
          outcomes:[{ w:10, text:'铜钱在掌心很轻。你把它放进口袋，当晚梦见一支驼队从帐篷外走过。', eff:{ morale:4, egg:'takla_city' } }] }
      ]
    },
    {
      id:'tk_body', title:'胡杨下的干尸', tag:'scout', stage:[3,6], once:true,
      text:'一具风干的尸体蜷在胡杨木下，皮肤像旧皮革。他怀里抱着一个羊皮卷。',
      options:[
        { label:'取出羊皮卷', hint:'也许写着水在哪里', req:null,
          outcomes:[{ w:10, text:'上面是回鹘文，你看不懂，但地图的符号认得出：水在前面，别回头。', eff:{ morale:-8, egg:'takla_body', flag:'ancient_map' } }] },
        { label:'就地掩埋，不碰遗物', hint:'让他安息', req:null,
          outcomes:[{ w:10, text:'你用沙子把他盖好，压上几块胡杨木。做完这些，你忽然不那么渴了。', eff:{ stamina:-10, morale:6, egg:'takla_body' } }] }
      ]
    },
    {
      id:'tk_water', title:'最后两升', tag:'water', stage:[3,6], once:true,
      text:'水袋里只剩两升，按地图还有一天半才能到和田河。太阳还没有落。',
      options:[
        { label:'白天挖坑取湿沙', hint:'沙下三米也许有水', req:null,
          outcomes:[
            { w:5, text:'挖到一米深，沙是湿的。你把布条塞进去，拧出了半杯浑水。', eff:{ water:1, stamina:-20 } },
            { w:5, text:'挖了两米，什么也没有。你浪费了最热的两小时。', eff:{ water:-2, stamina:-24, hp:-6 } }
          ] },
        { label:'夜里赶路，省水', hint:'夜间蒸发最少', req:null,
          outcomes:[{ w:10, text:'你等到日落才动身，靠星星和 GPS 走了六个小时。水只喝了一口。', eff:{ stamina:-22, water:-1, progress:1 } }] }
      ]
    }
  ],

  /* ---------------- 独龙江 ---------------- */
  dulong: [
    {
      id:'dl_zipline', title:'溜索', tag:'river', stage:[2,5], once:true,
      text:'两岸之间只有一根钢索，滑轮锈得厉害。下面是浑黄的怒江，水声像有人在吼。',
      options:[
        { label:'检查滑轮，再挂上去', hint:'慢一点，命长一点', req:null,
          outcomes:[
            { w:8, text:'滑轮有点卡，但还能转。你闭着眼滑到对岸，手心全是汗。', eff:{ stamina:-10, morale:-6, progress:1 } },
            { w:2, text:'滑到中间，滑轮发出一声怪响。你悬在江面上，靠手臂一点点挪过去。', eff:{ hp:-8, stamina:-22, morale:-12, progress:1 } }
          ] },
        { label:'绕山走旧马帮路', hint:'多走一天', req:null,
          outcomes:[{ w:10, text:'你沿马帮路绕了半天，路上看见三处新的塌方。', eff:{ stamina:-24, warmth:-4 } }] }
      ]
    },
    {
      id:'dl_slide', title:'雨后塌方', tag:'landslide', stage:[2,5], once:true,
      text:'暴雨刚停，前方的坡面还在掉石头。泥水从裂缝里往外冒，整面山像一块正在融化的蛋糕。',
      options:[
        { label:'等两小时再走', hint:'雨后两小时内最危险', req:null,
          outcomes:[{ w:10, text:'你在远处等了两个小时，塌方又发生了一次。你庆幸自己没有先走。', eff:{ stamina:4, food:-1, warmth:-4 } }] },
        { label:'快速冲过去', hint:'赌这一次不塌', req:null,
          outcomes:[
            { w:5, text:'你踩着泥冲过去，身后的石头落进了江里。', eff:{ stamina:-16, warmth:-6, progress:1 } },
            { w:5, text:'你滑倒在泥里，一块石头擦着小腿飞过去。', eff:{ hp:-14, stamina:-18, injury:'小腿挫伤' } }
          ] }
      ]
    },
    {
      id:'dl_face', title:'纹面', tag:'scout', stage:[3,5], once:true,
      text:'寨子口的老人坐在竹凳上，脸上的靛蓝纹路像一张地图。她看见你，先笑了。',
      options:[
        { label:'征得同意后拍一张', hint:'先问好，再举相机', req:null,
          outcomes:[{ w:10, text:'她摆正了头巾，让你拍。照片里的纹路，像一条条通往山里的路。', eff:{ morale:12, egg:'dulong_face' } }] },
        { label:'坐下陪她说话', hint:'不拍照，只听', req:null,
          outcomes:[{ w:10, text:'她说这些纹是给死后认路用的。你听不懂后半句，但她一直握着你的手。', eff:{ morale:14, egg:'dulong_face' } }] }
      ]
    },
    {
      id:'dl_station', title:'水文站', tag:'scout', stage:[3,5], once:true,
      text:'江边有一间水泥房，门上的牌子写着水文站。桌上的记录本停在 7 月 12 日。',
      options:[
        { label:'翻看记录', hint:'那一天发生了什么', req:null,
          outcomes:[{ w:10, text:'最后一页写着：江水改道，断面损失，撤离。之后全是空白。窗外，江水确实换了一个方向。', eff:{ morale:-6, egg:'dulong_station' } }] },
        { label:'在墙上留下日期', hint:'至少证明你来过', req:null,
          outcomes:[{ w:10, text:'你用炭笔写下今天的日期。写完才发现，墙上已经有一行一模一样的字。', eff:{ morale:-10, egg:'dulong_station' } }] }
      ]
    },
    {
      id:'dl_rain', title:'雨夜', tag:'rain', stage:[2,5], once:true,
      text:'雨下了一整夜，帐篷里开始积水。睡袋的下半截泡在水里，你听见上游传来闷响。',
      options:[
        { label:'搬到高处，挖排水沟', hint:'辛苦，但安全', req:'tent',
          outcomes:[{ w:10, text:'你摸黑把帐篷搬到坡上，挖了一条沟。后半夜，原来的营地被水淹了。', eff:{ stamina:-18, warmth:-6 } }] },
        { label:'裹着睡袋坐到天亮', hint:'省力，但会失温', req:null,
          outcomes:[{ w:10, text:'你坐在水里，牙齿打颤到天亮。雨停时，你花了很久才站起来。', eff:{ warmth:-20, hp:-6, stamina:-10 } }] }
      ]
    }
  ],

  /* ---------------- 梅里雪山 ---------------- */
  meili: [
    {
      id:'ml_avalanche', title:'雪崩', tag:'avalanche', stage:[2,5], once:true,
      text:'头顶传来一声闷雷，不是雷。整面雪坡开始向下移动，白色的墙越来越高。',
      options:[
        { label:'向侧面横切，抓住岩石', hint:'别顺着雪崩跑', req:null,
          outcomes:[
            { w:6, text:'你横向冲出去，抱住一块突出的岩石。雪崩从身边擦过，埋到你的腰。', eff:{ stamina:-22, warmth:-16, morale:-10 } },
            { w:4, text:'你被气浪掀倒，埋进雪里。你凭记忆挖出一个呼吸腔，等雪停。', eff:{ hp:-16, stamina:-26, warmth:-24 } }
          ] },
        { label:'扔掉背包，往高处跑', hint:'减轻负重', req:null,
          outcomes:[{ w:10, text:'你把背包扔了，轻装冲上侧坡。背包被雪崩带走，里面的口粮也没了。', eff:{ stamina:-24, food:-3, water:-2, morale:-12 } }] }
      ]
    },
    {
      id:'ml_lake', title:'冰湖', tag:'ice', stage:[2,5], once:true,
      text:'冰湖蓝得不像真的。湖面结着一层薄冰，对岸的冰川在阳光下发出细碎的响声。',
      options:[
        { label:'沿湖岸绕行', hint:'不踩冰面', req:null,
          outcomes:[{ w:10, text:'你沿着碎石坡绕了半圈，看见冰面上有一道新鲜的裂缝。', eff:{ stamina:-16 } }] },
        { label:'从冰面穿过去', hint:'快，但冰层不稳', req:null,
          outcomes:[
            { w:5, text:'冰面吱吱作响，但撑住了。你到了对岸，腿还在抖。', eff:{ stamina:-8, morale:-6, progress:1 } },
            { w:5, text:'冰面塌了。你掉进齐腰的冰水，拼命扒住边缘爬上来。', eff:{ hp:-14, warmth:-34, stamina:-20 } }
          ] }
      ]
    },
    {
      id:'ml_1991', title:'冰裂缝里的旗', tag:'scout', stage:[3,5], once:true,
      text:'冰裂缝里卡着一只相机、一本湿透的日记和一面褪色的旗。旗上的字你认得：中日联合登山队。',
      options:[
        { label:'把日记取出来', hint:'让名字被看见', req:null,
          outcomes:[{ w:10, text:'最后一页只有一句：雪一直在响。你把日记收进背包，准备带下山。', eff:{ morale:6, stamina:-6, egg:'meili_1991' } }] },
        { label:'在裂缝边站一会儿', hint:'不带走任何东西', req:null,
          outcomes:[{ w:10, text:'你把旗重新压好，双手合十。风从冰川上下来，经幡响成一片。', eff:{ morale:10, egg:'meili_1991' } }] }
      ]
    },
    {
      id:'ml_prayer', title:'经幡上的名字', tag:'scout', stage:[3,5], once:true,
      text:'神瀑边的经幡被风吹得笔直。你凑近看，上面写满了名字，最新的一条，是你的。',
      options:[
        { label:'把自己的名字划掉', hint:'有些名字不该在这里', req:null,
          outcomes:[{ w:10, text:'你用刀尖划掉名字。风停了一瞬，然后更猛地吹起来。', eff:{ morale:-10, egg:'meili_prayer' } }] },
        { label:'添上一句平安', hint:'也许只是巧合', req:null,
          outcomes:[{ w:10, text:'你在名字旁边写了“平安”。写完，经幡安静下来。', eff:{ morale:8, egg:'meili_prayer' } }] }
      ]
    },
    {
      id:'ml_pilgrim', title:'转山人', tag:'wild', stage:[2,5], once:true,
      text:'一个转山的老人拄着木棍走过来，背着一袋糌粑。他说今天不适合上山，雪在响。',
      options:[
        { label:'听他的，改走低线', hint:'多走半天', req:null,
          outcomes:[{ w:10, text:'你跟着他绕了低线。下午，原计划的山脊发生了小雪崩。', eff:{ stamina:-14, progress:1, morale:8 } }] },
        { label:'谢过他，继续按计划走', hint:'你有自己的节奏', req:null,
          outcomes:[
            { w:6, text:'你走了一段，雪坡确实很安静。', eff:{ stamina:-10 } },
            { w:4, text:'下午风变大，你在雪脊上被吹得站不稳，只能退回。', eff:{ stamina:-20, warmth:-16, progress:-1 } }
          ] }
      ]
    }
  ],

  /* ---------------- 黑竹沟 ---------------- */
  heizhugou: [
    {
      id:'hz_compass', title:'转圈的指针', tag:'nav', stage:[1,3], once:true,
      text:'指南针的指针在玻璃下面慢慢转圈，GPS 的坐标也在跳。你走过的路，在地图上找不到。',
      options:[
        { label:'用太阳和溪流定方向', hint:'老办法最可靠', req:null,
          outcomes:[{ w:10, text:'你看了一眼太阳，又听了一会儿水声，确认了东南方向。指针仍在转，但你已经不怕它了。', eff:{ stamina:-8, progress:1, morale:4 } }] },
        { label:'等设备恢复', hint:'也许只是暂时干扰', req:null,
          outcomes:[{ w:10, text:'你等了两个小时，设备没有恢复。你浪费了白天最好的时间。', eff:{ stamina:2, warmth:-6, food:-1 } }] }
      ]
    },
    {
      id:'hz_voices', title:'雾里的声音', tag:'fog', stage:[2,3], once:true,
      text:'浓雾里有人在说话，听不清内容，但节奏像在喊你的名字。声音从左边来，又像从右边来。',
      options:[
        { label:'朝声音反方向走', hint:'雾里的一切都可能是假的', req:null,
          outcomes:[{ w:10, text:'你背对声音走了很久，雾散开时，看见一道石门卡在两块巨石之间。指针在门前疯转。', eff:{ stamina:-14, morale:-8, egg:'heizhugou_door' } }] },
        { label:'回应，并朝声音走', hint:'也许有人需要帮助', req:null,
          outcomes:[
            { w:5, text:'你走过去，声音却越来越远。最后你站在一处断崖边，脚下全是雾。', eff:{ stamina:-18, warmth:-8, morale:-10 } },
            { w:5, text:'你找到了一个迷路的采药人。他比你更害怕，你们一起走出了雾。', eff:{ stamina:-16, morale:14 } }
          ] }
      ]
    },
    {
      id:'hz_camera', title:'石缝里的相机', tag:'scout', stage:[2,3], once:true,
      text:'石缝里卡着一台海鸥相机，皮套已经烂了。取景器里还有一点光，胶卷还剩三张。',
      options:[
        { label:'按下快门', hint:'看看会拍到什么', req:null,
          outcomes:[{ w:10, text:'闪光灯亮起的一瞬间，取景器里出现了一个站在你身后的人。你猛地回头，只有雾。', eff:{ morale:-12, egg:'heizhugou_camera' } }] },
        { label:'取出胶卷，不再按', hint:'带回去冲洗', req:null,
          outcomes:[{ w:10, text:'你把胶卷放进防水袋。走出很远，相机在你背包里响了一声快门。', eff:{ morale:-6, egg:'heizhugou_camera' } }] }
      ]
    },
    {
      id:'hz_bear', title:'竹林里的熊', tag:'wildlife', stage:[2,3], once:true,
      text:'竹林深处有折断的竹子和新鲜的爪印。一头黑熊正在翻你放在营地边的食物袋。',
      options:[
        { label:'制造噪音，把它赶走', hint:'它已经拿到食物了', req:null,
          outcomes:[
            { w:6, text:'你敲着登山杖大喊。它叼走一袋口粮，钻进竹林。', eff:{ food:-1, morale:-6 } },
            { w:4, text:'它没有走，反而朝你走了两步。你退到树上，等了一个小时。', eff:{ food:-2, stamina:-12, morale:-12 } }
          ] },
        { label:'放弃食物，慢慢后退', hint:'命比口粮贵', req:null,
          outcomes:[{ w:10, text:'你退到安全距离，看着它把营地翻了个遍。它走后，你捡回了半袋饼干。', eff:{ food:-2, morale:-8 } }] }
      ]
    }
  ],

  /* ---------------- 昆仑死亡谷 ---------------- */
  kunlun: [
    {
      id:'kl_storm', title:'雷暴', tag:'storm', stage:[2,7], once:true,
      text:'午后，峡谷上空积起黑色的云。闪电在谷底炸开，雷声贴着地面滚。你身上的金属都在发烫。',
      options:[
        { label:'扔掉金属，蹲在低处', hint:'保命的第一原则', req:null,
          outcomes:[{ w:8, text:'你把登山杖、锅具扔到远处，蹲在碎石堆里。闪电劈在对面的山坡上，石头炸开了。', eff:{ stamina:-16, warmth:-10, morale:-14 } }] },
        { label:'躲进岩洞', hint:'洞可能是空的，也可能不是', req:null,
          outcomes:[
            { w:6, text:'岩洞很浅，但挡住了雨。你在里面蹲了两个小时，闪电照亮了洞壁上的旧刻痕。', eff:{ warmth:-4, stamina:2 } },
            { w:4, text:'洞里有一具动物的骸骨，已经干了。你退了出来，宁可在雨里站着。', eff:{ morale:-12, warmth:-12 } }
          ] }
      ]
    },
    {
      id:'kl_herder', title:'对岸的牧人', tag:'night', stage:[3,8], once:true,
      text:'闪电照亮河谷的一瞬间，你看见对岸站着一个牧民，手里举着猎枪。第二道闪电亮起时，那里只剩一块石头。',
      options:[
        { label:'过河去看看', hint:'也许只是石头', req:null,
          outcomes:[{ w:10, text:'你蹚过河，石头旁边有一枚生锈的弹壳和一双胶鞋。鞋里还塞着一撮羊毛。', eff:{ stamina:-12, warmth:-10, egg:'kunlun_storm' } }] },
        { label:'退回营地，不再看', hint:'牧民说过，这里不欢迎人', req:null,
          outcomes:[{ w:10, text:'你退回帐篷，整夜没关手电。天亮后，对岸的石头不见了。', eff:{ morale:-10, egg:'kunlun_storm' } }] }
      ]
    },
    {
      id:'kl_team', title:'六顶帐篷', tag:'scout', stage:[4,9], once:true,
      text:'冻土湖边有六顶帐篷，围成一个圈。六个睡袋都铺开着，六本日记摊在睡袋上，没有一个人。',
      options:[
        { label:'翻看日记', hint:'他们最后写了什么', req:null,
          outcomes:[{ w:10, text:'六本日记都停在同一天。最后一页写着：雷声在追我们。你合上本子，听见远处有雷。', eff:{ morale:-16, egg:'kunlun_gear' } }] },
        { label:'在营地外扎营，天亮就走', hint:'别碰他们的东西', req:null,
          outcomes:[{ w:10, text:'你在二十米外扎营。半夜，你听见有人在帐篷外走动，数到第六个人时，声音停了。', eff:{ morale:-12, warmth:-10, egg:'kunlun_gear' } }] }
      ]
    }
  ]
});

/* ---------------- 通用事件 ---------------- */
window.COMMON_EVENTS = [
  {
    id:'cm_lost', title:'走错了一道梁', tag:'nav', stage:[1,99], once:true, common:true,
    text:'你以为翻过这道梁就是下坡，结果对面又是一道梁。地图上的等高线在眼前叠成一团。',
    options:[
      { label:'退回垭口重新定位', hint:'需要导航装备', req:['gps','map'],
        outcomes:[{ w:10, text:'你退回垭口，花了四十分钟重新确认方向。之前的两个小时白走了。', eff:{ stamina:-14, progress:-1 } }] },
      { label:'凭直觉继续走', hint:'赌方向感', req:null,
        outcomes:[
          { w:5, text:'直觉这次是对的。你省下了一个小时。', eff:{ stamina:-8, progress:1 } },
          { w:5, text:'你走进一条死谷，只能原路返回。', eff:{ stamina:-22, warmth:-8, progress:-1, morale:-8 } }
        ] }
    ]
  },
  {
    id:'cm_cold', title:'开始发抖', tag:'cold', stage:[1,99], once:true, common:true,
    text:'你发现自己停不下来地发抖，手指变得笨拙，拉链拉了三次才拉开。这是失温的早期信号。',
    options:[
      { label:'加衣服，吃高热量的东西', hint:'需要羽绒或抓绒', req:['down','fleece'],
        outcomes:[{ w:10, text:'你套上羽绒，吃了一块压缩饼干。十分钟后，抖慢慢停了。', eff:{ warmth:14, food:-1, stamina:4 } }] },
      { label:'继续走，靠运动产热', hint:'运动也会消耗体力', req:null,
        outcomes:[
          { w:6, text:'你加快脚步，身体重新热起来。', eff:{ warmth:6, stamina:-12 } },
          { w:4, text:'你走了很久，体温却还在掉。你不得不停下来扎营。', eff:{ warmth:-12, stamina:-16, hp:-6 } }
        ] },
      { label:'钻进保温毯', hint:'需要保温毯', req:'bivy',
        outcomes:[{ w:10, text:'锡箔毯把风挡在外面，你缩了十分钟，终于不再发抖。', eff:{ warmth:8 } }] }
    ]
  },
  {
    id:'cm_thirst', title:'水袋见底', tag:'water', stage:[1,99], once:true, common:true,
    text:'水袋捏不出水了。喉咙干得像塞了一把沙子，你开始不自觉地舔嘴唇。',
    options:[
      { label:'找水源并过滤', hint:'需要净水器', req:'filter',
        outcomes:[{ w:10, text:'你在附近找到一处积水，过滤后灌满水袋。水有股土味，但能喝。', eff:{ water:4, stamina:-10 } }] },
      { label:'减少活动，等凉快', hint:'白天不动，夜里走', req:null,
        outcomes:[{ w:10, text:'你找了一块阴凉处躺下，等到太阳落山。半天没有推进，但省下了水。', eff:{ stamina:4, water:-1, progress:0, food:-1 } }] }
    ]
  },
  {
    id:'cm_injury', title:'扭了一下', tag:'fatigue', stage:[1,99], once:true, common:true,
    text:'你在一块湿石头上踩滑，脚踝向外翻了一下。疼，但还能站。',
    options:[
      { label:'包扎，放慢速度', hint:'需要急救包', req:'kit',
        outcomes:[{ w:10, text:'你用了绷带和肌贴，把脚踝固定住。走路慢了一半，但没再恶化。', eff:{ stamina:-12, injury:'脚踝扭伤' } }] },
      { label:'咬牙继续', hint:'也许会肿起来', req:null,
        outcomes:[
          { w:5, text:'疼了一阵，走开了。', eff:{ stamina:-10 } },
          { w:5, text:'脚踝肿了起来，每一步都像踩在针上。', eff:{ hp:-8, stamina:-20, injury:'脚踝扭伤' } }
        ] }
    ]
  },
  {
    id:'cm_cache', title:'前人留下的', tag:'scout', stage:[1,99], once:true, common:true,
    text:'一块大石头下面压着防水袋，里面有几包饼干、一小罐气，还有一张被雨水泡软的路线图。',
    options:[
      { label:'取走补给，留下字条', hint:'无人区的规矩', req:null,
        outcomes:[{ w:10, text:'你拿走了一半，把剩下的重新压好，写下日期和“谢谢”。', eff:{ food:2, fuel:1, morale:6 } }] },
      { label:'原样放回', hint:'也许有人比你更需要', req:null,
        outcomes:[{ w:10, text:'你把石头压回去。走出很远，你又回头看了一眼。', eff:{ morale:4 } }] }
    ]
  },
  {
    id:'cm_stranger', title:'对面走来的人', tag:'wild', stage:[1,99], once:true, common:true,
    text:'一个背着旧式帆布包的男人从对面走来，脸被晒得很黑。他说自己已经走了六天，方向和你相反。',
    options:[
      { label:'交换情报', hint:'他也许知道前面的路', req:null,
        outcomes:[
          { w:7, text:'他告诉你前面有一处塌方，还画了一条绕行线。你给了他一块巧克力。', eff:{ morale:8, food:-1, flag:'intel' } },
          { w:3, text:'他说的话前后矛盾，你礼貌地结束了谈话。走出很远，你发现他一直在原地看着你。', eff:{ morale:-6 } }
        ] },
      { label:'不多说，各走各的', hint:'保持距离', req:null,
        outcomes:[{ w:10, text:'你们擦肩而过。他的鞋底磨得很薄，走路却没有声音。', eff:{ morale:-2 } }] }
    ]
  },
  {
    id:'cm_gear', title:'装备坏了', tag:'fatigue', stage:[1,99], once:true, common:true,
    text:'背包的肩带缝线崩了，重量全压在一边肩膀上。你走了半小时，肩膀开始发麻。',
    options:[
      { label:'用绳子重新捆扎', hint:'需要绳索', req:'rope',
        outcomes:[{ w:10, text:'你用绳子把背包和肩膀绑在一起，虽然难看，但能走了。', eff:{ stamina:-6 } }] },
      { label:'扔掉一些不必要的东西', hint:'减重，但可能后悔', req:null,
        outcomes:[{ w:10, text:'你扔掉了半罐气和一个备用电池。背包轻了，心也空了一点。', eff:{ fuel:-1, stamina:4, morale:-6 } }] }
    ]
  },
  {
    id:'cm_wild', title:'夜里的眼睛', tag:'wild', stage:[1,99], once:true, common:true,
    text:'头灯扫过营地边缘，黑暗里有两颗绿色的小光点，一动不动地看着你。',
    options:[
      { label:'敲击金属，让它离开', hint:'别让它觉得你好欺负', req:null,
        outcomes:[
          { w:8, text:'你敲响锅盖，光点消失了。你守到半夜才睡。', eff:{ stamina:-6, morale:-4 } },
          { w:2, text:'它靠近了。你打开头灯直射，它退开，但你整夜没敢合眼。', eff:{ morale:-12, stamina:-10 } }
        ] },
      { label:'保持安静，别惊动它', hint:'大部分动物更怕人', req:null,
        outcomes:[{ w:10, text:'光点看了一会儿，转身走了。你听见灌木被拨开的声音慢慢远去。', eff:{ morale:-4 } }] }
    ]
  }
];
