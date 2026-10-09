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
    const { phrase, grade, context } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        scenario: {
          situation: `Trong giờ hoạt động nhóm tại lớp ${grade || 'tiểu học'} Trường Tiểu học Lê Kim Lăng, các em học sinh đang rộn ràng thảo luận nhưng một số bạn còn ngại ngùng hoặc chưa tập trung.`,
          howToUse: `Cô giáo mỉm cười, vỗ tay 2 nhịp thu hút sự chú ý rồi nói vang, rõ ràng: "${phrase}". Sau đó làm động tác mở rộng hai tay mời gọi.`,
          followUp: `Sau khi học sinh đồng thanh nhắc lại, cô hỏi: "Can we do it together, class?" và khuyến khích cả lớp vỗ tay hưởng ứng.`,
          tips: `Học sinh tiểu học phản xạ tốt với nhịp điệu (Chant) và nụ cười khích lệ của giáo viên.`
        }
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

    const prompt = `Hãy tạo một kịch bản ứng dụng sư phạm chuẩn mực cho giáo viên Trường Tiểu học Lê Kim Lăng với khẩu hiệu: "${phrase}".
Khối lớp: ${grade || 'Khối 1-5'}.
Ngữ cảnh cụ thể (nếu có): ${context || 'Tình huống thực tế trong lớp học tiểu học'}.

Yêu cầu xuất ra định dạng JSON thuần túy (không markdown bao quanh) với các trường:
{
  "situation": "Mô tả ngữ cảnh sinh động, chân thực tại trường Lê Kim Lăng",
  "howToUse": "Hướng dẫn cụ thể giáo viên thực hiện: giọng điệu, cử chỉ hình thể (TPR), ánh mắt, thời điểm nói",
  "followUp": "Câu hỏi gợi mở hoặc phản xạ tiếp theo cho học sinh",
  "tips": "Mẹo sư phạm tâm lý lứa tuổi tiểu học"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_MENTOR,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    try {
      const parsed = JSON.parse(response.text || '{}');
      return res.status(200).json({ scenario: parsed });
    } catch {
      return res.status(200).json({
        scenario: {
          situation: `Tình huống tại lớp học trường Tiểu học Lê Kim Lăng khi sử dụng "${phrase}".`,
          howToUse: `Giáo viên nói với ngữ điệu rõ ràng, kết hợp ngôn ngữ cơ thể thân thiện.`,
          followUp: `Gợi mở học sinh phản hồi bằng hành động cụ thể.`,
          tips: `Khen ngợi ngay khi học sinh thực hiện đúng.`
        }
      });
    }
  } catch (error: any) {
    console.error('Error generating scenario:', error);
    return res.status(500).json({ error: 'Failed to generate scenario' });
  }
}
