import {
  Directive,
  HostListener,
  HostBinding,
  EventEmitter,
  Output,
  Input
} from '@angular/core';

@Directive({
  selector: '[appDragAndDrop]'
})
export class DragAndDropDirective {
  @Input() private allowed_extensions: Array<string> = [];
  @Output() private filesChangeEmiter: EventEmitter<File[]> = new EventEmitter();
  @Output() private filesInvalidEmiter: EventEmitter<File[]> = new EventEmitter();
  @HostBinding('class.drogover') private dragover = false;

  constructor() { }

  @HostListener('dragover', ['$event']) public onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.dragover = true;
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.dragover = false;
  }

  @HostListener('drop', ['$event']) public onDrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.dragover = false;
    const files = evt.dataTransfer.files;
    const valid_files: Array<File> = [];
    const invalid_files: Array<File> = [];
    if (files.length > 0) {
      for (const file of files) {
        const extention = file.name.split('.')[file.name.split('.').length - 1];
        if (this.allowed_extensions.lastIndexOf(extention) !== -1) {
          valid_files.push(file);
        } else {
          invalid_files.push(file);
        }
      }
      this.filesChangeEmiter.emit(valid_files);
      this.filesInvalidEmiter.emit(invalid_files);
    }
  }
}
