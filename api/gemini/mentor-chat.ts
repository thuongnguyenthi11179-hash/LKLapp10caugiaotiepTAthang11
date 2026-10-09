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
    const { message, teacherName, currentPhrase } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        reply: `Chào thầy/cô ${teacherName || 'giáo viên Lê Kim Lăng'}! LKL-Mentor luôn sẵn sàng đồng hành. Đối với câu "${currentPhrase || 'Classroom Language'}", thầy cô hãy nhớ kết hợp giọng điệu ấm áp và cử chỉ tay (TPR) dứt khoát. Học sinh tiểu học tiếp thu hình ảnh và ngữ điệu rất nhanh! Thầy cô cần hỗ trợ thêm về phát âm hay tình huống cụ thể nào không ạ?`
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

    const prompt = `Giáo viên ${teacherName ? `(Tên: ${teacherName})` : ''} đang hỏi: "${message}".
${currentPhrase ? `Câu khẩu hiệu đang tương tác: "${currentPhrase}".` : ''}
Hãy trả lời với tư cách LKL-Mentor. Giữ câu trả lời ngắn gọn (khoảng 3-5 ý chính), sư phạm, khích lệ và thực tiễn cho giáo viên tiểu học Lê Kim Lăng.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_MENTOR,
        temperature: 0.7,
      },
    });

    return res.status(200).json({ reply: response.text });
  } catch (error: any) {
    console.error('Error in mentor-chat:', error);
    return res.status(200).json({
      reply: `Chào thầy/cô! Hãy tự tin sử dụng khẩu hiệu này cùng cử chỉ tay thân thiện. Nếu cần luyện phát âm hay xây dựng kịch bản tình huống, thầy cô có thể dùng các tính năng tương tác ngay trong ứng dụng nhé!`
    });
  }
}
