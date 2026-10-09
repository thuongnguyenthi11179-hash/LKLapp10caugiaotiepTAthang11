// Web Speech API wrapper for Text-to-Speech and Speech Recognition

export class SpeechService {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;

  public static speak(text: string, rate: number = 0.9, pitch: number = 1.0): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synth) {
        console.warn('Speech synthesis not supported');
        resolve();
        return;
      }

      // Cancel previous utterances
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.lang = 'en-US';

      // Pick high quality English voice if available
      const voices = this.synth.getVoices();
      const englishVoice = voices.find(v => (v.lang.startsWith('en-US') || v.lang.startsWith('en-GB')) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))) 
        || voices.find(v => v.lang.startsWith('en'));

      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      this.synth.speak(utterance);
    });
  }

  public static stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public static isRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  public static createRecognizer(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): any {
    if (typeof window === 'undefined') return null;

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      onError('Trình duyệt không hỗ trợ Web Speech API nhận diện giọng nói. Bạn có thể tự gõ văn bản hoặc thử trên Google Chrome.');
      return null;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const currentText = finalTranscript || interimTranscript;
        onResult(currentText, Boolean(finalTranscript));
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          onError('Microphone bị chặn. Thầy cô vui lòng cho phép quyền truy cập Micro trên trình duyệt để luyện nói.');
        } else if (event.error === 'no-speech') {
          onError('Chưa nghe thấy giọng nói. Thầy cô hãy thử nhấn lại và đọc to, rõ ràng hơn nhé.');
        } else {
          onError(`Lỗi nhận diện âm thanh: ${event.error}`);
        }
      };

      recognition.onend = () => {
        onEnd();
      };

      return recognition;
    } catch (err: any) {
      console.error('Init speech recognition failed:', err);
      onError('Không thể khởi động bộ thu âm.');
      return null;
    }
  }
}
