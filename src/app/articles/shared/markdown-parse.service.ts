import { Injectable } from '@angular/core';
import marked from 'marked';
import hljs from 'highlight.js';


@Injectable()
export class MarkdownParseService {

  constructor() {
    marked.setOptions({
      langPrefix: '',
      highlight: function (code, langAndTitle, callback) {
        const lang = langAndTitle ? langAndTitle.split(':')[0] : '';
        return hljs.highlightAuto(code, [lang]).value;
      }
    });
  }

  parse(rawText: string): string {
    return marked(rawText);
  }
}
