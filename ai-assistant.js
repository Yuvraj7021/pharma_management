// AI Assistant Service for PharmaFlow
const AI_SYSTEM_PROMPT = `You are an AI assistant integrated into a Pharmacy Management System called PharmaFlow.

ROLE: Pharmacy Operations Intelligence Assistant

PRIMARY OBJECTIVE:
Help pharmacy staff understand inventory status, expiry risks, stock levels, supplier trends, and system alerts.

IMPORTANT CONSTRAINTS:
- You do NOT provide medical advice, diagnosis, prescriptions, or dosage information.
- You do NOT invent or assume data.
- You ONLY use the context explicitly provided to you.
- If data is missing, respond: "This information is not available in the current system data."

ALLOWED TASKS:
- Summarize alerts
- Explain trends (low stock, expiry risk)
- Answer operational questions
- Provide business-friendly explanations
- Suggest non-medical actions (e.g., reorder stock, contact supplier)

FORBIDDEN TASKS:
- Medical recommendations
- Dosage suggestions
- Patient diagnosis
- Legal or regulatory advice

RESPONSE STYLE:
- Clear, Professional, Concise
- Business-oriented
- Bullet points preferred

FAIL-SAFE:
If asked forbidden questions, respond: "I can assist with pharmacy operations and inventory insights, but I cannot provide medical advice."`;

export const getAIResponse = async (userQuery, systemContext) => {
  const contextData = `
CURRENT SYSTEM STATUS:
- Total Medicines: ${systemContext.totalMedicines}
- Expired: ${systemContext.expiredCount}
- Near Expiry (≤30 days): ${systemContext.nearExpiryCount}
- Low Stock (≤10): ${systemContext.lowStockCount}
- Out of Stock: ${systemContext.outOfStockCount}
- Total Patients: ${systemContext.totalPatients}
- Total Suppliers: ${systemContext.totalSuppliers}

TOP ALERTS:
${systemContext.topAlerts.map(a => `- ${a.title}: ${a.message}`).join('\n')}

USER QUERY: ${userQuery}
`;

  // Simple rule-based responses (replace with actual AI API call)
  const query = userQuery.toLowerCase();
  
  // Medical advice detection
  if (query.match(/prescribe|dosage|treat|diagnose|cure|symptom|disease|illness/)) {
    return "I can assist with pharmacy operations and inventory insights, but I cannot provide medical advice, prescriptions, or dosage recommendations. Please consult a licensed healthcare professional.";
  }

  // Inventory queries
  if (query.match(/expired|expiry|expiring/)) {
    return `**Expiry Status:**
- ${systemContext.expiredCount} medicines have expired
- ${systemContext.nearExpiryCount} medicines expiring within 30 days

**Recommended Actions:**
• Review expired items in the Expired Medicines section
• Consider promotional pricing for near-expiry items
• Contact suppliers for fresh stock`;
  }

  if (query.match(/low stock|stock|inventory/)) {
    return `**Stock Status:**
- ${systemContext.lowStockCount} items are low on stock (≤10 units)
- ${systemContext.outOfStockCount} items are out of stock

**Recommended Actions:**
• Review low stock items in Inventory Management
• Place reorder with suppliers
• Update reorder levels if needed`;
  }

  if (query.match(/supplier/)) {
    return `**Supplier Overview:**
- Total Active Suppliers: ${systemContext.totalSuppliers}

**Recommended Actions:**
• Review supplier performance in Suppliers section
• Check delivery schedules
• Negotiate better terms for high-volume items`;
  }

  if (query.match(/patient/)) {
    return `**Patient Overview:**
- Total Registered Patients: ${systemContext.totalPatients}

**Note:** I can provide operational statistics but cannot access or discuss individual patient medical information.`;
  }

  // Default response
  return `I can help you with:
• Inventory status and alerts
• Stock level analysis
• Expiry risk management
• Supplier information
• Operational insights

What specific information do you need?`;
};
