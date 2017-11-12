import { Injectable } from '@angular/core';
import marked from 'marked';
import hljs from 'highlight.js';

const MARKDOWN_HEADER_CLASS = 'markdown-header';

export { MARKDOWN_HEADER_CLASS };

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


  parse(rawText: string, baseUrl: string = null): any {
    const toc = [];
    const renderer = new marked.Renderer();
    renderer.heading = function(text, level) {
      // domのidに使えない文字はハイフンに置換する
      let slug = text
        .toLowerCase()
        .replace(/[\s]+/g, '-')
        .replace(/[\.\(\)\/]/g, '');

      // 数字始まりはquerySelectorでエラーになるので接頭子にnを付けてエラーを回避
      const numeralBeginning: RegExp = /^\d/;
      if (numeralBeginning.test(slug)) {
        slug = 'n' + slug;
      }

      const encodedSlug = encodeURI(slug);

      toc.push({
        level: level,
        slug: slug,
        encodedSlug: encodedSlug,
        title: text
      });
      if (baseUrl) {
        const url = `${baseUrl}#${encodedSlug}`;
        const headerAnchor = `<a href="${url}" class="anchor"><i class="fa fa-link"></i></a>`;
        return `<h${level} class="${MARKDOWN_HEADER_CLASS}" id="${slug}">${headerAnchor}${text}</h${level}>`;
      } else {
        return `<h${level}>${text}</h${level}>`;
      }
    };

    const text =  marked(rawText, {
      renderer: renderer
    });

    if (baseUrl) {
      return { text, toc };
    } else {
      return { text };
    }
  }
}
