import { TarotCardData, ArcanaType, Suit } from './types';

// ============================================================================
// 🔮 塔羅圖庫：Sacred Texts (PKT) 穩定圖源
// 核心修復：使用正確的檔名後綴 (ac, pa, kn, qu, ki) 取代數字，解決宮廷牌破圖問題
// ============================================================================

const BASE_URL = "https://sacred-texts.com/tarot/pkt/img/";

// 輔助函式：根據牌的屬性產生正確的 Sacred Texts 檔名
const getCardImage = (arcana: ArcanaType, suit: Suit, number: number | string): string => {
    // 1. 大阿爾克那 (Major Arcana): ar00.jpg ~ ar21.jpg
    if (arcana === ArcanaType.MAJOR) {
        const numStr = String(number).padStart(2, '0');
        return `${BASE_URL}ar${numStr}.jpg`;
    }

    // 2. 小阿爾克那 (Minor Arcana)
    // 花色代碼
    const suitCodeMap: Record<string, string> = {
        [Suit.WANDS]: 'wa',
        [Suit.CUPS]: 'cu',
        [Suit.SWORDS]: 'sw',
        [Suit.PENTACLES]: 'pe'
    };
    const s = suitCodeMap[suit];

    // 數字/宮廷代碼
    let n = "";
    if (number === 'Ace') n = 'ac';
    else if (number === 'Page') n = 'pa';
    else if (number === 'Knight') n = 'kn'; // 修正：確保騎士牌使用 kn
    else if (number === 'Queen') n = 'qu';
    else if (number === 'King') n = 'ki';
    else {
        // 數字轉字串代碼 (Two -> 02, Ten -> 10)
        const numMap: Record<string, string> = {
            'Two': '02', 'Three': '03', 'Four': '04', 'Five': '05', 
            'Six': '06', 'Seven': '07', 'Eight': '08', 'Nine': '09', 'Ten': '10'
        };
        n = numMap[String(number)];
    }

    return `${BASE_URL}${s}${n}.jpg`;
};

// ============================================================================
// 🃏 78 張牌原始資料
// ============================================================================
const RAW_DECK_DATA: Omit<TarotCardData, 'image'>[] = [
  // --- Major Arcana ---
  { id: 0, name: "愚者", englishName: "The Fool", arcana: ArcanaType.MAJOR, suit: Suit.NONE, number: 0, keywords: ["開始", "冒險", "天真"] },
  { id: 1, name: "魔術師", englishName: "The Magician", arcana: ArcanaType.MAJOR, suit: Suit.NONE, number: 1, keywords: ["創造", "能力", "專注"] },
  { id: 2, name: "女祭司", englishName: "The High Priestess", arcana: ArcanaType.MAJOR, suit: Suit.NONE, number: 2, keywords: ["直覺", "神秘", "潛意識"] },
  { id: 3, name: "皇后", englishName: "The Empress", arcana: ArcanaType.MAJOR, suit: Suit.NONE, number: 3, keywords: ["豐饒", "母性", "自然"] },
  { id: 4, name: "皇帝", englishName: "The Emperor", arcana: ArcanaType.MAJOR, suit: Suit.NONE, number: 4, keywords: ["權威", "結構", "控制"] },
  { id: 5, name: "教皇", englishName: "The Hierophant", arcana: ArcanaType.MAJOR, suit: Suit.NONE, number: 5, keywords: ["傳統", "信仰", "學習"] },
  { id: 6, name: "戀人", englishName: "The Lovers", arcana: ArcanaType.MAJOR, suit: Suit.NONE, number: 6, keywords: ["愛", "選擇", "和諧"] },
  { id: 7, name: "戰車", englishName: "The Chariot", arcana: ArcanaType.MAJOR, suit: Suit.NONE, number: 7, keywords: ["意志", "勝利", "行動"] },
  { id: 8, name: "力量", englishName: "Strength", arcana: ArcanaType.MAJOR, suit: Suit.NONE, number: 8, keywords: ["勇氣", "耐心", "同理心"] },
  { id: 9, name: "隱士", englishName: "The Hermit", arcana: ArcanaType.MAJOR, suit: Suit.NONE, number: 9, keywords: ["內省", "孤獨", "指引"] },
  { id: 10, name: "命運之輪", englishName: "Wheel of Fortune", arcana: ArcanaType.MAJOR, suit: Suit.NONE, number: 10, keywords: ["改變", "循環", "機運"] },
  { id: 11, name: "正義", englishName: "Justice", arcana: ArcanaType.MAJOR, suit: Suit.NONE, number: 11, keywords: ["公平", "真理", "因果"] },
  { id: 12, name: "倒吊人", englishName: "The Hanged Man", arcana: ArcanaType.MAJOR, suit: Suit.NONE, number: 12, keywords: ["犧牲", "新視角", "等待"] },
  { id: 13, name: "死神", englishName: "Death", arcana: ArcanaType.MAJOR, suit: Suit.NONE, number: 13, keywords: ["結束", "轉變", "重生"] },
  { id: 14, name: "節制", englishName: "Temperance", arcana: ArcanaType.MAJOR, suit: Suit.NONE, number: 14, keywords: ["平衡", "調和", "耐心"] },
  { id: 15, name: "惡魔", englishName: "The Devil", arcana: ArcanaType.MAJOR, suit: Suit.NONE, number: 15, keywords: ["束縛", "物質", "誘惑"] },
  { id: 16, name: "高塔", englishName: "The Tower", arcana: ArcanaType.MAJOR, suit: Suit.NONE, number: 16, keywords: ["劇變", "啟示", "崩壞"] },
  { id: 17, name: "星星", englishName: "The Star", arcana: ArcanaType.MAJOR, suit: Suit.NONE, number: 17, keywords: ["希望", "靈感", "平靜"] },
  { id: 18, name: "月亮", englishName: "The Moon", arcana: ArcanaType.MAJOR, suit: Suit.NONE, number: 18, keywords: ["幻覺", "不安", "潛意識"] },
  { id: 19, name: "太陽", englishName: "The Sun", arcana: ArcanaType.MAJOR, suit: Suit.NONE, number: 19, keywords: ["快樂", "成功", "活力"] },
  { id: 20, name: "審判", englishName: "Judgement", arcana: ArcanaType.MAJOR, suit: Suit.NONE, number: 20, keywords: ["覺醒", "召喚", "重生"] },
  { id: 21, name: "世界", englishName: "The World", arcana: ArcanaType.MAJOR, suit: Suit.NONE, number: 21, keywords: ["完成", "整合", "旅行"] },

  // --- Wands (權杖) ---
  { id: 22, name: "權杖王牌", englishName: "Ace of Wands", arcana: ArcanaType.MINOR, suit: Suit.WANDS, number: "Ace", keywords: ["靈感", "新開始", "行動"] },
  { id: 23, name: "權杖二", englishName: "Two of Wands", arcana: ArcanaType.MINOR, suit: Suit.WANDS, number: "Two", keywords: ["計畫", "決定", "發現"] },
  { id: 24, name: "權杖三", englishName: "Three of Wands", arcana: ArcanaType.MINOR, suit: Suit.WANDS, number: "Three", keywords: ["遠見", "擴展", "合作"] },
  { id: 25, name: "權杖四", englishName: "Four of Wands", arcana: ArcanaType.MINOR, suit: Suit.WANDS, number: "Four", keywords: ["慶祝", "和諧", "家"] },
  { id: 26, name: "權杖五", englishName: "Five of Wands", arcana: ArcanaType.MINOR, suit: Suit.WANDS, number: "Five", keywords: ["衝突", "競爭", "挑戰"] },
  { id: 27, name: "權杖六", englishName: "Six of Wands", arcana: ArcanaType.MINOR, suit: Suit.WANDS, number: "Six", keywords: ["勝利", "認可", "自信"] },
  { id: 28, name: "權杖七", englishName: "Seven of Wands", arcana: ArcanaType.MINOR, suit: Suit.WANDS, number: "Seven", keywords: ["防衛", "堅持", "勇氣"] },
  { id: 29, name: "權杖八", englishName: "Eight of Wands", arcana: ArcanaType.MINOR, suit: Suit.WANDS, number: "Eight", keywords: ["速度", "行動", "消息"] },
  { id: 30, name: "權杖九", englishName: "Nine of Wands", arcana: ArcanaType.MINOR, suit: Suit.WANDS, number: "Nine", keywords: ["韌性", "警戒", "堅持"] },
  { id: 31, name: "權杖十", englishName: "Ten of Wands", arcana: ArcanaType.MINOR, suit: Suit.WANDS, number: "Ten", keywords: ["負擔", "責任", "壓力"] },
  { id: 32, name: "權杖侍者", englishName: "Page of Wands", arcana: ArcanaType.MINOR, suit: Suit.WANDS, number: "Page", keywords: ["探索", "熱情", "消息"] },
  { id: 33, name: "權杖騎士", englishName: "Knight of Wands", arcana: ArcanaType.MINOR, suit: Suit.WANDS, number: "Knight", keywords: ["行動", "冒險", "衝動"] },
  { id: 34, name: "權杖皇后", englishName: "Queen of Wands", arcana: ArcanaType.MINOR, suit: Suit.WANDS, number: "Queen", keywords: ["魅力", "自信", "決心"] },
  { id: 35, name: "權杖國王", englishName: "King of Wands", arcana: ArcanaType.MINOR, suit: Suit.WANDS, number: "King", keywords: ["領導", "遠見", "榮譽"] },

  // --- Cups (聖杯) ---
  { id: 36, name: "聖杯王牌", englishName: "Ace of Cups", arcana: ArcanaType.MINOR, suit: Suit.CUPS, number: "Ace", keywords: ["愛", "情感", "直覺"] },
  { id: 37, name: "聖杯二", englishName: "Two of Cups", arcana: ArcanaType.MINOR, suit: Suit.CUPS, number: "Two", keywords: ["連結", "伴侶", "吸引"] },
  { id: 38, name: "聖杯三", englishName: "Three of Cups", arcana: ArcanaType.MINOR, suit: Suit.CUPS, number: "Three", keywords: ["友誼", "社群", "慶祝"] },
  { id: 39, name: "聖杯四", englishName: "Four of Cups", arcana: ArcanaType.MINOR, suit: Suit.CUPS, number: "Four", keywords: ["冷漠", "沉思", "錯過"] },
  { id: 40, name: "聖杯五", englishName: "Five of Cups", arcana: ArcanaType.MINOR, suit: Suit.CUPS, number: "Five", keywords: ["失落", "悲傷", "遺憾"] },
  { id: 41, name: "聖杯六", englishName: "Six of Cups", arcana: ArcanaType.MINOR, suit: Suit.CUPS, number: "Six", keywords: ["回憶", "純真", "懷舊"] },
  { id: 42, name: "聖杯七", englishName: "Seven of Cups", arcana: ArcanaType.MINOR, suit: Suit.CUPS, number: "Seven", keywords: ["選擇", "幻想", "迷惘"] },
  { id: 43, name: "聖杯八", englishName: "Eight of Cups", arcana: ArcanaType.MINOR, suit: Suit.CUPS, number: "Eight", keywords: ["離開", "尋找", "失望"] },
  { id: 44, name: "聖杯九", englishName: "Nine of Cups", arcana: ArcanaType.MINOR, suit: Suit.CUPS, number: "Nine", keywords: ["滿足", "願望", "快樂"] },
  { id: 45, name: "聖杯十", englishName: "Ten of Cups", arcana: ArcanaType.MINOR, suit: Suit.CUPS, number: "Ten", keywords: ["幸福", "家庭", "和諧"] },
  { id: 46, name: "聖杯侍者", englishName: "Page of Cups", arcana: ArcanaType.MINOR, suit: Suit.CUPS, number: "Page", keywords: ["訊息", "靈感", "夢想"] },
  { id: 47, name: "聖杯騎士", englishName: "Knight of Cups", arcana: ArcanaType.MINOR, suit: Suit.CUPS, number: "Knight", keywords: ["浪漫", "魅力", "想像"] },
  { id: 48, name: "聖杯皇后", englishName: "Queen of Cups", arcana: ArcanaType.MINOR, suit: Suit.CUPS, number: "Queen", keywords: ["慈悲", "關懷", "直覺"] },
  { id: 49, name: "聖杯國王", englishName: "King of Cups", arcana: ArcanaType.MINOR, suit: Suit.CUPS, number: "King", keywords: ["情緒穩定", "外交", "控制"] },

  // --- Swords (寶劍) ---
  { id: 50, name: "寶劍王牌", englishName: "Ace of Swords", arcana: ArcanaType.MINOR, suit: Suit.SWORDS, number: "Ace", keywords: ["清晰", "真相", "新思想"] },
  { id: 51, name: "寶劍二", englishName: "Two of Swords", arcana: ArcanaType.MINOR, suit: Suit.SWORDS, number: "Two", keywords: ["僵局", "決定", "防衛"] },
  { id: 52, name: "寶劍三", englishName: "Three of Swords", arcana: ArcanaType.MINOR, suit: Suit.SWORDS, number: "Three", keywords: ["心碎", "悲傷", "痛苦"] },
  { id: 53, name: "寶劍四", englishName: "Four of Swords", arcana: ArcanaType.MINOR, suit: Suit.SWORDS, number: "Four", keywords: ["休息", "恢復", "沉思"] },
  { id: 54, name: "寶劍五", englishName: "Five of Swords", arcana: ArcanaType.MINOR, suit: Suit.SWORDS, number: "Five", keywords: ["衝突", "失敗", "自私"] },
  { id: 55, name: "寶劍六", englishName: "Six of Swords", arcana: ArcanaType.MINOR, suit: Suit.SWORDS, number: "Six", keywords: ["過渡", "療癒", "前進"] },
  { id: 56, name: "寶劍七", englishName: "Seven of Swords", arcana: ArcanaType.MINOR, suit: Suit.SWORDS, number: "Seven", keywords: ["策略", "欺瞞", "隱密"] },
  { id: 57, name: "寶劍八", englishName: "Eight of Swords", arcana: ArcanaType.MINOR, suit: Suit.SWORDS, number: "Eight", keywords: ["束縛", "困惑", "無力"] },
  { id: 58, name: "寶劍九", englishName: "Nine of Swords", arcana: ArcanaType.MINOR, suit: Suit.SWORDS, number: "Nine", keywords: ["焦慮", "惡夢", "恐懼"] },
  { id: 59, name: "寶劍十", englishName: "Ten of Swords", arcana: ArcanaType.MINOR, suit: Suit.SWORDS, number: "Ten", keywords: ["結束", "背叛", "谷底"] },
  { id: 60, name: "寶劍侍者", englishName: "Page of Swords", arcana: ArcanaType.MINOR, suit: Suit.SWORDS, number: "Page", keywords: ["好奇", "觀察", "心智"] },
  { id: 61, name: "寶劍騎士", englishName: "Knight of Swords", arcana: ArcanaType.MINOR, suit: Suit.SWORDS, number: "Knight", keywords: ["急躁", "直接", "野心"] },
  { id: 62, name: "寶劍皇后", englishName: "Queen of Swords", arcana: ArcanaType.MINOR, suit: Suit.SWORDS, number: "Queen", keywords: ["獨立", "清晰", "敏銳"] },
  { id: 63, name: "寶劍國王", englishName: "King of Swords", arcana: ArcanaType.MINOR, suit: Suit.SWORDS, number: "King", keywords: ["權威", "邏輯", "真理"] },

  // --- Pentacles (錢幣) ---
  { id: 64, name: "錢幣王牌", englishName: "Ace of Pentacles", arcana: ArcanaType.MINOR, suit: Suit.PENTACLES, number: "Ace", keywords: ["機會", "繁榮", "穩定"] },
  { id: 65, name: "錢幣二", englishName: "Two of Pentacles", arcana: ArcanaType.MINOR, suit: Suit.PENTACLES, number: "Two", keywords: ["平衡", "適應", "優先"] },
  { id: 66, name: "錢幣三", englishName: "Three of Pentacles", arcana: ArcanaType.MINOR, suit: Suit.PENTACLES, number: "Three", keywords: ["團隊", "技能", "合作"] },
  { id: 67, name: "錢幣四", englishName: "Four of Pentacles", arcana: ArcanaType.MINOR, suit: Suit.PENTACLES, number: "Four", keywords: ["控制", "安全", "佔有"] },
  { id: 68, name: "錢幣五", englishName: "Five of Pentacles", arcana: ArcanaType.MINOR, suit: Suit.PENTACLES, number: "Five", keywords: ["困難", "貧窮", "孤立"] },
  { id: 69, name: "錢幣六", englishName: "Six of Pentacles", arcana: ArcanaType.MINOR, suit: Suit.PENTACLES, number: "Six", keywords: ["慷慨", "分享", "慈善"] },
  { id: 70, name: "錢幣七", englishName: "Seven of Pentacles", arcana: ArcanaType.MINOR, suit: Suit.PENTACLES, number: "Seven", keywords: ["評估", "收穫", "耐心"] },
  { id: 71, name: "錢幣八", englishName: "Eight of Pentacles", arcana: ArcanaType.MINOR, suit: Suit.PENTACLES, number: "Eight", keywords: ["技能", "細節", "專注"] },
  { id: 72, name: "錢幣九", englishName: "Nine of Pentacles", arcana: ArcanaType.MINOR, suit: Suit.PENTACLES, number: "Nine", keywords: ["富足", "獨立", "享受"] },
  { id: 73, name: "錢幣十", englishName: "Ten of Pentacles", arcana: ArcanaType.MINOR, suit: Suit.PENTACLES, number: "Ten", keywords: ["遺產", "家庭", "傳統"] },
  { id: 74, name: "錢幣侍者", englishName: "Page of Pentacles", arcana: ArcanaType.MINOR, suit: Suit.PENTACLES, number: "Page", keywords: ["學習", "機會", "務實"] },
  { id: 75, name: "錢幣騎士", englishName: "Knight of Pentacles", arcana: ArcanaType.MINOR, suit: Suit.PENTACLES, number: "Knight", keywords: ["勤奮", "責任", "保守"] },
  { id: 76, name: "錢幣皇后", englishName: "Queen of Pentacles", arcana: ArcanaType.MINOR, suit: Suit.PENTACLES, number: "Queen", keywords: ["滋養", "安全", "實際"] },
  { id: 77, name: "錢幣國王", englishName: "King of Pentacles", arcana: ArcanaType.MINOR, suit: Suit.PENTACLES, number: "King", keywords: ["財富", "成功", "可靠"] }
];

export const FULL_DECK: TarotCardData[] = RAW_DECK_DATA.map(card => ({
  ...card,
  image: getCardImage(card.arcana, card.suit, card.number!)
}));

export const PLACEHOLDER_IMG_BACK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"; // Transparent placeholder, handled by CSS

export const MODE_CONFIG = {
  'single': { 
    label: '單張指引', 
    count: 1, 
    desc: '尋求當下靈感、簡單的是非題、每日指引' 
  },
  'three_triangle': { 
    label: '聖三角牌陣', 
    count: 3, 
    desc: '過去的因、現在的狀、未來的果' 
  },
  'two_paths': { 
    label: '二擇一牌陣', 
    count: 5, 
    desc: '面對兩個選擇（A vs B）時的分析與發展' 
  },
  'relationship': { 
    label: '關係發展牌陣', 
    count: 4, 
    desc: '探索您的狀態、對方的狀態、關係現狀與未來' 
  },
};