import { Component, OnInit } from '@angular/core';
import { MessageService } from './message/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ MessageService ]
})
export class AppComponent {
  messages: Array<any>;
  message: string;

  constructor(private messageService: MessageService) {
    this.getMessages();
  }

  getMessages(): void {
    this.messageService
      .getAll()
      .subscribe((res: any) => {
        this.messages = res.messages;
      });
  }

  registerMessage(): void {
    if (!this.message) {
      return;
    }

    this.messageService
      .register(this.message)
      .subscribe((res: any) => {
        this.message = '';
        this.getMessages();
      });
  }
}
