import JSZip from 'jszip';
import { CLASSROOM_PHRASES } from '../data/phrases';

/**
 * Generate and download an official Lesson Plan (.docx) compliant with Official Dispatch 2345/BGDDT-GDTH
 */
export async function downloadLessonPlanDocx(teacherName: string, department: string): Promise<void> {
  const zip = new JSZip();

  // 1. [Content_Types].xml
  zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`);

  // 2. _rels/.rels
  zip.file('_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`);

  // 3. word/_rels/document.xml.rels
  zip.file('word/_rels/document.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`);

  // 4. word/styles.xml
  zip.file('word/styles.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
        <w:sz w:val="26"/>
      </w:rPr>
    </w:rDefault>
  </w:docDefaults>
</w:styles>`);

  // Build document body paragraphs
  let tableRows = '';
  CLASSROOM_PHRASES.forEach((p, idx) => {
    tableRows += `
    <w:tr>
      <w:tc><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:t>${idx + 1}</w:t></w:r></w:p></w:tc>
      <w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>${escapeXml(p.phrase)}</w:t></w:r><w:p/><w:r><w:rPr><w:i/></w:rPr><w:t>${escapeXml(p.ipa)}</w:t></w:r></w:p></w:tc>
      <w:tc><w:p><w:r><w:t>${escapeXml(p.vietnamese)}</w:t></w:r></w:p></w:tc>
      <w:tc><w:p><w:r><w:t>${escapeXml(p.tprGestures)}</w:t></w:r></w:p></w:tc>
      <w:tc><w:p><w:r><w:t>${escapeXml(p.leKimLangScenario.situation)}</w:t></w:r></w:p></w:tc>
    </w:tr>`;
  });

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <!-- Header info -->
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>ỦY BAN NHÂN DÂN QUẬN CẨM LỆ - TP. ĐÀ NẴNG</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="26"/></w:rPr><w:t>TRƯỜNG TIỂU HỌC LÊ KIM LĂNG</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:i/><w:sz w:val="22"/></w:rPr><w:t>*** Độc lập - Tự do - Hạnh phúc ***</w:t></w:r>
    </w:p>
    <w:p/>

    <!-- Title -->
    <w:p>
      <w:pPr><w:jc w:val="center"/><w:spacing w:before="120" w:after="120"/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="32"/><w:color w:val="0D5A34"/></w:rPr><w:t>KẾ HOẠCH BÀI DẠY SƯ PHẠM (CÔNG VĂN 2345/BGDĐT-GDTH)</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="center"/><w:spacing w:after="240"/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="26"/></w:rPr><w:t>CHUYÊN ĐỀ: 10 CÂU GIAO TIẾP TIẾNG ANH LỚP HỌC THÁNG 11</w:t></w:r>
    </w:p>

    <!-- Teacher info -->
    <w:p>
      <w:r><w:rPr><w:b/></w:rPr><w:t>Giáo viên thực hiện: </w:t></w:r>
      <w:r><w:t>${escapeXml(teacherName)}</w:t></w:r>
      <w:r><w:t>   |   </w:t></w:r>
      <w:r><w:rPr><w:b/></w:rPr><w:t>Tổ sinh hoạt chuyên môn: </w:t></w:r>
      <w:r><w:t>${escapeXml(department)}</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:b/></w:rPr><w:t>Năm học: </w:t></w:r>
      <w:r><w:t>2026 - 2027   |   Thời gian áp dụng: Tháng 11</w:t></w:r>
    </w:p>
    <w:p/>

    <!-- Section I -->
    <w:p>
      <w:r><w:rPr><w:b/><w:color w:val="0D5A34"/></w:rPr><w:t>I. YÊU CẦU CẦN ĐẠT:</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:b/></w:rPr><w:t>1. Năng lực đặc thù:</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>- Học sinh nghe hiểu và phản xạ chuẩn xác 10 khẩu hiệu tiếng Anh giao tiếp thông dụng trong các tiết học.</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>- Giáo viên tự tin phát âm chuẩn IPA, đúng ngữ điệu và kết hợp thuần thục ngôn ngữ cơ thể (phương pháp phản xạ toàn thân TPR).</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:b/></w:rPr><w:t>2. Phẩm chất chủ yếu:</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>- Chăm chỉ, có ý thức giữ gìn trật tự và vệ sinh trường lớp Lê Kim Lăng.</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>- Tinh thần hợp tác, yêu thương, giúp đỡ bạn bè trong các hoạt động học tập tập thể.</w:t></w:r>
    </w:p>
    <w:p/>

    <!-- Section II -->
    <w:p>
      <w:r><w:rPr><w:b/><w:color w:val="0D5A34"/></w:rPr><w:t>II. ĐỒ DÙNG DẠY HỌC &amp; HỌC LIỆU:</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>- Máy chiếu / Smart TV lớp học mở ứng dụng LKL10caugiaotiepTAthang11.</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>- Bộ Flashcard 10 khẩu hiệu, phiếu bài tập in ấn và loa âm thanh.</w:t></w:r>
    </w:p>
    <w:p/>

    <!-- Section III -->
    <w:p>
      <w:r><w:rPr><w:b/><w:color w:val="0D5A34"/></w:rPr><w:t>III. MA TRẬN 10 CÂU KHẨU HIỆU &amp; PHƯƠNG PHÁP TPR ÁP DỤNG:</w:t></w:r>
    </w:p>

    <!-- Table -->
    <w:tbl>
      <w:tblPr>
        <w:tblW w:w="0" w:type="auto"/>
        <w:tblBorders>
          <w:top w:val="single" w:sz="6" w:space="0" w:color="0D5A34"/>
          <w:left w:val="single" w:sz="6" w:space="0" w:color="0D5A34"/>
          <w:bottom w:val="single" w:sz="6" w:space="0" w:color="0D5A34"/>
          <w:right w:val="single" w:sz="6" w:space="0" w:color="0D5A34"/>
          <w:insideH w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
          <w:insideV w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
        </w:tblBorders>
      </w:tblPr>
      <w:tr>
        <w:tc><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/></w:rPr><w:t>STT</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/></w:rPr><w:t>Câu Khẩu Hiệu &amp; IPA</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/></w:rPr><w:t>Nghĩa Tiếng Việt</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/></w:rPr><w:t>Cử Chỉ TPR</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/></w:rPr><w:t>Tình Huống Tiểu Học LKL</w:t></w:r></w:p></w:tc>
      </w:tr>
      ${tableRows}
    </w:tbl>
    <w:p/>

    <!-- Signatures -->
    <w:p>
      <w:pPr><w:jc w:val="right"/><w:spacing w:before="360"/></w:pPr>
      <w:r><w:rPr><w:i/></w:rPr><w:t>Đà Nẵng, ngày ..... tháng 11 năm 2026</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:b/></w:rPr><w:t>DUYỆT CỦA BGH / TỔ TRƯỞNG CHUYÊN MÔN</w:t></w:r>
      <w:r><w:t>                                             </w:t></w:r>
      <w:r><w:rPr><w:b/></w:rPr><w:t>GIÁO VIÊN SOẠN BÀI</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:i/></w:rPr><w:t>(Ký và ghi rõ họ tên)                                                                        (Ký và ghi rõ họ tên)</w:t></w:r>
    </w:p>

    <!-- Page Break -->
    <w:p><w:r><w:br w:type="page"/></w:r></w:p>

    <!-- Worksheet Attachment -->
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="28"/><w:color w:val="0D5A34"/></w:rPr><w:t>PHIẾU BÀI TẬP RÈN LUYỆN DÀNH CHO HỌC SINH</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:b/></w:rPr><w:t>10 CLASSROOM SLOGANS - TIỂU HỌC LÊ KIM LĂNG</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>Họ và tên học sinh: .............................................................. Lớp: .............</w:t></w:r>
    </w:p>
    <w:p/>

    <w:p>
      <w:r><w:rPr><w:b/></w:rPr><w:t>Bài 1: Nối câu Tiếng Anh với nghĩa Tiếng Việt tương ứng:</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t>1. Listen carefully              A. Hãy cố gắng hết sức mình</w:t></w:r></w:p>
    <w:p><w:r><w:t>2. Be kind to everyone!          B. Lắng nghe cẩn thận nào</w:t></w:r></w:p>
    <w:p><w:r><w:t>3. Do your best                  C. Giữ gìn lớp học sạch đẹp</w:t></w:r></w:p>
    <w:p><w:r><w:t>4. Keep your classroom clean     D. Hãy tử tế với mọi người</w:t></w:r></w:p>
    <w:p/>

    <w:p>
      <w:r><w:rPr><w:b/></w:rPr><w:t>Bài 2: Điền từ còn thiếu vào chỗ trống:</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t>1. Work ................................. happily! (together / friendly)</w:t></w:r></w:p>
    <w:p><w:r><w:t>2. Speak ................................., please! (English / quietly)</w:t></w:r></w:p>
    <w:p><w:r><w:t>3. ................................. up quietly! (Line / Stand)</w:t></w:r></w:p>
    <w:p><w:r><w:t>4. Raise your ................................. to speak! (hands / arms)</w:t></w:r></w:p>
  </w:body>
</w:document>`;

  zip.file('word/document.xml', documentXml);

  const content = await zip.generateAsync({ type: 'blob' });
  triggerFileDownload(content, `Ke_Hoach_Bai_Day_10_Cau_Thang_11_${department.replace(/[^a-zA-Z0-9]/g, '_')}.docx`);
}

/**
 * Generate and download professional PowerPoint Slides (.pptx)
 */
export async function downloadPresentationPptx(teacherName: string, department: string): Promise<void> {
  const zip = new JSZip();

  // Content types
  let overrides = `
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  <Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
  <Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>
  <Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>`;

  // 1 title slide + 10 slogan slides + 1 summary slide = 12 slides
  const totalSlides = 12;
  for (let i = 1; i <= totalSlides; i++) {
    overrides += `\n  <Override PartName="/ppt/slides/slide${i}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`;
  }

  zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>${overrides}
</Types>`);

  // Root rels
  zip.file('_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`);

  // Presentation rels
  let presRels = `
  <Relationship Id="rIdMaster1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>`;
  for (let i = 1; i <= totalSlides; i++) {
    presRels += `\n  <Relationship Id="rIdSlide${i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i}.xml"/>`;
  }

  zip.file('ppt/_rels/presentation.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${presRels}
</Relationships>`);

  // Presentation XML
  let sldIdLst = '';
  for (let i = 1; i <= totalSlides; i++) {
    sldIdLst += `\n    <p:sldId id="${255 + i}" r:id="rIdSlide${i}"/>`;
  }

  zip.file('ppt/presentation.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
  <p:sldMasterIdLst>
    <p:sldMasterId id="2147483648" r:id="rIdMaster1"/>
  </p:sldMasterIdLst>
  <p:sldIdLst>${sldIdLst}
  </p:sldIdLst>
  <p:sldSz cx="12192000" cy="6858000" type="screen16x9"/>
</p:presentation>`);

  // Minimal slideMaster and slideLayout
  zip.file('ppt/slideMasters/slideMaster1.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldMaster xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
  <p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/></p:spTree></p:cSld>
  <p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>
</p:sldMaster>`);

  zip.file('ppt/slideMasters/_rels/slideMaster1.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
</Relationships>`);

  zip.file('ppt/slideLayouts/slideLayout1.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldLayout xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
  <p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/></p:spTree></p:cSld>
</p:sldLayout>`);

  zip.file('ppt/theme/theme1.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme">
  <a:themeElements>
    <a:clrScheme name="Office">
      <a:dk1><a:srgbClr val="000000"/></a:dk1>
      <a:lt1><a:srgbClr val="FFFFFF"/></a:lt1>
      <a:dk2><a:srgbClr val="1F497D"/></a:dk2>
      <a:lt2><a:srgbClr val="EEECE1"/></a:lt2>
      <a:accent1><a:srgbClr val="0D5A34"/></a:accent1>
      <a:accent2><a:srgbClr val="E59E0A"/></a:accent2>
      <a:accent3><a:srgbClr val="047857"/></a:accent3>
      <a:accent4><a:srgbClr val="0284C7"/></a:accent4>
      <a:accent5><a:srgbClr val="6366F1"/></a:accent5>
      <a:accent6><a:srgbClr val="F43F5E"/></a:accent6>
      <a:hlink><a:srgbClr val="0000FF"/></a:hlink>
      <a:folHlink><a:srgbClr val="800080"/></a:folHlink>
    </a:clrScheme>
    <a:fontScheme name="Office"><a:majorFont><a:latin typeface="Arial"/></a:majorFont><a:minorFont><a:latin typeface="Calibri"/></a:minorFont></a:fontScheme>
    <a:fmtScheme name="Office"><a:fillStyleLst/><a:lnStyleLst/><a:effectStyleLst/><a:bgFillStyleLst/></a:fmtScheme>
  </a:themeElements>
</a:theme>`);

  // Build Individual Slides
  // Slide 1: Title Slide
  zip.file('ppt/slides/slide1.xml', generateSlideXml({
    badge: 'TRƯỜNG TIỂU HỌC LÊ KIM LĂNG • TP. ĐÀ NẴNG',
    title: '10 CÂU GIAO TIẾP TIẾNG ANH THÁNG 11',
    subtitle: 'Classroom Language & Phản xạ toàn thân (TPR)',
    footer: `Giáo viên: ${teacherName} • ${department}`
  }));

  // Slides 2-11: 10 Slogans
  CLASSROOM_PHRASES.forEach((p, idx) => {
    zip.file(`ppt/slides/slide${idx + 2}.xml`, generateSlideXml({
      badge: `KHẨU HIỆU #${p.id} • ${p.category.toUpperCase()}`,
      title: `"${p.phrase}"`,
      subtitle: `${p.vietnamese}  [ ${p.ipa} ]`,
      body1: `Cử chỉ hình thể (TPR): ${p.tprGestures}`,
      body2: `Tình huống lớp học: ${p.leKimLangScenario.situation}`,
      footer: 'LKL10caugiaotiepTAthang11 • Rèn luyện khẩu hiệu lớp học tích cực'
    }));
  });

  // Slide 12: Summary & Chants
  zip.file('ppt/slides/slide12.xml', generateSlideXml({
    badge: 'TỔNG KẾT & RÈN LUYỆN ĐỒNG THANH',
    title: 'WE LOVE SPEAKING ENGLISH!',
    subtitle: 'Tự tin giao tiếp mỗi ngày trong lớp học',
    body1: 'Thầy cô và các em cùng vỗ tay hô vang 10 câu khẩu hiệu!',
    body2: 'Thực hiện động tác TPR dứt khoát - vui tươi - gắn kết.',
    footer: 'Chúc các thầy cô và học sinh Trường Tiểu học Lê Kim Lăng dạy tốt - học tốt!'
  }));

  const content = await zip.generateAsync({ type: 'blob' });
  triggerFileDownload(content, `Bai_Giang_Slide_10_Cau_Thang_11_${department.replace(/[^a-zA-Z0-9]/g, '_')}.pptx`);
}

function generateSlideXml(options: {
  badge: string;
  title: string;
  subtitle: string;
  body1?: string;
  body2?: string;
  footer?: string;
}): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
      <p:grpSpPr/>
      
      <!-- Main Content Card -->
      <p:sp>
        <p:nvSpPr><p:cNvPr id="2" name="Title Box"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr/></p:nvSpPr>
        <p:spPr>
          <a:xfrm><a:off x="914400" y="685800"/><a:ext cx="10363200" cy="5486400"/></a:xfrm>
        </p:spPr>
        <p:txBody>
          <a:bodyPr anchor="t"/>
          <a:lstStyle/>
          
          <!-- Badge -->
          <a:p>
            <a:r>
              <a:rPr lang="vi-VN" sz="1600" b="1">
                <a:solidFill><a:srgbClr val="0D5A34"/></a:solidFill>
              </a:rPr>
              <a:t>${escapeXml(options.badge)}</a:t>
            </a:r>
          </a:p>
          
          <!-- Title -->
          <a:p>
            <a:pPr><a:spcBfr><a:spcPts val="2000"/></a:spcBfr></a:pPr>
            <a:r>
              <a:rPr lang="en-US" sz="4400" b="1">
                <a:solidFill><a:srgbClr val="064E3B"/></a:solidFill>
              </a:rPr>
              <a:t>${escapeXml(options.title)}</a:t>
            </a:r>
          </a:p>
          
          <!-- Subtitle -->
          <a:p>
            <a:pPr><a:spcBfr><a:spcPts val="1200"/></a:spcBfr></a:pPr>
            <a:r>
              <a:rPr lang="vi-VN" sz="2400" i="1">
                <a:solidFill><a:srgbClr val="B45309"/></a:solidFill>
              </a:rPr>
              <a:t>${escapeXml(options.subtitle)}</a:t>
            </a:r>
          </a:p>
          
          ${options.body1 ? `
          <!-- Body 1 -->
          <a:p>
            <a:pPr><a:spcBfr><a:spcPts val="2400"/></a:spcBfr></a:pPr>
            <a:r>
              <a:rPr lang="vi-VN" sz="2000" b="1">
                <a:solidFill><a:srgbClr val="1E293B"/></a:solidFill>
              </a:rPr>
              <a:t>${escapeXml(options.body1)}</a:t>
            </a:r>
          </a:p>` : ''}
          
          ${options.body2 ? `
          <!-- Body 2 -->
          <a:p>
            <a:pPr><a:spcBfr><a:spcPts val="1200"/></a:spcBfr></a:pPr>
            <a:r>
              <a:rPr lang="vi-VN" sz="1800">
                <a:solidFill><a:srgbClr val="475569"/></a:solidFill>
              </a:rPr>
              <a:t>${escapeXml(options.body2)}</a:t>
            </a:r>
          </a:p>` : ''}
          
          ${options.footer ? `
          <!-- Footer -->
          <a:p>
            <a:pPr><a:spcBfr><a:spcPts val="3000"/></a:spcBfr></a:pPr>
            <a:r>
              <a:rPr lang="vi-VN" sz="1400" i="1">
                <a:solidFill><a:srgbClr val="64748B"/></a:solidFill>
              </a:rPr>
              <a:t>${escapeXml(options.footer)}</a:t>
            </a:r>
          </a:p>` : ''}
        </p:txBody>
      </p:sp>
    </p:spTree>
  </p:cSld>
</p:sld>`;
}

function escapeXml(unsafe: string): string {
  return (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function triggerFileDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
