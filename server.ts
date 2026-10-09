import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

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

// 1. Chat with LKL-Mentor
app.post('/api/gemini/mentor-chat', async (req, res) => {
  try {
    const { message, teacherName, currentPhrase } = req.body;

    if (!ai) {
      return res.json({
        reply: `Chào thầy/cô ${teacherName || 'giáo viên Lê Kim Lăng'}! LKL-Mentor luôn sẵn sàng đồng hành. Đối với câu "${currentPhrase || 'Classroom Language'}", thầy cô hãy nhớ kết hợp giọng điệu ấm áp và cử chỉ tay (TPR) dứt khoát. Học sinh tiểu học tiếp thu hình ảnh và ngữ điệu rất nhanh! Thầy cô cần hỗ trợ thêm về phát âm hay tình huống cụ thể nào không ạ?`
      });
    }

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

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Error in mentor-chat:', error);
    res.json({
      reply: `Chào thầy/cô! Hãy tự tin sử dụng khẩu hiệu này cùng cử chỉ tay thân thiện. Nếu cần luyện phát âm hay xây dựng kịch bản tình huống, thầy cô có thể dùng các tính năng tương tác ngay trong ứng dụng nhé!`
    });
  }
});

// 2. Generate Pedagogical Scenario
app.post('/api/gemini/scenario', async (req, res) => {
  try {
    const { phrase, grade, context } = req.body;

    if (!ai) {
      return res.json({
        scenario: {
          situation: `Trong giờ hoạt động nhóm tại lớp ${grade || 'tiểu học'} Trường Tiểu học Lê Kim Lăng, các em học sinh đang rộn ràng thảo luận nhưng một số bạn còn ngại ngùng hoặc chưa tập trung.`,
          howToUse: `Cô giáo mỉm cười, vỗ tay 2 nhịp thu hút sự chú ý rồi nói vang, rõ ràng: "${phrase}". Sau đó làm động tác mở rộng hai tay mời gọi.`,
          followUp: `Sau khi học sinh đồng thanh nhắc lại, cô hỏi: "Can we do it together, class?" và khuyến khích cả lớp vỗ tay hưởng ứng.`,
          tips: `Học sinh tiểu học phản xạ tốt với nhịp điệu (Chant) và nụ cười khích lệ của giáo viên.`
        }
      });
    }

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
      res.json({ scenario: parsed });
    } catch {
      res.json({
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
    res.status(500).json({ error: 'Failed to generate scenario' });
  }
});

// 3. Speaking Evaluation Feedback
app.post('/api/gemini/speaking-feedback', async (req, res) => {
  try {
    const { targetPhrase, recognizedText, teacherName } = req.body;

    if (!ai) {
      // Local smart phonetic matching
      const targetClean = (targetPhrase || '').toLowerCase().replace(/[^a-z ]/g, '').trim();
      const recClean = (recognizedText || '').toLowerCase().replace(/[^a-z ]/g, '').trim();
      
      const isExact = targetClean === recClean;
      const isClose = targetClean.includes(recClean) || recClean.includes(targetClean);

      const rating = isExact ? 'Excellent' : isClose ? 'Good' : 'Keep it up';
      const points = isExact ? 30 : isClose ? 20 : 10;

      return res.json({
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
      res.json(parsed);
    } catch {
      res.json({
        rating: 'Good',
        feedback: `Thầy/cô đã nỗ lực phát âm rất đáng khen!`,
        correction: `Chú ý phát âm rõ âm đuôi của từ trong câu "${targetPhrase}".`,
        points: 20,
        encouragement: `Rất tốt ạ! Tiếp tục giữ vững tinh thần nhé thầy cô!`
      });
    }
  } catch (error: any) {
    console.error('Error evaluating speech:', error);
    res.json({
      rating: 'Good',
      feedback: 'Thầy/cô phát âm rõ ràng, nhịp điệu tương đối tốt!',
      correction: 'Hãy chú ý thêm độ ngân và ngữ điệu tự nhiên.',
      points: 20,
      encouragement: 'Tiếp tục luyện tập cùng LKL-Mentor nhé!'
    });
  }
});

// Vite middleware or static serving
const isProd = process.env.NODE_ENV === 'production';
if (isProd) {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`LKL10caugiaotiepTAthang11 Server listening on http://0.0.0.0:${PORT}`);
});
