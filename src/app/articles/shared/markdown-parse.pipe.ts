import { Pipe, PipeTransform } from '@angular/core';
import { MarkdownParseService } from '../shared/markdown-parse.service';

@Pipe({ name: 'toMarkdown' })
export class MarkdownParsePipe implements PipeTransform {
  constructor(
    private markdownParseService: MarkdownParseService,
  ) {}

  transform(rawText: string): string {
    if (!rawText) {
      return '';
    }

    return this.markdownParseService.parse(rawText);
  }
}
