import { ClassroomPhrase } from '../types';

export const CLASSROOM_PHRASES: ClassroomPhrase[] = [
  {
    id: 1,
    phrase: "Be kind to everyone!",
    vietnamese: "Hãy tử tế với mọi người!",
    ipa: "/biː kaɪnd tuː ˈevriwʌn/",
    category: "Văn hóa & Đạo đức",
    intonation: "Ngữ điệu đi xuống nhẹ ở cuối (Falling intonation), âm điệu ấm áp, chan chứa tình cảm.",
    toneDescription: "Ấm áp, chân thành, truyền cảm hứng nhân ái",
    pedagogicalMeaning: "Xây dựng tình bạn thân thiện trong trường học, giáo dục lòng nhân ái, sự sẻ chia và văn hóa tôn trọng bạn bè, phòng chống bạo lực học đường từ lứa tuổi tiểu học.",
    pronunciationTips: [
      {
        rule: "Trọng âm từ KIND",
        details: "Nhấn mạnh từ 'KIND' với âm nguyên âm đôi /aɪ/. Âm đuôi /nd/ không đọc thành 'đờ' to mà chặn nhẹ đầu lưỡi ở hàm răng trên.",
        focusWords: ["kind"]
      },
      {
        rule: "Nhịp điệu tự nhiên của 'everyone'",
        details: "'Everyone' có 3 âm tiết /ˈev.ri.wʌn/, nhấn vào âm tiết đầu tiên 'ev', lướt nhẹ 'ri-one'.",
        focusWords: ["everyone"]
      }
    ],
    tprGestures: "Cô giáo đặt nhẹ hai tay lên lồng ngực trái, mỉm cười trìu mến rồi mở rộng vòng tay hướng về toàn thể học sinh.",
    leKimLangScenario: {
      situation: "Vào giờ ra chơi tại sân trường Lê Kim Lăng, một bạn nhỏ sơ ý làm rơi hộp bút chì màu xuống sàn, một vài bạn xung quanh nhìn ngơ ngác và có bạn định trêu chọc.",
      teacherAction: "Cô bước tới nhẹ nhàng vỗ vai các em, mỉm cười nói: 'Be kind to everyone! Let's help our friend together.'",
      studentReaction: "Các em học sinh liền cúi xuống cùng nhặt bút giúp bạn và đồng thanh: 'Thank you!'",
      extensionPrompt: "Who can share a pencil with Minh? (Ai có thể cho bạn Minh mượn bút nào?)",
      pedagogicalTip: "Khen ngợi ngay lập tức cử chỉ đẹp của học sinh để tạo hiệu ứng lan tỏa tích cực."
    },
    quiz: {
      question: "Khi thấy học sinh trong lớp trêu chọc hoặc không chia sẻ đồ dùng với bạn mới chuyển trường đến, giáo viên Lê Kim Lăng nên dùng câu khẩu hiệu nào?",
      options: [
        "Be kind to everyone!",
        "Line up quietly",
        "Never give up",
        "Keep your classroom clean"
      ],
      correctIndex: 0,
      explanation: "'Be kind to everyone!' nhắc nhở các em đối xử hòa nhã, tôn trọng và yêu thương bạn bè trong mọi tình huống."
    }
  },
  {
    id: 2,
    phrase: "Listen carefully",
    vietnamese: "Lắng nghe cẩn thận",
    ipa: "/ˈlɪsn ˈkeəfəli/",
    category: "Nề nếp lớp học",
    intonation: "Ngữ điệu dứt khoát, điềm tĩnh, hướng sự tập trung cao độ về phía giáo viên.",
    toneDescription: "Nghiêm túc, dứt khoát nhưng hòa nhã, không quát mắng",
    pedagogicalMeaning: "Rèn luyện kỹ năng tập trung chú ý - yếu tố quyết định hiệu quả tiếp thu bài của học sinh tiểu học, giúp ổn định trật tự lớp học tích cực không cần dùng roi vọt.",
    pronunciationTips: [
      {
        rule: "Âm câm chữ 't' trong LISTEN",
        details: "'Listen' đọc là /ˈlɪs.n/ (lít-xừn), âm 't' hoàn toàn câm, tuyệt đối không phát âm thành 'lít-sờn-t'.",
        focusWords: ["listen"]
      },
      {
        rule: "Trọng âm từ CAREFULLY",
        details: "Nhấn mạnh vào âm tiết đầu /ˈkeə.fə.li/, hai âm sau đọc nhẹ và nhanh dần.",
        focusWords: ["carefully"]
      }
    ],
    tprGestures: "Đưa ngón trỏ chạm nhẹ vào vành tai của mình, ánh mắt nhìn bao quát cả lớp một cách dịu dàng nhưng kiên định.",
    leKimLangScenario: {
      situation: "Trước khi phổ biến luật chơi cho trò chơi ô chữ học tập, lớp học đang râm ran tiếng trao đổi tự do giữa các bàn.",
      teacherAction: "Cô giáo dừng lại 2 giây, gõ nhẹ vào bảng 2 nhịp và nói rõ ràng: 'Eyes on me! Listen carefully!'",
      studentReaction: "Cả lớp lập tức ngồi thẳng lưng, khoanh tay lên bàn và đồng thanh: 'Listen carefully!'",
      extensionPrompt: "Are you ready to listen? (Cả lớp đã sẵn sàng lắng nghe chưa nào?)",
      pedagogicalTip: "Đợi 100% học sinh giữ trật tự rồi mới tiếp tục giảng, tuyệt đối không giảng khi lớp đang ồn."
    },
    quiz: {
      question: "Từ 'listen' trong câu 'Listen carefully' có điểm đặc biệt nào về mặt ngữ âm?",
      options: [
        "Chữ 't' là âm câm, phát âm là /ˈlɪsn/",
        "Phải bật thật mạnh âm 't' ở giữa",
        "Nhấn trọng âm vào âm tiết thứ hai",
        "Đọc giống từ 'lesson'"
      ],
      correctIndex: 0,
      explanation: "Trong tiếng Anh, chữ 't' trong 'listen' là âm câm (silent letter), phát âm chuẩn là /ˈlɪsn/."
    }
  },
  {
    id: 3,
    phrase: "Help each other",
    vietnamese: "Giúp đỡ lẫn nhau",
    ipa: "/help iːtʃ ˈʌðər/",
    category: "Văn hóa & Đạo đức",
    intonation: "Ngữ điệu mềm mại, nâng đỡ, mang tính cổ vũ và khuyến khích đồng đội.",
    toneDescription: "Khích lệ, ấm áp, thúc đẩy tinh thần tương thân tương ái",
    pedagogicalMeaning: "Phát triển năng lực giao tiếp và hợp tác trong Chương trình GDPT 2018; rèn luyện thói quen học tập nhóm đôi, nhóm 4 tương trợ lẫn nhau.",
    pronunciationTips: [
      {
        rule: "Bật nhẹ âm cuối /p/ trong HELP",
        details: "Khép nhẹ hai môi và bật hơi /p/ thanh thoát, tránh nuốt âm hoặc phát âm thành 'hép'.",
        focusWords: ["help"]
      },
      {
        rule: "Âm /ð/ trong OTHER",
        details: "Đưa đầu lưỡi hơi kẹp nhẹ giữa hai hàm răng khi phát âm /ð/ trong /ˈʌð.ər/.",
        focusWords: ["other"]
      }
    ],
    tprGestures: "Hai bàn tay giáo viên đan vào nhau mô phỏng động tác kết nối hoặc đưa tay nâng đỡ nhẹ nhàng về phía nhóm học sinh.",
    leKimLangScenario: {
      situation: "Trong tiết Mỹ thuật lớp 3, một em học sinh bị thiếu hộp sáp màu và đang loay hoay bối rối, bên cạnh là bạn cùng bàn có hộp màu 24 cây.",
      teacherAction: "Thầy giáo đi ngang qua mỉm cười vỗ vai bạn bên cạnh: 'Remember: Help each other! Can you share your colors?'",
      studentReaction: "Bạn nhỏ nhanh chóng đẩy hộp màu sang giữa bàn: 'Yes! Here you are!'",
      extensionPrompt: "Good job! Teamwork makes the dream work!",
      pedagogicalTip: "Khuyến khích học sinh tự nguyện giúp đỡ thay vì ép buộc để tạo thói quen tự nhiên."
    },
    quiz: {
      question: "Câu khẩu hiệu nào phù hợp nhất khi giáo viên muốn nhắc nhở các nhóm học tập hỗ trợ bạn chưa hiểu bài?",
      options: [
        "Help each other",
        "Speak English, please",
        "Line up quietly",
        "Keep your classroom clean"
      ],
      correctIndex: 0,
      explanation: "'Help each other' khích lệ tinh thần đồng đội và sẻ chia giúp đỡ lẫn nhau trong học tập."
    }
  },
  {
    id: 4,
    phrase: "Never give up",
    vietnamese: "Đừng bao giờ bỏ cuộc",
    ipa: "/ˈnevər ɡɪv ʌp/",
    category: "Khích lệ & Ý chí",
    intonation: "Ngữ điệu hào hùng, dâng cao ở 'up', truyền cảm hứng và niềm tin mãnh liệt.",
    toneDescription: "Mạnh mẽ, tràn đầy năng lượng, khơi dậy ý chí kiên cường",
    pedagogicalMeaning: "Xây dựng tư duy phát triển (Growth Mindset) cho học sinh tiểu học. Giúp các em hiểu rằng sai lầm là cơ hội học hỏi, không sợ khó, không sợ sai.",
    pronunciationTips: [
      {
        rule: "Nối âm /v/ sang /ʌ/ trong 'give up'",
        details: "Âm kết thúc /v/ của 'give' nối liền mạch với nguyên âm /ʌ/ thành /ɡɪ.vʌp/ rất tự nhiên.",
        focusWords: ["give", "up"]
      },
      {
        rule: "Trọng âm NEVER",
        details: "Nhấn mạnh rõ rệt vào âm tiết đầu /ˈnev.ər/ với nguyên âm /e/ mở rộng.",
        focusWords: ["never"]
      }
    ],
    tprGestures: "Nắm chặt bàn tay thành hình nắm đấm giơ lên ngang ngực với nét mặt đầy quyết tâm (tương tự cử chỉ 'Cố lên!').",
    leKimLangScenario: {
      situation: "Một em học sinh lớp 1 luyện viết chữ nét khuyết trên bị lem mực lần thứ ba, em phụng phịu muốn gác bút không viết nữa.",
      teacherAction: "Cô giáo cúi thấp ngang tầm mắt học sinh, mỉm cười trìu mến: 'Don't worry, my dear! Never give up! Try one more time!'",
      studentReaction: "Em học sinh lấy lại nụ cười, cẩn thận nắn nót lại từng nét chữ trong sự cổ vũ của cô.",
      extensionPrompt: "Yes, you can do it! (Con làm được mà!)",
      pedagogicalTip: "Lời khích lệ 'Never give up' có sức mạnh tâm lý to lớn giúp giải tỏa ức chế sợ sai ở trẻ nhỏ."
    },
    quiz: {
      question: "Hiện tượng nối âm (linking sound) xuất hiện ở vị trí nào trong câu 'Never give up'?",
      options: [
        "Nối âm đuôi /v/ của 'give' sang nguyên âm /ʌ/ của 'up' (/ɡɪ-vʌp/)",
        "Nối từ 'never' sang từ 'give'",
        "Không có hiện tượng nối âm",
        "Nối âm /r/ với âm /g/"
      ],
      correctIndex: 0,
      explanation: "Trong 'give up', phụ âm /v/ nối với nguyên âm /ʌ/ tạo thành âm liền mạch /ɡɪ.vʌp/."
    }
  },
  {
    id: 5,
    phrase: "Do your best",
    vietnamese: "Hãy cố gắng hết sức mình",
    ipa: "/duː jɔːr best/",
    category: "Khích lệ & Ý chí",
    intonation: "Ngữ điệu đi lên khích lệ rồi ổn định, thể hiện sự tin tưởng tuyệt đối vào năng lực học trò.",
    toneDescription: "Ấm áp, tự hào, khích lệ nỗ lực thay vì chỉ nhìn vào điểm số",
    pedagogicalMeaning: "Đánh giá học sinh tiểu học theo Thông tư 27: coi trọng sự tiến bộ và nỗ lực cá nhân của học sinh hơn là so sánh cạnh tranh gay gắt.",
    pronunciationTips: [
      {
        rule: "Cụm phụ âm cuối /st/ trong BEST",
        details: "Phát âm rõ âm gió /s/ rồi ngắt nhanh ở âm /t/ (/best/), tránh bỏ quên âm 's' thành 'bét'.",
        focusWords: ["best"]
      },
      {
        rule: "Trọng âm chính",
        details: "Từ 'BEST' mang trọng âm câu mạnh nhất, nói tròn vành rõ chữ.",
        focusWords: ["best"]
      }
    ],
    tprGestures: "Đưa một hoặc hai ngón tay cái hướng lên trên (Thumb up) kết hợp gật đầu tán thưởng đầy năng lượng.",
    leKimLangScenario: {
      situation: "Trước khi cả lớp bắt đầu 15 phút làm bài khảo sát năng lực Toán học giữa học kỳ tại phòng học trường Lê Kim Lăng.",
      teacherAction: "Thầy giáo nhìn quanh lớp với nụ cười tự tin: 'Take a deep breath, everyone! Do your best!'",
      studentReaction: "Các em học sinh vui vẻ đáp lại: 'We will do our best!' và tự tin mở bài làm.",
      extensionPrompt: "Believe in yourself! (Hãy tin vào chính mình!)",
      pedagogicalTip: "Dùng câu này giúp giảm bớt áp lực thi cử và kích hoạt động lực nội tại của học sinh."
    },
    quiz: {
      question: "Âm cuối của từ 'best' trong câu 'Do your best' cần lưu ý phát âm như thế nào?",
      options: [
        "Bật rõ tổ hợp phụ âm /st/ (gió /s/ và ngắt /t/)",
        "Chỉ cần đọc là 'bét' không cần âm gió",
        "Nuốt âm 't' chỉ giữ lại âm 's'",
        "Đọc kéo dài như từ 'base'"
      ],
      correctIndex: 0,
      explanation: "Từ 'best' kết thúc bằng cụm phụ âm /st/, người học thường quên âm /s/ hoặc âm /t/, cần bật rõ cả hai."
    }
  },
  {
    id: 6,
    phrase: "Speak English, please",
    vietnamese: "Làm ơn nói tiếng Anh nào",
    ipa: "/spiːk ˈɪŋɡlɪʃ pliːz/",
    category: "Tương tác & Ngôn ngữ",
    intonation: "Ngữ điệu lịch sự, lên giọng nhẹ ở từ 'please' thể hiện sự tôn trọng và mời gọi thân thiện.",
    toneDescription: "Lịch sự, khuyến khích nhẹ nhàng, không tạo cảm giác ép buộc",
    pedagogicalMeaning: "Tạo môi trường tắm ngôn ngữ (Language Immersion) trong tiết học tiếng Anh hoặc giờ sinh hoạt ngoại khóa, giúp học sinh bớt rụt rè.",
    pronunciationTips: [
      {
        rule: "Âm bắt đầu /sp/ trong SPEAK",
        details: "Không phát âm thêm nguyên âm đệm thành 'sì-píc', hãy lướt nhanh /s/ sang /p/ (/spiːk/).",
        focusWords: ["speak"]
      },
      {
        rule: "Âm xì dài /ʃ/ của ENGLISH và âm /z/ của PLEASE",
        details: "'English' kết thúc bằng âm chu môi /ʃ/, còn 'please' kết thúc bằng âm rung thanh quản /z/.",
        focusWords: ["english", "please"]
      }
    ],
    tprGestures: "Đưa tay mở nhẹ ngang cằm hướng về phía học sinh, ánh mắt tươi cười chờ đón các em mở lời.",
    leKimLangScenario: {
      situation: "Trong giờ học tiếng Anh tăng cường, khi được yêu cầu mô tả đồ chơi yêu thích, một vài bạn quên mất và quay sang tranh luận bằng tiếng Việt.",
      teacherAction: "Cô giáo đến gần, nghiêng đầu mỉm cười và giơ ngón tay làm dấu: 'Speak English, please! What is it in English?'",
      studentReaction: "Các em giật mình nhận ra và vui vẻ đổi sang: 'Oh, it's a red car!'",
      extensionPrompt: "Try in English, Minh! You can say: It is...",
      pedagogicalTip: "Luôn kèm từ 'please' và nụ cười để tạo tâm lý thoải mái, tránh chỉ trích học sinh khi quên."
    },
    quiz: {
      question: "Vì sao giáo viên nên luôn bổ sung từ 'please' khi nhắc nhở 'Speak English, please'?",
      options: [
        "Tạo sắc thái lịch sự, khích lệ nhẹ nhàng thay vì ra lệnh khô khan",
        "Để câu dài hơn dễ nhớ hơn",
        "Bắt buộc theo ngữ pháp tiếng Anh cổ",
        "Chỉ dùng cho học sinh lớp 5"
      ],
      correctIndex: 0,
      explanation: "Từ 'please' tạo sắc thái sư phạm nhân văn, lịch sự, giúp học sinh cảm thấy được tôn trọng và sẵn sàng hợp tác."
    }
  },
  {
    id: 7,
    phrase: "Keep your classroom clean",
    vietnamese: "Giữ gìn lớp học sạch đẹp",
    ipa: "/kiːp jɔːr ˈklɑːsruːm kliːn/",
    category: "Nề nếp lớp học",
    intonation: "Ngữ điệu vui tươi, nhịp điệu rộn ràng, kích thích ý thức tự giác bảo vệ môi trường.",
    toneDescription: "Vui tươi, tự hào về trường lớp, tính giáo dục cao",
    pedagogicalMeaning: "Giáo dục ý thức lao động, vệ sinh môi trường học đường và lòng tự hào về cảnh quan Trường Tiểu học Lê Kim Lăng Xanh - Sạch - Đẹp.",
    pronunciationTips: [
      {
        rule: "Vần /iː/ trong KEEP và CLEAN",
        details: "Cả hai từ 'keep' (/kiːp/) và 'clean' (/kliːn/) đều có nguyên âm dài /iː/, mở rộng khóe môi như đang cười nhẹ.",
        focusWords: ["keep", "clean"]
      },
      {
        rule: "Trọng âm từ CLASSROOM",
        details: "Nhấn mạnh âm tiết đầu /ˈklɑːs.ruːm/ (hoặc /ˈklæs.ruːm/).",
        focusWords: ["classroom"]
      }
    ],
    tprGestures: "Hai tay đưa ngang quét nhẹ tượng trưng cho động tác dọn dẹp mặt bàn gọn gàng, rồi chỉ tay vào giỏ rác tái chế trong lớp.",
    leKimLangScenario: {
      situation: "Sau tiết Thủ công gấp giấy xé dán hoa lá tại lớp 2/1, sàn nhà và gầm bàn còn vương vãi nhiều mẩu giấy vụn.",
      teacherAction: "Cô bật bản nhạc vui nhộn và hô to: 'Class, 1 minute challenge: Keep your classroom clean!'",
      studentReaction: "Các em học sinh hào hứng thi đua nhặt sạch các mẩu giấy cho vào sọt rác chỉ trong 30 giây.",
      extensionPrompt: "Look at our clean room! Wonderful job!",
      pedagogicalTip: "Biến việc giữ vệ sinh thành trò chơi thi đua tính giờ (1-minute clean up challenge) sẽ thu hút học sinh tiểu học."
    },
    quiz: {
      question: "Âm nguyên âm chung nổi bật giữa hai từ 'keep' và 'clean' là gì?",
      options: [
        "Nguyên âm dài /iː/ (cười nhẹ và kéo dài hơi)",
        "Nguyên âm ngắn /ɪ/",
        "Nguyên âm đôi /eɪ/",
        "Nguyên âm /æ/"
      ],
      correctIndex: 0,
      explanation: "Cả 'keep' (/kiːp/) và 'clean' (/kliːn/) đều chứa nguyên âm dài /iː/."
    }
  },
  {
    id: 8,
    phrase: "Line up quietly",
    vietnamese: "Xếp hàng ngay ngắn, trật tự",
    ipa: "/laɪn ʌp ˈkwaɪətli/",
    category: "Nề nếp lớp học",
    intonation: "Ngữ điệu hiệu lệnh rõ ràng, dứt khoát nhưng điềm đạm, tạo cảm giác an toàn và nề nếp.",
    toneDescription: "Điềm tĩnh, dứt khoát, mang tính định hướng nề nếp tự giác",
    pedagogicalMeaning: "Hình thành văn hóa xếp hàng - nét đẹp văn minh cốt lõi của học sinh trường tiểu học khi di chuyển trong không gian chung.",
    pronunciationTips: [
      {
        rule: "Nối âm /n/ sang /ʌ/ trong 'line up'",
        details: "Phụ âm cuối /n/ của 'line' nối liền mạch với 'up' tạo thành /ˈlaɪ.nʌp/ rất nhịp nhàng.",
        focusWords: ["line", "up"]
      },
      {
        rule: "Phát âm QUIETLY",
        details: "Tổ hợp âm /kw/ như trong 'quai-ợt-li', nhấn mạnh âm đầu /ˈkwaɪ.ət.li/.",
        focusWords: ["quietly"]
      }
    ],
    tprGestures: "Đưa ngón trỏ đặt lên môi ra hiệu giữ trật tự (Suỵt), tay còn lại duỗi thẳng dọc theo thân mình để làm chuẩn cho hàng.",
    leKimLangScenario: {
      situation: "Chuông báo kết thúc tiết 4 vang lên, học sinh háo hức chuẩn bị di chuyển xuống nhà ăn bán trú hoặc sân tập thể dục.",
      teacherAction: "Thầy đứng ở cửa lớp, đưa tay làm hiệu: 'Stand up! Line up quietly, please!'",
      studentReaction: "Các tổ trưởng nhanh chóng làm gương, cả lớp bước vào hàng thẳng tắp, không xô đẩy.",
      extensionPrompt: "Who is the straightest line? Group 1 or Group 2?",
      pedagogicalTip: "Khen ngợi tổ xếp hàng thẳng nhất sẽ kích thích tinh thần tự giác của toàn thể học sinh."
    },
    quiz: {
      question: "Để câu khẩu lệnh 'Line up quietly' phát âm tự nhiên và chuẩn bản xứ nhất, ta áp dụng quy tắc nào?",
      options: [
        "Nối âm cuối /n/ của 'line' sang 'up' thành /ˈlaɪ-nʌp/",
        "Đọc ngắt quãng từng từ rời rạc",
        "Nuốt âm /t/ trong từ 'quietly'",
        "Nhấn mạnh toàn bộ các từ như nhau"
      ],
      correctIndex: 0,
      explanation: "Nối âm phụ âm cuối sang nguyên âm đầu (/n/ + /ʌ/ = /ˈlaɪ-nʌp/) giúp câu lệnh trôi chảy và tự nhiên."
    }
  },
  {
    id: 9,
    phrase: "Raise your hands to speak",
    vietnamese: "Giơ tay phát biểu",
    ipa: "/reɪz jɔːr hændz tuː spiːk/",
    category: "Tương tác & Ngôn ngữ",
    intonation: "Ngữ điệu mạch lạc, rõ ràng, hướng đến sự công bằng và trật tự trong đối thoại.",
    toneDescription: "Rõ ràng, hướng dẫn nề nếp kỷ luật tích cực",
    pedagogicalMeaning: "Xây dựng văn hóa lắng nghe và tôn trọng lượt nói của người khác, tránh tình trạng học sinh nói leo, tranh cướp lời trong lớp học.",
    pronunciationTips: [
      {
        rule: "Âm /z/ trong RAISE và /dz/ trong HANDS",
        details: "'Raise' đọc là /reɪz/ có rung thanh quản, 'hands' số nhiều có âm /hændz/, tránh đọc thiếu âm gió.",
        focusWords: ["raise", "hands"]
      },
      {
        rule: "Trọng âm câu",
        details: "Nhấn mạnh vào 2 hành động chính: 'RAISE' và 'SPEAK'.",
        focusWords: ["raise", "speak"]
      }
    ],
    tprGestures: "Giáo viên giơ thẳng cánh tay phải lên cao với bàn tay xòe tự nhiên làm mẫu cho các em noi theo.",
    leKimLangScenario: {
      situation: "Cô giáo vừa đặt câu hỏi thảo luận về bài học mới, nhiều học sinh hào hứng cùng đồng thanh la to đáp án gây ồn ào.",
      teacherAction: "Cô mỉm cười giơ cao cánh tay phải của mình làm mẫu và nói êm ái: 'Good ideas! But please raise your hands to speak!'",
      studentReaction: "Các em hạ giọng và đồng loạt giơ tay ngay ngắn chờ cô gọi tên.",
      extensionPrompt: "Thank you! An, please share your answer.",
      pedagogicalTip: "Giáo viên chỉ gọi tên những học sinh giơ tay trật tự để củng cố hành vi mong muốn."
    },
    quiz: {
      question: "Khi học sinh trong lớp nhao nhao nói tự do cùng một lúc, hành động kết hợp TPR chuẩn nhất của cô giáo là gì?",
      options: [
        "Cô giơ thẳng tay phải lên cao làm mẫu và nói 'Raise your hands to speak'",
        "Đập thước thật mạnh xuống bàn để dọa các em",
        "Im lặng bỏ ra khỏi lớp",
        "Hét to hơn học sinh"
      ],
      correctIndex: 0,
      explanation: "Cử chỉ TPR giơ thẳng tay làm mẫu kết hợp khẩu hiệu 'Raise your hands to speak' thể hiện phương pháp kỷ luật tích cực của nhà giáo."
    }
  },
  {
    id: 10,
    phrase: "Work together happily",
    vietnamese: "Hợp tác vui vẻ cùng nhau",
    ipa: "/wɜːk təˈɡeðər ˈhæpɪli/",
    category: "Khích lệ & Ý chí",
    intonation: "Ngữ điệu rộn ràng, tươi vui, mang lại nguồn năng lượng tích cực ngập tràn lớp học.",
    toneDescription: "Vui tươi, hân hoan, tràn đầy năng lượng gắn kết",
    pedagogicalMeaning: "Bổ sung hoàn thiện bộ 10 câu khẩu hiệu cốt lõi. Giúp rèn luyện kỹ năng làm việc nhóm, tôn trọng sự khác biệt và niềm vui học tập cùng bạn bè.",
    pronunciationTips: [
      {
        rule: "Trọng âm TOGETHER và HAPPILY",
        details: "'Together' nhấn vào âm tiết 2 /təˈɡeð.ər/, 'happily' nhấn vào âm tiết 1 /ˈhæp.ɪ.li/.",
        focusWords: ["together", "happily"]
      },
      {
        rule: "Âm /ɜː/ trong WORK",
        details: "Phát âm tròn môi nhẹ với nguyên âm dài /wɜːk/, âm cuối /k/ bật nhẹ.",
        focusWords: ["work"]
      }
    ],
    tprGestures: "Hai tay đưa rộng ra rồi khép lại phía trước ngực mô phỏng vòng tròn kết nối, kèm theo nụ cười rạng rỡ.",
    leKimLangScenario: {
      situation: "Bước vào hoạt động trải nghiệm STEM sáng tạo làm thiệp chúc mừng ngày 20/11 theo nhóm 4 em tại trường Tiểu học Lê Kim Lăng.",
      teacherAction: "Thầy giáo vỗ tay 2 nhịp và cổ vũ cả lớp: 'Ready, steady, go! Work together happily!'",
      studentReaction: "Các nhóm hào hứng phân công nhau: bạn cắt giấy, bạn dán hoa, rộn vang tiếng cười vui vẻ.",
      extensionPrompt: "Show me your big smiles! Happy teamwork!",
      pedagogicalTip: "Lời nhắc 'happily' tạo ra bầu không khí học mà chơi, chơi mà học không áp lực cho trẻ thơ."
    },
    quiz: {
      question: "Câu khẩu hiệu 'Work together happily' mang lại ý nghĩa sư phạm nổi bật nào cho học sinh tiểu học?",
      options: [
        "Kích thích niềm vui khi làm việc nhóm và tinh thần học tập hợp tác",
        "Yêu cầu học sinh làm bài một mình không nói chuyện",
        "Dùng để phạt học sinh mất trật tự",
        "Nhắc nhở học sinh nộp bài thi nhanh"
      ],
      correctIndex: 0,
      explanation: "'Work together happily' truyền cảm hứng về tinh thần hợp tác vui vẻ và tình bạn gắn kết trong các hoạt động học tập."
    }
  }
];

export const BADGE_DEFINITIONS = [
  {
    id: 'first_step',
    title: 'Khởi Đầu Tự Tin',
    description: 'Đã hoàn thành bài học khẩu hiệu đầu tiên',
    icon: '🌱',
    minPoints: 20
  },
  {
    id: 'pronunciation_master',
    title: 'Bậc Thầy Phát Âm',
    description: 'Đạt điểm Speaking xuất sắc ở 5 câu trở lên',
    icon: '🎙️',
    minPoints: 100
  },
  {
    id: 'pedagogy_star',
    title: 'Ngôi Sao Sư Phạm LKL',
    description: 'Thực hành thành công kịch bản lớp học tại trường Lê Kim Lăng',
    icon: '⭐',
    minPoints: 180
  },
  {
    id: 'inspirational_mentor',
    title: 'Giáo Viên Truyền Cảm Hứng',
    description: 'Chinh phục toàn diện bộ 10 câu khẩu hiệu lớp học',
    icon: '🏆',
    minPoints: 260
  }
];
