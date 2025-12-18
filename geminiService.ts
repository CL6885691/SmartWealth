
import { GoogleGenAI, Type } from "@google/genai";
import { BankAccount, Transaction, Category } from "./types";

// Always use the required initialization format for @google/genai
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (
  accounts: BankAccount[],
  transactions: Transaction[],
  categories: Category[]
) => {
  // Financial analysis is a complex task requiring professional reasoning
  const accountSummary = accounts.map(a => `${a.name}: ${a.balance} ${a.currency}`).join(', ');
  const recentTransactions = transactions.slice(-15).map(t => {
    const cat = categories.find(c => c.id === t.categoryId)?.name;
    return `${t.date}: ${t.type} ${t.amount} (${cat || '未分類'}) - ${t.note}`;
  }).join('; ');

  const prompt = `
    你是一位資深的個人理財顧問。
    用戶目前帳戶狀態: ${accountSummary}
    最近交易紀錄: ${recentTransactions}
    
    請深入分析用戶的消費習慣，特別注意是否有過度消費、收入來源單一或儲蓄率不足的問題。
    請根據數據給予 3 個「具體、可執行、具備理財專業度」的建議。
  `;

  try {
    // Correct usage of generateContent with both model name and prompt configuration
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: '理財現況深度分析摘要' },
            advice: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: '三個專業理財行動建議' 
            }
          },
          required: ['summary', 'advice'],
          propertyOrdering: ["summary", "advice"]
        }
      }
    });

    // Directly access the text property as per the latest SDK guidelines (not a method call)
    const jsonStr = response.text || '{}';
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini AI Error:", error);
    // Graceful fallback for the UI
    return {
      summary: "AI 顧問分析暫時無法使用，請稍後再試。",
      advice: ["定期檢視帳單", "減少非必要開支", "規劃多元收入"]
    };
  }
};
