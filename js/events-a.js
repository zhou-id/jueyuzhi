/* =========================================================
   荒野禁区 · 事件库（上）
   鳌太线 / 羌塘 / 罗布泊 / 墨脱 / 可可西里
   ========================================================= */

window.EVENTS = {

  /* ---------------- 鳌太线 ---------------- */
  aotai: [
    {
      id:'aotai_wind', title:'白毛风', tag:'storm', stage:[1,5], once:true,
      text:'午后三点，风向突然倒了。雪粒横着抽在脸上，十米外只剩一团灰影。前方的刃脊像一条被磨薄的刀背，两侧都是空的。',
      options:[
        { label:'贴着背风面硬切过去', hint:'需要冰爪，赌一把通过', req:'crampon',
          outcomes:[
            { w:6, text:'冰爪咬住了硬雪。你几乎是爬着过去的，膝盖在抖，但人还在刃脊上。', eff:{ stamina:-16, warmth:-10, progress:1 } },
            { w:4, text:'一块雪檐在你脚下断裂。你滑出去三米，被一块石头挂住，脚踝传来一声闷响。', eff:{ hp:-20, stamina:-26, warmth:-20, injury:'脚踝扭伤' } }
          ] },
        { label:'原地挖雪洞，等风停', hint:'需要帐篷，消耗半天', req:'tent',
          outcomes:[
            { w:7, text:'你把帐篷压成雪洞，蜷在里面数着自己的呼吸。风在半夜停了。', eff:{ warmth:-14, stamina:6, morale:-5 } },
            { w:3, text:'雪洞被新雪压塌了一半。你刨了很久才爬出来，手指已经不听使唤。', eff:{ warmth:-28, hp:-10, stamina:-8 } }
          ] },
        { label:'下撤到药王庙，改日再上', hint:'后退一个节点，保住体力', req:null,
          outcomes:[{ w:10, text:'你退回了药王庙。山脊在暮色里安静下来，像什么都没发生过。', eff:{ stamina:-6, progress:-1, morale:-8 } }] }
      ]
    },
    {
      id:'aotai_lost', title:'石海', tag:'nav', stage:[2,5], once:true,
      text:'雾从谷底漫上来，你在乱石海里失去了方向。每一块石头都长得一样，来时的脚印已经被风抹平。',
      options:[
        { label:'用 GPS 校点', hint:'需要 GPS', req:'gps',
          outcomes:[
            { w:7, text:'信号飘了一会儿，最后锁定了导航架的方向。你少走了两公里的冤枉路。', eff:{ stamina:-10, progress:1 } },
            { w:3, text:'电量掉到 12%，坐标漂了两百米。你走回原路，重新找了一小时。', eff:{ stamina:-18, warmth:-10 } }
          ] },
        { label:'跟着一列旧脚印走', hint:'不用装备，但脚印不一定是人的', req:null,
          outcomes:[
            { w:5, text:'脚印把你带回了主脊线。你默默感谢那个不知名的前人。', eff:{ stamina:-12, progress:1, morale:-3 } },
            { w:5, text:'脚印绕了一圈，又回到原地。你意识到那是同一个人迷路时留下的。', eff:{ stamina:-16, water:-1, warmth:-8, morale:-8 } }
          ] },
        { label:'原地等雾散', hint:'消耗时间和体温', req:null,
          outcomes:[{ w:10, text:'你在石堆后坐了三个小时。雾散时，山脊线像被人重新画了一遍。', eff:{ stamina:4, warmth:-16, food:-1 } }] }
      ]
    },
    {
      id:'aotai_water', title:'水源枯竭', tag:'water', stage:[2,5], once:true,
      text:'背了四升水，到麦秸岭只剩不到一升。地图上的那条溪，在旱季里只剩一道白色的石头。',
      options:[
        { label:'停下来融雪', hint:'需要炉头与气罐', req:['stove','fuel'],
          outcomes:[{ w:10, text:'气罐嘶嘶响着，雪化成水，又冷又淡。你灌满了水袋。', eff:{ water:3, fuel:-1, stamina:-6 } }] },
        { label:'继续往前找溪谷', hint:'赌下一个山谷有水', req:null,
          outcomes:[
            { w:5, text:'翻过两道梁子，终于听见水声。你趴下去喝了很久。', eff:{ water:4, stamina:-14 } },
            { w:5, text:'山谷是干的。你多走了两个小时，只喝掉了最后一口水。', eff:{ water:-2, stamina:-20, morale:-8 } }
          ] },
        { label:'喝下浑浊的溪水', hint:'需要净水器，否则可能腹泻', req:'filter',
          outcomes:[
            { w:8, text:'净水器滤出的水带着一点塑料味，但至少是安全的。', eff:{ water:3, stamina:2 } },
            { w:2, text:'滤芯堵了。你喝了两口带泥沙的水，半夜开始腹泻。', eff:{ hp:-8, injury:'肠胃感染' } }
          ] }
      ]
    },
    {
      id:'aotai_voice', title:'风里的名字', tag:'night', stage:[3,6], once:true,
      text:'半夜，风里有人在喊你的名字。一遍，又一遍，声音像是从石堆那边传来的。你确定自己是一个人。',
      options:[
        { label:'回应一声', hint:'也许只是回音', req:null,
          outcomes:[{ w:10, text:'你应了一声。风停了半秒，然后石堆那边传来一声很轻的“谢谢”。天亮后，石堆上多了一块刻着名字的石头。', eff:{ morale:12, warmth:-10, egg:'aotai_stone' } }] },
        { label:'装睡到天亮', hint:'不回应，也不靠近', req:null,
          outcomes:[{ w:10, text:'你把头埋进睡袋。声音断断续续响了一整夜，天亮时什么也没有。', eff:{ morale:-10, warmth:-8 } }] }
      ]
    },
    {
      id:'aotai_camp', title:'无人认领的营地', tag:'scout', stage:[3,5], once:true,
      text:'背风坡有一顶塌掉的无名帐篷，帐杆断成两截。旁边的石头压着一张防水袋，里面像是还有东西。',
      options:[
        { label:'进帐篷检查', hint:'可能有补给，也可能有不忍看的东西', req:null,
          outcomes:[{ w:10, text:'睡袋里没有人。防水袋中是一张写着“明天就下山”的纸条，日期是四年前。你拿走了一罐没用完的气。', eff:{ fuel:1, morale:-8, egg:'aotai_camp' } }] },
        { label:'绕开，不打扰', hint:'把安静留给这里', req:null,
          outcomes:[{ w:10, text:'你绕了很远。回头时，帐篷已经被雪盖住一半，像一座没有名字的坟。', eff:{ stamina:-8, morale:-4 } }] }
      ]
    },
    {
      id:'aotai_rescue', title:'石头后面的人', tag:'wild', stage:[2,4], once:true,
      text:'一个没有队友的男人蜷在石头后面，嘴唇发紫，冲锋衣湿透。他还有意识，但已经站不起来。',
      options:[
        { label:'烧热水，把睡袋给他', hint:'需要炉头、气罐与睡袋，会消耗物资', req:['stove','fuel','bag'],
          outcomes:[{ w:10, text:'你把他塞进睡袋，喂了热水。他缓过来后，把一张标着备用水源的纸条塞给你。', eff:{ food:-2, fuel:-1, stamina:-10, morale:18, flag:'rescued' } }] },
        { label:'用卫星电话替他求救', hint:'需要卫星电话，救援会来但很慢', req:'satphone',
          outcomes:[{ w:10, text:'你报了坐标。救援队说最快六小时后到。你陪他等到天黑，山脊上的风一直没有停。', eff:{ stamina:-14, morale:14, flag:'rescued' } }] },
        { label:'留下保温毯，自己先走', hint:'需要保温毯', req:'bivy',
          outcomes:[{ w:10, text:'你留下唯一一张保温毯。走出很远，你还能看见那块银色的反光。', eff:{ morale:-8 } }] },
        { label:'走开', hint:'你也有自己的命要保', req:null,
          outcomes:[{ w:10, text:'你没有回头。风把身后的声音吹散了，但你记了很久。', eff:{ morale:-20, warmth:-4 } }] }
      ]
    },
    {
      id:'aotai_tent', title:'帐篷在半夜裂开', tag:'storm', stage:[2,6], once:true,
      text:'凌晨两点，一阵侧风把外帐撕开一道口子。雪灌进来，睡袋表面很快结了一层白霜。',
      options:[
        { label:'用绳子加固', hint:'需要绳索', req:'rope',
          outcomes:[
            { w:7, text:'你把绳子压在帐杆上，用石头做了四个地锚。风还在吼，但帐篷稳住了。', eff:{ stamina:-10, warmth:-8 } },
            { w:3, text:'一根帐杆在风里折断。你只能把睡袋拖到背风的石头后面。', eff:{ hp:-6, warmth:-20 } }
          ] },
        { label:'挖个雪坑睡', hint:'需要睡袋', req:'bag',
          outcomes:[{ w:10, text:'雪坑里比帐篷安静。你睡了两小时，醒来时睫毛上全是冰。', eff:{ warmth:-16, stamina:4 } }] },
        { label:'放弃帐篷，继续走', hint:'用体温换时间', req:null,
          outcomes:[{ w:10, text:'你摸黑走了两个小时，靠运动维持体温。天快亮时，风终于小了。', eff:{ stamina:-22, warmth:-18, progress:1 } }] }
      ]
    }
  ],

  /* ---------------- 羌塘 ---------------- */
  qiangtang: [
    {
      id:'qt_bear', title:'帐篷外的呼吸', tag:'wildlife', stage:[2,9], once:true,
      text:'凌晨两点，帐篷外传来沉重的呼吸声，还有爪子拨弄锅盖的声响。你闻到了自己的口粮味道。',
      options:[
        { label:'握紧防熊喷雾，慢慢后退', hint:'需要防熊喷雾', req:'bearspray',
          outcomes:[
            { w:8, text:'你拉开帐篷拉链，喷雾在手。棕熊抬起头看你，然后叼走一袋口粮，慢悠悠地走了。天亮后，你在营地外发现它挖开的鼠兔洞、啃过的牦牛骨，和一只被撕开的旧背包。', eff:{ food:-1, morale:-8, egg:'qiangtang_bear' } },
            { w:2, text:'它扑过来的速度比你想的快。喷雾救了你，但前臂被爪子划开一道口子。', eff:{ hp:-16, injury:'前臂撕裂伤', food:-1 } }
          ] },
        { label:'敲锅制造噪音', hint:'没有装备，只能赌它怕人', req:null,
          outcomes:[
            { w:5, text:'你拼命敲锅。棕熊退了两步，转身跑进夜色。你的手抖了半个小时。', eff:{ morale:-10, stamina:-6 } },
            { w:5, text:'它被激怒了。你被逼到岩壁边，直到它自己离开。肋骨疼得厉害。', eff:{ hp:-24, injury:'肋骨挫伤', warmth:-15 } }
          ] },
        { label:'屏住呼吸，装死', hint:'只对某些熊有效', req:null,
          outcomes:[
            { w:6, text:'它绕着帐篷转了三圈，最后走了。你躺到天亮，一动没动。', eff:{ morale:-16, warmth:-12 } },
            { w:4, text:'它掀开了帐篷。你蜷在地上，被翻动了几下，像一件行李。', eff:{ hp:-18, warmth:-20, morale:-12 } }
          ] }
      ]
    },
    {
      id:'qt_altitude', title:'第四次醒来', tag:'altitude', stage:[1,4], once:true,
      text:'夜里你第四次被憋醒，太阳穴突突地跳，躺下比站着更难受。同行没有别人，只有你自己。',
      options:[
        { label:'吃药，下降半日', hint:'需要高原药，退一个节点', req:'meds',
          outcomes:[{ w:10, text:'药下去半小时后，呼吸慢慢顺了。你退到低一点的地方扎营，睡了一整晚。', eff:{ hp:6, stamina:8, progress:-1 } }] },
        { label:'放慢节奏，硬扛', hint:'省一天，但身体要付账', req:null,
          outcomes:[
            { w:6, text:'你把行程减半，走得极慢。两天后身体适应了稀薄的空气。', eff:{ stamina:-14, hp:-4 } },
            { w:4, text:'第三天早上你咳出了粉红色的痰。你害怕了，开始下撤。', eff:{ hp:-20, stamina:-20, progress:-1, injury:'高原肺水肿' } }
          ] }
      ]
    },
    {
      id:'qt_lake', title:'盐湖', tag:'water', stage:[2,7], once:true,
      text:'前方是一片白得刺眼的盐湖。水就在眼前，但喝一口会让身体更缺水。绕过去，要多走半天。',
      options:[
        { label:'取冰融水', hint:'需要炉头与气罐', req:['stove','fuel'],
          outcomes:[{ w:10, text:'你把冰面上的雪装进锅，烧了四十分钟。水里有股咸味，但能喝。', eff:{ water:4, fuel:-1, stamina:-8 } }] },
        { label:'尝一口湖水', hint:'非常不推荐', req:null,
          outcomes:[
            { w:6, text:'你只抿了一口就吐了。舌头咸得发苦，但至少没有更糟。', eff:{ hp:-6, morale:-4 } },
            { w:4, text:'你喝了两大口，半小时后开始呕吐、头晕，身体在加速失水。', eff:{ hp:-16, water:-2, injury:'脱水' } }
          ] },
        { label:'绕湖找淡水', hint:'消耗体力，也许有融水溪', req:null,
          outcomes:[
            { w:7, text:'湖的东侧有一条冰川融水的小溪。你灌满水，还洗了把脸。', eff:{ water:5, stamina:-16 } },
            { w:3, text:'绕了很远，只找到一片咸水沼泽。你损失了半天和大量体力。', eff:{ water:-2, stamina:-24, warmth:-8 } }
          ] }
      ]
    },
    {
      id:'qt_exp', title:'铁皮箱', tag:'scout', stage:[3,8], once:true,
      text:'盐湖边一块黑色石头下面，压着一只锈死的铁皮箱。箱盖上的编号，是 1976 年。',
      options:[
        { label:'撬开它', hint:'可能是科考队的遗物', req:null,
          outcomes:[{ w:10, text:'箱里是泛黄的测绘图、一叠未寄出的信，和半块压缩饼干。信的最后一行写着：湖比地图上大。', eff:{ morale:8, stamina:-4, egg:'qiangtang_exp' } }] },
        { label:'拍张照片，原样埋回去', hint:'让后来的人也能找到', req:null,
          outcomes:[{ w:10, text:'你把石头压回原位，在 GPS 上打了个点。风很快把土盖住了。', eff:{ morale:4, egg:'qiangtang_exp' } }] }
      ]
    },
    {
      id:'qt_ice', title:'冰裂缝', tag:'ice', stage:[3,9], once:true,
      text:'冰川末端出现一条蓝黑色的裂缝，宽约一米，深不见底。绕行要多走三公里，跳过去只需一秒。',
      options:[
        { label:'结组跨过', hint:'需要绳索', req:'rope',
          outcomes:[
            { w:8, text:'你把绳子系在背包上，一步步挪了过去。裂缝里传来水流的声音。', eff:{ stamina:-14, warmth:-8, progress:1 } },
            { w:2, text:'对岸的雪檐塌了，你整个人挂在绳子上，靠同伴的体重才没掉下去。', eff:{ hp:-14, stamina:-20, injury:'肩部拉伤' } }
          ] },
        { label:'绕行', hint:'稳妥，但消耗半天', req:null,
          outcomes:[{ w:10, text:'你沿着裂缝边缘走了三公里。多花的时间，让晚上的营地更冷了。', eff:{ stamina:-22, warmth:-10 } }] },
        { label:'直接跳过去', hint:'赌你的脚踝和运气', req:null,
          outcomes:[
            { w:5, text:'你落地的瞬间滑了一下，但稳住了。回头看一眼，背后全是冷汗。', eff:{ stamina:-10, progress:1, morale:-6 } },
            { w:5, text:'你半个身子陷进裂缝。冰水灌进衣服，你花了很久才爬出来。', eff:{ hp:-22, warmth:-32, stamina:-24 } }
          ] }
      ]
    },
    {
      id:'qt_yak', title:'金色野牦牛', tag:'wildlife', stage:[4,10], once:true,
      text:'雪线之上，一头通体金黄的野牦牛正低头吃草。它抬起头，隔着两百米看了你很久。',
      options:[
        { label:'停下，让它先走', hint:'牧民的规矩', req:null,
          outcomes:[{ w:10, text:'你站在原地，它慢慢转身走进云里。当地人后来说，见到它的人这一年不会迷路。', eff:{ morale:16, egg:'qiangtang_yak' } }] },
        { label:'举起望远镜看', hint:'需要望远镜', req:'binocular',
          outcomes:[{ w:10, text:'镜头里，它的毛在风里像火一样。你看了很久，直到它消失。', eff:{ morale:10, egg:'qiangtang_yak' } }] },
        { label:'继续靠近拍照', hint:'它比熊更不讲理', req:null,
          outcomes:[
            { w:5, text:'它低吼了一声，刨了刨地。你识趣地退开了。', eff:{ morale:-4, stamina:-6 } },
            { w:5, text:'它冲了过来。你被顶翻在雪里，肋骨像断了。', eff:{ hp:-22, injury:'肋骨挫伤' } }
          ] }
      ]
    }
  ],

  /* ---------------- 罗布泊 ---------------- */
  luobubo: [
    {
      id:'lb_sandstorm', title:'沙暴', tag:'sandstorm', stage:[1,5], once:true,
      text:'地平线突然变成一堵黄墙。风里带着盐粒，打在脸上像砂纸。能见度在三十秒内降到不足五米。',
      options:[
        { label:'原地趴低，用背包挡风', hint:'标准做法，但会被埋', req:null,
          outcomes:[
            { w:7, text:'你趴在一块盐壳后面，用背包护住头。沙暴走了四十分钟，你被埋了半个身子。', eff:{ stamina:-14, water:-2, warmth:-6 } },
            { w:3, text:'沙暴比预想的久。你埋了很久，起来时咳出的痰里全是沙子。', eff:{ hp:-10, stamina:-20, water:-3 } }
          ] },
        { label:'顶着风找背风坡', hint:'容易迷失方向', req:null,
          outcomes:[
            { w:5, text:'你摸到一处雅丹土台后面，躲了一个小时。回头时，来路已经被填平。', eff:{ stamina:-18, water:-2 } },
            { w:5, text:'你在黄沙里转了很久，GPS 的屏幕被沙糊住。等风停，你已经偏离了两公里。', eff:{ hp:-8, stamina:-24, water:-3, morale:-10 } }
          ] }
      ]
    },
    {
      id:'lb_mirage', title:'前面的湖', tag:'heat', stage:[2,5], once:true,
      text:'前方出现一片水光，还有胡杨的影子。你的喉咙干得发痛，脚步不自觉地快了起来。',
      options:[
        { label:'按坐标走，不信眼睛', hint:'需要 GPS 与地形图', req:['gps','map'],
          outcomes:[{ w:10, text:'坐标显示那里只有盐壳。你强迫自己转了方向。半小时后，水光消失了。', eff:{ stamina:-8, morale:-6 } }] },
        { label:'跑过去看看', hint:'也许真的是水', req:null,
          outcomes:[
            { w:5, text:'你跑了两公里，只找到一片反光的盐壳。你蹲下来，笑了很久。', eff:{ stamina:-18, water:-2, morale:-12 } },
            { w:5, text:'那里的确有水，但是一潭死水，漂着白色的盐花。你不敢喝。', eff:{ stamina:-16, water:-2 } }
          ] }
      ]
    },
    {
      id:'lb_shuangyu', title:'湖心的影子', tag:'night', stage:[3,6], once:true,
      text:'夜里，湖心方向有个东西在反光。你走过去，看见盐壳下埋着一枚青玉双鱼佩，一半露在外面。',
      options:[
        { label:'挖出来，收进背包', hint:'带走它', req:null,
          outcomes:[{ w:10, text:'玉佩入手冰凉。翻过来，背面刻着两个你不认识的符号。当晚你梦见了一片有水的湖。', eff:{ morale:6, egg:'luobubo_shuangyu', stamina:-4 } }] },
        { label:'拍张照，原样埋回去', hint:'有些东西不该被带走', req:null,
          outcomes:[{ w:10, text:'你拍完照，把盐壳重新盖好。照片洗出来后，玉佩的位置多了一只手。', eff:{ morale:-4, egg:'luobubo_shuangyu' } }] }
      ]
    },
    {
      id:'lb_yu', title:'余纯顺的墓', tag:'scout', stage:[2,5], once:true,
      text:'一座孤零零的墓碑立在盐碱地上，前面摆着几瓶没喝完的水。碑上的名字被风磨得发浅。',
      options:[
        { label:'留下一瓶水，鞠一躬', hint:'把自己的一瓶水留给他', req:null,
          outcomes:[{ w:10, text:'你把水放在碑前。风很快把瓶身埋了半截。你站着看了很久才走。', eff:{ water:-1, morale:10, egg:'luobubo_yu' } }] },
        { label:'拍张照，继续赶路', hint:'这里的一切都在提醒你快走', req:null,
          outcomes:[{ w:10, text:'快门声在空旷的盐壳上显得很响。你加快脚步，没有再回头。', eff:{ morale:2, egg:'luobubo_yu' } }] }
      ]
    },
    {
      id:'lb_crust', title:'盐壳塌陷', tag:'heat', stage:[2,5], once:true,
      text:'脚下的盐壳突然发出一声脆响。你半个身子陷进灰白色的粉末里，下面是松软的流沙。',
      options:[
        { label:'慢慢把背包卸下来', hint:'扩大接触面积', req:null,
          outcomes:[{ w:8, text:'你把背包垫在身前，一点点爬了出来。鞋里灌满了盐粒。', eff:{ stamina:-16, water:-1 } }] },
        { label:'用登山杖撑住，猛蹬出来', hint:'快，但容易拉伤', req:'pole',
          outcomes:[{ w:10, text:'登山杖卡住硬壳，你借力翻了出来。杖身弯了一点，但人没事。', eff:{ stamina:-12 } }] },
        { label:'挣扎', hint:'越挣扎陷得越快', req:null,
          outcomes:[{ w:10, text:'你越动陷得越深。最后几乎是用手刨出来的，指甲缝里全是盐。', eff:{ hp:-12, stamina:-24, morale:-10 } }] }
      ]
    },
    {
      id:'lb_signal', title:'不该存在的信号', tag:'isolation', stage:[3,6], once:true,
      text:'夜里，你随手打开卫星电话的对讲频段。里面突然传来一段很轻的敲击声，三短，三长，三短。',
      options:[
        { label:'回应 SOS', hint:'也许有人也在找你', req:'satphone',
          outcomes:[{ w:10, text:'你按了三短三长三短。那边安静了很久，然后回了一个坐标，就在你前方两公里。你天亮后去找，只看到一座空无一人的旧帐篷。', eff:{ morale:-8, egg:'luobubo_signal' } }] },
        { label:'关掉设备，睡觉', hint:'无人区里，未知比已知可怕', req:null,
          outcomes:[{ w:10, text:'你关掉电话，声音停了。但那一夜你总是听见有人在营地外面走。', eff:{ morale:-12, warmth:-8 } }] }
      ]
    }
  ],

  /* ---------------- 墨脱 ---------------- */
  motuo: [
    {
      id:'mt_leech', title:'蚂蟥', tag:'leech', stage:[2,5], once:true,
      text:'雨林里的蚂蟥比雨还密。你低头时，裤脚上已经挂了十几条，有一条约莫指节长，正往袜子里钻。',
      options:[
        { label:'喷驱虫剂，扎紧裤脚', hint:'需要驱虫剂', req:'insect',
          outcomes:[{ w:10, text:'刺鼻的味道让它们松了口。你重新扎紧雪套，后面半天舒服了很多。', eff:{ stamina:-4 } }] },
        { label:'边走边扯', hint:'扯断会流血', req:null,
          outcomes:[
            { w:6, text:'你扯掉大部分，有几条断了，袜子上渗出血点。不疼，只是恶心。', eff:{ hp:-4, stamina:-8, morale:-6 } },
            { w:4, text:'一条钻进了裤腿。你花了二十分钟才把它弄出来，腿上留下一个止不住血的小洞。', eff:{ hp:-10, injury:'蚂蟥咬伤', stamina:-6 } }
          ] }
      ]
    },
    {
      id:'mt_landslide', title:'塌方区', tag:'landslide', stage:[3,5], once:true,
      text:'前方整面山坡塌进江里，碎石还在往下滚。绕行要爬上一道湿滑的陡坡，直接穿过大约二十米。',
      options:[
        { label:'结绳保护，快速通过', hint:'需要绳索', req:'rope',
          outcomes:[
            { w:8, text:'你把绳子固定在树上，一口气冲过塌方。身后的石头比你先到对岸。', eff:{ stamina:-14, progress:1 } },
            { w:2, text:'脚下的碎石整体下滑。你被绳子吊住，膝盖撞上岩壁。', eff:{ hp:-14, injury:'膝盖撞伤', stamina:-12 } }
          ] },
        { label:'爬高绕行', hint:'多走两个小时', req:null,
          outcomes:[{ w:10, text:'你沿着几乎垂直的泥坡爬上去，指甲里全是土。绕过塌方时，腿已经不是自己的了。', eff:{ stamina:-26, warmth:-6 } }] },
        { label:'等雨停再走', hint:'塌方会越来越松', req:null,
          outcomes:[{ w:10, text:'雨一直没停。你在树下缩了一夜，听着石头滚进江里的声音。', eff:{ stamina:2, warmth:-10, food:-1 } }] }
      ]
    },
    {
      id:'mt_bridge', title:'藤桥', tag:'river', stage:[3,5], once:true,
      text:'藤桥横在江上，桥板只剩一半。脚下是翻滚的浑水，对岸的雾里有人在喊什么。',
      options:[
        { label:'两个人两个人过', hint:'慢，但稳', req:null,
          outcomes:[{ w:10, text:'你一手扶藤一手抓绳，一步一步挪过去。桥在风里晃，但没断。', eff:{ stamina:-12, morale:-4 } }] },
        { label:'快速跑过去', hint:'桥面湿滑', req:null,
          outcomes:[
            { w:5, text:'你跑过藤桥，木板在身后断裂，掉进江里。你站在对岸，腿软了很久。', eff:{ stamina:-16, morale:-8 } },
            { w:5, text:'中间一块木板塌了。你整个人卡在藤条里，半个身子悬在江上，靠手臂把自己拉了回去。', eff:{ hp:-12, stamina:-24, warmth:-12 } }
          ] }
      ]
    },
    {
      id:'mt_wet', title:'湿透的睡袋', tag:'rain', stage:[2,5], once:true,
      text:'连续两天的雨让睡袋吸饱了水。晚上钻进睡袋时，你感觉自己像躺在一块冰里。',
      options:[
        { label:'用身体硬焐', hint:'会整夜发抖', req:null,
          outcomes:[{ w:10, text:'你蜷成一团，抖到天亮。睡袋稍微干了一点，人却更累了。', eff:{ warmth:-18, stamina:-6, hp:-4 } }] },
        { label:'烧水，做热食', hint:'需要气罐，热食能升体温', req:['stove','fuel'],
          outcomes:[{ w:10, text:'热面条下肚，身体从里到外暖起来。你把湿袜子挂在锅边烘了半小时。', eff:{ warmth:10, fuel:-1, food:-1, stamina:6 } }] },
        { label:'用保温毯裹住', hint:'需要保温毯', req:'bivy',
          outcomes:[{ w:10, text:'锡箔毯把湿气隔在外面，你终于睡了个整觉。', eff:{ warmth:4, stamina:10 } }] }
      ]
    },
    {
      id:'mt_menba', title:'藤桥那边的老人', tag:'scout', stage:[3,5], once:true,
      text:'桥头有一座木屋，门巴族老人坐在门槛上，递给你一碗酥油茶。她指了指你身后的山，又摇了摇头。',
      options:[
        { label:'喝完茶，问路', hint:'也许她知道些什么', req:null,
          outcomes:[{ w:10, text:'她说：那边不能去，今年收人了。她给你指了一条绕开山脊的旧路。', eff:{ stamina:8, morale:6, egg:'motuo_menba', flag:'safe_path' } }] },
        { label:'放下一点盐和糖，离开', hint:'不打扰，也是一种尊重', req:null,
          outcomes:[{ w:10, text:'老人没有收，只是笑了笑。你走出很远，回头时她还在门口坐着。', eff:{ morale:6, food:-1, egg:'motuo_menba' } }] }
      ]
    },
    {
      id:'mt_lotus', title:'月亮瀑布', tag:'scout', stage:[3,6], once:true,
      text:'瀑布从两百米高的崖壁上砸下来，水雾里有一道淡淡的彩虹。雨刚停三分钟。你忽然注意到瀑布后面的石壁。',
      options:[
        { label:'钻进瀑布后面的岩腔', hint:'会被淋透', req:null,
          outcomes:[
            { w:6, text:'石壁上有一尊天然形成的像，眉眼像被水刻出来的。你拍了一张照片，照片里多了一个不在场的人影。', eff:{ warmth:-6, stamina:-6, morale:-6, egg:'motuo_lotus' } },
            { w:4, text:'岩腔比想象中深。你走了十几步，忽然听见身后瀑布停了。回头时，水还在落，只是没有声音。', eff:{ morale:-14, stamina:-8, egg:'motuo_lotus' } }
          ] },
        { label:'在瀑布外拍一张就走', hint:'保持距离', req:null,
          outcomes:[
            { w:10, text:'照片很美。回看时，石壁上多了一道你可能没注意到的影子。', eff:{ morale:4, egg:'motuo_lotus' } }
          ] }
      ]
    },
    {
      id:'mt_porter', title:'背夫', tag:'wild', stage:[2,4], once:true,
      text:'一个背夫蹲在路边，背架上绑着两箱药品，脚上的胶鞋已经磨穿。他说前面的桥断了，得绕山。',
      options:[
        { label:'帮他分担一箱药', hint:'耗体力，但你会得到向导', req:null,
          outcomes:[{ w:10, text:'你替他背了五公里。他执意不收钱，只把一条绕桥的路线画在你的地图上。', eff:{ stamina:-18, progress:1, morale:12, flag:'porter_route' } }] },
        { label:'把羊毛帽给他', hint:'需要羊毛帽', req:'hat',
          outcomes:[{ w:10, text:'他愣了一下，然后笑了。他把路线说得很细，连哪块石头会滑都标了出来。', eff:{ morale:10, flag:'porter_route' } }] },
        { label:'各走各的', hint:'你也有自己的期限', req:null,
          outcomes:[{ w:10, text:'你超过了他。走出很远，还听得见他背架吱呀的声音。', eff:{ morale:-6 } }] }
      ]
    }
  ],

  /* ---------------- 可可西里 ---------------- */
  kekexili: [
    {
      id:'kx_river', title:'冰河', tag:'water', stage:[2,6], once:true,
      text:'一条冰川融水河横在面前，水色发灰，流速很快。河面不宽，但底下全是圆滑的石头。',
      options:[
        { label:'结绳渡河', hint:'需要绳索', req:'rope',
          outcomes:[
            { w:7, text:'绳子绷紧，你顶着水流一步步挪到对岸。水没过膝盖，冷得像刀割。', eff:{ stamina:-16, warmth:-18, progress:1 } },
            { w:3, text:'你在河心滑倒，被水冲了五六米。绳子把你拽住，但衣服全湿了。', eff:{ hp:-10, warmth:-30, stamina:-20 } }
          ] },
        { label:'沿河找浅滩', hint:'多走，但安全', req:null,
          outcomes:[{ w:10, text:'上游两百米有一片砾石浅滩。你踩着石头过去，只湿了鞋。', eff:{ stamina:-20, water:-1 } }] },
        { label:'直接蹚过去', hint:'最快，也最冷', req:null,
          outcomes:[
            { w:5, text:'你咬牙冲了过去，上岸时腿已经没知觉。', eff:{ warmth:-26, stamina:-14, progress:1 } },
            { w:5, text:'水流比看起来急。你被冲倒，背包灌了水，狼狈地爬回岸边。', eff:{ hp:-12, warmth:-32, stamina:-24, food:-1 } }
          ] }
      ]
    },
    {
      id:'kx_yak', title:'雪停之后的第三分钟', tag:'wildlife', stage:[3,8], once:true,
      text:'暴风雪刚停，世界安静得能听见雪粒落地的声音。雪线上，一头通体金黄的野牦牛正低头站着，像一小块被留在人间的太阳。',
      options:[
        { label:'站着，不要靠近', hint:'牧民说，见到它的人这一年不会迷路', req:null,
          outcomes:[
            { w:8, text:'你站在原地，它慢慢转过身，走进云里。雪地上没有留下脚印。', eff:{ morale:16, egg:'kekexili_yak' } },
            { w:2, text:'它抬起头看了你很久，然后朝你的方向走了两步。你退后，它停住，转身消失。', eff:{ morale:6, warmth:-6, egg:'kekexili_yak' } }
          ] },
        { label:'举起望远镜看它', hint:'需要望远镜', req:'binocular',
          outcomes:[
            { w:10, text:'镜头里，它的毛在风里像火。你看了很久，直到云把整条雪线收走。', eff:{ morale:12, egg:'kekexili_yak' } }
          ] }
      ]
    },
    {
      id:'kx_station', title:'索南达杰保护站', tag:'scout', stage:[2,5], once:true,
      text:'保护站的门没锁。屋里的炉子还有余温，墙上贴着巡护路线，桌上摊着一本登记簿。',
      options:[
        { label:'翻看登记簿', hint:'看看都有谁来过', req:null,
          outcomes:[{ w:10, text:'最后一页写着你的队伍名字，日期是明天。你翻回去，那一页是空白的。', eff:{ morale:-10, egg:'kekexili_station' } }] },
        { label:'留下一点补给，写张字条', hint:'巡护员也许需要', req:null,
          outcomes:[{ w:10, text:'你把两包口粮放在桌上，写了一句“谢谢”。出门时，炉子突然响了一声。', eff:{ food:-2, morale:12, egg:'kekexili_station' } }] }
      ]
    },
    {
      id:'kx_snowstorm', title:'白帐', tag:'storm', stage:[3,7], once:true,
      text:'暴风雪在午后突然压下来，帐篷被吹得像一面旗。远处已经分不清天和地。',
      options:[
        { label:'压上所有石头，死守帐篷', hint:'需要帐篷', req:'tent',
          outcomes:[
            { w:7, text:'你搬了十几块石头压住帐角，在帐篷里熬了六个小时。雪把帐篷埋了一半。', eff:{ warmth:-14, stamina:-8, water:-1 } },
            { w:3, text:'一阵横风掀翻了帐篷。你在雪里追了很远才把外帐抓回来。', eff:{ hp:-8, warmth:-26, stamina:-16 } }
          ] },
        { label:'挖雪洞避风', hint:'比帐篷更稳', req:null,
          outcomes:[{ w:10, text:'你挖了一个半人高的雪洞，把睡袋拖进去。外面风声像火车，里面却安静得可怕。', eff:{ warmth:-10, stamina:2 } }] }
      ]
    },
    {
      id:'kx_calf', title:'产羔季', tag:'wildlife', stage:[3,7], once:true,
      text:'卓乃湖畔，几百只藏羚羊正在产羔。一只小羊被铁丝网缠住，母羊在远处来回踱步。',
      options:[
        { label:'慢慢靠近，解开铁丝', hint:'别让它应激', req:null,
          outcomes:[{ w:10, text:'你蹲着挪过去，解开了铁丝。小羊跑回羊群，母羊看了你一眼。', eff:{ morale:14, stamina:-6 } }] },
        { label:'远远看着，不干预', hint:'自然的归自然', req:null,
          outcomes:[{ w:10, text:'你退到土坡后面，看了很久。风把羊群的声音送过来，像潮水。', eff:{ morale:8 } }] }
      ]
    },
    {
      id:'kx_cold', title:'零下二十度', tag:'cold', stage:[2,7], once:true,
      text:'夜里气温骤降，水壶冻成了冰坨。你呼出的气在睡袋口结成一圈白霜。',
      options:[
        { label:'烧水灌进保温壶', hint:'需要气罐', req:['stove','fuel'],
          outcomes:[{ w:10, text:'热水灌进壶里，塞进睡袋。你抱着它睡到天亮，像抱着一块炭。', eff:{ warmth:12, fuel:-1 } }] },
        { label:'穿上所有衣服，硬扛', hint:'把能穿的都穿上', req:null,
          outcomes:[{ w:10, text:'你把冲锋衣、抓绒、羽绒全套上，行动像个粽子。冷，但还活着。', eff:{ warmth:-8, stamina:-6 } }] },
        { label:'用保温毯裹住睡袋', hint:'需要保温毯', req:'bivy',
          outcomes:[{ w:10, text:'锡箔层把热量反射回来，你第一次在无人区睡出了汗。', eff:{ warmth:8, stamina:6 } }] }
      ]
    }
  ]
};
