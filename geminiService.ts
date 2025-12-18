
import { GoogleGenAI, Type } from "@google/genai";
import { BankAccount, Transaction, Category } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFinancialAdvice = async (
  accounts: BankAccount[],
  transactions: Transaction[],
  categories: Category[]
) => {
  // Process data for prompt
  const accountSummary = accounts.map(a => `${a.name}: ${a.balance} ${a.currency}`).join(', ');
  const recentTransactions = transactions.slice(-10).map(t => {
    const cat = categories.find(c => c.id === t.categoryId)?.name;
    return `${t.date}: ${t.type} ${t.amount} (${cat})`;
  }).join('; ');

  const prompt = `
    你是一位專業的個人理財顧問。請分析以下用戶的財務數據並給予建議：
    帳戶資訊: ${accountSummary}
    最近交易紀錄: ${recentTransactions}
    
    請提供一段簡短的財務現況分析，並列出 3 個具體的行動建議來幫助用戶儲蓄或優化支出。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: '理財現況摘要' },
            advice: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: '三個具體建議' 
            }
          },
          required: ['summary', 'advice']
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("AI Advice Error:", error);
    return {
      summary: "目前無法連結 AI 顧問，請稍後再試。",
      advice: ["檢查固定支出", "維持緊急預備金", "追蹤每日花費"]
    };
  }
};
