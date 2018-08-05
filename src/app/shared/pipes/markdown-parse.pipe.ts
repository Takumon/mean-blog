import { Pipe, PipeTransform } from '@angular/core';

import { MarkdownParseService } from '../services';

@Pipe({ name: 'toMarkdown' })
export class MarkdownParsePipe implements PipeTransform {
  constructor(
    private markdownParseService: MarkdownParseService,
  ) {}

  transform(rawText: string): any {
    if (!rawText) {
      return '';
    }

    return this.markdownParseService.parse(rawText);
  }
}
