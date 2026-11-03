/* =========================================================
   绝域志 · 事件生成器
   为没有手写事件的坐标，按地貌 + 星级生成事件组
   ========================================================= */
(function () {
  function fill(str, loc) {
    return String(str)
      .replace(/\{NAME\}/g, loc.name)
      .replace(/\{PROV\}/g, loc.province)
      .replace(/\{STAMP\}/g, loc.stamp || '')
      .replace(/\{LEGEND\}/g, loc.legend || '')
      .replace(/\{NEXT:([a-z0-9_]+)\}/g, (m, id) => loc.id + '_' + id);
  }

  /* ---------- 地景模板 ---------- */
  const SCENE = {
    ridge: [
      { id:'wind', title:'刃脊上的横风', tag:'storm',
        text:'风从侧面的山谷翻上来，把{NAME}的碎石刮得贴着地面跑。你听不清自己的呼吸，只能听见风在背包上撕扯。',
        options:[
          { label:'压低重心，贴着背风侧挪', hint:'慢，但稳', outcomes:[
            { w:3, text:'你把身体压得很低，一步一步挪过最窄的那段。风在头顶呼啸，没能把你推下去。', eff:{ stamina:-7, warmth:-5, progress:1 } },
            { w:1, text:'一块碎石在脚下松动。你抓住了岩角，手背被划开一道口子。', eff:{ hp:-7, stamina:-9, injury:'手部划伤' } }
          ]},
          { label:'蹲在石后等风小一点', hint:'消耗时间', outcomes:[
            { w:1, text:'风没有停，只是换了个方向。你多冻了一个小时，但至少还站着。', eff:{ warmth:-9, stamina:-3 } }
          ]},
          { label:'用冰爪强行通过', req:'crampon', hint:'需要冰爪', outcomes:[
            { w:1, text:'冰爪咬住硬雪，你快速通过了风口。', eff:{ stamina:-4, progress:1 } }
          ]}
        ]},
      { id:'edge', title:'路断在崖边', tag:'nav',
        text:'标记在崖边消失了。往下的碎石坡有一条若隐若现的兽径，绕回去要花掉大半天。{NAME}的地形从不体谅人。',
        options:[
          { label:'顺着兽径下降', hint:'快，但没人保证', outcomes:[
            { w:2, text:'兽径把你带到一处平台，路线重新接上。', eff:{ stamina:-9, progress:1 } },
            { w:2, text:'兽径尽头是断崖。你只能原路爬回，多耗了两个小时。', eff:{ stamina:-14, morale:-5 } }
          ]},
          { label:'原路绕回，找可靠的山脊', hint:'安全但费时', outcomes:[
            { w:1, text:'你多走了几公里，但脚下每一步都是实的。', eff:{ stamina:-12, progress:1, warmth:-3 } }
          ]}
        ]},
      { id:'snowslope', title:'硬雪坡', tag:'ice',
        text:'雪面冻得像铁板，下面可能是空的。你知道该做什么，但身体在犹豫。',
        options:[
          { label:'踢出步阶，一步一步上', hint:'稳妥', outcomes:[
            { w:3, text:'你踢出十几个步阶，踢到腿酸，但爬了上去。', eff:{ stamina:-11, progress:1 } },
            { w:1, text:'一脚踩空，整条腿陷进雪里。你爬出来时，裤腿已经湿透。', eff:{ stamina:-8, warmth:-10 } }
          ]},
          { label:'绕到背风坡找软雪', hint:'耗时', outcomes:[
            { w:1, text:'背面雪更软，你多花了一小时，但省了力气。', eff:{ stamina:-5, progress:1 } }
          ]}
        ]},
      { id:'campwind', title:'营地被风掀了', tag:'storm',
        text:'凌晨两点，一阵风把外帐扯开。睡袋里灌进雪，气温还在往下掉。',
        options:[
          { label:'冒黑把帐篷重新压好', hint:'抢时间', outcomes:[
            { w:2, text:'你用石头压住每一根风绳。风还在，但帐篷立住了。', eff:{ stamina:-8, warmth:-6 } },
            { w:1, text:'风绳断了。你只能把睡袋拖到一块岩石后面。', eff:{ warmth:-14, stamina:-6 } }
          ]},
          { label:'干脆收帐，摸黑下撤到低处', hint:'风险高', outcomes:[
            { w:1, text:'你摸黑下撤了三百米，风小了，但你丢了半天的体力。', eff:{ stamina:-16, warmth:-4, progress:-1 } }
          ]}
        ]},
      { id:'view', title:'云开的一瞬', tag:'lore',
        text:'云层裂开一条缝，{NAME}的全貌在脚下展开。你忽然明白为什么会有人一次次回到这种地方。',
        options:[
          { label:'坐下来，看十分钟', hint:'值得', outcomes:[
            { w:1, text:'你坐在石头上，什么也没想。意志回了一点。', eff:{ morale:12, warmth:-3 } }
          ]},
          { label:'拍一张，然后继续走', hint:'不耽误', outcomes:[
            { w:1, text:'照片拍得很好。你把相机收好，继续赶路。', eff:{ morale:6, progress:1 } }
          ]}
        ]}
    ],

    plateau: [
      { id:'altitude', title:'头开始疼', tag:'altitude',
        text:'太阳穴一下一下地跳，眼前的路有点发白。你知道这不是累，是海拔在收利息。',
        options:[
          { label:'放慢速度，深呼吸', hint:'稳', outcomes:[
            { w:3, text:'你把节奏压到最慢，头痛慢慢退回背景。', eff:{ stamina:-6, warmth:-4 } },
            { w:1, text:'越走越晕。你扶住石头站了很久。', eff:{ hp:-6, stamina:-10 } }
          ]},
          { label:'吃药，继续赶路', req:'meds', hint:'需要高原药', outcomes:[
            { w:1, text:'药起效了。你多推进了一段，但今晚必须早扎营。', eff:{ progress:1, stamina:-4 } }
          ]},
          { label:'原地扎营，明天再说', hint:'保守', outcomes:[
            { w:1, text:'你在风口外扎营。夜里睡得不深，但头不疼了。', eff:{ warmth:-6, morale:-3 } }
          ]}
        ]},
      { id:'bog', title:'草皮下面是空的', tag:'water',
        text:'前面那片草甸绿得很正常。你伸杖一探，杖子直接没进去半米。',
        options:[
          { label:'绕远，走裸露的碎石带', hint:'安全', outcomes:[
            { w:1, text:'你多走了一个小时，但脚下每一块石头都是实的。', eff:{ stamina:-10, progress:1 } }
          ]},
          { label:'踩草墩跳过去', hint:'省时，危险', outcomes:[
            { w:2, text:'你连着跳过三个草墩，落地时心跳很快。', eff:{ stamina:-6, progress:1 } },
            { w:1, text:'第三个草墩塌了。你半个身子陷进冰水，爬出来时牙在打战。', eff:{ warmth:-16, stamina:-10 } }
          ]}
        ]},
      { id:'lake', title:'结冰的湖', tag:'cold',
        text:'湖面冻得发青。对岸就是路线。绕湖要多走五公里。',
        options:[
          { label:'绕湖走', hint:'不冒险', outcomes:[
            { w:1, text:'你绕着湖岸走了两个小时，风把脸吹得发麻。', eff:{ stamina:-12, warmth:-5 } }
          ]},
          { label:'先扔石头试冰', hint:'试试看', outcomes:[
            { w:2, text:'石头砸出一片白痕，冰够厚。你贴着岸边快速通过。', eff:{ stamina:-5, progress:1 } },
            { w:1, text:'冰在脚下响了。你趴下，一点一点爬回去。', eff:{ warmth:-12, morale:-8 } }
          ]},
          { label:'从冰面直线穿过', hint:'最快，也最险', outcomes:[
            { w:2, text:'你屏住呼吸走完最后十米，鞋底全是水。', eff:{ stamina:-3, progress:1, warmth:-6 } },
            { w:1, text:'冰裂了。你半个身子落水，爬上岸后开始发抖。', eff:{ hp:-10, warmth:-22, stamina:-8 } }
          ]}
        ]},
      { id:'animal', title:'带崽的野牦牛', tag:'wildlife',
        text:'一头野牦牛挡在坡上，身后有一头小牛。它没有动，只是把头低了下来。',
        options:[
          { label:'大幅绕开，不要直视', hint:'正确', outcomes:[
            { w:1, text:'你绕了一个大圈。它一直看着你，直到你走远。', eff:{ stamina:-10, progress:1, morale:-2 } }
          ]},
          { label:'站着不动，等它先走', hint:'耐心', outcomes:[
            { w:1, text:'十几分钟后，它带着小牛走开了。你的腿有点软。', eff:{ stamina:-4, morale:-3 } }
          ]},
          { label:'用防熊喷雾驱赶', req:'bearspray', hint:'需要防熊喷雾', outcomes:[
            { w:1, text:'雾气喷在侧方，它退了两步，转身走了。', eff:{ morale:4 } }
          ]}
        ]},
      { id:'storm', title:'冰雹横着砸', tag:'storm',
        text:'天突然黑下来。冰雹不是往下落，而是横着抽过来，打在脸上像小石子。',
        options:[
          { label:'背风蹲下，用背包护头', hint:'标准做法', outcomes:[
            { w:3, text:'你把自己缩成一团。冰雹过去了，耳朵还在嗡嗡响。', eff:{ warmth:-8, stamina:-6 } },
            { w:1, text:'一颗冰雹砸在手上，很快肿了起来。', eff:{ hp:-7, injury:'手部肿胀', warmth:-8 } }
          ]},
          { label:'顶着风继续走', hint:'冒险', outcomes:[
            { w:1, text:'你走了几百米就撑不住了，只能退回原处。', eff:{ stamina:-14, warmth:-12, morale:-5 } }
          ]}
        ]}
    ],

    desert: [
      { id:'heat', title:'中午的太阳', tag:'heat',
        text:'地表在发烫，空气像从烤箱里出来。远处的地平线开始抖，甚至出现了水的影子——你知道那是假的。',
        options:[
          { label:'挖坑遮阳，等到傍晚', hint:'正确', outcomes:[
            { w:1, text:'你把背包撑起来做了个阴影。水喝掉一部分，但命还在。', eff:{ water:-2, stamina:4, heat:0 } }
          ]},
          { label:'趁现在多走一段', hint:'消耗水', outcomes:[
            { w:2, text:'你推进了一段，但水消耗得飞快。', eff:{ progress:1, water:-4, stamina:-10 } },
            { w:1, text:'你开始头晕，视线边缘发黑。', eff:{ hp:-9, water:-4, stamina:-14 } }
          ]}
        ]},
      { id:'dune', title:'爬沙山', tag:'heat',
        text:'沙脊像一道刀锋，走一步滑半步。每一脚都在往下还债。',
        options:[
          { label:'沿着脊线慢慢爬', hint:'省方向', outcomes:[
            { w:2, text:'你终于翻过沙脊，前方便是路线。', eff:{ stamina:-12, progress:1 } },
            { w:1, text:'脚下一滑，你整段滑了下去，只能重来。', eff:{ stamina:-16, morale:-6 } }
          ]},
          { label:'绕到背风面走缓坡', hint:'多走路', outcomes:[
            { w:1, text:'背风面软得像面粉，走得很累，但方向没丢。', eff:{ stamina:-9, progress:1 } }
          ]}
        ]},
      { id:'storm', title:'沙暴来了', tag:'sandstorm',
        text:'西边的天变成一堵黄墙，几秒钟就到眼前。风里带着沙砾，打得冲锋衣噼啪响。',
        options:[
          { label:'原地趴低，背对风向', hint:'不要找背风处', outcomes:[
            { w:2, text:'你趴在地上，用纱布蒙住口鼻。沙暴过了二十分钟，你像从土里挖出来的。', eff:{ stamina:-8, water:-2, morale:-4 } },
            { w:1, text:'沙灌进领口和袖口，你几乎窒息。等风停下来，你咳了很久。', eff:{ hp:-8, stamina:-12, water:-3 } }
          ]},
          { label:'躲到沙丘背面', hint:'可能被埋', outcomes:[
            { w:1, text:'背风面很快积起沙，你不得不一直挖。', eff:{ stamina:-14, morale:-6 } }
          ]}
        ]},
      { id:'water', title:'盐壳下的水', tag:'water',
        text:'你在一处低洼发现湿痕。挖开盐壳，下面有水，但尝一口就知道不能喝。',
        options:[
          { label:'用净水器过滤', req:'filter', hint:'需要净水器', outcomes:[
            { w:2, text:'水过滤后带着苦味，但至少能咽。补水成功。', eff:{ water:4, stamina:-6 } },
            { w:1, text:'滤芯很快被盐堵住。你只挤出一小口。', eff:{ water:1, stamina:-8 } }
          ]},
          { label:'放弃，继续找下一处', hint:'保守', outcomes:[
            { w:1, text:'你把水壶收好，按计划继续走。', eff:{ stamina:-5 } }
          ]}
        ]},
      { id:'night', title:'夜行的星星', tag:'lore',
        text:'夜里温度掉下来，沙不再烫脚。抬头是无风的星空，亮得让人心里发空。远处有一点光，可能是营地，也可能是几十公里外的矿。',
        options:[
          { label:'按方位角走，不追光', hint:'相信数据', outcomes:[
            { w:1, text:'你没有追那点光。两个小时后，你到了预定坐标。', eff:{ progress:1, morale:5, warmth:-4 } }
          ]},
          { label:'朝那点光走', hint:'可能是幻觉', outcomes:[
            { w:2, text:'光越来越远。你放弃了，回到原方向，多耗了半夜。', eff:{ stamina:-14, water:-3, morale:-6 } },
            { w:1, text:'那是一处废弃的井架。你在下面避了风，却在旁边发现了一具风干的骆驼。', eff:{ morale:-10, warmth:4 } }
          ]}
        ]}
    ],

    forest: [
      { id:'fog', title:'雾从林子里出来', tag:'fog',
        text:'雾不是飘过来的，是从地面长出来的。十米外的{NAME}变成一片模糊的绿。',
        options:[
          { label:'停下，等雾散', hint:'最安全', outcomes:[
            { w:1, text:'你在一棵树下等了四十分钟，雾稍微薄了一点。', eff:{ warmth:-4, morale:-3 } }
          ]},
          { label:'贴着溪谷往下走', hint:'溪水是方向', outcomes:[
            { w:2, text:'溪水把你带到一条熟悉的林道。', eff:{ stamina:-6, progress:1 } },
            { w:1, text:'溪谷越走越陡，你不得不爬回山脊。', eff:{ stamina:-12, morale:-5 } }
          ]},
          { label:'用 GPS 打点前进', req:'gps', hint:'需要 GPS', outcomes:[
            { w:1, text:'屏幕上那条线微微发抖，但它把你带出了雾区。', eff:{ progress:1, stamina:-4 } }
          ]}
        ]},
      { id:'rain', title:'雨没有要停的意思', tag:'rain',
        text:'雨下了一整夜。睡袋边缘已经湿了，冲锋衣内壁全是凝水。',
        options:[
          { label:'冒雨继续走，保持体温', hint:'不能停', outcomes:[
            { w:2, text:'你一直走到午后，身体反而暖了起来。', eff:{ progress:1, stamina:-8, warmth:-5 } },
            { w:1, text:'你在雨里停了太久，牙齿开始打战。', eff:{ warmth:-14, stamina:-10 } }
          ]},
          { label:'搭起天幕，等雨停', hint:'消耗一天', outcomes:[
            { w:1, text:'你把天幕拉在树下，缩在里面听雨。夜里雨小了。', eff:{ stamina:6, food:-1, water:-1 } }
          ]}
        ]},
      { id:'leech', title:'蚂蟥', tag:'leech',
        text:'脱鞋的时候，你发现脚踝上有三条黑色的线，正在慢慢变粗。',
        options:[
          { label:'用盐或火慢慢取下', hint:'别硬拽', outcomes:[
            { w:1, text:'它们松开了。血又流了一会儿，你压住了伤口。', eff:{ hp:-4, morale:-3 } }
          ]},
          { label:'直接扯掉', hint:'会感染', outcomes:[
            { w:1, text:'伤口留了很久的血，你开始有点头晕。', eff:{ hp:-7, injury:'脚踝咬伤' } }
          ]},
          { label:'喷驱虫剂，扎紧裤脚', req:'insect', hint:'需要驱虫剂', outcomes:[
            { w:1, text:'剩下的蚂蟥都在裤脚外面打转，没能进来。', eff:{ morale:4 } }
          ]}
        ]},
      { id:'bear', title:'树上的抓痕', tag:'wildlife',
        text:'树干一米八的位置有五道新鲜的爪痕，树皮还在掉。你闻到了一点点腐肉味。',
        options:[
          { label:'安静后退，绕开这片林子', hint:'正确', outcomes:[
            { w:1, text:'你退了两百米，绕了一个大圈。没有再听见声音。', eff:{ stamina:-10, progress:1, morale:-4 } }
          ]},
          { label:'大声说话，让它知道你', hint:'熊也怕人', outcomes:[
            { w:2, text:'你边走边喊，林子安静得反常，但没有东西跟上来。', eff:{ stamina:-4, progress:1 } },
            { w:1, text:'灌木里响了一下。你几乎跑了起来，摔了一跤。', eff:{ hp:-6, stamina:-12, injury:'膝盖撞伤' } }
          ]},
          { label:'把防熊喷雾握在手里', req:'bearspray', hint:'需要防熊喷雾', outcomes:[
            { w:1, text:'你握着喷雾走过那片林子，什么也没发生，但手一直在出汗。', eff:{ progress:1, morale:-2 } }
          ]}
        ]},
      { id:'clearing', title:'一块没有树的空地', tag:'lore',
        text:'林子中间突然空出一块圆形空地，草长得齐膝高，边缘整齐得不像自然形成的。',
        options:[
          { label:'绕开它', hint:'别多想', outcomes:[
            { w:1, text:'你绕了半圈，回头看了一眼。空地上什么也没有。', eff:{ stamina:-3, morale:-4 } }
          ]},
          { label:'走进去看看', hint:'也许有东西', outcomes:[
            { w:2, text:'空地里只有一截埋在土里的旧木桩，上面刻着一个数字：7。', eff:{ morale:-8, progress:1 } },
            { w:1, text:'你走到中央，忽然听见背后的树里有东西动了一下。你几乎是跑出来的。', eff:{ stamina:-10, morale:-12 } }
          ]}
        ]}
    ],

    gorge: [
      { id:'river', title:'过河', tag:'river',
        text:'水比昨天大了。对岸的标记还在，但中间的河水已经漫过了腰线。',
        options:[
          { label:'结组，用绳子保护', req:'rope', hint:'需要绳子', outcomes:[
            { w:2, text:'你们把绳子系在石头上，一个一个过去。水流很急，但没人被冲走。', eff:{ stamina:-10, warmth:-10, progress:1 } },
            { w:1, text:'中间那一步踩空，你被水推出两米，绳子把你拉住了。', eff:{ hp:-6, stamina:-14, warmth:-16 } }
          ]},
          { label:'沿河岸找更浅的地方', hint:'耗时', outcomes:[
            { w:2, text:'你往上走了一公里，找到一处浅滩。', eff:{ stamina:-12, progress:1, warmth:-4 } },
            { w:1, text:'上游的河岸是断崖。你只能回来，天已经快黑了。', eff:{ stamina:-14, morale:-6 } }
          ]},
          { label:'直接下河，尽量快', hint:'很危险', outcomes:[
            { w:2, text:'你被水冲得站不稳，但硬是蹚了过去。', eff:{ stamina:-16, warmth:-18, progress:1 } },
            { w:1, text:'水没到胸口，脚下一滑。你被冲了十几米，撞在石头上。', eff:{ hp:-16, warmth:-24, injury:'肋部撞伤', stamina:-18 } }
          ]}
        ]},
      { id:'landslide', title:'塌方区', tag:'landslide',
        text:'前面的整片坡滑了下来，碎石堆一直铺到崖边。上面还在零星落石。',
        options:[
          { label:'观察十分钟，快速通过', hint:'不停留', outcomes:[
            { w:2, text:'你挑了一个安静的窗口，快速穿过碎石堆。', eff:{ stamina:-8, progress:1 } },
            { w:1, text:'半路落下一块拳头大的石头，砸在背包上。你被撞得跪了下去。', eff:{ hp:-9, stamina:-12 } }
          ]},
          { label:'爬到上方绕行', hint:'更远', outcomes:[
            { w:1, text:'你爬高绕过了塌方，多耗了两个小时。', eff:{ stamina:-14, progress:1, warmth:-4 } }
          ]}
        ]},
      { id:'bridge', title:'藤桥', tag:'river',
        text:'藤桥在风里晃，木板缺了三块。下面的水声很大，听不清对岸的人说话。',
        options:[
          { label:'一次过一个人，扶稳主藤', hint:'规范', outcomes:[
            { w:2, text:'你一步一步走过去，藤桥在脚下晃得很规律。', eff:{ stamina:-6, progress:1, morale:-4 } },
            { w:1, text:'一块木板断了。你抓住藤条，把身体拉回桥上。', eff:{ hp:-6, stamina:-12, morale:-8 } }
          ]},
          { label:'走下游的浅滩', hint:'绕路', outcomes:[
            { w:1, text:'你沿下游走了一公里，找到一处能蹚过的浅滩。', eff:{ stamina:-12, progress:1 } }
          ]}
        ]},
      { id:'storm', title:'峡谷里的暴雨', tag:'rain',
        text:'雨在谷壁上汇成瀑布，原本干燥的沟底几分钟就变成了溪流。',
        options:[
          { label:'立刻爬上高处', hint:'山洪不等人', outcomes:[
            { w:1, text:'你抓着树根爬上了十几米。半小时后，沟底已经被水填满。', eff:{ stamina:-14, warmth:-8 } }
          ]},
          { label:'躲进崖壁下的凹处', hint:'可能被淹', outcomes:[
            { w:2, text:'凹处暂时没进水，但水声越来越近，你一夜没睡。', eff:{ stamina:-6, warmth:-6, morale:-8 } },
            { w:1, text:'水漫了进来。你半夜逃到更高的岩台，睡袋全湿。', eff:{ warmth:-18, stamina:-12, hp:-5 } }
          ]}
        ]},
      { id:'voices', title:'雾里的回声', tag:'nav',
        text:'雾里有人说话，像是两个人在争论路线。你喊了一声，声音在山谷里来回撞了几次。',
        options:[
          { label:'不回应，按自己的方向走', hint:'可能是回音', outcomes:[
            { w:1, text:'声音渐渐远了。你继续向前，心里发凉。', eff:{ morale:-5, progress:1 } }
          ]},
          { label:'朝人声走过去', hint:'也许真有人', outcomes:[
            { w:2, text:'你走过去，只有一片湿漉漉的岩壁。声音停了。', eff:{ stamina:-10, morale:-10 } },
            { w:1, text:'雾里站着一个人影，你走近时，它像被风吹散一样消失了。你后退时被石头绊倒。', eff:{ hp:-8, morale:-16, injury:'脚踝扭伤' } }
          ]}
        ]}
    ],

    caldera: [
      { id:'rim', title:'火山口的边缘', tag:'storm',
        text:'火山口的边缘是一圈松散的火山渣，风从口子里往上冒。下面很深，什么都看不见。',
        options:[
          { label:'离边缘五米走，不做停留', hint:'安全', outcomes:[
            { w:1, text:'你保持距离，很快通过了最危险的一段。', eff:{ stamina:-6, progress:1, warmth:-4 } }
          ]},
          { label:'走到边缘看一眼', hint:'值得吗', outcomes:[
            { w:2, text:'你趴下身子看了一眼，下面全是白雾。心跳很快。', eff:{ morale:6, warmth:-6 } },
            { w:1, text:'火山渣在脚下塌了。你抓住一块岩石，半个身子悬在口子上。', eff:{ hp:-12, stamina:-14, morale:-12 } }
          ]}
        ]},
      { id:'snow', title:'雪层下的热气', tag:'ice',
        text:'雪面某处没有积雪，露出一圈湿黑的石头，风里带着硫磺味。',
        options:[
          { label:'绕开，雪壳可能很薄', hint:'正确', outcomes:[
            { w:1, text:'你绕了一大圈。回头看，那块地方的白气还在往上冒。', eff:{ stamina:-8, progress:1 } }
          ]},
          { label:'踩上去试试温度', hint:'别学', outcomes:[
            { w:2, text:'鞋底陷进去，热水灌进了鞋里。你跳出来，脚背已经烫红。', eff:{ hp:-8, warmth:4, injury:'脚背烫伤' } },
            { w:1, text:'雪壳彻底塌了。你整个小腿浸进滚烫的水汽里。', eff:{ hp:-16, stamina:-12, injury:'小腿烫伤' } }
          ]}
        ]},
      { id:'storm', title:'风口上的暴雪', tag:'storm',
        text:'火山口的地形把风挤成一股，雪粒横着打过来，能见度不到三米。',
        options:[
          { label:'原地挖雪洞', hint:'保命', outcomes:[
            { w:2, text:'你挖出一个雪洞，把睡袋塞进去。风声在外面变成了闷响。', eff:{ warmth:-6, stamina:-10 } },
            { w:1, text:'雪洞塌了一角。你花了一小时才重新挖通。', eff:{ warmth:-12, stamina:-14 } }
          ]},
          { label:'沿着绳索标记下撤', req:'gps', hint:'需要 GPS', outcomes:[
            { w:1, text:'你沿着屏幕上的轨迹退回山口，风在背后推着你。', eff:{ progress:-1, stamina:-8, warmth:-6 } }
          ]}
        ]},
      { id:'dawn', title:'口子里的日出', tag:'lore',
        text:'天边发白，火山口里升起的不是雾，是被晨光染红的水汽。那一瞬间，{NAME}安静得不像地球。',
        options:[
          { label:'坐下来等它升起来', hint:'看完整', outcomes:[
            { w:1, text:'你看了整整二十分钟。身体很冷，心里却很满。', eff:{ morale:14, warmth:-8 } }
          ]},
          { label:'趁光线好多走一段', hint:'务实', outcomes:[
            { w:1, text:'你借着光推进了一段，路线比想象中清楚。', eff:{ progress:1, stamina:-5 } }
          ]}
        ]},
      { id:'steps', title:'雪上的两行脚印', tag:'nav',
        text:'雪地上有两行脚印，从火山口方向过来，走到一半就消失了，中间没有任何挣扎的痕迹。',
        options:[
          { label:'顺着脚印走一小段', hint:'也许能找到人', outcomes:[
            { w:2, text:'脚印在一处雪坡前断了。坡下什么也没有。', eff:{ morale:-8, stamina:-6 } },
            { w:1, text:'脚印走到一半变成了拖痕，然后是空的。你停下了。', eff:{ morale:-14, warmth:-4 } }
          ]},
          { label:'避开，按自己的路线走', hint:'别追', outcomes:[
            { w:1, text:'你选择另一侧上坡。回头时，那两行脚印已经被雪盖住。', eff:{ progress:1, morale:-4 } }
          ]}
        ]}
    ],

    glacier: [
      { id:'crevasse', title:'雪桥', tag:'ice',
        text:'前面的雪面平得可疑。你知道下面可能是一条两米宽的裂缝，被新雪盖住了。',
        options:[
          { label:'用冰镐探路，结组通过', req:'rope', hint:'需要绳子', outcomes:[
            { w:2, text:'你探出雪桥的边缘，绕开最薄的地方，安全通过。', eff:{ stamina:-8, progress:1 } },
            { w:1, text:'雪桥在你身后塌了。你趴在冰面上，听见下面很深的水声。', eff:{ stamina:-14, morale:-10 } }
          ]},
          { label:'绕到裂缝边缘，找窄处跨过', hint:'需要判断', outcomes:[
            { w:2, text:'你找到一处只有半米宽的地方，跨了过去。', eff:{ stamina:-6, progress:1 } },
            { w:1, text:'落点雪太软，你陷了进去，靠双手撑住才爬出来。', eff:{ hp:-8, stamina:-16, warmth:-8 } }
          ]},
          { label:'直接走过去', hint:'最危险', outcomes:[
            { w:2, text:'雪面没有响。你的后背全是冷汗。', eff:{ stamina:-4, progress:1, morale:-6 } },
            { w:1, text:'你掉了进去。背包卡在裂缝口，你悬在半空，挣扎了很久才爬出来。', eff:{ hp:-18, stamina:-24, warmth:-12, morale:-18 } }
          ]}
        ]},
      { id:'berg', title:'冰塔林', tag:'ice',
        text:'冰塔像一片蓝色的废墟，每一座都在滴水。偶尔有一声断裂，很脆。',
        options:[
          { label:'快速穿过，不在下面停留', hint:'不要休息', outcomes:[
            { w:2, text:'你低着头快步走完，直到离开冰塔林才敢喘气。', eff:{ stamina:-10, progress:1 } },
            { w:1, text:'一块冰在你旁边砸下来，碎片划破了脸。', eff:{ hp:-9, injury:'面部划伤', stamina:-8 } }
          ]},
          { label:'绕开冰塔林，走侧碛', hint:'更稳', outcomes:[
            { w:1, text:'侧碛的碎石很滑，但你远离了那些蓝色的塔。', eff:{ stamina:-12, progress:1 } }
          ]}
        ]},
      { id:'whiteout', title:'白毛风', tag:'storm',
        text:'风把雪吹成一张白布，天和地没有边界。你伸出手，看不清自己的手套。',
        options:[
          { label:'原地蹲下，插杖定位', hint:'不要动', outcomes:[
            { w:2, text:'你蹲了四十分钟，风慢慢弱下去，地形重新出现。', eff:{ warmth:-14, stamina:-6 } },
            { w:1, text:'风持续了更久。你的手脚开始失去知觉。', eff:{ warmth:-22, hp:-10 } }
          ]},
          { label:'靠 GPS 摸回营地', req:'gps', hint:'需要 GPS', outcomes:[
            { w:1, text:'你盯着那条抖动的线，一步一步走回了帐篷。', eff:{ stamina:-8, warmth:-8, progress:-1 } }
          ]}
        ]},
      { id:'melt', title:'融水沟', tag:'water',
        text:'冰面上有一条半米深的沟，水在下面流。看着不深，但冰壁很滑。',
        options:[
          { label:'跨过去，先用冰镐试对岸', req:'crampon', hint:'需要冰爪', outcomes:[
            { w:1, text:'冰爪咬住对岸，你稳稳跨过。', eff:{ stamina:-5, progress:1 } }
          ]},
          { label:'沿沟往上找窄处', hint:'多走路', outcomes:[
            { w:1, text:'你往上游走了三百米，找到一处只有一掌宽的地方。', eff:{ stamina:-10, progress:1 } }
          ]}
        ]},
      { id:'icefall', title:'冰崩的声音', tag:'avalanche',
        text:'山谷里传来一声闷响，像远处有人推倒了一面墙。你不知道落点在哪。',
        options:[
          { label:'立刻离开谷底，爬上侧坡', hint:'正确', outcomes:[
            { w:1, text:'你爬上了侧坡。几秒后，白色的碎冰冲过你刚才站的地方。', eff:{ stamina:-14, warmth:-6, morale:-8 } }
          ]},
          { label:'站着听，判断方向', hint:'太慢', outcomes:[
            { w:2, text:'你判断错了。冰屑冲到你脚下，把你掀翻。', eff:{ hp:-12, stamina:-12, warmth:-10 } },
            { w:1, text:'落点在另一条沟。你虚惊一场，但腿一直在抖。', eff:{ morale:-6 } }
          ]}
        ]}
    ],

    karst: [
      { id:'cave', title:'洞口的风', tag:'nav',
        text:'崖壁上有一个洞，风从里面吹出来，带着潮气和一种说不出的甜味。',
        options:[
          { label:'只走进去十米，探一探', hint:'不过分', outcomes:[
            { w:2, text:'洞里很干，墙上有人刻的字，日期是三十年前。', eff:{ morale:5, stamina:-4 } },
            { w:1, text:'你的头灯照到一处影子，回头时发现只是石笋。', eff:{ morale:-5 } }
          ]},
          { label:'不进去，继续赶路', hint:'安全', outcomes:[
            { w:1, text:'你离开了那个洞。风在背后吹了很久。', eff:{ progress:1 } }
          ]}
        ]},
      { id:'slip', title:'湿透的石阶', tag:'wet',
        text:'石阶上覆着一层薄薄的青苔，脚一踩就滑。下面就是几米深的石缝。',
        options:[
          { label:'侧身下行，重心压低', hint:'稳', outcomes:[
            { w:2, text:'你侧着身一步一步下，鞋底始终贴着石面。', eff:{ stamina:-8, progress:1 } },
            { w:1, text:'脚下一滑，你坐倒在石阶上，尾巴骨疼得说不出话。', eff:{ hp:-6, stamina:-8 } }
          ]},
          { label:'改成手脚并用', hint:'慢', outcomes:[
            { w:1, text:'你手脚并用，像动物一样爬下去，慢但安全。', eff:{ stamina:-10, progress:1 } }
          ]}
        ]},
      { id:'rain', title:'石缝里的水', tag:'water',
        text:'雨水从岩壁渗下来，在石凹里积成一小汪。水很清，但岩壁上有动物的痕迹。',
        options:[
          { label:'过滤后再喝', req:'filter', hint:'需要净水器', outcomes:[
            { w:1, text:'水过滤后有一点土味，但喝下去没事。', eff:{ water:3 } }
          ]},
          { label:'直接喝', hint:'别学', outcomes:[
            { w:2, text:'水很凉，很甜。你喝了半壶。', eff:{ water:3 } },
            { w:1, text:'半夜你开始腹痛，营地附近没有可以躺平的地方。', eff:{ hp:-10, stamina:-12, morale:-8 } }
          ]},
          { label:'不喝，留着水', hint:'保守', outcomes:[
            { w:1, text:'你把水壶拧紧，继续走。', eff:{ stamina:-4 } }
          ]}
        ]},
      { id:'maze', title:'长得一样的岔路', tag:'nav',
        text:'三条石缝通向三个方向，都有人走过的痕迹。你不知道哪一条是真的。',
        options:[
          { label:'用指南针和地形图判断', req:'map', hint:'需要地形图', outcomes:[
            { w:1, text:'你对照等高线，选了最靠北的一条。半小时后看到了熟悉的标记。', eff:{ progress:1, stamina:-4 } }
          ]},
          { label:'跟着最新鲜的脚印', hint:'也许是人', outcomes:[
            { w:2, text:'脚印把你带回主路，但多绕了一段。', eff:{ progress:1, stamina:-8 } },
            { w:1, text:'脚印在一处石壁前结束了，像是人凭空消失。', eff:{ morale:-12, stamina:-6 } }
          ]}
        ]},
      { id:'night', title:'林间的响动', tag:'wildlife',
        text:'夜里，营地外的落叶被踩响了三次。不是风，风没有那么均匀。',
        options:[
          { label:'打开头灯，照向声源', hint:'确认一下', outcomes:[
            { w:2, text:'光柱里只有一棵树和满地的落叶。', eff:{ morale:-3, stamina:-2 } },
            { w:1, text:'光柱里有一双反光的眼睛，一闪就没了。你一夜没合眼。', eff:{ morale:-12 } }
          ]},
          { label:'不动，握紧防熊喷雾', req:'bearspray', hint:'需要喷雾', outcomes:[
            { w:1, text:'声音绕了营地一圈，然后远了。天亮后，地上有一串很大的脚印。', eff:{ morale:-6, warmth:-4 } }
          ]},
          { label:'装作没听见，继续睡', hint:'心大', outcomes:[
            { w:2, text:'你闭上眼，声音持续了一会儿就停了。', eff:{ morale:-4 } },
            { w:1, text:'有什么东西碰了帐篷一下。你屏住呼吸，直到天亮。', eff:{ morale:-14 } }
          ]}
        ]}
    ]
  };

  /* ---------- 低星：缓和 ---------- */
  const CALM = [
    { id:'c_walk', title:'一段好走的路', tag:'calm',
      text:'路比想象中平，风也温和。远处有鸟叫，脚下是干净的石子。',
      options:[
        { label:'保持节奏，慢慢走', hint:'不急', outcomes:[
          { w:1, text:'你走得很稳，推进了一段，心情也松下来。', eff:{ stamina:-1, progress:1, morale:6 } }
        ]},
        { label:'找块石头坐下来歇会儿', hint:'恢复', outcomes:[
          { w:1, text:'你喝了口水，看了会儿天。', eff:{ stamina:7, water:-1, morale:5 } }
        ]}
      ]},
    { id:'c_berry', title:'野果', tag:'calm',
      text:'灌木上挂着一串紫红色的小果子，鸟吃过，说明没有毒。',
      options:[
        { label:'采一些补充口粮', hint:'小心辨认', outcomes:[
          { w:2, text:'果子有点酸，但能吃。你装了半袋。', eff:{ food:1, morale:6 } },
          { w:1, text:'你尝了一颗，舌头有点麻。赶紧吐掉了。', eff:{ hp:-2, morale:-3 } }
        ]},
        { label:'不采，留着口粮', hint:'保守', outcomes:[
          { w:1, text:'你拍了张照，继续走。', eff:{ morale:3, progress:1 } }
        ]}
      ]},
    { id:'c_shelter', title:'一处背风的平台', tag:'calm',
      text:'一块大石头后面有一片干地，风吹不到，地面平整。',
      options:[
        { label:'就地扎营，早点休息', hint:'舒服', outcomes:[
          { w:1, text:'你把帐篷搭好，煮了一壶热水。这是这几天最舒服的一晚。', eff:{ stamina:10, warmth:8, food:-1, water:-1 } }
        ]},
        { label:'记下位置，继续走', hint:'留着备用', outcomes:[
          { w:1, text:'你在石头上刻了一个记号，然后接着走。', eff:{ progress:1, morale:2 } }
        ]}
      ]}
  ];

  /* ---------- 三星：过渡 ---------- */
  const MID = [
    { id:'m_change', title:'天气在换挡', tag:'storm',
      text:'云层压下来，风向变了。刚才还晴着，现在像要收走整条山谷。',
      options:[
        { label:'加衣，提前扎营', hint:'保守', outcomes:[
          { w:1, text:'你把帐篷扎在背风处。夜里风很大，但你在里面很干。', eff:{ stamina:4, warmth:2, food:-1, water:-1 } }
        ]},
        { label:'抢在变天前多走一段', hint:'赌一把', outcomes:[
          { w:2, text:'你在雨落下来前推进了整整一段。', eff:{ progress:1, stamina:-12, warmth:-6 } },
          { w:1, text:'雨来得比你想的快。你被淋透了，走错了岔路。', eff:{ stamina:-14, warmth:-14, food:-1 } }
        ]}
      ]},
    { id:'m_camp', title:'前任的营地', tag:'lore',
      text:'一处平整的营地，石头压着烧黑的柴，地上有几枚生锈的钉子。至少三年前有人在这里睡过。',
      options:[
        { label:'仔细翻一翻', hint:'也许有用', outcomes:[
          { w:2, text:'你在石缝里摸到一小卷防水火柴，还能用。', eff:{ item:'lighter', morale:5 } },
          { w:1, text:'什么也没有，只有一只被雨泡烂的鞋。', eff:{ morale:-4 } }
        ]},
        { label:'直接借用这块地', hint:'省事', outcomes:[
          { w:1, text:'你在这里扎营，睡得比预想的踏实。', eff:{ stamina:8, warmth:4 } }
        ]}
      ]},
    { id:'m_trail', title:'两个方向', tag:'nav',
      text:'一条路通向山脊，一条路通向溪谷，都有人走过的痕迹。地图上只有一条线。',
      options:[
        { label:'按地图走山脊', req:'map', hint:'需要地图', outcomes:[
          { w:1, text:'山脊的路偏长，但视线好，你确认了方向。', eff:{ progress:1, stamina:-8 } }
        ]},
        { label:'跟着痕迹走溪谷', hint:'更快', outcomes:[
          { w:2, text:'溪谷的路更近，你在天黑前接上了主线。', eff:{ progress:1, stamina:-6 } },
          { w:1, text:'溪谷走到一半，痕迹断了。你被迫爬回山脊。', eff:{ stamina:-14, morale:-5 } }
        ]}
      ]}
  ];

  /* ---------- 四五星：惊悚 ---------- */
  const HORROR = [
    { id:'h_steps', title:'多出来的脚步声', tag:'horror', once:true,
      text:'走了两个小时，你一直听见身后有脚步声。你停下，它也停下；你走，它也走。节奏和你完全一样。',
      options:[
        { label:'猛地回头', hint:'确认', outcomes:[
          { w:2, text:'身后只有碎石和风。你继续走，脚步声也继续。', eff:{ morale:-12, stamina:-4 } },
          { w:1, text:'你回头的一瞬间，看见一个和你一样背着包的人影，正转过身去。它的背包和你的同款。', eff:{ morale:-22, hp:-5, flag:'shadow' } }
        ]},
        { label:'不回头，加快脚步', hint:'别去看', outcomes:[
          { w:1, text:'你走得很快，直到听见自己的心跳比脚步声还大。', eff:{ stamina:-12, morale:-8 } }
        ]},
        { label:'停下来，对着空山喊一声', hint:'试试', outcomes:[
          { w:2, text:'回声传回来两次。第二次，比你喊的晚了一点。', eff:{ morale:-14, stamina:-3 } },
          { w:1, text:'回应你的是一个女人的声音，很轻，说了三个字。你没听清，也不敢再问。', eff:{ morale:-20, warmth:-6 } }
        ]}
      ]},
    { id:'h_tent', title:'不该存在的帐篷', tag:'horror', once:true,
      text:'一处背风洼地里立着一顶帐篷，颜色褪得发白。你喊了两声，没有人应。拉链是拉开的，里面睡袋鼓着，像有人。',
      options:[
        { label:'拉开门看一眼', hint:'你会后悔', outcomes:[
          { w:2, text:'睡袋里塞的是旧衣服和一本潮掉的笔记本。最后一页写着：“它跟着我三天了。”', eff:{ morale:-18, item:'map' } },
          { w:1, text:'睡袋里是空的，但有一个人形的凹陷还没弹起来。你后退时，凹陷慢慢鼓了回去。', eff:{ morale:-24, hp:-6 } }
        ]},
        { label:'离开，不碰任何东西', hint:'正确', outcomes:[
          { w:1, text:'你绕开帐篷。走了两百米回头，那顶帐篷还在，但门口站着一个人。', eff:{ morale:-16, stamina:-6 } }
        ]}
      ]},
    { id:'h_radio', title:'无线电里的敲击声', tag:'horror',
      text:'夜里，对讲机在没有信号的地方响了三下敲击。你按下通话键问了一句，对面沉默了很久，然后又是三下。',
      options:[
        { label:'关掉它', hint:'别回', outcomes:[
          { w:1, text:'你关了机。黑暗里安静得过分，你整夜没有睡。', eff:{ morale:-10, stamina:-8 } }
        ]},
        { label:'回敲三下', hint:'回应它', outcomes:[
          { w:2, text:'对面回了六下。然后是一段很长的杂音，像有人在里面呼吸。', eff:{ morale:-18, warmth:-6 } },
          { w:1, text:'对面说话了，用的是你自己的声音，说的是：“别回头。”', eff:{ morale:-26, hp:-6 } }
        ]},
        { label:'用卫星电话求援', req:'satphone', hint:'需要卫星电话', outcomes:[
          { w:1, text:'卫星电话接通了。调度员沉默了一会儿，说：这个坐标没有登记过任何队伍。', eff:{ morale:-12, flag:'rescued' } }
        ]}
      ]},
    { id:'h_count', title:'你数不清有几顶帐篷', tag:'horror', once:true,
      text:'雾散开的一瞬，你看见前方坡上有一排帐篷，一模一样的颜色，一模一样的角度。你数了一遍是六顶，再看变成了七顶。',
      options:[
        { label:'绕开，绝不靠近', hint:'理智', outcomes:[
          { w:1, text:'你宁可多走两个小时。绕行时，你一直感觉那排帐篷在跟着你转向。', eff:{ stamina:-16, morale:-10 } }
        ]},
        { label:'走过去，找最近的一顶', hint:'也许有人', outcomes:[
          { w:2, text:'每顶帐篷里都有一本日记，日期相同，字迹相同：今天又数错了。', eff:{ morale:-20, item:'battery' } },
          { w:1, text:'你走到最后一顶帐篷前，里面传来拉链被拉开的声音。你转身就跑。', eff:{ stamina:-16, morale:-26, hp:-8 } }
        ]}
      ]},
    { id:'h_mirror', title:'水洼里的倒影', tag:'horror',
      text:'你低头喝水，看见水里的自己慢了半拍才抬头。',
      options:[
        { label:'把水搅乱，立刻离开', hint:'别再看', outcomes:[
          { w:1, text:'水纹乱了，倒影也乱了。你收拾东西就走，没再回头。', eff:{ morale:-12, stamina:-6 } }
        ]},
        { label:'再等一秒，看清楚', hint:'不要', outcomes:[
          { w:2, text:'倒影先站了起来。你还没动。', eff:{ morale:-18, hp:-4 } },
          { w:1, text:'水里的你笑着对你摇了摇头，伸手指了指你身后的方向。你真的回头了。', eff:{ morale:-28, warmth:-8, flag:'seen' } }
        ]}
      ]},
    { id:'h_after', title:'它没有跟上来', tag:'horror', once:true,
      text:'你躲进岩缝里屏住呼吸。声音过去了，脚步匀匀地走远，可是你分明看见，岩缝外面多了一道影子，一直没有动。',
      options:[
        { label:'数到一百，再出去', hint:'等', outcomes:[
          { w:1, text:'你数了很久。出去时，地上只有一小片湿痕，像有人在这里站了很久。', eff:{ morale:-12, stamina:-6 } }
        ]},
        { label:'直接冲出去，往路线跑', hint:'赌', outcomes:[
          { w:2, text:'你跑了三百米，什么都没追上你。', eff:{ stamina:-16, morale:-8, progress:1 } },
          { w:1, text:'你撞上了什么，冰冷、湿，像一件挂着的外套。你摔倒在地，手掌擦破了。', eff:{ hp:-9, stamina:-14, injury:'手掌擦伤', morale:-16 } }
        ]}
      ]}
  ];

  /* ---------- 本地传闻（每个坐标一条） ---------- */
  function signature(loc) {
    if (!loc.legend) return null;
    return {
      id:'legend', title:'关于' + loc.name + '的传闻', tag:'lore', once:true,
      text: loc.legend + ' 你把这句话在脑子里过了一遍，风正好停下来。',
      options:[
        { label:'当真，顺着传闻试一次', hint:'也许有东西', outcomes:[
          { w:2, text:'你照着做了。什么奇迹也没发生，但你在原地捡到了一小段还能用的绳子。', eff:{ item:'rope', morale:8 } },
          { w:1, text:'你照着做了。什么都没有，只有一种被注视的感觉，从后颈一直凉到背心。', eff:{ morale:-14, warmth:-5 } }
        ]},
        { label:'不当真，继续赶路', hint:'理性', outcomes:[
          { w:1, text:'你摇了摇头，继续走。传闻就留在身后，像一块没捡起的石头。', eff:{ morale:3, progress:1 } }
        ]}
      ]
    };
  }

  /* ---------- 组装 ---------- */
  function build(loc) {
    const group = (SCENE[loc.scene] || SCENE.ridge).map(t => Object.assign({}, t));
    if (loc.level >= 4) group.push.apply(group, HORROR.map(t => Object.assign({}, t)));
    else if (loc.level === 3) group.push.apply(group, MID.map(t => Object.assign({}, t)));
    else group.push.apply(group, CALM.map(t => Object.assign({}, t)));

    const sig = signature(loc);
    if (sig) group.push(sig);

    return group.map(t => {
      const ev = {
        id: loc.id + '_' + t.id,
        title: fill(t.title, loc),
        tag: t.tag,
        once: t.once !== false,
        text: fill(t.text, loc),
        options: t.options.map(o => ({
          label: fill(o.label, loc),
          hint: o.hint,
          req: o.req,
          outcomes: o.outcomes.map(oc => ({
            w: oc.w,
            text: fill(oc.text, loc),
            eff: oc.eff || {},
            next: oc.next ? fill(oc.next, loc) : null
          }))
        }))
      };
      return ev;
    });
  }

  let built = 0;
  LOCATIONS.forEach(loc => {
    if (EVENTS[loc.id]) return;      // 已有手写事件组
    const group = build(loc);
    if (!group.length) return;
    EVENTS[loc.id] = group;
    built += 1;
  });
  window.EVENTS_BUILT = built;
})();
