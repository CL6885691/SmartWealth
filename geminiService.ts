
import { GoogleGenAI, Type } from "@google/genai";
import { BankAccount, Transaction, Category } from "./types";

// Always initialize the Gemini client with process.env.API_KEY inside the function.
// Initialization and model calls follow the @google/genai guidelines.

export const getFinancialAdvice = async (
  accounts: BankAccount[],
  transactions: Transaction[],
  categories: Category[]
) => {
  // Initialize the Gemini client inside the function scope to ensure it always uses the most up-to-date environment configuration.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
    // Using gemini-3-pro-preview for complex reasoning and analysis task.
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

    // Directly access the .text property of the GenerateContentResponse.
    const jsonStr = response.text || '{}';
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return {
      summary: "AI 顧問分析暫時無法使用，請檢查財務紀錄或稍後再試。",
      advice: ["定期檢視帳單", "減少非必要開支", "規劃多元收入"]
    };
  }
};
