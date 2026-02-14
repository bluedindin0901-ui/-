import { GoogleGenAI } from "@google/genai";
import { ReadingRequest, ReadingMode } from '../types';

export const getTarotReading = async (request: ReadingRequest): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const modeDescriptions = {
    [ReadingMode.SINGLE]: "單張指引 (One Card Oracle)",
    [ReadingMode.THREE_TRIANGLE]: "聖三角牌陣 (Holy Triangle: Past, Present, Future)",
    [ReadingMode.TWO_PATHS]: "二擇一牌陣 (Two Paths: Choice A vs Choice B)",
    [ReadingMode.RELATIONSHIP]: "關係發展牌陣 (Relationship Spread)"
  };

  const cardsDescription = request.cards.map((card, index) => {
    let positionName = "指引";
    
    if (request.mode === ReadingMode.THREE_TRIANGLE) {
      positionName = index === 0 ? "過去 (The Cause)" : index === 1 ? "現在 (Current Situation)" : "未來 (The Outcome)";
    } else if (request.mode === ReadingMode.RELATIONSHIP) {
      const pos = ["您的狀態", "對方的狀態", "關係現狀", "未來發展"];
      positionName = pos[index] || `位置${index + 1}`;
    } else if (request.mode === ReadingMode.TWO_PATHS) {
      const pos = ["核心狀況/現況", "選擇A的過程", "選擇A的結果", "選擇B的過程", "選擇B的結果"];
      positionName = pos[index] || `位置${index + 1}`;
    }

    return `${index + 1}. [${positionName}]：${card.data.name} (${card.isReversed ? '逆位' : '正位'})\n   - 英文牌名: ${card.data.englishName}`;
  }).join('\n    ');

  const prompt = `
    你是一位專業且直覺敏銳的塔羅牌占卜師。你的任務是回應使用者的問題，針對抽出的牌陣進行解讀。

    【求卜者資訊】
    問題：${request.question || "求卜者心中所想，未具體說明"}
    占卜模式：${modeDescriptions[request.mode]}

    【抽出的牌陣】
    ${cardsDescription}

    請根據上述資訊，為求卜者進行解讀。使用**繁體中文**回答。

    【輸出格式要求】
    1. 請嚴格依照以下段落格式輸出。
    2. **重要：請完全不要使用 Markdown 的粗體語法（即不要使用 **文字** 或 __文字__）。**
    3. 請使用純文字，並利用換行和符號（如 「」 或 > ）來區隔重點即可，保持視覺乾淨。

    1. 牌陣總覽
    (請依序列出每一張牌，並用一句話解釋其核心意義)
    • [位置名稱]：[牌名] ([正/逆]位)
      [一句話簡單解釋這張牌在當下對應位置的重點意義]

    2. 深入牌意解析
    關鍵字：[綜合關鍵字]
    核心訊息：[針對每一張牌在該位置的含義進行詳細解析]
    (如果是二擇一牌陣，請明確比較路徑A與路徑B的優劣)

    3. 對你的回應
    [結合使用者的問題與牌陣含義，進行深入、流暢的敘事解讀。請連結牌與牌之間的關係，而不只是分開解釋。語氣要神秘但具備同理心。]

    4. 宇宙的建議
    [具體的行動建議或思考方向]

    5. 溫柔提醒
    > [一句溫暖、充滿力量的金句，作為結尾]

    (請保持回答在 600-900 字之間，語氣優雅、療癒。)
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    return response.text || "塔羅之靈暫時沈默（無回應）。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "連結宇宙的訊號微弱，請稍後再試。";
  }
};