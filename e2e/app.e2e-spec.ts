import { Angular4Express4Typescritp2Page } from './app.po';
import { browser, element, by } from 'protractor';


describe('E2Eテスト', () => {
  let page: Angular4Express4Typescritp2Page;

  beforeEach(() => {
    page = new Angular4Express4Typescritp2Page();
  });

  it('画面タイトルが正しいか', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('メッセージ一覧');
  });


  it('メッセージが登録できるか', () => {
    page.navigateTo();
    const newMessage = `サンプルメッセージ ${new Date().toString()}`;
    element(by.id('registerMessage')).sendKeys(newMessage);

    element(by.id('registerMessageButton')).click();

    // 登録後メッセージ入力項目が初期化されているか
    expect(element(by.id('registerMessage')).getText()).toEqual('');

    // 登録後一覧に登録したメッセージが含まれているか
    const messages = element(by.id('messageList')).all(by.tagName('li'));
    expect(messages.last().getText()).toEqual(newMessage);
  });

});
