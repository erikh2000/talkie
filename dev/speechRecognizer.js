import GrammarRules from './grammarRules';

class SpeechRecognizer {

    constructor(grammarRules) {
      this.grammarRules = grammarRules;
      this.isRestarting = false;
      this.recognizing = false;

      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;

      //Event handlers
      this.recognition.onaudiostart = this._logEvent;
      this.recognition.onsoundstart = this._logEvent;
      this.recognition.onspeechstart = this._logEvent;
      this.recognition.onsoundend = this._logEvent;
      this.recognition.onaudioend = this._logEvent;
      this.recognition.onnomatch = this._logEvent;
      this.recognition.onerror = this._onError.bind(this);
      this.recognition.onstart = this._logEvent;
      this.recognition.onend = this._onEnd.bind(this);
      this.recognition.onresult = this._onResult.bind(this);
    }

    setGrammarRules(newGrammarRules) {
        this.grammarRules = newGrammarRules;
    }

    start() {
        this.recognition.start();
        this.recognizing = true;
    }

    stop() {
      this.recognition.stop();
      this.recognizing = false;
    }

    _onEnd(event) {
      this._logEvent(event);
      this.recognizing = false;
      if (this.isRestarting) {
        this.start();
        this.isRestarting = false;
      }
    }

    _onResult(event) {
      this._logEvent(event);
      for (let result of event.results) {
        for (let alternative of result) {
          let transcript = alternative.transcript.trim();
          let words = transcript.split(' ');
          for (let word of words) {
            let match = this.grammarRules.findMatch(word);
            if (match) {
              this._restartRecognition();
              match.callback(match.key);
              return;
            } else {
              console.log('         rejected \"' + word + '\"');
            }
          }
        }
      }
    }

    _restartRecognition() {
      this.isRestarting = true;
      this.recognizing = false;
      this.recognition.abort();
    }

    _logEvent(event) {
      console.log('***EVENT ' + event.type + '***');
    }

    _onError(event) {
      console.log('***EVENT ' + event.type + '***');
      if (event.error === 'no-speech') {
        this._restartRecognition();
      }
    }
}

export default SpeechRecognizer;
