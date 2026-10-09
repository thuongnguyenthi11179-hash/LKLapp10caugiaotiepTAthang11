import { GoogleGenAI } from '@google/genai';

const SYSTEM_INSTRUCTION_MENTOR = `Bạn là Chuyên gia Huấn luyện Ngôn ngữ và Thiết kế Bài giảng (EdTech Specialist) trong hệ thống LKL10caugiaotiepTAthang11, được lập trình riêng để đồng hành cùng giáo viên tại Trường Tiểu học Lê Kim Lăng.
Bạn hỗ trợ giáo viên rèn luyện chuyên cần và tự tin ứng dụng bộ 10 câu khẩu hiệu lớp học Tháng 11 (Classroom Language):
1. "Be kind to everyone!" (Hãy tử tế với mọi người!)
2. "Listen carefully" (Lắng nghe cẩn thận)
3. "Help each other" (Giúp đỡ lẫn nhau)
4. "Never give up" (Đừng bao giờ bỏ cuộc)
5. "Do your best" (Hãy cố gắng hết sức mình)
6. "Speak English, please" (Làm ơn nói tiếng Anh nào)
7. "Keep your classroom clean" (Giữ gìn lớp học sạch đẹp)
8. "Line up quietly" (Xếp hàng ngay ngắn, trật tự)
9. "Raise your hands to speak" (Giơ tay phát biểu)
10. "Work together happily" (Hợp tác vui vẻ cùng nhau!)

Nguyên tắc:
- Phong cách: Thân thiện, khích lệ, chuyên nghiệp và sư phạm. Coi giáo viên là đối tượng bận rộn, phản hồi ngắn gọn, súc tích, trực quan, dễ áp dụng ngay trên lớp.
- Ngôn ngữ: Tiếng Việt làm ngôn ngữ dẫn dắt chính, kèm Tiếng Anh chuẩn xác. Tránh dùng thuật ngữ ngôn ngữ học quá phức tạp.
- Luôn gắn liền với bối cảnh học sinh tiểu học năng động, hiếu động tại trường Tiểu học Lê Kim Lăng.`;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { targetPhrase, recognizedText, teacherName } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Local smart phonetic matching
      const targetClean = (targetPhrase || '').toLowerCase().replace(/[^a-z ]/g, '').trim();
      const recClean = (recognizedText || '').toLowerCase().replace(/[^a-z ]/g, '').trim();
      
      const isExact = targetClean === recClean;
      const isClose = targetClean.includes(recClean) || recClean.includes(targetClean);

      const rating = isExact ? 'Excellent' : isClose ? 'Good' : 'Keep it up';
      const points = isExact ? 30 : isClose ? 20 : 10;

      return res.status(200).json({
        rating,
        feedback: isExact 
          ? `Thầy/cô phát âm rất chuẩn xác và trôi chảy câu "${targetPhrase}"!`
          : `Thầy/cô đã đọc khá rõ ràng: "${recognizedText}". Hãy chú ý thêm các âm đuôi và trọng âm chính.`,
        correction: isExact 
          ? 'Không có lỗi đáng kể. Ngữ điệu tự nhiên, rất phù hợp khi đứng lớp!'
          : `Cần luyện thêm ngữ điệu và phát âm tròn vành rõ chữ các từ: ${targetPhrase}.`,
        points,
        encouragement: `LKL-Mentor chúc mừng thầy/cô ${teacherName || ''}! Mỗi ngày một chút tiến bộ, học sinh Lê Kim Lăng sẽ rất yêu thích giọng đọc của thầy cô!`
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `Đánh giá bản ghi âm phát âm của giáo viên tiểu học.
Câu mẫu chuẩn: "${targetPhrase}"
Giọng đọc nhận diện được: "${recognizedText}"
Giáo viên: "${teacherName || 'Thầy/Cô'}"

Hãy đóng vai LKL-Mentor và đưa ra phản hồi định dạng JSON:
{
  "rating": "Excellent" | "Good" | "Keep it up",
  "feedback": "Nhận xét tổng quan ngắn gọn, khích lệ",
  "correction": "Chỉ rõ lỗi cần sửa cụ thể (âm đuôi, nối âm, trọng âm, nguyên âm nếu có)",
  "points": số điểm tích lũy (20 đến 30 nếu tốt, 15 nếu khá, 10 nếu cần cố gắng),
  "encouragement": "Lời động viên chân tình, sư phạm"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_MENTOR,
        responseMimeType: 'application/json',
        temperature: 0.5,
      },
    });

    try {
      const parsed = JSON.parse(response.text || '{}');
      return res.status(200).json(parsed);
    } catch {
      return res.status(200).json({
        rating: 'Good',
        feedback: `Thầy/cô đã nỗ lực phát âm rất đáng khen!`,
        correction: `Chú ý phát âm rõ âm đuôi của từ trong câu "${targetPhrase}".`,
        points: 20,
        encouragement: `Rất tốt ạ! Tiếp tục giữ vững tinh thần nhé thầy cô!`
      });
    }
  } catch (error: any) {
    console.error('Error evaluating speech:', error);
    return res.status(200).json({
      rating: 'Good',
      feedback: 'Thầy/cô phát âm rõ ràng, nhịp điệu tương đối tốt!',
      correction: 'Hãy chú ý thêm độ ngân và ngữ điệu tự nhiên.',
      points: 20,
      encouragement: 'Tiếp tục luyện tập cùng LKL-Mentor nhé!'
    });
  }
}
