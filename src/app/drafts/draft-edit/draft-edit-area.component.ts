import {
  Component,
  ViewChild,
  HostListener,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import {
  FormControl,
  ControlContainer,
  FormGroupDirective,
} from '@angular/forms';


@Component({
  selector: 'app-draft-edit-area',
  templateUrl: './draft-edit-area.component.html',
  styleUrls: ['./draft-edit-area.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class DraftEditAreaComponent {

  /** スクロールイベント */
  @Output() scroll = new EventEmitter();

  /** テキストエリア */
  @ViewChild('mdTextArea') $mdTextArea;

  @Input() body: FormControl;

  /** キャレット開始位置（マークダウン入力補助のため）*/
  caretPosStart = 0;
  /** キャレット終了位置（マークダウン入力補助のため）*/
  caretPosEnd = 0;


  /**
   * スクロール時にテキストエリアが、それだけスクロールした状態かを知らせるイベントを発行する.
   */
  @HostListener('scroll', ['$event'])
  syncScroll($event: Event): void {
    const scrollAreaHight = $event.srcElement.scrollHeight - $event.srcElement.clientHeight;
    const ratio = ($event.srcElement.scrollTop / scrollAreaHight);

    this.scroll.emit({ ratio });
  }


  /**
   * 画像削除時に画像リンクをテキストエリア本文から削除する.
   * 複数定義している場合を考慮してグローバルマッチにしている.
   *
   * @param image 削除した画像オブジェクト
   */
  onDeleteImage(image) {
    const escapedImage = image.fileName.replace(/\./g, '\\.');
    const imageStatement = `\\!\\[${escapedImage}\\]\\(api\\/images\\/ofArticle\\/${image._id}\\)`;
    this.body.setValue(this.body.value.replace(new RegExp(imageStatement, 'g'), ''));
  }


  /**
   * 画像追加時に画像リンクをテキストエリア本文に挿入する.
   *
   * @param image 挿入した画像オブジェクト
   */
  insertImageToArticle(image) {
    const imageStatement = `\n![${image.fileName}](api/images/ofArticle/${image._id})\n`;
    this.insertText(imageStatement, this.caretPosStart);
  }


  /**
   * 指定したプレフィックスとサフィックスを指定した位置に挿入する
   *
   * @param preffix プレフィックス
   * @param positionForPreffix プレフィックス挿入位置
   * @param suffix サフィックス
   * @param positionForSuffix サフィックス挿入位置
   */
  insertPreffixAndSuffix(
    preffix: string,
    positionForPreffix: number,
    suffix: string,
    positionForSuffix: number
  ) {
    const v = this.body.value;
    this.body.setValue(v.substring(0, positionForPreffix)
                        + preffix + v.substring(positionForPreffix, positionForSuffix) + suffix
                        + v.substring(positionForSuffix, v.length));
  }


  /**
   * 指定したテキストを現在キャレットがある行の冒頭に挿入する
   *
   * @param text 挿入するテキスト
   */
  insertToLineStart(text: string) {
    // 挿入するとキャレット位置が変わってしまうので事前に保持しておく
    const previouseCaretPosStart = this.caretPosStart;
    const previouseCaretPosEnd = this.caretPosEnd;

    this.insertText(text, this.searchCurrentLineStartIndex());
    this.moveCaretPosition(previouseCaretPosStart + text.length, previouseCaretPosEnd + text.length);
  }


  /**
   * テキストエリアのキャレット位置を保存する
   *
   * ＠param textareaElement テキストエリアのDOM要素
   */
  saveCaretPos(textareaElement) {
    if (textareaElement.selectionStart || textareaElement.selectionStart === 0) {
      this.caretPosStart = textareaElement.selectionStart;
      this.caretPosEnd = textareaElement.selectionEnd;
    }
  }


  /**
   * タブやエンター押下時に必要に応じてインデント調整やリスト形式にフォーマットしたりする
   */
  textFormat($event) {
    if ($event.keyCode === 9) {
      $event.preventDefault();
      this.adjustIndent($event);
      return;
    }

    // 前行がリスト形式であれば、自動でインデントしてリスト形式にする
    if ($event.keyCode === 13) {
      const startIndexOfCurrentLine = this.searchCurrentLineStartIndex();
      const listInfoOfCurrentLine = this.extractListInfo();

      if (!listInfoOfCurrentLine.isListLine) {
        return;
      }

      // キャレットが行冒頭にある場合は通常のEnterを押した時の挙動と同じにする
      if (startIndexOfCurrentLine <= this.caretPosStart
          &&  this.caretPosStart < startIndexOfCurrentLine + listInfoOfCurrentLine.indent.length + 2
        ) {
        return;
      }

      // ブラウザデフォルト処理を抑止し改行も本処理で挿入する
      $event.preventDefault();
      const listLinePreffix = '\n' + listInfoOfCurrentLine.indent + '* ';
      this.insertContentToCaretPosition(listLinePreffix, '');
    }
  }

  /**
   * 指定したpreffixをキャレット開始位置に、指定したsuffixをキャレット終了位置に挿入する.
   *
   * @param preffix
   * @param suffix
   */
  insertContentToCaretPosition(preffix: string, suffix: string) {
    // 挿入するとキャレット位置が変わってしまうので事前に保持しておく
    const previouseCaretPosStart = this.caretPosStart;
    const previouseCaretPosEnd = this.caretPosEnd;

    this.insertPreffixAndSuffix(preffix, previouseCaretPosStart, suffix, previouseCaretPosEnd);
    this.moveCaretPosition(previouseCaretPosStart + preffix.length, previouseCaretPosEnd + preffix.length);
  }


  /**
   * 選択箇所をソースコードラッパーで囲む
   */
  insertCodeWrapper() {
    // 挿入するとキャレット位置が変わってしまうので事前に保持しておく
    const preStart = this.caretPosStart;
    const preEnd = this.caretPosEnd;

    // 範囲選択時はそれを囲む
    if (this.isSelectRange()) {
      this.insertContentToCaretPosition('`', '`');
      this.moveCaretPosition(preStart + 1, preEnd + 1);
    } else if (this.caretPosStart === this.searchCurrentLineStartIndex()) {
      // 行冒頭の場合
      this.insertText('```\n\n```\n', this.caretPosStart);
      this.moveCaretPosition(preStart + 4, preEnd + 4);
    } else {
      // それ以外の場合
      this.insertContentToCaretPosition('`', '`');
      this.moveCaretPosition(preStart + 1, preEnd + 1);
    }
  }


  /**
   * 現在キャレットがある行冒頭のポジションを取得する
   *
   * @return キャレットポジション(デフォルトは現在キャレットポジション)
   */
  private searchCurrentLineStartIndex(caretPosStart: number = this.caretPosStart): number {
    const v: string = this.body.value;
    // 遡って行末の改行を探す

    // テキストがない場合は最初が行冒頭とみなす
    if (v.length === 0) {
      return 0;
    }

    for (let i = caretPosStart - 1; i > 0; i--) {
      if (v[i] === '\n') {
        return i + 1;
      }
    }
    return 0;
  }


  /**
   * 指定したテキストを指定した位置に挿入する
   *
   * @param text 挿入するテキスト
   * @param position 挿入位置
   */
  private insertText(text: string, position: number) {
    const v = this.body.value;
    this.body.setValue(v.substring(0, position)
                    + text
                    + v.substring(position, v.length));
  }


  /**
   * 現在のキャレットポジションをずらす<br>
   * 範囲選択したくない場合は開始位置と終了位置に同じ値を指定する
   *
   * @param start 開始位置
   * @param end 終了位置
   */
  private moveCaretPosition(start: number, end: number) {
    const e = this.$mdTextArea.nativeElement;
    e.focus();
    e.setSelectionRange(start, end);
  }


  /**
   * 指定したキャレットがある行がリスト形式か判断する
   *
   * @param caretPosition キャレットポジション(デフォルトは現在のキャレットポジション)
   */
  private extractListInfo(caretPosition: number = this.caretPosStart): {isListLine: boolean, indent?: string} {
    const lineStartIndex = this.searchCurrentLineStartIndex(caretPosition);

    const temp = this.body.value.substring(lineStartIndex);
    const taregetLine = temp.substring(0, temp.indexOf('\n') === -1 ? temp.length : temp.indexOf('\n'));
    const listLinePattern = /^(\s*)\*\s/;

    const isListLine = listLinePattern.test(taregetLine);
    const result = {isListLine};

    if (isListLine) {
      result['indent'] = taregetLine.match(listLinePattern)[1];
    }
    return result;
  }


  /**
   * タブ押下時にテキストをフォーマットする
   */
  private adjustIndent($event) {
    const TAB = '    ';
    // インデントを追加
    if (!$event.shiftKey) {
      if (this.extractListInfo().isListLine) {
        return this.insertContentToCurrentLineStart(TAB);
      } else {
        return this.insertContentToCaretPosition(TAB, '');
      }
    }

    // インデントを削除
    const v = this.body.value;
    if (this.extractListInfo().isListLine) {
      // 挿入するとキャレット位置が変わってしまうので事前に保持しておく
      const previouseCaretPosStart = this.caretPosStart;
      const previouseCaretPosEnd = this.caretPosEnd;
      const lineStartIndex = this.searchCurrentLineStartIndex();

      const first4Charactor = v.substring(lineStartIndex, lineStartIndex + 4);
      const indent  = first4Charactor.match(/^\s*/)[0];
      const indentRemoved = first4Charactor.replace(/^\s*/, '');

      this.body.setValue(v.substring(0, lineStartIndex)
                          + indentRemoved
                          + v.substring(lineStartIndex + 4));
      this.moveCaretPosition(previouseCaretPosStart - indent.length, previouseCaretPosEnd - indent.length);
      return;
    }

    if (this.caretPosStart >= 4 && TAB === v.substring(this.caretPosStart - 4, this.caretPosStart)) {

      // 挿入するとキャレット位置が変わってしまうので事前に保持しておく
      const previouseCaretPosStart = this.caretPosStart;
      const previouseCaretPosEnd = this.caretPosEnd;

      this.body.setValue(v.substring(0, this.caretPosStart - TAB.length) + v.substring(this.caretPosStart));
      this.moveCaretPosition(previouseCaretPosStart - TAB.length, previouseCaretPosEnd - TAB.length);
    }
  }


  /**
   * テキストエリアで範囲選択中か判断する
   */
  private isSelectRange(): boolean {
    return this.caretPosStart !== this.caretPosEnd;
  }


  /**
   * 指定したtextをキャレットがある行冒頭に挿入する
   *
   * @param value
   */
  private insertContentToCurrentLineStart(value: string) {
    // 挿入するとキャレット位置が変わってしまうので事前に保持しておく
    const previouseCaretPosStart = this.caretPosStart;
    const previouseCaretPosEnd = this.caretPosEnd;

    const lineStartIndex = this.searchCurrentLineStartIndex();

    this.insertPreffixAndSuffix(value, lineStartIndex, '', lineStartIndex);
    this.moveCaretPosition(previouseCaretPosStart + value.length, previouseCaretPosEnd + value.length);
  }
}
