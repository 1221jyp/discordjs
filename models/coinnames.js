const coinNames = {
  BTC: "비트코인",
  ETH: "이더리움",
  XRP: "리플",
  ETC: "이더리움클래식",
  CVC: "시빅",
  DGB: "디지바이트",
  SC: "시아코인",
  SNT: "스테이터스네트워크토큰",
  WAVES: "웨이브",
  NMR: "뉴메레르",
  XEM: "넴",
  QTUM: "퀀텀",
  BAT: "베이직어텐션토큰",
  LSK: "리스크",
  STEEM: "스팀",
  DOGE: "도지코인",
  BNT: "뱅코르",
  XLM: "스텔라루멘",
  ARDR: "아더",
  ARK: "아크",
  STORJ: "스토리지",
  GRS: "그로스톨코인",
  RLC: "아이젝",
  NEO: "네오",
  MTL: "메탈",
  ADA: "에이다",
  MANA: "디센트럴랜드",
  SBD: "스팀달러",
  POWR: "파워렛저",
  BTG: "비트코인골드",
  DNT: "디스트릭트0x",
  ZRX: "제로엑스",
  TRX: "트론",
  TUSD: "트루USD",
  LRC: "루프링",
  ICX: "아이콘",
  EOS: "이오스",
  POLYX: "폴리매쉬",
  ONT: "온톨로지",
  ZIL: "질리카",
  LOOM: "룸네트워크",
  BCH: "비트코인캐시",
  HIFI: "하이파이",
  IOST: "아이오에스티",
  IQ: "아이큐",
  IOTA: "아이오타",
  RVN: "레이븐코인",
  GO: "고체인",
  UPP: "센티넬프로토콜",
  ENJ: "엔진코인",
  ONG: "온톨로지가스",
  GAS: "가스",
  ELF: "엘프",
  KNC: "카이버네트워크",
  MOC: "모스코인",
  BSV: "비트코인에스브이",
  THETA: "쎄타토큰",
  DENT: "덴트",
  QKC: "쿼크체인",
  BTT: "비트토렌트",
  IOTX: "아이오텍스",
  SOLVE: "솔브케어",
  NKN: "엔케이엔",
  META: "메타디움",
  ANKR: "앵커",
  CRO: "크로노스",
  TFUEL: "쎄타퓨엘",
  ORBS: "오브스",
  AERGO: "아르고",
  ATOM: "코스모스",
  TT: "썬더코어",
  CRE: "캐리프로토콜",
  STPT: "에스티피",
  MBL: "무비블록",
  DAI: "다이",
  MKR: "메이커",
  BORA: "보라",
  WAXP: "왁스",
  HBAR: "헤데라",
  MED: "메디블록",
  MLK: "밀크",
  VET: "비체인",
  CHZ: "칠리즈",
  FX: "펑션엑스",
  OGN: "오리진프로토콜",
  XTZ: "테조스",
  HIVE: "하이브",
  HBD: "하이브달러",
  OBSR: "옵저버",
  DKA: "디카르고",
  STMX: "스톰엑스",
  AHT: "아하토큰",
  LINK: "체인링크",
  KAVA: "카바",
  JST: "저스트",
  CHR: "크로미아",
  DAD: "다드",
  TON: "톤",
  CTSI: "카르테시",
  DOT: "폴카닷",
  COMP: "컴파운드",
  SXP: "솔라",
  HUNT: "헌트",
  ONIT: "온버프",
  CRV: "커브",
  ALGO: "알고랜드",
  RSR: "리저브라이트",
  OXT: "오키드",
  PLA: "플레이댑",
  SAND: "샌드박스",
  SUN: "썬",
  QTCON: "퀴즈톡",
  MVL: "엠블",
  REI: "레이",
  AQT: "알파쿼크",
  AXS: "엑시인피니티",
  STRAX: "스트라티스",
  GLM: "골렘",
  FCT2: "피르마체인",
  SSX: "썸씽",
  FIL: "파일코인",
  UNI: "유니스왑",
  INJ: "인젝티브",
  PROM: "프롬",
  VAL: "밸리디티",
  PSG: "파리생제르맹",
  JUV: "유벤투스",
  CBK: "코박토큰",
  FOR: "포튜브",
  BFC: "바이프로스트",
  HPO: "히포크랏",
  CELO: "셀로",
  STX: "스택스",
  NEAR: "니어프로토콜",
  AUCTION: "바운스토큰",
  FLOW: "플로우",
  STRK: "스트라이크",
  PUNDIX: "펀디엑스",
  GRT: "더그래프",
  SNX: "신세틱스",
  USDP: "팍스달러",
  XEC: "이캐시",
  SOL: "솔라나",
  MATIC: "폴리곤",
  AAVE: "에이브",
  "1INCH": "1인치네트워크",
  MASK: "마스크네트워크",
  AUDIO: "오디우스",
  YGG: "일드길드게임즈",
  GTC: "깃코인",
  OCEAN: "오션프로토콜",
  CTC: "크레딧코인",
  LPT: "라이브피어",
  AVAX: "아발란체",
  IMX: "이뮤터블엑스",
  RNDR: "렌더토큰",
  RLY: "랠리",
  T: "쓰레스홀드",
  RAD: "래드웍스",
  AGLD: "어드벤처골드",
  API3: "에이피아이쓰리",
  ARPA: "알파",
  ENS: "이더리움네임서비스",
  GMT: "스테픈",
  APE: "에이프코인",
  RAY: "레이디움",
  APT: "앱토스",
  ACM: "AC밀란",
  AFC: "아스날",
  ATM: "아틀레티코마드리드",
  BAR: "FC바르셀로나",
  CITY: "맨체스터시티",
  INTER: "인터밀란",
  NAP: "나폴리",
  SHIB: "시바이누",
  GAL: "갤럭시",
  ASTR: "아스타",
  BLUR: "블러",
  ACS: "액세스프로토콜",
  MAGIC: "매직",
  ARB: "아비트럼",
  EGLD: "멀티버스엑스",
  SUI: "수이",
  MINA: "미나",
  STG: "스타게이트파이낸스",
  SEI: "세이",
  CYBER: "사이버커넥트",
  GLMR: "문빔",
};

module.exports = coinNames;
